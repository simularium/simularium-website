![Node.js CI](https://github.com/allen-cell-animated/simularium-website/workflows/Node.js%20CI/badge.svg)

# Simularium Website

Front end website to create, modify and view simulations

---

## Description

​This project aims to involve the wider biology community, especially wet lab biologists, in building and analyzing spatial mechanistic simulations at different levels of scale and connecting them in the context of whole cells. Our goal is to facilitate collaboration between experimental and computational biologists by building software tools and infrastructure to allow easy access to software packages written by computational biologists and easy visualization and sharing of results.

## Documentation

If you have more extensive technical documentation (whether generated or not), ensure they are published to the following address:
For full package documentation please visit
[organization.github.io/projectname](https://organization.github.io/projectname/index.html).

## Quick Start
To run this application in development: 
#### With Gradle
1. `$ ./gradlew start`

#### With npm
1. `npm i` to install dependencies 
2. `npm start`

This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser automatically when those files change.
___

## Development

1. Checkout a branch named for an issue/bug
2. Push changes to that branch
3. Make sure `npm run typeCheck`, `npm run test` and `npm run lint` all exit without errors. 
4. Make a PR back to master using template, include screen shots for visual changes. Request reviews from Megan, Dan, Eric, Blair. If your change is implementing a design add Lisa S too. 
5. Merge after at least 1 approval, but for complex changes, ideally 2.


### Structure
src/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[components/](src/components/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[constants/](src/constants/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[containers/](src/containers/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[state/](src/state/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[styles/](src/styles/README.md)<br/>
___


### Runtime configuration:

| Env var | Default | Options |
| ------- |-------- |---------|
|`DEPLOYMENT_ENV`    | dev     | "dev", "staging", "production" |


Differences in builds by environment:

| Target | Sources Maps | Uglification | NODE_ENV === 'production' |
| ------ | ------------ | ------------ |  ------------------------- |
| dev    | true         | false |  false                     |
| staging| true         | false |  false                      |
| production| false      | true |  true                      |
___


### Deployment
Once built, Webpack outputs (e.g., index.html, JS and CSS files) are put into a tar archive, gzipped, and stored in
Artifactory in the `maven-snapshot-local` repo. From there, deployments involve: a) pulling a particular artifact (referenced by git tag) out of Artifactory
and b) copying the contents of the artifact to an S3 website bucket. For both staging and production deployments, these 
steps are captured in this project's Jenkinsfile and can be executed by setting the proper parameters for the Jenkins build.

#### Staging deployment
Automatically builds from `master`

#### Production deployment
Note: The final two steps require the AWS CLI as well as permissions on AWS to copy to the production S3 bucket and to run a Cloudfront invalidation.
See https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html for details on installing the AWS CLI.

From the Jenkins UI:
1. Go to this project's `master` branch pipeline page: https://jenkins.corp.alleninstitute.org/job/docker-images/job/docker-cell-feature-explorer/
2. Select "Build with Parameters" on the left-hand-side navigation menu.
3. Under the "JOB_TYPE" dropdown, select "PROMOTE_ARTIFACT".
4. Ignore the "DEPLOYMENT_TYPE" dropdown for now.
5. In the "GIT_TAG" selectbox, select the tag of the artifact you want to deploy.
6. Hit "Build".
7. Once the artifact promotion job has finished, return to the "Build with Parameters" page.
8. Under the "JOB_TYPE" dropdown, select "DEPLOY_ARTIFACT".
9. Under the "DEPLOYMENT_TYPE" dropdown, select "production".
10. In the "GIT_TAG" selectbox, select the tag of the artifact that you just promoted.
11. Hit "Build".
13. Run the script "bust-cloudfront-cache.sh" found in this repo's `scripts` directory. That will ensure Cloudfront is serving the newly deployed artifacts.

### Docker image configuration
| Env var | Required | Default | Notes |
| ------- |-------- |---------|---------|
| `PORT` | - | 80 | Port on which the app will run **inside** the container. |
___

See [CONTRIBUTING.md](CONTRIBUTING.md) for information related to developing the code.
