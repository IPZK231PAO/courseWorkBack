// if (window.location.pathname === '/playlists') {
// document.querySelector('#firstPlaylistForm').addEventListener('submit', async event => {
// 	event.preventDefault()

// 	const messageDiv = document.querySelector('#message');
// 	const title = document.querySelector('#firstForm__title').value;
// 	const id = document.querySelector('#userId')
// 	const selectedSongs = Array.from(
// 		event.target.querySelectorAll('#firstForm__songs option:checked')
// 	).map(option => option.value)

// 	const data = {
// 		id:id,
// 		title: title,
// 		songIds: selectedSongs
// 	};

// 	console.log(data);

// 	fetch('/playlists', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data)
// 	})
// 	.then(response => {
// 		console.log('Response first Playlist:', response);
// 		return response.json()
// 	})
// 	.then(data => {
// 		console.log('Data', data);
// 		messageDiv.style.color = data.success ? 'green' : 'brown';
// 		messageDiv.textContent = data.message
// 	})
// 	.catch(error => {
// 		console.error('Error adding playlist: ', error)
// 	});
// });

// document.querySelector('#secondPlaylistForm').addEventListener('submit', async event => {
// 	event.preventDefault()

// 	const messageDiv = document.querySelector('#message');
// 	const selectedSongs = Array.from(
// 		event.target.querySelectorAll('.secondPlaylistForm__songs option:checked')
// 	).map(option => option.value)

// 	const data = {
// 		playlistId: event.target.getAttribute('name'),
// 		songIds: selectedSongs
// 	};

// 	console.log(data);

// 	fetch(`/playlists/addsongs`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data)
// 	})
// 	.then(response => {
// 		console.log('Response second Playlist:', response);
// 		return response.json()
// 	})
// 	.then(data => {
// 		console.log('Data', data);
// 		messageDiv.style.color = data.success ? 'green' : 'brown';
// 		messageDiv.textContent = data.message
// 	})
// 	.catch(error => {
// 		console.error('Error adding playlist: ', error)
// 	})
// })

// document.querySelector('#ThirdPlaylistForm').addEventListener('submit', async event => {
// 	event.preventDefault()

// 	const messageDiv = document.querySelector('#message');
// 	const selectedSongs = Array.from(
// 		event.target.querySelectorAll('#ThirdForm__songs option:checked')
// 	).map(option => option.value)
// 	const title = document.querySelector('#ThirdForm__title').value;
// 	const data = {
// 		playlistId: event.target.getAttribute('name'),
// 		title:title,
// 		songIds: selectedSongs
// 	};

// 	console.log(data);

// 	fetch(`/playlists/update`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data)
// 	})
// 	.then(response => {
// 		console.log('Response third Playlist:', response);
// 		return response.json()
// 	})
// 	.then(data => {
// 		console.log('Data', data);
// 		messageDiv.style.color = data.success ? 'green' : 'brown';
// 		messageDiv.textContent = data.message
// 	})
// 	.catch(error => {
// 		console.error('Error updating playlist: ', error)
// 	})
// })

// }
document.addEventListener('DOMContentLoaded', () => {
    const messageDiv = document.querySelector('#message');
    const userId = document.querySelector('#userId').getAttribute('name');

    // Function to open modal form
    function openForm(formId) {
        document.getElementById(formId).style.display = 'block';
    }

    // Function to close modal form
    function closeForm(formId) {
        document.getElementById(formId).style.display = 'none';
    }

    // Event listeners for opening forms
    document.getElementById('openCreateForm').addEventListener('click', () => openForm('createForm'));
    document.querySelectorAll('.openAddSongsForm').forEach(button => {
        button.addEventListener('click', () => {
            const playlistId = button.getAttribute('data-playlist-id');
            document.getElementById('secondPlaylistForm').setAttribute('name', playlistId);
            openForm('addSongsForm');
        });
    });
    document.querySelectorAll('.openUpdateForm').forEach(button => {
        button.addEventListener('click', () => {
            const playlistId = button.getAttribute('data-playlist-id');
            document.getElementById('thirdPlaylistForm').setAttribute('name', playlistId);
            openForm('updateForm');
        });
    });

    // Event listeners for closing forms
    document.getElementById('closeCreateForm').addEventListener('click', () => closeForm('createForm'));
    document.getElementById('closeAddSongsForm').addEventListener('click', () => closeForm('addSongsForm'));
    document.getElementById('closeUpdateForm').addEventListener('click', () => closeForm('updateForm'));

    // Create playlist form submit
    document.getElementById('firstPlaylistForm').addEventListener('submit', async event => {
        event.preventDefault();
        const title = document.querySelector('#firstForm__title').value;
        const selectedSongs = Array.from(event.target.querySelectorAll('#firstForm__songs option:checked')).map(option => option.value);
        const data = { id: userId, title, songIds: selectedSongs };

        fetch('/playlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.style.color = data.success ? 'green' : 'brown';
            messageDiv.textContent = data.message;
            if (data.success) closeForm('createForm');
        })
        .catch(error => console.error('Error adding playlist:', error));
    });

    // Add songs to playlist form submit
    document.getElementById('secondPlaylistForm').addEventListener('submit', async event => {
        event.preventDefault();
        const playlistId = event.target.getAttribute('name');
        const selectedSongs = Array.from(event.target.querySelectorAll('.secondPlaylistForm__songs option:checked')).map(option => option.value);
        const data = { playlistId, songIds: selectedSongs };

        fetch(`/playlists/addsongs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.style.color = data.success ? 'green' : 'brown';
            messageDiv.textContent = data.message;
            if (data.success) closeForm('addSongsForm');
        })
        .catch(error => console.error('Error adding songs to playlist:', error));
    });

    // Update playlist form submit
    document.getElementById('thirdPlaylistForm').addEventListener('submit', async event => {
        event.preventDefault();
        const playlistId = event.target.getAttribute('name');
        const title = document.querySelector('#thirdForm__title').value;
        const selectedSongs = Array.from(event.target.querySelectorAll('#thirdForm__songs option:checked')).map(option => option.value);
        const data = { playlistId, title, songIds: selectedSongs };

        fetch(`/playlists/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.style.color = data.success ? 'green' : 'brown';
            messageDiv.textContent = data.message;
            if (data.success) closeForm('updateForm');
        })
        .catch(error => console.error('Error updating playlist:', error));
    });
});