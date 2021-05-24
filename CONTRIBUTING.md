# Contributing to Allen Institute for Cell Science Open Source

Thank you for your interest in contributing to this Allen Institute for Cell Science open source project! This document is
a set of guidelines to help you contribute to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of
Conduct][code_of_conduct].

[code_of_conduct]: CODE_OF_CONDUCT.md

## Project Documentation

The `README` in the root of the repository should contain or link to
project documentation. If you cannot find the documentation you're
looking for, please file a GitHub issue with details of what
you'd like to see documented.

___

## How to Contribute

1. Fork the repo on GitHub.
2. Create a branch and make your edits on your branch, pushing back to your fork.
3. Make sure `npm run typeCheck`, `npm run test` and `npm run lint` all exit without errors. Add tests and documentation as needed.
4. Submit a pull request back to master via GitHub using template, include screen shots for visual changes. 


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
1. Make a new version: `npm version [patch/minor/major]`
2. Push the new package.json version: `git push origin master`
3. Push the new tag: `git push origin [NEW_TAG]`

### Docker image configuration
| Env var | Required | Default | Notes |
| ------- |-------- |---------|---------|
| `PORT` | - | 80 | Port on which the app will run **inside** the container. |
___

## Questions or Thoughts?

Talk to us on [one of our community forums][community].

[community]: https://forum.allencell.org/
