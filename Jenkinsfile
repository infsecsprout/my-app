pipeline {
  agent {
    kubernetes {
      yaml '''
      apiVersion: v1
      kind: Pod
      spec:
        containers:
        - name: kaniko
          image: gcr.io/kaniko-project/executor:debug
          command: ['sleep']
          args: ['infinity']
          volumeMounts:
          - name: workspace-volume
            mountPath: /home/jenkins/agent
        volumes:
        - name: workspace-volume
          emptyDir: {}
      '''
    }
  }
  
  environment {
    // 사용자님 로그에서 확인한 아이디입니다
    DOCKERhub_ID = 'superinfosec'
    APP_NAME = 'my-app'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Build & Push with Kaniko') {
      steps {
        container('kaniko') {
          script {
            // 아까 등록한 docker-hub-creds ID/PW를 가져옵니다
            withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PW', usernameVariable: 'DOCKER_USER')]) {
              sh '''
                # 1. Kaniko가 사용할 인증 파일 생성 (config.json)
                AUTH=$(echo -n "${DOCKER_USER}:${DOCKER_PW}" | base64)
                echo "{\\"auths\\":{\\"https://index.docker.io/v1/\\":{\\"auth\\":\\"${AUTH}\\"}}}" > /kaniko/.docker/config.json

                # 2. 이미지 빌드 및 푸시 (한 방에 처리)
                /kaniko/executor --context `pwd` \
                  --destination ${DOCKERhub_ID}/${APP_NAME}:${IMAGE_TAG} \
                  --destination ${DOCKERhub_ID}/${APP_NAME}:latest
              '''
            }
          }
        }
      }
    }
  }
}
