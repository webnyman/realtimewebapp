// Anonymous function for disabling submit button after submitting snippet

try {
  const submitForm = document.getElementById('snippetForm')
  const submitButton = document.getElementById('submitButton')
  submitForm.addEventListener('submit', () => {
    submitButton.disabled = true
  })
} catch (error) {
  console.log(error)
}
