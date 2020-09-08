![Node.js CI](https://github.com/allen-cell-animated/simularium-website/workflows/Node.js%20CI/badge.svg)

# Simularium Website

Front end website to create, modify and view simulations

---

## Description

Main features in a brief descriptive text.

## Installation

Describe how to obtain the software and get it ready to run

## Documentation

If you have more extensive technical documentation (whether generated or not), ensure they are published to the following address:
For full package documentation please visit
[organization.github.io/projectname](https://organization.github.io/projectname/index.html).

## Quick Start
With Gradle
To run this application in development, run `$ ./gradlew start`. This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser
automatically when those files change.
With npm
1. `npm i` to install dependencies 
2. `npm start`
___

## Development

1. Checkout a branch named for an issue/bug
2. Push changes to that branch
3. Make sure `npm run typeCheck`, `npm run test` and `npm run lint` all exit without errors. 
4. Make a PR back to master using template, include screen shots for visual changes. Request reviews from Megan, Dan, Eric, Blair. If your change is implementing a design add Lisa S too. 


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


### Publishing
By default, Jenkins will build both a gzipped tar archive of all Webpack outputs (e.g., index.html, bundle.js, bundle.css; "build artifacts")
and a Docker image running an Nginx server, serving those same build artifacts.

### Docker image configuration
| Env var | Required | Default | Notes |
| ------- |-------- |---------|---------|
| `PORT` | - | 80 | Port on which the app will run **inside** the container. |
___

See [CONTRIBUTING.md](CONTRIBUTING.md) for information related to developing the code.
