#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

const files = require('./lib/files')
const github = require('./lib/github')
const commit = require('./lib/commit')

clear()

console.log(
  chalk.green(
    figlet.textSync('Committer', { horizontalLayout: 'full'})
  )
)

// check if current working directory is a git repo
if (!files.directoryExists('.git')) {
  console.log(chalk.red('Current directory is not a Git repository!'))
  process.exit()
}

const getGithubToken = async () => {
  // get token from config store
  let token = github.getStoredGithubToken()
  if (token) {
    return token
  }

  // if no token is found, use credentials to access GitHub account
  token = await github.getPersonalAccessToken()

  return token
}

const run = async () => {
  try {
    // retrieve and set auth token
    const token = await getGithubToken()
    github.githubAuth(token)

    // check if there has been any changes made by running git status
    const ahead = await commit.checkIfLocalChanges()

    if(!ahead) {
      console.log(chalk.red('No local changes made, commit not possible.'))
      process.exit()
    }

    await commit.createCommit()

    console.log(chalk.green('All done! Changes committed and pushed.'))

  } catch (error) {
    if (error) {
      switch (error.status) {
        case 401:
          console.log(chalk.red('Could\'t log you in. Please provide correct credentials/token.'))
          break
        default:
          console.log(chalk.red(error))
      }
    }
  }
}

run()
