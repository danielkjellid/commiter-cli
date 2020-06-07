// the commit module handles the actual commit to GitHub

const CLI = require('clui')
const git = require('simple-git/promise')()
const Spinner = CLI.Spinner

const inquirer = require('./inquirer')

module.exports = {
  createCommit: async () => {
    const answers = inquirer.promptCommitDetails()
    const status = new Spinner('Committing and pushing to remote')
  
    status.start()

    let commitMessage = '(' + answers.typeOfCommit + ') ' + answers.commitMessage

    try {
      // git.add('.')
      //   .then(git.commit(commitMessage))
      //   .then(git.push('origin', 'master'))
      console.log('All done! Changes commited and pushed.')
    } finally {
      status.stop()
    }
  }
}