package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	ID        string
	Name      string
	Email     string
	CreatedAt string
}

var db *sql.DB

var cognitoRegion string
var clientId string
var jwksURL string
var apiKey string

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("handler called...")

	var user User
	err := db.QueryRow("SELECT id, username, email, created_at FROM users WHERE username = ?", "testuser").Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt)
	if err != nil {
		fmt.Printf("error in query: %s", err)
		return
	}

	fmt.Fprintf(w, "ID: %s, Name: %s, Email: %s, CreatedAt: %s\n", user.ID, user.Name, user.Email, user.CreatedAt)
}

func main() {
	fmt.Println("server started...")
	var err error

	cognitoRegion = os.Getenv("COGNITO_REGION")
	clientId = os.Getenv("COGNITO_CLIENT_ID")
	jwksURL = os.Getenv("TOKEN_KEY_URL")
	apiKey = os.Getenv("GOOGLE_API_KEY")
	if cognitoRegion == "" || clientId == "" || jwksURL == "" || apiKey == "" {
		log.Fatalf("congnitまたはgeminiの環境変数が設定されていません")
	}

	ns_mariadb_user := os.Getenv("NS_MARIADB_USER")
	ns_mariadb_password := os.Getenv("NS_MARIADB_PASSWORD")
	ns_mariadb_port := os.Getenv("NS_MARIADB_PORT")
	ns_mariadb_hostname := os.Getenv("NS_MARIADB_HOSTNAME")
	ns_mariadb_database := os.Getenv("NS_MARIADB_DATABASE")
	if ns_mariadb_user == "" || ns_mariadb_password == "" || ns_mariadb_port == "" || ns_mariadb_hostname == "" || ns_mariadb_database == "" {
		log.Fatalf("mariadbの環境変数が設定されていません")
	}

	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", ns_mariadb_user, ns_mariadb_password, ns_mariadb_hostname, ns_mariadb_port, ns_mariadb_database))
	if err != nil {
		fmt.Println("error in db connection")
		log.Fatal(err)
	}
	defer db.Close()

	http.HandleFunc("/", handler)
	http.HandleFunc("/signin", signin)
	http.HandleFunc("/signup", signup)
	http.HandleFunc("/checkEmail", checkEmail)
	http.HandleFunc("/resendEmail", resendEmail)
	http.HandleFunc("/welcome", welcome)
	http.HandleFunc("/saveprofile", saveProfile)
	http.HandleFunc("/getAnswers", processQuestionsWithAI)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
