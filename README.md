## Simularium repositories
This repository is part of the Simularium project ([simularium.allencell.org](https://simularium.allencell.org)), which includes repositories:
- [simulariumIO](https://github.com/simularium/simulariumio) - Python package that converts simulation outputs to the format consumed by the Simularium viewer website
- [octopus](https://github.com/simularium/octopus) - Python backend application that interfaces with biological simulation engines and serves simulation data to the front end website
- [simularium-viewer](https://github.com/simularium/simularium-viewer) - NPM package to view Simularium trajectories in 3D
- [simularium-website](https://github.com/simularium/simularium-website) - Front end website for the Simularium project, includes the Simularium viewer

---

![Node.js CI](https://github.com/simularium/simularium-website/workflows/Node.js%20CI/badge.svg)

# Simularium Website

[Links to staging and production releases](https://simularium.github.io/simularium-website/)

simularium-website is containts the code for the front end [Simularium website](https://simularium.allencell.org/), which allows users to visualize and analyze biological simulation results. Future functionality will include creating, modifying, and sharing simulations.

---

## Support

Submit a GitHub issue with any bug reports or feature requests, or talk to us on the [Allen Cell Discussion Form - Simularium][community].

[community]: https://forum.allencell.org/c/software-code/simularium/

## Development

To run this application in development: 

1. `npm i` to install dependencies 
2. `npm start`

This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser automatically when those files change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information related to development.
