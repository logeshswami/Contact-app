package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SignupCredential struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name" biniding:"required,name"`
}

type LoginCredential struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// create new user
func Signup(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input SignupCredential
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// check email already eixst
		var existingUser models.User
		if err := db.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
			return
		}
		// hash pwd wit h method HashPassword
		user := models.User{Email: input.Email, Name: input.Name}
		if err := user.HashPassword(input.Password); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password", "status": "fail"})
			return
		}

		// Signup user
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error in creating user", "status": "fail"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "status": "success"})
	}
}

// Login
func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input LoginCredential
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		//Find usr by email
		var user models.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password", "IsAuth": false})
			return
		}

		//Check if the password matches
		if err := user.CheckPassword(input.Password); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password", "IsAuth": false})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "UserId": user.UserId, "Name": user.Name, "IsAuth": true})
	}
}
