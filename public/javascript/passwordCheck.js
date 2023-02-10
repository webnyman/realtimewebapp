// Anonymous function for client-side validation of password length

try {
  const passwordInput = document.querySelector('#password')
  const passwordHelpBlock = document.querySelector('#passwordHelpBlock')
  passwordInput.addEventListener('keyup', () => {
    (passwordInput.value.length > 9) ? passwordHelpBlock.className = 'form-text text-success' : passwordHelpBlock.className = 'form-text text-danger'
  })
} catch (error) {
  console.log(error)
}
