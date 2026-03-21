package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ExamQuestion struct {
	ID              uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Text            string         `gorm:"type:text;not null" json:"text"`
	DifficultyLevel string         `gorm:"size:20;not null" json:"difficultyLevel"`
	OrderIndex      int            `gorm:"not null;default:0" json:"orderIndex"`
	PointValue      float64        `gorm:"not null;default:10" json:"pointValue"`
	TimesAnswered   int            `gorm:"default:0" json:"timesAnswered"`
	TimesCorrect    int            `gorm:"default:0" json:"timesCorrect"`
	IsActive        bool           `gorm:"default:true" json:"isActive"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
	Options         []ExamOption   `gorm:"foreignKey:QuestionID" json:"options"`
}

func (e *ExamQuestion) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}

type ExamOption struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	QuestionID uuid.UUID `gorm:"type:uuid;not null" json:"questionId"`
	Text       string    `gorm:"type:text;not null" json:"text"`
	IsCorrect  bool      `gorm:"default:false" json:"isCorrect"`
}

func (e *ExamOption) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}

type ExamResult struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID        uuid.UUID      `gorm:"type:uuid;not null" json:"userId"`
	User          User           `gorm:"foreignKey:UserID" json:"-"`
	AssignedLevel string         `gorm:"size:50" json:"assignedLevel"`
	TotalScore    float64        `json:"totalScore"`
	CreatedAt     time.Time      `json:"createdAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

func (e *ExamResult) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}

type ExamSubmission struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ResultID     uuid.UUID `gorm:"type:uuid;not null" json:"resultId"`
	QuestionID   uuid.UUID `gorm:"type:uuid;not null" json:"questionId"`
	OptionID     uuid.UUID `gorm:"type:uuid;not null" json:"optionId"`
	IsCorrect    bool      `gorm:"default:false" json:"isCorrect"`
	PointsEarned float64   `gorm:"default:0" json:"pointsEarned"`
}

func (e *ExamSubmission) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}