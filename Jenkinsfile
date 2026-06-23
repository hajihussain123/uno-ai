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

                    echo "Commit Message: ${env.COMMIT_MSG}"
                }
            }
        }

        // stage('List Gemini Models') {
        //     steps {
        //         withCredentials([string(credentialsId: 'gemini-key', variable: 'GEMINI_KEY')]) {
        //             sh '''
        //     curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_KEY"
        //     '''
        //         }
        //     }
        // }

        stage('Gemini Summary') {
            steps {
                script {
                    def commitMsg = sh(
                script: 'git log -1 --pretty=%B',
                returnStdout: true
            ).trim()

                withCredentials([string(credentialsId: 'gemini-key', variable: 'GEMINI_KEY')]) {
                    sh """
            curl -X POST \
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\$GEMINI_KEY" \
            -H "Content-Type: application/json" \
            -d '{
                "contents": [{
                    "parts": [{
                        "text": "Summarize this commit in one sentence: ${commitMsg}"
                    }]
                }]
            }'
            """
                }
            }
        }
    }
    }
}
