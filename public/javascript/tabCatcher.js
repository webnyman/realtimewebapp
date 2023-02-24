// Anonymous function for adding tab functionality to textarea

try {
  const textarea = document.querySelector('#issueDescr')

  textarea.addEventListener('keydown', (event) => {
    if (event.keyCode === 9) {
      event.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end)
      textarea.selectionStart = textarea.selectionEnd = start + 1
    }
  })
} catch (error) {
  console.log(error)
}
