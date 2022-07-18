# Setup Smallstep CLI

[![build-test](https://github.com/puppetlabs/setup-step-cli/actions/workflows/test.yml/badge.svg)](https://github.com/puppetlabs/setup-step-cli/actions/workflows/test.yml)

- [Description](#description)
- [Support](#support)
- [Action Inputs](#action-inputs)
- [Examples](#examples)
- [Development](#development)
- [Dependabot](#dependabot)
- [Releasing](#releasing)

## Description

This action downloads a specified version of the [smallstep cli](https://smallstep.com/docs/step-cli) on supported platforms and adds the `step` command to the runner's tool-cache.

## Support

This action is not supported or maintained by Puppet by Perforce and does not qualify for Puppet by Perforce Support plans.
It's provided without guarantee or warranty and you can use it at your own risk.
All bugfixes, updates, and new feature development will come from community contributions.

## Action Inputs

| Input name | Description | Required | Default value |
|------------|-------------|----------|---------------|
| version    | The version of the step-cli tool to install | true | latest |

## Examples

```yaml
name: My workflow
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: puppetlabs/setup-step-cli@v1
      with:
        version: '1.20.0'
    - name: Get Version
      run: step version
```

## Development

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install dependencies, make changes, then build, format, lint, package, and test changes.

```bash
npm install
npm run all
```

## Dependabot

Dependabot doesn't know that when dependencies are updated, it should result in changes in the `dist` directory, which will cause the [check-dist](https://github.com/puppetlabs/setup-step-cli/blob/main/.github/workflows/check-dist.yml) action to fail.

To remediate this, simply checkout the branch created by dependabot, run `npm install && npm run all`, then commit and push changes.

When time allows, an action could added to target pull requests created by dependabot to run the commands above and push to the branch, so that manual intervention is not required.

## Releasing

Open a release prep PR and run the release action:

1. Bump the "version" parameter in `package.json` appropriately based merged pull requests since the last release.
2. Run `npm run all`
3. Run `docker run -it --rm -e CHANGELOG_GITHUB_TOKEN -v $(pwd):/usr/local/src/your-app githubchangeloggenerator/github-changelog-generator:1.16.2 github_changelog_generator --future-release <INSERT_NEXT_VERSION>`
4. Commit and push changes to a new branch, then open a pull request against `main` and be sure to add the "maintenance" label.
5. After the pull request is approved and merged, then navigate to Actions --> Release Action --> run workflow --> Branch: main --> Run workflow.

The action is now published! :rocket:
