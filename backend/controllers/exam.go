package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ─── Groq API Helper ─────────────────────────────────────────────────────────

func callGroq(prompt string) (string, error) {
	reqBody := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.7,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewReader(jsonBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("GROQ_API_KEY"))

	httpClient := &http.Client{}
	resp, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return "", fmt.Errorf("empty response from Groq: %v", result)
	}

	message := choices[0].(map[string]interface{})["message"].(map[string]interface{})
	content := message["content"].(string)

	return strings.TrimSpace(content), nil
}

// ─── AI: Soru Üretimi ────────────────────────────────────────────────────────

func GenerateQuestionsWithAI(c *gin.Context) {
	var input struct {
		DifficultyLevel string `json:"difficultyLevel" binding:"required,oneof=easy medium hard"`
		Count           int    `json:"count" binding:"required,min=1,max=10"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := fmt.Sprintf(`You are a tennis level assessment expert. Generate %d tennis skill assessment questions for %s level players.

Return ONLY a JSON array with this exact format, no other text:
[
  {
    "text": "question text here",
    "options": [
      {"text": "option 1", "isCorrect": false},
      {"text": "option 2", "isCorrect": false},
      {"text": "option 3", "isCorrect": false},
      {"text": "option 4", "isCorrect": true}
    ]
  }
]

Rules:
- Questions must be about tennis skills, technique, tactics or experience
- Each question must have exactly 4 options
- Exactly 1 option must be isCorrect: true
- %s level means: easy=beginner, medium=intermediate, hard=advanced
- Return only the JSON array, no markdown, no explanation`, input.Count, input.DifficultyLevel, input.DifficultyLevel)

	rawText, err := callGroq(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("AI generation failed: %s", err.Error())})
		return
	}

	rawText = strings.TrimSpace(rawText)
	rawText = strings.TrimPrefix(rawText, "```json")
	rawText = strings.TrimPrefix(rawText, "```")
	rawText = strings.TrimSuffix(rawText, "```")
	rawText = strings.TrimSpace(rawText)

	type AIOption struct {
		Text      string `json:"text"`
		IsCorrect bool   `json:"isCorrect"`
	}
	type AIQuestion struct {
		Text    string     `json:"text"`
		Options []AIOption `json:"options"`
	}

	var aiQuestions []AIQuestion
	if err := json.Unmarshal([]byte(rawText), &aiQuestions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not parse AI response",
			"raw":   rawText,
		})
		return
	}

	var maxOrder int
	config.DB.Model(&models.ExamQuestion{}).Select("COALESCE(MAX(order_index), 0)").Scan(&maxOrder)

	var savedQuestions []models.ExamQuestion
	for i, q := range aiQuestions {
		question := models.ExamQuestion{
			Text:            q.Text,
			DifficultyLevel: input.DifficultyLevel,
			OrderIndex:      maxOrder + i + 1,
			PointValue:      pointValueByDifficulty(input.DifficultyLevel),
		}
		config.DB.Create(&question)

		for _, opt := range q.Options {
			option := models.ExamOption{
				QuestionID: question.ID,
				Text:       opt.Text,
				IsCorrect:  opt.IsCorrect,
			}
			config.DB.Create(&option)
		}

		config.DB.Preload("Options").First(&question, "id = ?", question.ID)
		savedQuestions = append(savedQuestions, question)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   fmt.Sprintf("%d questions generated and saved", len(savedQuestions)),
		"questions": savedQuestions,
	})
}

// ─── AI: Cevap Analizi ───────────────────────────────────────────────────────

func AnalyzeExamWithAI(c *gin.Context) {
	var input struct {
		Answers []struct {
			QuestionText string `json:"questionText"`
			SelectedText string `json:"selectedText"`
			IsCorrect    bool   `json:"isCorrect"`
		} `json:"answers" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	answersSummary := ""
	for i, a := range input.Answers {
		correct := "WRONG"
		if a.IsCorrect {
			correct = "CORRECT"
		}
		answersSummary += fmt.Sprintf("%d. Q: %s | A: %s | %s\n", i+1, a.QuestionText, a.SelectedText, correct)
	}

	prompt := fmt.Sprintf(`You are a tennis coach analyzing a player's skill assessment results.

Here are their answers:
%s

Based on these answers, provide:
1. Overall skill analysis (2-3 sentences)
2. Strong points (1-2 items)
3. Areas to improve (1-2 items)
4. Recommended training focus

Keep it concise, encouraging and practical. Respond in English.`, answersSummary)

	analysis, err := callGroq(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("AI analysis failed: %s", err.Error())})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analysis": analysis})
}

// ─── Admin: Manuel Soru Oluşturma ────────────────────────────────────────────

type CreateQuestionInput struct {
	Text            string  `json:"text" binding:"required"`
	DifficultyLevel string  `json:"difficultyLevel" binding:"required,oneof=easy medium hard"`
	OrderIndex      int     `json:"orderIndex" binding:"required"`
	PointValue      float64 `json:"pointValue" binding:"required"`
	Options         []struct {
		Text      string `json:"text" binding:"required"`
		IsCorrect bool   `json:"isCorrect"`
	} `json:"options" binding:"required,min=2"`
}

func CreateQuestion(c *gin.Context) {
	var input CreateQuestionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	question := models.ExamQuestion{
		Text:            input.Text,
		DifficultyLevel: input.DifficultyLevel,
		OrderIndex:      input.OrderIndex,
		PointValue:      input.PointValue,
	}

	if err := config.DB.Create(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create question"})
		return
	}

	for _, opt := range input.Options {
		option := models.ExamOption{
			QuestionID: question.ID,
			Text:       opt.Text,
			IsCorrect:  opt.IsCorrect,
		}
		config.DB.Create(&option)
	}

	config.DB.Preload("Options").First(&question, "id = ?", question.ID)
	c.JSON(http.StatusCreated, question)
}

// ─── Soruları Getir (Dinamik - Seviyeye Göre) ────────────────────────────────

func GetExamQuestions(c *gin.Context) {
	userIDStr, _ := c.Get("userID")
	userID, _ := uuid.Parse(userIDStr.(string))

	var user models.User
	config.DB.First(&user, "id = ?", userID)

	var questions []models.ExamQuestion

	if user.Level == "" {
		config.DB.Preload("Options").
			Where("is_active = true").
			Order("order_index asc").
			Find(&questions)
	} else {
		difficulty := levelToDifficulty(user.Level)
		config.DB.Preload("Options").
			Where("is_active = true AND difficulty_level = ?", difficulty).
			Order("order_index asc").
			Find(&questions)

		if len(questions) < 3 {
			config.DB.Preload("Options").
				Where("is_active = true").
				Order("order_index asc").
				Find(&questions)
		}
	}

	type SafeOption struct {
		ID   uuid.UUID `json:"id"`
		Text string    `json:"text"`
	}
	type SafeQuestion struct {
		ID              uuid.UUID    `json:"id"`
		Text            string       `json:"text"`
		DifficultyLevel string       `json:"difficultyLevel"`
		OrderIndex      int          `json:"orderIndex"`
		PointValue      float64      `json:"pointValue"`
		Options         []SafeOption `json:"options"`
	}

	var result []SafeQuestion
	for _, q := range questions {
		var safeOpts []SafeOption
		for _, o := range q.Options {
			safeOpts = append(safeOpts, SafeOption{ID: o.ID, Text: o.Text})
		}
		result = append(result, SafeQuestion{
			ID:              q.ID,
			Text:            q.Text,
			DifficultyLevel: q.DifficultyLevel,
			OrderIndex:      q.OrderIndex,
			PointValue:      q.PointValue,
			Options:         safeOpts,
		})
	}

	c.JSON(http.StatusOK, result)
}

// ─── Sınav Gönder ────────────────────────────────────────────────────────────

type SubmitExamInput struct {
	Answers []struct {
		QuestionID string `json:"questionId" binding:"required"`
		OptionID   string `json:"optionId" binding:"required"`
	} `json:"answers" binding:"required"`
}

func SubmitExam(c *gin.Context) {
	var input SubmitExamInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDStr, _ := c.Get("userID")
	userID, _ := uuid.Parse(userIDStr.(string))

	var totalScore float64
	var submissions []models.ExamSubmission

	for _, answer := range input.Answers {
		questionID, err := uuid.Parse(answer.QuestionID)
		if err != nil {
			continue
		}
		optionID, err := uuid.Parse(answer.OptionID)
		if err != nil {
			continue
		}

		var question models.ExamQuestion
		if err := config.DB.First(&question, "id = ?", questionID).Error; err != nil {
			continue
		}

		var option models.ExamOption
		if err := config.DB.First(&option, "id = ? AND question_id = ?", optionID, questionID).Error; err != nil {
			continue
		}

		pointsEarned := 0.0
		if option.IsCorrect {
			pointsEarned = question.PointValue
			totalScore += pointsEarned
		}

		submissions = append(submissions, models.ExamSubmission{
			QuestionID:   questionID,
			OptionID:     optionID,
			IsCorrect:    option.IsCorrect,
			PointsEarned: pointsEarned,
		})

		newTimesAnswered := question.TimesAnswered + 1
		newTimesCorrect := question.TimesCorrect + boolToInt(option.IsCorrect)

		config.DB.Model(&question).Updates(map[string]interface{}{
			"times_answered": newTimesAnswered,
			"times_correct":  newTimesCorrect,
		})

		correctRate := float64(newTimesCorrect) / float64(newTimesAnswered)
		newPointValue := question.PointValue
		if correctRate > 0.80 {
			newPointValue = question.PointValue * 0.95
		} else if correctRate < 0.30 {
			newPointValue = question.PointValue * 1.05
		}
		if newPointValue < 5 {
			newPointValue = 5
		}
		if newPointValue > 50 {
			newPointValue = 50
		}
		config.DB.Model(&question).Update("point_value", newPointValue)
	}

	assignedLevel := assignLevel(totalScore)

	examResult := models.ExamResult{
		UserID:        userID,
		AssignedLevel: assignedLevel,
		TotalScore:    totalScore,
	}
	config.DB.Create(&examResult)

	for i := range submissions {
		submissions[i].ResultID = examResult.ID
		config.DB.Create(&submissions[i])
	}

	config.DB.Model(&models.User{}).Where("id = ?", userID).Update("level", assignedLevel)

	c.JSON(http.StatusOK, gin.H{
		"assignedLevel": assignedLevel,
		"totalScore":    totalScore,
		"resultId":      examResult.ID,
	})
}

// ─── Soru İstatistikleri ─────────────────────────────────────────────────────

func GetQuestionStats(c *gin.Context) {
	questionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var question models.ExamQuestion
	if err := config.DB.First(&question, "id = ?", questionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question not found"})
		return
	}

	correctRate := 0.0
	if question.TimesAnswered > 0 {
		correctRate = float64(question.TimesCorrect) / float64(question.TimesAnswered) * 100
	}

	c.JSON(http.StatusOK, gin.H{
		"id":              question.ID,
		"text":            question.Text,
		"difficultyLevel": question.DifficultyLevel,
		"orderIndex":      question.OrderIndex,
		"pointValue":      question.PointValue,
		"timesAnswered":   question.TimesAnswered,
		"timesCorrect":    question.TimesCorrect,
		"correctRate":     correctRate,
	})
}

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

func assignLevel(score float64) string {
	switch {
	case score >= 76:
		return "Advanced (ITN 3)"
	case score >= 56:
		return "Upper-Intermediate (ITN 5)"
	case score >= 31:
		return "Intermediate (ITN 7)"
	default:
		return "Beginner (ITN 10)"
	}
}

func levelToDifficulty(level string) string {
	switch {
	case strings.Contains(level, "Advanced"):
		return "hard"
	case strings.Contains(level, "Intermediate"):
		return "medium"
	default:
		return "easy"
	}
}

func pointValueByDifficulty(difficulty string) float64 {
	switch difficulty {
	case "hard":
		return 20
	case "medium":
		return 15
	default:
		return 10
	}
}

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}