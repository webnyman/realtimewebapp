import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issuetemplate')
const issueContainer = document.querySelector('tbody')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  // 🎉 This should work with any subdirectory.
  const base = document.querySelector('base')
  const path = base
    ? (new URL('socket.io', base.href)).pathname
    : '/socket.io'
  const socket = window.io.connect('/', { path })

  // Listener for new issue
  socket.on('newIssue', (issue) => {
    insertIssue(issue.id, createIssue(issue))
  })

  // Listener for close issue
  socket.on('closeIssue', (issue) => deleteIssueRow(issue.id))

  // Listener for update issue
  socket.on('updateIssue', (issue) => updateIssue(issue))
}

/**
 * Inserts an issue to the issue table.
 *
 * @param {any} issueId - The issues id
 * @param {HTMLElement} issueNode - The node to insert
 */
function insertIssue (issueId, issueNode) {
  try {
    const allIssues = document.querySelectorAll('.issue')
    const firstIssue = allIssues[0]
    if (firstIssue.getAttribute('data-id') < issueId) {
      issueContainer.insertBefore(issueNode, firstIssue)
      blinkGreen(issueId)
    } else {
      for (const element of allIssues) {
        if (element.getAttribute('data-id') < issueId) {
          issueContainer.insertBefore(issueNode, element)
          blinkGreen(issueId)
          return
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * Creates a issue node.
 *
 * @param {object} issue - The issue to add.
 * @returns {HTMLElement} issueNode - The node to insert.
 */
function createIssue (issue) {
  // Get all necessary HTML Elements fron template
  const issueNode = issueTemplate.content.cloneNode(true)
  const issueRow = issueNode.querySelector('tr')
  const issueNumberTd = issueNode.querySelectorAll('td')[0]
  const issueTitleTd = issueNode.querySelectorAll('td')[1]
  const issueDescrTd = issueNode.querySelectorAll('td')[2]
  const avatar = issueNode.querySelector('img')
  const issueCreatedBySpan = issueNode.querySelector('span')
  const hrefClose = issueNode.querySelector('#href-close')
  const hrefUpdate = issueNode.querySelector('#href-update')

  // Set all necessary parameters from issue
  issueRow.setAttribute('data-id', issue.id)
  issueRow.classList.add('issue')
  issueNumberTd.innerText = issue.iid
  issueTitleTd.innerText = issue.title
  issueDescrTd.innerText = issue.description
  avatar.setAttribute('src', issue.avatar)
  avatar.setAttribute('alt', issue.createdBy)
  issueCreatedBySpan.innerText = issue.createdBy
  hrefClose.href = ('./issues/' + issue.iid + '/close')
  hrefUpdate.href = ('./issues/' + issue.iid + '/edit')

  return issueNode
}

/**
 * Deletes an issue from the issue table.
 *
 * @param {any} issueId - The issue to delete.
 */
function deleteIssueRow (issueId) {
  try {
    const rowToRemove = document.querySelector(`tr[data-id="${issueId}"]`)
    rowToRemove.classList.add('table-danger')
    setTimeout(() => {
      rowToRemove.classList.remove('table-danger')
      rowToRemove.remove()
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Updates an issue from the issue table.
 *
 * @param {object} issue - The issue to update.
 */
function updateIssue (issue) {
  try {
    const issueToUpdate = document.querySelector(`tr[data-id="${issue.id}"]`)
    issueToUpdate.querySelectorAll('td')[1].innerText = issue.title
    issueToUpdate.querySelectorAll('td')[2].innerText = issue.description
    issueToUpdate.querySelectorAll('td')[3].innerText = issue.createdBy
    blinkGreen(issue.id)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Makes row green on insert and update.
 *
 * @param {any} issueId - The issue to glow.
 *
 */
function blinkGreen (issueId) {
  try {
    const rowToGlow = document.querySelector(`tr[data-id="${issueId}"]`)
    rowToGlow.classList.add('table-success')
    setTimeout(() => {
      rowToGlow.classList.remove('table-success')
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
