package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	FullName      string         `gorm:"size:255;not null" json:"fullName"`
	Email         string         `gorm:"size:255;not null;unique" json:"email"`
	PasswordHash  string         `gorm:"not null" json:"-"`
	Level         string         `gorm:"size:50" json:"level"`
	IsActive      bool           `gorm:"default:true" json:"isActive"`
	PreferredHand string         `gorm:"size:20" json:"preferredHand"`
	Bio           string         `gorm:"type:text" json:"bio"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}