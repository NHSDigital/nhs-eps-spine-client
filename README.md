# NHS EPS Spine Client

[![Release to GitHub Packages](https://github.com/NHSDigital/nhs-eps-spine-client/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/NHSDigital/nhs-eps-spine-client/actions/workflows/release.yml)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=NHSDigital_nhs-eps-spine-client)](https://sonarcloud.io/summary/new_code?id=NHSDigital_nhs-eps-spine-client)

This repository contains the code to invoke the Spine client, utilised in <https://github.com/NHSDigital/prescriptionsforpatients>

## Functionality

This repository encompasses the code for invoking the Spine client, designed for interaction with the Spine API. It serves as a versatile NPM dependency for both <https://github.com/NHSDigital/prescriptionsforpatients> and the Prescription Tracker application.

### Versions

This project has a dependency on @aws-lambda-powertools/logger.  
If you are using @aws-lambda-powertools/logger in your project, and you are using version 1.x of @aws-lambda-powertools/logger, then you must use version 1.x of this module.  
If you are using @aws-lambda-powertools/logger in your project, and you are using version 2.x of @aws-lambda-powertools/logger, then you must use version 2.x of this module.

### Usage

To integrate this into your project, install the package using the following:

- command line

```bash
npm install @NHSDigital/eps-spine-client
```

- package.json

```
"@NHSDigital/eps-spine-client": "^2.0.0"
```

## Project Structure

- `.devcontainer` Contains a dockerfile and vscode devcontainer definition
- `.github` Contains github workflows that are used for building and deploying from pull requests and releases
- `scripts` Contains a script for checking Python licenses
- `src` Contains the source code for the project
- `tests` Contains the tests for the project

## Contributing

Contributions to this project are welcome from anyone, providing that they conform to the [guidelines for contribution](./CONTRIBUTING.md) and the [community code of conduct](./CODE_OF_CONDUCT.md).

### Licensing

This code is dual licensed under the MIT license and the OGL (Open Government License). Any new work added to this repository must conform to the conditions of these licenses. In particular this means that this project may not depend on GPL-licensed or AGPL-licensed libraries, as these would violate the terms of those libraries' licenses.

The contents of this repository are protected by Crown Copyright (C).

## Development

It is recommended that you use visual studio code and a devcontainer as this will install all necessary components and correct versions of tools and languages.  
See <https://code.visualstudio.com/docs/devcontainers/containers> for details on how to set this up on your host machine.  
There is also a workspace file in .vscode that should be opened once you have started the devcontainer. The workspace file can also be opened outside of a devcontainer if you wish.

All commits must be made using [signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

Once the steps at the link above have been completed. Add to your ~/.gnupg/gpg.conf as below:

```
use-agent
pinentry-mode loopback
```

and to your ~/.gnupg/gpg-agent.conf as below:

```
allow-loopback-pinentry
```

As described here:
<https://stackoverflow.com/a/59170001>

You will need to create the files, if they do not already exist.
This will ensure that your VSCode bash terminal prompts you for your GPG key password.

You can cache the gpg key passphrase by following instructions at <https://superuser.com/questions/624343/keep-gnupg-credentials-cached-for-entire-user-session>

### CI Setup

The GitHub Actions require a secret to exist on the repo called "SONAR_TOKEN".
This can be obtained from [SonarCloud](https://sonarcloud.io/)
as described [here](https://docs.sonarsource.com/sonarqube/latest/user-guide/user-account/generating-and-using-tokens/).
You will need the "Execute Analysis" permission for the project (NHSDigital_nhs-eps-spine-client) in order for the token to work.

### Pre-commit hooks

Some pre-commit hooks are installed as part of the install above, to run basic lint checks and ensure you can't accidentally commit invalid changes.
The pre-commit hook uses python package pre-commit and is configured in the file .pre-commit-config.yaml.
A combination of these checks are also run in CI.

### Make commands

There are `make` commands that are run as part of the CI pipeline and help alias some functionality during development.

#### Install targets

- `install` Installs project dependencies

#### Build targets

- `build` Builds the project

#### Linting and testing

- `lint` Performs linting for all code
- `test` Runs tests for the project

#### Clean and deep-clean targets

- `clean` Clears up any files that have been generated by building or testing locally
- `deep-clean` Runs clean target and also removes any node_modules installed locally

#### Check licenses

- `check-licenses` Checks licenses for all packages used

### GitHub folder

This .github folder contains workflows and templates related to github

- `dependabot.yml` Dependabot definition file
- `pull_request_template.yml` Template for pull requests

Workflows are in the .github/workflows folder

- `combine-dependabot-prs.yml` Workflow for combining dependabot pull requests. Runs on demand
- `dependabot_auto_approve_and_merge.yml` Workflow to auto merge dependabot updates
- `pr-link.yaml` This workflow template links Pull Requests to Jira tickets and runs when a pull request is opened
- `pr_title_check.yml` Workflow to check the format of a pull request is compliant with the project standards. See [guidelines for contribution](./CONTRIBUTING.md) for details
- `pull_request.yml` Called when pull request is opened or updated. Runs [quality_checks](https://github.com/NHSDigital/eps-workflow-quality-checks)
- `release.yml` Run when code is merged to main branch or a tag starting v is pushed. Calls [quality_checks](https://github.com/NHSDigital/eps-workflow-quality-checks)
- `rename_dependabot_prs.yml` Renames dependabot pull requests to comply with project standards

### Running a Release

Details of running the release can be found in [RELEASE.md](./RELEASE.md)
