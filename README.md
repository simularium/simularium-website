## Simularium repositories
This repository is part of the Simularium project ([simularium.allencell.org](https://simularium.allencell.org)), which includes repositories:
- [simulariumIO](https://github.com/allen-cell-animated/simulariumio) - Python package that converts simulation outputs to the format consumed by the Simularium viewer website
- [simularium-engine](https://github.com/allen-cell-animated/simularium-engine) - C++ backend application that interfaces with biological simulation engines and serves simulation data to the front end website
- [simularium-viewer](https://github.com/allen-cell-animated/simularium-viewer) - NPM package to view Simularium trajectories in 3D
- [simularium-website](https://github.com/allen-cell-animated/simularium-website) - Front end website for the Simularium project, includes the Simularium viewer

---

![Node.js CI](https://github.com/allen-cell-animated/simularium-website/workflows/Node.js%20CI/badge.svg)

# Simularium Website

simularium-website is the front end Simularium website, which allows users to visualize and analyze biological simulation results. Future functionality will include creating, modifying, and sharing simulations.

---

## Quick Start
To run this application in development: 
#### With Gradle
1. `$ ./gradlew start`

#### With npm
1. `npm i` to install dependencies 
2. `npm start`

This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser automatically when those files change.

---

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for information related to developing the code.
