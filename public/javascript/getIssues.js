import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issuetemplate')

if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const socket = window.io()
  socket.on('issues/create', (issue) => insertIssueRow(issue))
}

/**
 * Inserts a issue row at the top of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  console.log(issue)
  const issueContainer = document.querySelector('thead')
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
  }
}
