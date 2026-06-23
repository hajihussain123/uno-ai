pipeline {
    agent any

    stages {
        stage('Get Commit Message') {
            steps {
                script {
                    env.COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()

                    echo "Commit Message: ${env .COMMIT_MSG}"
                }
            }
        }

        stage('AI Summary') {
            steps {
                script {
                    def commitMsg = sh(
                script: 'git log -1 --pretty=%B',
                returnStdout: true
            ).trim()

                    sh """
            curl http://host.docker.internal:11434/api/generate \
              -d '{
                "model":"llama3.2",
                "prompt":"Summarize this commit: ${commitMsg}",
                "stream": false
              }'
            """
                }
            }
        }
    }
}
