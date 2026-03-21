package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PasswordResetToken struct {
	ID        uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;not null" json:"userId"`
	User      User       `gorm:"foreignKey:UserID" json:"-"`
	Token     string     `gorm:"size:255;not null;unique" json:"token"`
	ExpiresAt time.Time  `gorm:"not null" json:"expiresAt"`
	Used      bool       `gorm:"default:false" json:"used"`
	CreatedAt time.Time  `json:"createdAt"`
}

func (p *PasswordResetToken) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}