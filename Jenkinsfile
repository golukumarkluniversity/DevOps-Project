pipeline {
    agent any

    environment {
        IMAGE = "ghcr.io/${GITHUB_OWNER}/gitops-progressive-delivery-demo"
        IMAGE_TAG = "sha-${GIT_COMMIT}"
        SONARQUBE = credentials('sonarqube-token')
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Test') {
            steps { sh 'npm test' }
        }

        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.projectKey=gitops-progressive-delivery -Dsonar.sources=app -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.token=$SONARQUBE'
                }
            }
        }

        stage('Build image') {
            steps {
                sh 'docker build --file docker/Dockerfile --tag $IMAGE:$IMAGE_TAG .'
            }
        }

        stage('Scan image') {
            steps {
                sh 'trivy image --exit-code 1 --ignore-unfixed --severity HIGH,CRITICAL $IMAGE:$IMAGE_TAG'
            }
        }

        stage('Publish image') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'container-registry', usernameVariable: 'REGISTRY_USER', passwordVariable: 'REGISTRY_TOKEN')]) {
                    sh 'echo "$REGISTRY_TOKEN" | docker login ghcr.io --username "$REGISTRY_USER" --password-stdin'
                    sh 'docker push $IMAGE:$IMAGE_TAG'
                }
            }
        }

        stage('Promote GitOps') {
            when { branch 'main' }
            steps {
                withCredentials([string(credentialsId: 'gitops-repository-token', variable: 'GITOPS_TOKEN')]) {
                    sh '''
                      git clone https://x-access-token:${GITOPS_TOKEN}@github.com/${GITHUB_OWNER}/gitops-progressive-delivery-demo.git /tmp/gitops
                      sed -i -E "s/(newTag: ).*/\\1${IMAGE_TAG}/" /tmp/gitops/k8s/environments/dev/kustomization.yaml
                      git -C /tmp/gitops config user.name jenkins
                      git -C /tmp/gitops config user.email jenkins@localhost
                      git -C /tmp/gitops add k8s/environments/dev/kustomization.yaml
                      git -C /tmp/gitops commit -m "chore: promote ${IMAGE_TAG}" || true
                      git -C /tmp/gitops push
                    '''
                }
            }
        }
    }

    post {
        always { junit allowEmptyResults: true, testResults: 'test-results/**/*.xml' }
        failure { mail to: 'devops@example.com', subject: "CI failed: ${JOB_NAME} #${BUILD_NUMBER}", body: "See ${BUILD_URL}" }
    }
}
