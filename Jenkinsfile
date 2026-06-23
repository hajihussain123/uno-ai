pipeline {
    agent any

    stages {
        stage('push') {
            steps {
                echo 'Pipeline executed from GitHub !!'
            }
        }
        stage('Get Commit') {
            steps {
                sh 'git log -1 --pretty=%B > commit.txt'
                sh 'cat commit.txt'
            }
        }
    }
}


