// the commit module handles the actual commit to GitHub
const CLI = require('clui')
const git = require('simple-git/promise')()
const Spinner = CLI.Spinner

const inquirer = require('./inquirer')

module.exports = {
  checkIfLocalChanges: async () => {
    const requestStatus = new Spinner('Checking git status against remote repository')

    requestStatus.start()

    const status = async () => {
      let files = []

      await git.status().then(result => {
        if (result.files.length > 0) {
          filesToJson = JSON.stringify(result.files)
          files = filesToJson
        }
      })

      return files
    }

    const response = await status()

    try {
      if (response.length > 0) {
        return true
      } else {
        return false
      }
    } finally {
      requestStatus.stop()
    }
  },
  createCommit: async () => {

    // get available branches
    const branches = await git.branch()
    const sanitizedBranches = branches.all.filter(branch => !branch.includes('remotes/origin/'))

    // set default branch to master
    let branch = 'master'

    // check if multiple branches exists
    if (sanitizedBranches.length > 1) {
      // if it does, prompt which branch you want to push to
      branch = await inquirer.promptSelectBranch(sanitizedBranches)
      branch = branch.selectBranch
    }
    
    // fire commitdetails prompt to get details and commit message form user
    const answers = await inquirer.promptCommitDetails()

    // sanitize commits 
    let sanitizedTypeOfCommit = answers.typeOfCommit.replace(/ .*/,'')
    let sanitizedCommitMessage = answers.commitMessage.toLowerCase()

    let commitMessage = sanitizedTypeOfCommit + ': ' + sanitizedCommitMessage

    const status = new Spinner('Committing and pushing to remote')
    status.start()

    try {
      git.add('.')
        .then(git.commit(commitMessage))
        .then(git.push('origin', branch))
    } finally {
      status.stop()
    }
  }
}