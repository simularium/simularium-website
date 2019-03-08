pipeline {
    options {
        disableConcurrentBuilds()
        timeout(time: 1, unit: "HOURS")
    }
    agent {
        node {
            label "docker"
        }
    }
    triggers {
        pollSCM("H */4 * * 1-5")
    }
    parameters {
        booleanParam(name: "PROMOTE_ARTIFACT", defaultValue: false, description: "Only run promote job")
        gitParameter(name: "GIT_TAG", defaultValue: "master", type: "PT_TAG", sortMode: "DESCENDING_SMART", description: "Select a Git tag specifying the artifact which should be promoted. This value is only used in promote jobs.")
    }
    environment {
        VENV_BIN = "/local1/virtualenvs/jenkinstools/bin"
        PYTHON = "${VENV_BIN}/python3"
    }
    stages {
        stage ("initialize") {
            steps {
                this.notifyBB("INPROGRESS")
                git url: "${env.GIT_URL}", branch: "${env.BRANCH_NAME}"
            }
        }

        stage ("lint, typeCheck, and test") {
            when {
                not { expression { return params.PROMOTE_ARTIFACT } }
            }
            steps {
                sh "./gradlew lint"
                sh "./gradlew typeCheck"
                sh "./gradlew test"
            }
        }

        stage ("build and push: non-master branch") {
            when {
                not { branch "master" }
                not { expression { return params.PROMOTE_ARTIFACT } }
            }
            environment {
                DEPLOYMENT_ENV = "staging"
            }
            steps {
                sh "./gradlew -i snapshotPublishTarGzAndDockerImage"
            }
        }

        stage ("build and push: master branch") {
            when {
                branch "master"
                not { expression { return params.PROMOTE_ARTIFACT } }
            }
            environment {
                DEPLOYMENT_ENV = "production"
            }
            steps {
                sh "${PYTHON} ${VENV_BIN}/manage_version -t gradle -s prepare"
                sh "./gradlew -i snapshotPublishTarGzAndDockerImage"
                sh "${PYTHON} ${VENV_BIN}/manage_version -t gradle -s tag"
            }
        }

        stage ("promote") {
            when {
                expression { return params.PROMOTE_ARTIFACT }
            }
            steps {
                sh "${PYTHON} ${VENV_BIN}/promote_artifact -t maven -g ${params.GIT_TAG}"
            }
        }
    }
    post {
        always {
            this.notifyBB(currentBuild.result)
        }
        cleanup {
            deleteDir()
        }
    }
}

def notifyBB(String state) {
    // on success, result is null
    state = state ?: "SUCCESS"

    if (state == "SUCCESS" || state == "FAILURE") {
        currentBuild.result = state
    }

    notifyBitbucket commitSha1: "${GIT_COMMIT}",
            credentialsId: "aea50792-dda8-40e4-a683-79e8c83e72a6",
            disableInprogressNotification: false,
            considerUnstableAsSuccess: true,
            ignoreUnverifiedSSLPeer: false,
            includeBuildNumberInKey: false,
            prependParentProjectKey: false,
            projectKey: "SW",
            stashServerBaseUrl: "https://aicsbitbucket.corp.alleninstitute.org"
}