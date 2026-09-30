pipeline{
    agent any
    stages{
        stage('Checkout'){
            steps{
            checkout scm
            }
        }
        stage('Building Docker Image'){
            steps{
                script{
                    sh 'docker build -t jenkinspipeline .'
                }

            }

        }
        stage('deploy'){
            steps{
                script{
                    sh 'docker run -d -p 3000:3000 jenkinspipeline'
                }
            }
        }
    }
}