import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issuetemplate')
const issueContainer = document.querySelector('thead')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()
  socket.on('newIssue', (issue) => insertIssueRow(issue))
  socket.on('closeIssue', (issue) => deleteIssueRow(issue.id))
}

/**
 * Inserts a issue row at the top of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  try {
    if (!issueContainer.querySelector(`[data-id="${issue.id}"]`)) {
      const issueNode = issueTemplate.content.cloneNode(true)
      const issueRow = issueNode.querySelector('tr')
      const issueNumberTd = issueNode.querySelectorAll('td')[0]
      const issueTitleTd = issueNode.querySelectorAll('td')[1]
      const issueDescrTd = issueNode.querySelectorAll('td')[2]
      const issueCreatedByTd = issueNode.querySelectorAll('td')[3]

      issueRow.setAttribute('data-id', issue.id)
      issueNumberTd.innerText = issue.iid
      issueTitleTd.innerText = issue.title
      issueDescrTd.innerText = issue.description
      issueCreatedByTd.innerText = issue.createdBy

      issueContainer.appendChild(issueNode)
      blinkGreen()
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * Delets an issue from the issue table.
 *
 * @param {object} issueId - The issue to delete.
 */
function deleteIssueRow (issueId) {
  try {
    document.querySelector(`tr[data-id="${issueId}"]`).remove()
  } catch (error) {
    console.log(error)
  }
}

/**
 * Makes first row green on insert.
 *
 */
function blinkGreen () {
  try {
    const firstRow = issueContainer.querySelectorAll('tr')[1]
    firstRow.classList.add('table-success')
    setTimeout(() => {
      firstRow.classList.remove('table-success')
    }, 1000)
  } catch (error) {
    console.log(error)
  }
}
