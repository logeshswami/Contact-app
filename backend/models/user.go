package models

import (
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	UserId       string `gorm:"primary_key;not null;unique;type:uuid"`
	Email        string `gorm:"unique;not null"`
	PasswordHash string `gorm:"column:password_hash;not null"`
	Name         string `gorm:"not null"`
}

// BeforeCreate hook(method) auto generate uuid before creation of usr
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.UserId == "" {
		u.UserId = uuid.New().String() // generate uuid us gogle lib
	}
	return nil
}

// method HashPassword to hash pwd
func (u *User) HashPassword(password string) error {
	// convert pwd to byteslice and hash wit default strongnes
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hashed)
	return nil
}

// cmp pwd with hash values
func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
}
