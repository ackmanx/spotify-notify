document.addEventListener('DOMContentLoaded', async function () {
    const response = await window.fetch('/api/get-new-albums')
    console.log('###', await response.json()) //todo majerus
})
