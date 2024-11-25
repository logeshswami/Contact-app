package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Contact list routes
func ContactRoutes(router *gin.Engine, db *gorm.DB) {

	router.POST("/contacts/add", controllers.CreateContact(db))
	router.POST("/contacts/fetch", controllers.GetContacts(db))
	router.PUT("/contacts/:contact_id", controllers.UpdateContact(db))
	router.DELETE("/contacts/:contact_id", controllers.DeleteContact(db))
}
