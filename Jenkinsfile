pipeline {
 agent {
        label 'slave3'
    }
    stages {
        stage('Clone GitHub Repository') {
            steps {
                script {
                    sh 'cd /home/ec2-user/workspace/mycapstonepipeline/Capstone_Project'
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
                    sh 'pip install django'
                }
            }
        }

        stage('Run Django Commands on EC2') {
            steps {
                script {
                    sh '''
                    cd /home/ec2-user/workspace/mycapstonepipeline/Capstone_Project
                    python3 manage.py collectstatic --noinput
                    python3 manage.py makemigrations
                    python3 manage.py migrate
                    python3 manage.py runserver 127.16.0.0:8000 
                    '''
                }
            }
        }
    }
}
