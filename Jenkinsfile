pipeline {
    agent any

    stages {
        stage('Clone GitHub Repository') {
            steps {
                script {
                    sh 'git clone https://github.com/kanishksingh01/Capstone_Project.git'
                    sh 'cd your-project'
                }
            }
        }

        stage('Setup Python Environment') {
            steps {
                script {
                    sh 'python3 -m venv venv'
                    sh 'source venv/bin/activate'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'source venv/bin/activate && pip install django'
                }
            }
        }

        stage('Run Django Commands on EC2') {
            steps {
                script {
                    sh '''
                    source venv/bin/activate
                    python manage.py collectstatic --noinput
                    python manage.py makemigrations
                    python manage.py migrate
                    python manage.py runserver 0.0.0.0:8000 
                    '''
                }
            }
        }

        stage('Run Node.js Application') {
            steps {
                script {
                    sh '''
                    cd your-project
                    npm install
                    npm start &
                    '''
                }
            }
        }
    }
}
