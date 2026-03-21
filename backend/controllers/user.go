package controllers

import (
	"net/http"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProfileUpdateInput struct {
	FullName      string `json:"fullName"`
	PreferredHand string `json:"preferredHand"`
	Bio           string `json:"bio"`
}

func GetUserProfile(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "id = ?", targetID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	requesterID, _ := c.Get("userID")
	if requesterID == targetID.String() {
		c.JSON(http.StatusOK, user)
	} else {
		c.JSON(http.StatusOK, gin.H{
			"id":            user.ID,
			"fullName":      user.FullName,
			"level":         user.Level,
			"preferredHand": user.PreferredHand,
			"bio":           user.Bio,
		})
	}
}

func UpdateUserProfile(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	requesterID, _ := c.Get("userID")
	if requesterID != targetID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own profile"})
		return
	}

	var input ProfileUpdateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "id = ?", targetID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	config.DB.Model(&user).Updates(models.User{
		FullName:      input.FullName,
		PreferredHand: input.PreferredHand,
		Bio:           input.Bio,
	})

	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
	targetID, err := uuid.Parse(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	requesterID, _ := c.Get("userID")
	if requesterID != targetID.String() {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own account"})
		return
	}

	if err := config.DB.Delete(&models.User{}, "id = ?", targetID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete user"})
		return
	}

	c.Status(http.StatusNoContent)
}