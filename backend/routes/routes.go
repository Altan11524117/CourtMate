package routes

import (
	"courtmate-backend/controllers"
	"courtmate-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	v1 := router.Group("/v1")

	// Auth (public)
	auth := v1.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.POST("/logout", controllers.Logout)
		auth.POST("/reset-password", controllers.ResetPassword)
		auth.POST("/reset-password/confirm", controllers.ConfirmResetPassword)
	}

	// Protected
	protected := v1.Group("/")
	protected.Use(middlewares.AuthRequired())
	{
		// Users
		protected.GET("/users/me", func(c *gin.Context) {
			id, _ := c.Get("userID")
			c.JSON(200, gin.H{"userID": id})
		})
		protected.GET("/users/:userId/profile", controllers.GetUserProfile)
		protected.PATCH("/users/:userId/profile", controllers.UpdateUserProfile)
		protected.DELETE("/users/:userId", controllers.DeleteUser)

		// Exams
		protected.POST("/exams/questions", controllers.CreateQuestion)
		protected.GET("/exams/placement/questions", controllers.GetExamQuestions)
		protected.POST("/exams/placement/submit", controllers.SubmitExam)
		protected.GET("/exams/questions/:id/stats", controllers.GetQuestionStats)

		// Ads
		protected.GET("/ads", controllers.ListAds)
		protected.GET("/ads/search", controllers.SearchAds)
		protected.POST("/ads", controllers.CreateAd)
		protected.GET("/ads/:adId", controllers.GetAdDetail)
		protected.PATCH("/ads/:adId", controllers.UpdateAd)
		protected.DELETE("/ads/:adId", controllers.DeleteAd)

		// Applications
		protected.GET("/ads/:adId/applications", controllers.ListApplications)
		protected.POST("/ads/:adId/applications", controllers.ApplyToAd)
		protected.PATCH("/ads/:adId/applications/:applicationId", controllers.UpdateApplicationStatus)
	}
}