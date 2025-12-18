pipeline {
  agent {
    kubernetes {
      yaml '''
      apiVersion: v1
      kind: Pod
      spec:
        containers:
        - name: docker
          image: docker:latest
          command: ['sleep']
          args: ['infinity']
          volumeMounts:
          - name: dockersock
            mountPath: /var/run/docker.sock
        volumes:
        - name: dockersock
          hostPath:
            path: /var/run/docker.sock
      '''
    }
  }
  
  environment {
    DOCKERhub_ID = 'superinfosec'
    APP_NAME = 'my-app'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Build Image') {
      steps {
        container('docker') {
          sh "docker build -t ${DOCKERhub_ID}/${APP_NAME}:${IMAGE_TAG} ."
          sh "docker tag ${DOCKERhub_ID}/${APP_NAME}:${IMAGE_TAG} ${DOCKERhub_ID}/${APP_NAME}:latest"
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        container('docker') {
          withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PW', usernameVariable: 'DOCKER_USER')]) {
            sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PW}"
            sh "docker push ${DOCKERhub_ID}/${APP_NAME}:${IMAGE_TAG}"
            sh "docker push ${DOCKERhub_ID}/${APP_NAME}:latest"
          }
        }
      }
    }
  }
}
