document.addEventListener('DOMContentLoaded', () => {
    function openPopup(popupId, playlistId, songId = null, userId = null) {
        const popup = document.getElementById(popupId);
        popup.style.display = 'block';
        if (playlistId) popup.dataset.playlistId = playlistId;
        if (songId) popup.dataset.songId = songId;
        if (userId) popup.dataset.userId = userId;
    }

    const messageDiv = document.querySelector('#message');

    document.querySelectorAll('.add-song').forEach(button => {
        button.addEventListener('click', (event) => {
            const playlistId = event.target.closest('.playlist-item').dataset.id;
            openPopup('addSongPopup', playlistId);
        });
    });

    document.querySelectorAll('.remove-song').forEach(button => {
        button.addEventListener('click', (event) => {
            const playlistId = event.target.closest('.playlist-item').dataset.id;
            const songId = button.dataset.songId;
            openPopup('removeSongPopup', playlistId, songId);
        });
    });

    document.querySelectorAll('.edit-playlist').forEach(button => {
        button.addEventListener('click', (event) => {
            const playlistId = event.target.closest('.playlist-item').dataset.id;
            openPopup('editPlaylistPopup', playlistId);
        });
    });

    document.querySelectorAll('.delete-song').forEach(button => {
        button.addEventListener('click', async event => {
            const songId = event.target.closest('.AdminSongList-item').dataset.id;
            const messageDiv = document.querySelector('#message');

            await fetch(`/admin/songs/${songId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    messageDiv.style.color = data.success ? 'green' : 'brown';
                    messageDiv.textContent = data.message;
                    if (data.success) location.reload();
                })
                .catch(error => console.error('Error deleting song:', error));
        });
    });

    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.closest('.AdminUsersList-item').dataset.id;
            openPopup('editUserPopup', null, null, userId);
        });
    });

    document.querySelectorAll('.edit-song').forEach(button => {
        button.addEventListener('click', (event) => {
            const songId = event.target.closest('.AdminSongList-item').dataset.id;
            openPopup('editSongPopup', null, songId);
        });
    });
    
    
    
    const editUserForm = document.querySelector('#editUserForm');
    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = event.target.closest('.modal').dataset.userId;
        const formData = new FormData(editUserForm);
        const data = {};

        if (formData.get('username')) data.username = formData.get('username');
        if (formData.get('email')) data.email = formData.get('email');

        fetch(`/admin/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.style.color = data.success ? 'green' : 'brown';
            if (data.success) location.reload();
        })
        .catch(error => console.error('Error:', error));
    });

    const editSongForm = document.querySelector('#editSongForm');
    editSongForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const songId = event.target.closest('.modal').dataset.songId;
        const formData = new FormData(editSongForm);
        const data = {};

        if (formData.get('title')) data.title = formData.get('title');
        if (formData.get('artist')) data.artist = formData.get('artist');
        if (formData.get('album')) data.album = formData.get('album');
        const genreString = formData.get('genre');
        if (genreString) {
            const genresArray = genreString.split(',').map(genre => genre.trim());
            data.genre = genresArray;
        }

        fetch(`/admin/songs/${songId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.style.color = data.success ? 'green' : 'brown';
            if (data.success) location.reload();
        })
        .catch(error => console.error('Error:', error));
    });

    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', async event => {
            const userId = event.target.closest('.AdminUsersList-item').dataset.id;
            const messageDiv = document.querySelector('#message');

            await fetch(`/admin/users/${userId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    messageDiv.style.color = data.success ? 'green' : 'brown';
                    messageDiv.textContent = data.message;
                    if (data.success) location.reload();
                })
                .catch(error => console.error('Error deleting user:', error));
        });
    });
});

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
    popup.dataset.playlistId = '';
    popup.dataset.songId = '';
    popup.dataset.userId = '';
}