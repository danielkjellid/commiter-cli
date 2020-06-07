// the commit module handles the actual commit to GitHub

const CLI = require('clui')
const git = require('simple-git/promise')()
const Spinner = CLI.Spinner

const inquirer = require('./inquirer')

module.exports = {
  createCommit: async () => {
    const answers = await inquirer.promptCommitDetails()

    let sanitizedTypeOfCommit = answers.typeOfCommit.replace(/ .*/,'')
    let sanitizedCommitMessage = answers.commitMessage.toLowerCase()

    let commitMessage = sanitizedTypeOfCommit + ': ' + sanitizedCommitMessage

    const status = new Spinner('Committing and pushing to remote')
    status.start()

    try {
      git.add('.')
        .then(git.commit(commitMessage))
        .then(git.push('origin', 'master'))
    } finally {
      status.stop()
    }
  }
}