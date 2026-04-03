package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"os"
	"time"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	resend "github.com/resend/resend-go/v2"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	FullName string `json:"fullName" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.User
	if err := config.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	user := models.User{
		FullName:     input.FullName,
		Email:        input.Email,
		PasswordHash: string(hash),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": user.ID.String(),
		"exp":    time.Now().Add(72 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":     tokenString,
		"expiresIn": 72 * 3600,
	})
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func ResetPassword(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent if email exists"})
		return
	}

	// Generate secure random token
	tokenBytes := make([]byte, 32)
	rand.Read(tokenBytes)
	tokenString := hex.EncodeToString(tokenBytes)

	// Delete any existing unused tokens for this user
	config.DB.Where("user_id = ? AND used = false", user.ID).Delete(&models.PasswordResetToken{})

	// Save new token with 1 hour expiry
	resetToken := models.PasswordResetToken{
		UserID:    user.ID,
		Token:     tokenString,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}
	config.DB.Create(&resetToken)

	// Send email via Resend
	resetLink := os.Getenv("FRONTEND_URL") + "/reset-password?token=" + tokenString

	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))
	params := &resend.SendEmailRequest{
		From:    "CourtMate <[EMAIL_ADDRESS]>",
		To: []string{user.Email},
		Subject: "CourtMate - Password Reset",
		Html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c7a2c;">CourtMate Password Reset</h2>
        <p>Hello ` + user.FullName + `,</p>
        <p>Click the button below to reset your password. This link is valid for <strong>1 hour</strong>.</p>
        <a href="` + resetLink + `"
           style="display:inline-block; padding:12px 24px; background:#2c7a2c; color:white; text-decoration:none; border-radius:6px; margin: 16px 0;">
            Reset My Password
        </a>
        <p style="color: #666; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
    </div>
`,
	}

	resp, err := client.Emails.Send(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	_ = resp

	c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent if email exists"})
}

func ConfirmResetPassword(c *gin.Context) {
	var input struct {
		Token       string `json:"token" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var resetToken models.PasswordResetToken
	if err := config.DB.Where("token = ? AND used = false", input.Token).First(&resetToken).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or already used token"})
		return
	}

	if time.Now().After(resetToken.ExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reset token has expired"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	config.DB.Model(&models.User{}).Where("id = ?", resetToken.UserID).Update("password_hash", string(hash))
	config.DB.Model(&resetToken).Update("used", true)

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}