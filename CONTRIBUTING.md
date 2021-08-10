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
4. Submit a pull request back to the main branch via GitHub.


### Structure
src/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;assets/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[components/](src/components/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[constants/](src/constants/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[containers/](src/containers/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;routes/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[state/](src/state/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[styles/](src/styles/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;util/<br/>
___


### Runtime configuration:

| Env var | Default | Options |
| ------- |-------- |---------|
|`DEPLOYMENT_ENV`    | dev     | "dev", "staging", "production" |


Differences in builds by environment:

| Target | Sources Maps | Uglification | `NODE_ENV === 'production'` |
| ------ | ------------ | ------------ |  ------------------------- |
| dev    | true         | false |  false                     |
| staging| true         | false |  false                      |
| production| false      | true |  true                      |
___


### Deployment

#### Staging deployment
Automatically builds from `main`

#### Production deployment
1. Make a new version: `npm version [patch/minor/major]`
2. Push the new package.json version: `git push origin main`
3. Push the new tag: `git push origin [NEW_TAG]`
4. Go to the [releases page](https://github.com/allen-cell-animated/simularium-website/releases) and write the release notes for the new version. You can refer to the auto-generated [CHANGELOG.md][changelog] for a list of changes.

[changelog]: CHANGELOG.md

## Questions or Thoughts?

Feel free to submit a GitHub issue or talk to us on the [Allen Cell Discussion Form - Simularium][community].

[community]: https://forum.allencell.org/c/software-code/simularium/
