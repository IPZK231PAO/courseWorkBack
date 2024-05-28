function addListened(username, songName) {
    console.log('ADD LISTENED CLIENT:', username, songName)
    const data = {
        username: username,
        songName: songName
    }
    fetch('/addListened', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to add song to history')
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error adding song to history: ', error)
        })
}
document.addEventListener('DOMContentLoaded', () => {
    let audios = document.querySelectorAll('audio')

    audios.forEach(audio => {
        audio.addEventListener('play', () => {
            const songName = audio.getAttribute('data-song-title')
            const username = audio.getAttribute('data-username')
            console.log(username, ' ', songName)
            addListened(username, songName)
        })
    })
})