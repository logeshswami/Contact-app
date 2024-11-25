package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Contact struct {
	ContactId string `gorm:"primaryKey;not null;unique;type:uuid"`
	UserId    string `gorm:"not null;type:uuid;uniqueIndex:idx_name_user;uniqueIndex:idx_phone_user"` //uniq key pari
	User      User   //foregin key
	Name      string `gorm:"not null;uniqueIndex:idx_name_user"`  //uniq key pair
	Phone     string `gorm:"not null;uniqueIndex:idx_phone_user"` //uniq key pair
	Email     string
	Address   string
}

func (c *Contact) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ContactId == "" {
		c.ContactId = uuid.New().String()
	}
	return nil
}
