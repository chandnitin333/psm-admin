pipeline {
    agent any

    parameters {
        choice(name: 'BRANCH', choices: ['develop', 'staging', 'main'], description: 'Choose branch to deploy')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'prod'], description: 'Choose environment to deploy')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "Checking out branch: ${params.BRANCH}"
                    git branch: params.BRANCH, url: 'https://github.com/chandnitin333/psm-admin.git'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo "Building the application..."
                    Run build commands (e.g., npm install, ng build, etc.)
                    Example:
                    sh 'npm install'
                    sh 'ng build --configuration production --base-href "/"'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Choose deployment server based on the environment selected
                    def server
                    if (params.ENVIRONMENT == 'dev') {
                        server = 'http://admin.gramvikas.co.in'
                    } else if (params.ENVIRONMENT == 'staging') {
                        server = 'http://admin.gramvikas.co.in/login'
                    } else if (params.ENVIRONMENT == 'prod') {
                        server = 'http://admin.gramvikas.co.in/login'
                    }

                    echo "Deploying to server: ${server} in environment: ${params.ENVIRONMENT}"

                    // Deployment process (e.g., SSH to the server, copy files, restart services)
                    // Example SSH deployment (if using SSH to deploy)
                    // sh """
                    //   ssh user@${server} 'bash -s' < ./deploy-script.sh
                    // """
                    
                    // Alternatively, you can use other tools like SCP to copy files
                    // Example using SCP:
                    // sh "scp -r dist/* user@${server}:${DEPLOY_DIR}"
                }
            }
        }

        stage('Post-Deployment') {
            steps {
                script {
                    echo "Post-deployment steps..."
                    // Example:
                    // sh "ssh user@${server} 'systemctl restart your-app-service'"
                }
            }
        }
    }
    
    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
