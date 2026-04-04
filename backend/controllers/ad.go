package controllers

import (
	"net/http"
	"strconv"
	"time"

	"courtmate-backend/config"
	"courtmate-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AdInput struct {
	Title         string `json:"title" binding:"required"`
	Category      string `json:"category"`
	Location      string `json:"location" binding:"required"`
	RequiredLevel string `json:"requiredLevel"`
	MatchDate     string `json:"matchDate" binding:"required"`
}

func ListAds(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	var ads []models.Ad
	config.DB.Where("status = ?", "open").
		Order("created_at desc").
		Limit(limit).Offset(offset).
		Find(&ads)

	c.JSON(http.StatusOK, ads)
}

func SearchAds(c *gin.Context) {
	category := c.Query("category")
	location := c.Query("location")
	sort := c.DefaultQuery("sort", "newest")

	query := config.DB.Model(&models.Ad{}).Where("status = ?", "open")

	if category != "" {
		query = query.Where("category = ?", category)
	}
	if location != "" {
		query = query.Where("location ILIKE ?", "%"+location+"%")
	}

	switch sort {
	case "oldest":
		query = query.Order("created_at asc")
	case "level_asc":
		query = query.Order("required_level asc")
	case "level_desc":
		query = query.Order("required_level desc")
	default:
		query = query.Order("created_at desc")
	}

	var ads []models.Ad
	query.Find(&ads)
	c.JSON(http.StatusOK, ads)
}

func CreateAd(c *gin.Context) {
	var input AdInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ownerIDStr, _ := c.Get("userID")
	ownerID, _ := uuid.Parse(ownerIDStr.(string))

	// Parse matchDate string to time.Time
	matchDate, err := time.Parse(time.RFC3339, input.MatchDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid matchDate format. Use ISO8601 e.g. 2026-04-01T10:00:00Z"})
		return
	}

	ad := models.Ad{
		OwnerID:       ownerID,
		Title:         input.Title,
		Category:      input.Category,
		Location:      input.Location,
		RequiredLevel: input.RequiredLevel,
		MatchDate:     matchDate,
	}

	if err := config.DB.Create(&ad).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create ad"})
		return
	}

	c.JSON(http.StatusCreated, ad)
}

func GetAdDetail(c *gin.Context) {
	adID, err := uuid.Parse(c.Param("adId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ad ID"})
		return
	}

	var ad models.Ad
	if err := config.DB.Preload("Owner").First(&ad, "id = ?", adID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ad not found"})
		return
	}

	config.DB.Model(&ad).UpdateColumn("view_count", ad.ViewCount+1)

	c.JSON(http.StatusOK, gin.H{
		"id":            ad.ID,
		"ownerId":       ad.OwnerID,
		"title":         ad.Title,
		"category":      ad.Category,
		"location":      ad.Location,
		"requiredLevel": ad.RequiredLevel,
		"matchDate":     ad.MatchDate,
		"status":        ad.Status,
		"viewCount":     ad.ViewCount + 1,
		"ownerProfileSummary": gin.H{
			"fullName": ad.Owner.FullName,
			"level":    ad.Owner.Level,
		},
	})
}

func UpdateAd(c *gin.Context) {
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
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the owner can update this ad"})
		return
	}

	var input AdInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	
	matchDate, err := time.Parse(time.RFC3339, input.MatchDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid matchDate format. Use ISO8601 e.g. 2026-04-16T18:02:00Z"})
		return
	}

	
	config.DB.Model(&ad).Updates(map[string]interface{}{
		"title":          input.Title,
		"category":       input.Category,
		"location":       input.Location,
		"required_level": input.RequiredLevel,
		"match_date":     matchDate,
	})

	c.JSON(http.StatusOK, ad)
}

func DeleteAd(c *gin.Context) {
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
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the owner can delete this ad"})
		return
	}

	config.DB.Where("ad_id = ?", adID).Delete(&models.Application{})
	config.DB.Delete(&ad)

	c.Status(http.StatusNoContent)
}