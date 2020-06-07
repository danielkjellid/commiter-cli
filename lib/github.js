// the github module takes care of access token management

const CLI = require('clui')
const Configstore = require('configstore')
const { Octokit } = require('@octokit/rest')
const Spinner = CLI.Spinner
const { createBasicAuth } = require('@octokit/auth-basic')

const inquirer = require('./inquirer')
const package = require('../package.json')

const config = new Configstore(package.name)

// check whether a access token is given

let octokit

module.exports = {
  getInstance: () => {
    return octokit
  },

  // if a config object exists and it has github.token property, this means that there's
  // already a token in storage, in this case, return the token value back
  getStoredGithubToken: () => {
    return config.get('github.token')
  },

  // if no token is detected, fetch one
  getPersonalAccessToken: async () => {

    // prompt user for their credentials using the promptGithubCredentials function
    const credentials = await inquirer.promptGithubCredentials()
    const status = new Spinner('Athenticating you, please wait...')

    status.start()

    // pass username, password and token
    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {
        status.stop()
        const response = await inquirer.promptTwoFactorAuthentication()
        status.start()
        return response.twoFactorAuthenticationCode
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'committer, a cli for standardizing and automating the commit process'
      }
    })

    try {
      const response = await auth()

      // if authentication is successful and a token is present in response, set it in configstore
      if (response.token) {
        config.set('github.token', response.token)
        return response.token
      } else {
        throw new Error('GitHub token was not found in the response')
      }
    } finally {
      status.stop()
    }
  },

  githubAuth: (token) => {
    octokit = new Octokit({
      auth: token
    })
  }
}