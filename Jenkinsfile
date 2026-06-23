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
        // stage('List Models') {
        //     steps {
        //         withCredentials([string(credentialsId: 'openai-key', variable: 'OPENAI_KEY')]) {
        //             sh '''
        //     curl https://api.openai.com/v1/models \
        //       -H "Authorization: Bearer $OPENAI_KEY"
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
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\$GEMINI_KEY" \
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
