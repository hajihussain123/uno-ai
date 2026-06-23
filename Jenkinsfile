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
        stage('List Models') {
            steps {
                withCredentials([string(credentialsId: 'openai-key', variable: 'OPENAI_KEY')]) {
                    sh '''
            curl https://api.openai.com/v1/models \
              -H "Authorization: Bearer $OPENAI_KEY"
            '''
                }
            }
        }

    // stage('AI Summary') {
    //     steps {
    //         withCredentials([
    //             string(credentialsId: 'openai-key', variable: 'OPENAI_KEY')
    //         ]) {
    //             sh """
    //             curl https://api.openai.com/v1/chat/completions \
    //               -H "Authorization: Bearer \$OPENAI_KEY" \
    //               -H "Content-Type: application/json" \
    //               -d '{
    //                 "model":"gpt-4o-mini",
    //                 "messages":[
    //                   {
    //                     "role":"user",
    //                     "content":"Summarize this commit in one sentence: ${env.COMMIT_MSG}"
    //                   }
    //                 ]
    //               }'
    //             """
    //         }
    //     }
    // }
    }
}
