jest.mock('@actions/core')
jest.mock('../src/setup-step-cli')
import {run} from '../src/main'
import {afterEach, expect, jest, test} from '@jest/globals'
const core = require('@actions/core')
const step = require('../src/setup-step-cli')

afterEach(() => {
  jest.clearAllMocks()
})

test('should succeed calling main program entrypoint with latest version', async () => {
  // Mock getting Actions input for latest version and return value for installStepCli
  const version = 'latest'
  core.getInput = jest.fn().mockReturnValueOnce(version)
  Object.defineProperty(step, 'installStepCli', {
    value: jest.fn().mockImplementationOnce(() => Promise.resolve())
  })

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalledWith('latest')
})

test('should succeed calling main program entrypoint with specific version', async () => {
  // Mock getting Actions input for a specific version and return value for installStepCli
  const version = '0.0.0'
  core.getInput = jest.fn().mockReturnValueOnce(version)
  Object.defineProperty(step, 'installStepCli', {
    value: jest.fn().mockImplementationOnce(() => Promise.resolve())
  })

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalledWith('0.0.0')
})

test('should fail version input validation', async () => {
  // Mock getting Actions input and return value for installStepCli
  const version = 'notasemver'
  core.getInput = jest.fn().mockReturnValueOnce(version)

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalledTimes(0)
  expect(core.setFailed).toHaveBeenCalledWith(
    'The supplied input notasemver is not a valid version. Please supply a semver format like major.minor.hotfix'
  )
})

test('should fail calling main program entrypoint with Error thrown', async () => {
  // Mock installStepCli throwing error
  const version = '0.0.0'
  core.getInput = jest.fn().mockReturnValueOnce(version)
  step.installStepCli.mockImplementationOnce(() => {
    throw new Error('some failure')
  })

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalled
  expect(core.setFailed).toHaveBeenCalledWith('some failure')
})

test('should fail calling main program entrypoint without Error thrown', async () => {
  // Mock installStepCli rejected without error
  const version = '0.0.0'
  core.getInput = jest.fn().mockReturnValueOnce(version)
  step.installStepCli.mockImplementationOnce(() => Promise.reject())

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalled
  expect(core.setFailed).toHaveBeenCalledTimes(0)
})
