pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Building Docker Image') {
            steps {
                script {
                    sh 'docker build -t jenkinspipeline .'
                }
            }
        }

        stage('Verify Kubernetes') {
            steps {
                sh '''
                    set -e

                    echo "===== Kubernetes Version ====="
                    kubectl version --client

                    echo "===== Kubeconfig ====="
                    echo "HOME=$HOME"
                    echo "KUBECONFIG=$KUBECONFIG"

                    echo "===== Available Contexts ====="
                    kubectl config get-contexts

                    echo "===== Current Context ====="
                    kubectl config current-context

                    echo "===== Cluster Info ====="
                    kubectl cluster-info

                    echo "===== Nodes ====="
                    kubectl get nodes
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f deployment.yaml --validate=false'
                    sh 'kubectl apply -f service.yaml'
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline executed successfully"
            echo "Application deployed successfully"
            echo "Application is running on port 30001"
        }

        failure {
            echo "Pipeline execution failed"
        }
    }
}
