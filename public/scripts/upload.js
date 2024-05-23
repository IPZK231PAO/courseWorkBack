document
		.querySelector('#uploadForm')
		.addEventListener('submit', async function (event) {
			event.preventDefault()

			const messageDiv = document.querySelector('#message')
			const form = document.querySelector('#uploadForm')
			const formData = new FormData(form)

			try {
				fetch('/upload', {
					method: 'POST',
					body: formData
				})
					.then(response => {
						console.log('Response Upload:', response)

						return response.json()
					})
					.then(data => {
						console.log('Data upload', data)
						!data.success
							? (messageDiv.style.color = 'brown')
							: (messageDiv.style.color = 'green')
						messageDiv.textContent = data.message
					})
					.catch(error => {
						console.error('Error adding song to history: ', error)
					})
			} catch (error) {
				console.error('Error:', error)

				messageDiv.style.color = 'brown'
				messageDiv.textContent = 'Error uploading song'
			}
		})