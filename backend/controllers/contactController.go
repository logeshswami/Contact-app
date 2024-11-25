package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UidRequest struct {
	UserID string `json:"user_id" binding:"required"`
}

// add contact to lst for the user
func CreateContact(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var contact models.Contact
		if err := c.ShouldBindJSON(&contact); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "status": "fail"})
			return
		}
		var existingContact models.Contact
		if err := db.Where("user_id = ? AND phone = ?", contact.UserId, contact.Phone).First(&existingContact).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Phone number already exists for this user", "status": "exists"})
			return
		}
		if err := db.Where("user_id = ? AND name = ?", contact.UserId, contact.Name).First(&existingContact).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Contact name already exists for this user", "status": "exists"})
			return
		}
		//add contact ot db
		if err := db.Create(&contact).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create contact" + err.Error(), "status": "fail"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Contact created successfully", "status": "success", "contact": contact})
	}
}

// fetch all contact of teh user
func GetContacts(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var userReq UidRequest
		var contacts []models.Contact

		if err := c.ShouldBindJSON(&userReq); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body", "details": err.Error(), "status": "fail"})
			return
		}
		//user id to match
		userId := userReq.UserID
		if err := db.Where("user_id = ?", userId).Find(&contacts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch contacts", "id": userId, "status": "fail"})
			return
		}

		c.JSON(http.StatusOK, contacts)
	}
}

// update contact with contact id
func UpdateContact(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var contact models.Contact
		contactId := c.Param("contact_id")

		if err := db.First(&contact, "contact_id = ?", contactId).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Contact not found", "status": "fail"})
			return
		}
		if err := c.ShouldBindJSON(&contact); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error(), "status": "fail"})
			return
		}
		if err := db.Save(&contact).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update contact", "status": "fail"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Contact updated successfully", "status": "success", "contact": contact})
	}
}

// delete contact using contactid
func DeleteContact(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var contact models.Contact
		contactId := c.Param("contact_id")

		if err := db.First(&contact, "contact_id = ?", contactId).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"message": "Contact not found", "status": "fail"})
			return
		}
		if err := db.Delete(&contact).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete contact", "status": "fail"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Contact deleted successfully", "status": "success"})
	}
}
