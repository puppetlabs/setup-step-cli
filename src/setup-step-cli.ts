import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'

export async function installStepCli(version: string): Promise<string> {
  let artifactVersion
  let artifactPlatform
  let artifactExtractPath
  let artifactArch

  if (version === 'latest') {
    artifactVersion = 'fake'
  } else {
    artifactVersion = version
  }

  if (process.platform === 'darwin') {
    artifactPlatform = 'darwin'
    artifactExtractPath = '/usr/local/opt/step'
  } else if (process.platform === 'linux') {
    artifactPlatform = 'linux'
    artifactExtractPath = '/opt/step'
  } else if (process.platform === 'win32') {
    artifactPlatform = 'windows'
    artifactExtractPath = 'C:\\ProgramData\\step'
  } else {
    throw new Error(
      `The platform ${process.platform} is not supported by this action`
    )
  }

  if (process.arch === 'arm64') {
    artifactArch = 'arm64'
  } else if (process.arch === 'x64') {
    artifactArch = 'amd64'
  } else {
    throw new Error(
      `The architecture ${process.arch} is not supported by this action`
    )
  }

  await io.mkdirP(artifactExtractPath)

  const stepCLIUrl = `https://github.com/smallstep/cli/releases/download/v${artifactVersion}/step_${artifactPlatform}_${artifactVersion}_${artifactArch}.tar.gz`
  const stepCLIDownload = await tc.downloadTool(stepCLIUrl)
  core.info(`Downloaded step from ${stepCLIUrl} to ${stepCLIDownload}`)
  const stepCLIExtracted = await tc.extractTar(
    stepCLIDownload,
    `${artifactExtractPath}`,
    ['xz', '--strip-components=1']
  )
  core.info(
    `Extracted step_${artifactPlatform}_${artifactVersion}_${artifactArch}.tar.gz to ${stepCLIExtracted}`
  )
  const stepCachedPath = await tc.cacheDir(stepCLIExtracted, 'step', version)
  core.addPath(`${stepCachedPath}/bin`)
  core.info(
    `Added ${stepCachedPath} to tool-cache and ${stepCachedPath}/bin to $PATH`
  )

  const allStepVersions = tc.findAllVersions('step')
  core.info(`Versions of step available: ${allStepVersions}`)

  await exec.exec('step', ['version'])

  return stepCLIExtracted
}
