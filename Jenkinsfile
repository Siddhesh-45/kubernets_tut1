pipeline {
    agent any

    environment {
        IMAGE_NAME = 'jenkinspipeline'
        CONTAINER_NAME = 'jenkinspipeline-app'
        HOST_PORT = '30001'
        CONTAINER_PORT = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "===== Building Docker Image ====="
                    docker build -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                    echo "===== Stopping Old Container ====="

                    docker stop ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Remove Old Container') {
            steps {
                sh '''
                    echo "===== Removing Old Container ====="

                    docker rm ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Deploy Docker Container') {
            steps {
                sh '''
                    echo "===== Starting New Container ====="

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "===== Running Containers ====="
                    docker ps

                    echo "===== Container Status ====="
                    docker inspect -f '{{.State.Status}}' ${CONTAINER_NAME}
                '''
            }
        }
    }

    post {
        success {
            echo "========================================"
            echo "Docker deployment successful!"
            echo "Application is running on port 30001"
            echo "========================================"
        }

        failure {
            echo "========================================"
            echo "Docker deployment failed!"
            echo "========================================"
        }
    }
}
