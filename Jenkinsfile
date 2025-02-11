pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular Application') {
            steps {
                sh 'ng build --prod'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t angular-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 8080:80 --name angular-app-container angular-app'
            }
        }
    }
}
