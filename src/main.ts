import * as core from '@actions/core'
import * as step from './setup-step-cli'

export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')

    await step.installStepCli(version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
