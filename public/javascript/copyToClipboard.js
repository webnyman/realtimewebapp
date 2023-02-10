// Anonymous function for copy snippet to clipboard

try {
  const copyButtons = document.querySelectorAll('#copyToClipboard')
  copyButtons.forEach(button => {
    button.addEventListener('click', event => {
      const td = (event.target.closest('td'))
      const snippetToCopy = td.querySelector('pre').innerText
      navigator.clipboard
        .writeText(snippetToCopy)
        .then(() => {
          td.querySelector('small').classList.remove('d-none')
          setTimeout(() => {
            td.querySelector('small').classList.add('d-none')
          }, 1000)
        })
        .catch((err) => console.error(`Error copying to clipboard: ${err}`))
    })
  })
} catch (error) {
  console.log(error)
}
