import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issuetemplate')
const issueContainer = document.querySelector('tbody')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()
  socket.on('newIssue', (issue) => {
    insertIssue(issue.id, createIssue(issue))
  })
  socket.on('closeIssue', (issue) => deleteIssueRow(issue.id))
  socket.on('updateIssue', (issue) => updateIssue(issue))
}

/**
 * Inserts an issue to the issue table.
 *
 * @param {any} issueId - The issues id
 * @param {object} issueNode - The node to insert
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
 * @returns {object} issueNode - The node to insert.
 */
function createIssue (issue) {
  if (!issueContainer.querySelector(`[data-id="${issue.id}"]`)) {
    try {
      const issueNode = issueTemplate.content.cloneNode(true)
      const issueRow = issueNode.querySelector('tr')
      const issueNumberTd = issueNode.querySelectorAll('td')[0]
      const issueTitleTd = issueNode.querySelectorAll('td')[1]
      const issueDescrTd = issueNode.querySelectorAll('td')[2]
      const avatar = issueNode.querySelector('img')
      const issueCreatedBySpan = issueNode.querySelector('span')

      issueRow.setAttribute('data-id', issue.id)
      issueRow.classList.add('issue')
      issueNumberTd.innerText = issue.iid
      issueTitleTd.innerText = issue.title
      issueDescrTd.innerText = issue.description
      avatar.setAttribute('src', issue.avatar)
      avatar.setAttribute('alt', issue.createdBy)
      issueCreatedBySpan.innerText = issue.createdBy

      return issueNode
    } catch (error) {
      console.log(error)
    }
  }
}

/**
 * Deletes an issue from the issue table.
 *
 * @param {any} issueId - The issue to delete.
 */
function deleteIssueRow (issueId) {
  try {
    document.querySelector(`tr[data-id="${issueId}"]`).remove()
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
    console.log(issue.id)
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
 * Makes row green on insert.
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
