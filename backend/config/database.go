package config

import (
	"fmt"
	"log"
	"os"

	"courtmate-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate — all models
	err = db.AutoMigrate(
		&models.User{},
		&models.Ad{},
		&models.Application{},
		&models.ExamResult{},
		&models.PasswordResetToken{},
		&models.ExamQuestion{},
		&models.ExamOption{},
		&models.ExamResult{},
		&models.ExamSubmission{},
	)
	if err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}

	log.Println("Database connection successful!")
	DB = db
}