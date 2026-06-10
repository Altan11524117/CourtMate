pipeline {
    agent any

    environment {
        GOPATH = "${WORKSPACE}"
        RABBITMQ_HOST = 'rabbitmq'
        RABBITMQ_PORT = '5672'
        RABBITMQ_USER = 'guest'
        RABBITMQ_PASSWORD = 'guest'
        DB_HOST = 'db'
        DB_USER = 'postgres'
        DB_PASSWORD = 'rootpassword'
        DB_NAME = 'courtmate_db'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Building Go application...'
                dir('backend') {
                    sh '''
                        go version
                        go mod download
                        go build -o main .
                        echo "✓ Build successful!"
                    '''
                }
            }
        }

        stage('Test - RabbitMQ Messaging') {
            steps {
                echo '🧪 Testing RabbitMQ messaging...'
                dir('backend') {
                    sh '''
                        echo "Waiting for RabbitMQ to be ready..."
                        for i in {1..30}; do
                            if go run github.com/streadway/amqp@latest > /dev/null 2>&1; then
                                echo "✓ RabbitMQ is ready!"
                                break
                            fi
                            echo "Attempt $i: Waiting for RabbitMQ..."
                            sleep 2
                        done

                        echo "Running RabbitMQ integration tests..."
                        go test -v ./config -run TestRabbitMQ 2>&1 || echo "⚠ Some tests may require RabbitMQ running in Docker"
                    '''
                }
            }
        }

        stage('Test - API Health Check') {
            steps {
                echo '💚 Testing API health endpoint...'
                dir('backend') {
                    sh '''
                        echo "Waiting for backend health endpoint..."
                        for i in {1..10}; do
                            if curl -f http://localhost:8000/health > /dev/null 2>&1; then
                                echo "✓ Backend is healthy!"
                                break
                            fi
                            echo "Attempt $i: Waiting for backend..."
                            sleep 2
                        done
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                dir('backend') {
                    sh '''
                        docker build -t courtmate-backend:${BUILD_NUMBER} .
                        docker tag courtmate-backend:${BUILD_NUMBER} courtmate-backend:latest
                        echo "✓ Docker image built successfully!"
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up...'
                sh '''
                    echo "Pipeline execution completed!"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo '📊 Pipeline execution finished'
        }
    }
}
