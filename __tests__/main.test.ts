jest.mock('@actions/core')
jest.mock('../src/setup-step-cli')
import {run} from '../src/main'
import {beforeEach, expect, jest, test} from '@jest/globals'
const core = require('@actions/core')
const step = require('../src/setup-step-cli')

test('should suceed calling main program entrypoint', async () => {
  // Mock getting Actions input and return value for installStepCli
  const version = '0.0.0'
  core.getInput = jest.fn().mockReturnValueOnce(version)
  Object.defineProperty(step, 'installStepCli', {
    value: jest.fn().mockImplementationOnce(() => Promise.resolve())
  })

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalledWith('0.0.0')
})

test('should fail calling main program entrypoint with Error thrown', async () => {
  // Mock installStepCli throwing error
  step.installStepCli.mockImplementationOnce(() => {
    throw new Error('some failure')
  })

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalled
  expect(core.setFailed).toHaveBeenCalledWith('some failure')
})

test('should fail calling main program entrypoint without Error thrown', async () => {
  // Mock installStepCli throwing error
  step.installStepCli.mockImplementationOnce(() => Promise.reject())

  // Run function and validate steps
  run()
  expect(step.installStepCli).toHaveBeenCalled
  expect(core.setFailed).toHaveBeenCalledTimes(0)
})
