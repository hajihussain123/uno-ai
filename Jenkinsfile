pipeline {
    agent any

    stages {
        stage('Get Changes') {
            steps {
                script {
                    env.GIT_DIFF = sh(
                        script: 'git diff HEAD~1 HEAD',
                        returnStdout: true
                    ).trim()

                    echo 'Collected git diff'
                }
            }
        }

        stage('AI Code Review') {
            steps {
                sh """
                curl http://host.docker.internal:11434/api/generate \
                  -H "Content-Type: application/json" \
                  -d '{
                    "model":"llama3.2",
                    "prompt":"You are a senior software engineer performing a code review. Review the following git diff. Identify bugs, code smells, security issues, performance concerns, and suggest improvements.\\n\\n${env.GIT_DIFF}",
                    "stream": false
                  }'
                """
            }
        }
    }
}
