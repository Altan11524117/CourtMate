package main

import (
	"log"
	"os"
	"time"

	"courtmate-backend/config"
	"courtmate-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// .env dosyasını yükle
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, system environment variables will be used.")
	}
}

func main() {
	// Veritabanına bağlan
	config.ConnectDatabase()

	// Gin router'ı oluştur
	r := gin.Default()

	// CORS ayarları
	allowedOrigins := []string{"http://localhost:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Rotaları ayarla
	routes.SetupRoutes(r)

	// Portu ayarla ve sunucuyu başlat
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" // OpenAPI dosyasındaki localhost portu
	}

	log.Printf("The server is running at http://localhost:%s...\n", port)
	r.Run(":" + port)
}