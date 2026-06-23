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
        }
    }
}

stage('AI Code Review') {
    steps {
        script {
            def escapedDiff = env.GIT_DIFF
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")

            sh """
            curl http://host.docker.internal:11434/api/generate \
              -H "Content-Type: application/json" \
              -d '{
                "model":"llama3.2",
                "prompt":"Review this git diff and suggest improvements:\\n\\n${escapedDiff}",
                "stream": false
              }'
            """
        }
    }
}
        // stage('AI Summary') {
        //     steps {
        //         script {
        //             def commitMsg = sh(
        //         script: 'git log -1 --pretty=%B',
        //         returnStdout: true
        //     ).trim()

        //             sh """
        //     curl http://host.docker.internal:11434/api/generate \
        //       -H "Content-Type: application/json" \
        //       -d '{
        //         "model":"llama3.2",
        //         "prompt":"Summarize this commit in one sentence: ${commitMsg}",
        //         "stream": false
        //       }'
        //     """
        //         }
        //     }     
        // }



//         // stage('Get Changes') {
//         //     steps {
//         //         script {
//         //             env.GIT_DIFF = sh(
//         //                 script: 'git diff HEAD~1 HEAD',
//         //                 returnStdout: true
//         //             ).trim()

//         //             echo 'Collected git diff'
//         //         }
//         //     }
//         // }

//         stage('Get Changes') {
//             steps {
//                 sh 'git diff HEAD~1 HEAD > diff.txt'
//                 sh 'cat diff.txt'
//             }
//         }

//         stage('AI Code Review') {
//             steps {
//                 sh '''
// cat > prompt.txt << EOF
// You are a senior software engineer.

// Review the following git diff.
// Identify:
// 1. Bugs
// 2. Security issues
// 3. Code smells
// 4. Improvements

// EOF

// cat diff.txt >> prompt.txt

// PROMPT=$(cat prompt.txt | jq -Rs .)

// curl http://host.docker.internal:11434/api/generate \
//   -H "Content-Type: application/json" \
//   -d "{
//     \\"model\\": \\"llama3.2\\",
//     \\"prompt\\": $PROMPT,
//     \\"stream\\": false
//   }"
// '''
//             }
//         }

    //     // stage('AI Code Review') {
    //     //     steps {
    //     //         sh """
    //     //         curl http://host.docker.internal:11434/api/generate \
    //     //           -H "Content-Type: application/json" \
    //     //           -d '{
    //     //             "model":"llama3.2",
    //     //             "prompt":"You are a senior software engineer performing a code review. Review the following git diff. Identify bugs, code smells, security issues, performance concerns, and suggest improvements.\\n\\n${env.GIT_DIFF}",
    //     //             "stream": false
    //     //           }'
    //     //         """
    //     //     }
    //     // }
    }
}

