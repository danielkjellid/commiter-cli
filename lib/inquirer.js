// the inquirer module takes care of command-line user interaction

const inquirer = require('inquirer')

module.exports = {
  promptGithubCredentials: () => {
    const prompts = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username og e-mail adress:',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your username or e-mail address.'
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your GitHub password:',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter your password.'
          }
        }
      }
    ]

    return inquirer.prompt(prompts)
  },

  promptTwoFactorAuthentication: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: function(value) {
        if (value.length) {
          return true
        } else {
          return 'Please enter your two-factor authentication code.'
        }
      }
    })
  },

  promptCommitDetails: () => {
    const prompts = [
      {
        type: 'list',
        name: 'typeOfCommit',
        message: 'What type of commit are you making?',
        choices: [
          'chore - regular maintenance', 
          'fix - a bug fix', 
          'style - features and updates related to styling', 
          'feature - a new feature you\'re adding', 
          'refactor - refactoring specific sections of the codebase', 
          'testing - everything related to testing'
        ],
        default: 'chore - regular maintenance'
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'What changes have you made?',
        validate: function(value) {
          if (value.length) {
            return true
          } else {
            return 'Please enter a commit message.'
          }
        }
      }
    ]
    
    return inquirer.prompt(prompts)
  }
}