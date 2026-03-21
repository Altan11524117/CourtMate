package main

import (
	"log"
	"os"

	"courtmate-backend/config" // Import yolları go.mod'daki isme göre düzeltildi
	"courtmate-backend/routes" // Import yolları go.mod'daki isme göre düzeltildi
	
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