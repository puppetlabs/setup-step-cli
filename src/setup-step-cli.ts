import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as tc from '@actions/tool-cache'
import {request} from '@octokit/request'

export async function installStepCli(version: string): Promise<string> {
  let artifactVersion
  let artifactPlatform
  let artifactArch
  let compressFormat

  if (version === 'latest') {
    const response = await request(
      'GET /repos/{owner}/{repo}/releases/latest',
      {
        owner: 'smallstep',
        repo: 'cli'
      }
    )
    artifactVersion = response.data.tag_name.replace('v', '')
  } else {
    artifactVersion = version
  }

  if (process.platform === 'darwin') {
    artifactPlatform = 'darwin'
    compressFormat = 'tar.gz'
  } else if (process.platform === 'linux') {
    artifactPlatform = 'linux'
    compressFormat = 'tar.gz'
  } else if (process.platform === 'win32') {
    artifactPlatform = 'windows'
    compressFormat = 'zip'
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

  await io.mkdirP('step')

  const stepCLIUrl = `https://github.com/smallstep/cli/releases/download/v${artifactVersion}/step_${artifactPlatform}_${artifactVersion}_${artifactArch}.${compressFormat}`
  const stepCLIDownload = await tc.downloadTool(stepCLIUrl)
  core.info(`Downloaded step from ${stepCLIUrl} to ${stepCLIDownload}`)
  const stepCLIExtracted = await tc.extractTar(stepCLIDownload, 'step', [
    'xz',
    '--strip-components=1'
  ])
  core.info(
    `Extracted step_${artifactPlatform}_${artifactVersion}_${artifactArch}.tar.gz to ${stepCLIExtracted}`
  )
  const stepCachedPath = await tc.cacheDir(
    stepCLIExtracted,
    'step',
    artifactVersion
  )
  core.addPath(`${stepCachedPath}/bin`)
  core.info(
    `Added ${stepCachedPath} to tool-cache and ${stepCachedPath}/bin to $PATH`
  )

  const allStepVersions = tc.findAllVersions('step')
  core.info(`Versions of step available: ${allStepVersions}`)

  await exec.exec('step', ['version'])

  return stepCLIExtracted
}
