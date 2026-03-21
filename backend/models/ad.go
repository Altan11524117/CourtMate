package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Ad struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	OwnerID       uuid.UUID      `gorm:"type:uuid;not null" json:"ownerId"`
	Owner         User           `gorm:"foreignKey:OwnerID" json:"-"`
	Title         string         `gorm:"size:255;not null" json:"title"`
	Category      string         `gorm:"size:100" json:"category"`
	Location      string         `gorm:"size:255;not null" json:"location"`
	RequiredLevel string         `gorm:"size:50" json:"requiredLevel"`
	MatchDate     time.Time      `gorm:"not null" json:"matchDate"`
	Status        string         `gorm:"size:20;default:'open'" json:"status"`
	ViewCount     int            `gorm:"default:0" json:"viewCount"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
	Applications  []Application  `gorm:"foreignKey:AdID" json:"-"`
}

func (a *Ad) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return
}

type Application struct {
	ID          uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	AdID        uuid.UUID      `gorm:"type:uuid;not null" json:"adId"`
	Ad          Ad             `gorm:"foreignKey:AdID" json:"-"`
	ApplicantID uuid.UUID      `gorm:"type:uuid;not null" json:"applicantId"`
	Applicant   User           `gorm:"foreignKey:ApplicantID" json:"-"`
	Status      string         `gorm:"size:20;default:'pending'" json:"status"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func (a *Application) BeforeCreate(tx *gorm.DB) (err error) {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return
}