import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
  try {
    const plist = require('plist')
    const printFile = getBooleanInput('print-file')
    const infoPlistPath = core.getInput('info-plist-path')

    if (!fs.existsSync(infoPlistPath)) {
      core.setFailed(
        `The file path for the Info.plist does not exist or is not found: ${infoPlistPath}`
      )
      process.exit(1)
    }

    core.debug(`Running action with ${infoPlistPath}`)

    const keyValuePairs = JSON.parse(core.getInput('key-value-json'))
    core.debug(JSON.stringify(keyValuePairs))

    if (!keyValuePairs) {
      core.setFailed(`Key Value JSON has no value: ${keyValuePairs}. You must define it.`)
      process.exit(1)
    }

    if (printFile) {
      core.info('Before update:')
      await exec.exec('cat', [infoPlistPath])
    }

    const fileContent = fs.readFileSync(infoPlistPath, {encoding: 'utf8'})

    const obj = plist.parse(fileContent)

    for (const item of keyValuePairs) {
      for (const [key, value] of Object.entries(item)) {
        core.debug(`Existing ${key} value ${obj[key]}`)
        obj[key] = value
      }
    }

    fs.chmodSync(infoPlistPath, '600')
    fs.writeFileSync(infoPlistPath, plist.build(obj))

    if (printFile) {
      core.info('After update:')
      await exec.exec('cat', [infoPlistPath])
    }

    core.info(`Info.plist updated successfully`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function handleError(err: unknown): Promise<void> {
  core.setFailed(`Unhandled error: ${err}`)
}

function getBooleanInput(inputName: string, defaultValue = false): boolean {
  return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE'
}
