package controllers

import (
	"net/http"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ApplyToAd(c *gin.Context) {
	adID, err := uuid.Parse(c.Param("adId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ad ID"})
		return
	}

	applicantIDStr, _ := c.Get("userID")
	applicantID, _ := uuid.Parse(applicantIDStr.(string))

	var ad models.Ad
	if err := config.DB.First(&ad, "id = ?", adID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}

	if ad.OwnerID == applicantID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot apply to your own ad"})
		return
	}

	var existing models.Application
	if err := config.DB.Where("ad_id = ? AND applicant_id = ?", adID, applicantID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You have already applied to this ad"})
		return
	}

	application := models.Application{
		AdID:        adID,
		ApplicantID: applicantID,
		Status:      "pending",
	}

	if err := config.DB.Create(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not submit application"})
		return
	}

	c.JSON(http.StatusCreated, application)
}

func ListApplications(c *gin.Context) {
	adID, err := uuid.Parse(c.Param("adId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ad ID"})
		return
	}

	var ad models.Ad
	if err := config.DB.First(&ad, "id = ?", adID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}

	requesterID, _ := c.Get("userID")
	if ad.OwnerID.String() != requesterID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the ad owner can view applications"})
		return
	}

	var applications []models.Application
	config.DB.Preload("Applicant").Where("ad_id = ?", adID).Find(&applications)

	var result []gin.H
	for _, app := range applications {
		result = append(result, gin.H{
			"id":             app.ID,
			"applicantId":    app.ApplicantID,
			"applicantName":  app.Applicant.FullName,
			"applicantLevel": app.Applicant.Level,
			"status":         app.Status,
			"createdAt":      app.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, result)
}

func UpdateApplicationStatus(c *gin.Context) {
	adID, err := uuid.Parse(c.Param("adId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ad ID"})
		return
	}
	appID, err := uuid.Parse(c.Param("applicationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}

	var ad models.Ad
	if err := config.DB.First(&ad, "id = ?", adID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}

	requesterID, _ := c.Get("userID")
	if ad.OwnerID.String() != requesterID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the ad owner can update applications"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required,oneof=approved rejected"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var application models.Application
	if err := config.DB.First(&application, "id = ? AND ad_id = ?", appID, adID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Application not found"})
		return
	}

	config.DB.Model(&application).Update("status", input.Status)
	c.JSON(http.StatusOK, application)
}