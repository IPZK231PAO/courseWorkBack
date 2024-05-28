document.addEventListener('DOMContentLoaded', () => {
    function openPopup(popupId, playlistId=null,songId=null) {
        const modal = document.getElementById(popupId)


        if(songId!==null||playlistId!==null){
             modal.dataset.songId = songId
            modal.dataset.playlistId = playlistId
        }
        delete modal.dataset.songId
        delete modal.dataset.playlistId
        modal.style.display = 'block'
        
    }
   
    

    document.querySelectorAll('.add-song').forEach(button => {
        button.addEventListener('click', () => {
            const playlistId = button.closest('.playlist-item').dataset.id;
            openPopup('addSongPopup',playlistId)
        });
    });

    document.querySelectorAll('.remove-song').forEach(button => {
        button.addEventListener('click', () => {
            const playlistId = button.closest('.playlist-item').dataset.id
            const songId = button.dataset.songId
            openPopup('removeSongPopup', playlistId, songId)
        });
    });

    document.querySelectorAll('.edit-playlist').forEach(button => {
        button.addEventListener('click', () => {
            const playlistId = button.closest('.playlist-item').dataset.id
            openPopup('editPlaylistPopup',playlistId)
        });
    });

    const addSongForm = document.querySelector('#addSongForm');

    addSongForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const playlistId = event.target.closest('.modal').dataset.playlistId
        const messageDiv = document.querySelector('#message')
        const formData = new FormData(addSongForm)
        const selectedSongs = Array.from(formData.getAll('songs'))

        fetch(`/playlists/addsongs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlistId: playlistId,
                songs: selectedSongs
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageDiv.textContent = data.message
                location.reload()
            } else {
                messageDiv.textContent = data.message
            }
        })
        .catch(error => {
            console.error('Error:', error)
        });
    });

    const editPlaylistForm = document.querySelector('#editPlaylistForm');
    editPlaylistForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const playlistId = event.target.closest('.modal').dataset.playlistId;
        const messageDiv = document.querySelector('#message')
        const formData = new FormData(editPlaylistForm)
        const title = formData.get('title')
        const selectedSongs = Array.from(formData.getAll('songs'))
        console.log(title, selectedSongs)
        fetch(`/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                songs: selectedSongs
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageDiv.textContent = data.message
                location.reload()
            } else {
                messageDiv.textContent = data.message
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
    })
    const removeSongForm = document.querySelector('#removeSongForm')

    removeSongForm.addEventListener('submit', (event) => {
       event.preventDefault()
       console.log(event.target.dataset)
       const playlistId = event.target.closest('.modal').dataset.playlistId
       const messageDiv = document.querySelector('#message')
       const songId = event.target.closest('.modal').dataset.songId
        console.log(playlistId,songId)
        fetch(`/playlists/removesong`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlistId: playlistId,
                songId: songId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageDiv.textContent = data.message;
                location.reload()
            } else {
                messageDiv.textContent = data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
   document.querySelector('#createPlaylistButton').addEventListener('click', () => {
    openPopup('createPlaylistPopup');
});
const createPlaylistForm = document.querySelector('#createPlaylistForm');
createPlaylistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageDiv = document.querySelector('#message');
    const formData = new FormData(createPlaylistForm);
    const title = formData.get('title');
    const id=event.target.dataset.id
    console.log(id)
    const selectedSongs = Array.from(formData.getAll('songs'));

    fetch(`/playlists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            title: title,
            songs: selectedSongs
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.textContent = data.message;
            location.reload();
        } else {
            messageDiv.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.querySelectorAll('.delete-playlist').forEach(button => {
    button.addEventListener('click', () => {
        const playlistId = button.closest('.playlist-item').dataset.id
        if (confirm('Are you sure you want to delete this playlist?')) {
            fetch(`/playlists/${playlistId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.textContent = data.message
                    location.reload()
                } else {
                    messageDiv.textContent = data.message
                }
            })
            .catch(error => {
                console.error('Error:', error)
            });
        }
    });
});

});
