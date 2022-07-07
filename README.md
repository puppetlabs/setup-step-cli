# Setup Smallstep CLI

[![build-test](https://github.com/puppetlabs/setup-step-cli/actions/workflows/test.yml/badge.svg)](https://github.com/puppetlabs/setup-step-cli/actions/workflows/test.yml)

This action downloads a specified version of the [smallstep cli](https://smallstep.com/docs/step-cli) on supported platforms and adds the `step` command to the runner's tool-cache.

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

## Releasing

Open a release prep PR and run the release action:

1. Bump the "version" parameter in `package.json` appropriately based merged pull requests since the last release.
2. Run `npm run all`, commit and push changes to a new branch.
3. Open a pull request against `main` and be sure to add the "maintenance" label.
4. After the pull request is approved and merged, then navigate to Actions --> Release Action --> run workflow --> Branch: main --> Run workflow.

The action is now published! :rocket:
