import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
// import * as plist from 'plist'

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
  try {
    const plist = require('plist')
    const printFile = getBooleanInput('print-file')
    const infoPlistPath = core.getInput('info-plist-path')

    if (!fs.existsSync(infoPlistPath)) {
      core.setFailed(`The file path for the Info.plist does not exist or is not found: ${infoPlistPath}`)
      process.exit(1)
    }

    core.debug(`Running action with ${infoPlistPath}`)

    const keyName: string = core.getInput('key-name')
    const keyValue: string = core.getInput('key-value')

    if (!keyName) {
      core.setFailed(`Key Name has no value: ${keyName}. You must define it.`)
      process.exit(1)
    }

    if (!keyValue) {
      core.setFailed(`Key Value has no value: ${keyValue}. You must define it.`)
      process.exit(1)
    }

    if (printFile) {
      core.info('Before update:')
      await exec.exec('cat', [infoPlistPath])
    }

    const fileContent = fs.readFileSync(infoPlistPath, {encoding: 'utf8'})
    core.debug(JSON.stringify(fileContent))

    const obj = plist.parse(fileContent)
    obj[keyName] = keyValue

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

async function handleError(err: any): Promise<void> {
  console.error(err)
  core.setFailed(`Unhandled error: ${err}`)
}

function getBooleanInput(inputName: string, defaultValue: boolean = false): boolean {
  return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE'
}
