package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRoutes(router *gin.Engine, db *gorm.DB) {
	router.POST("/signup", controllers.Signup(db))
	router.POST("/login", controllers.Login(db))
}
