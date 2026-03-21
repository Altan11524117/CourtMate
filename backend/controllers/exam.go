package controllers

import (
	"net/http"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

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

func GetExamQuestions(c *gin.Context) {
	var questions []models.ExamQuestion
	config.DB.Preload("Options").
		Where("is_active = true").
		Order("order_index asc").
		Find(&questions)

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

		// Update question stats
		newTimesAnswered := question.TimesAnswered + 1
		newTimesCorrect := question.TimesCorrect + boolToInt(option.IsCorrect)

		config.DB.Model(&question).Updates(map[string]interface{}{
			"times_answered": newTimesAnswered,
			"times_correct":  newTimesCorrect,
		})

		// Adjust point value based on correct rate
		correctRate := float64(newTimesCorrect) / float64(newTimesAnswered)
		newPointValue := question.PointValue
		if correctRate > 0.80 {
			newPointValue = question.PointValue * 0.95 // too easy, decrease
		} else if correctRate < 0.30 {
			newPointValue = question.PointValue * 1.05 // too hard, increase
		}
		// Clamp between 5 and 50
		if newPointValue < 5 {
			newPointValue = 5
		}
		if newPointValue > 50 {
			newPointValue = 50
		}
		config.DB.Model(&question).Update("point_value", newPointValue)
	}

	// Assign level
	assignedLevel := assignLevel(totalScore)

	// Save result
	examResult := models.ExamResult{
		UserID:        userID,
		AssignedLevel: assignedLevel,
		TotalScore:    totalScore,
	}
	config.DB.Create(&examResult)

	// Save submissions
	for i := range submissions {
		submissions[i].ResultID = examResult.ID
		config.DB.Create(&submissions[i])
	}

	// Update user level
	config.DB.Model(&models.User{}).Where("id = ?", userID).Update("level", assignedLevel)

	c.JSON(http.StatusOK, gin.H{
		"assignedLevel": assignedLevel,
		"totalScore":    totalScore,
		"resultId":      examResult.ID,
	})
}

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

func boolToInt(b bool) int {
	if b {
		return 1
	}
	return 0
}