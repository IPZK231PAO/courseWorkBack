function searchSongs() {
    const input = document.getElementById('searchInput')
    const filter = input.value.toLowerCase()
    const sortBy = document.getElementById('sortSelect').value
    const songs = document.querySelectorAll('#songList .song-item')

    songs.forEach(song => {
        const text = song.querySelector(`.${sortBy}`).innerText.toLowerCase()
        if (text.includes(filter)) {
            song.style.display = 'block'
        } else {
            song.style.display = 'none'
        }
    })
}

function sortSongs() {
    const select = document.getElementById('sortSelect')
    const sortBy = select.value
    const songList = document.getElementById('songList')

    if (songList) {
        const songs = Array.from(songList.children)

        songs.sort((a, b) => {
            const textA = a.querySelector(`.${sortBy}`).innerText.toLowerCase()
            const textB = b.querySelector(`.${sortBy}`).innerText.toLowerCase()
            return textA.localeCompare(textB)
        })

        songs.forEach(song => {
            songList.appendChild(song)
        })
    } else {
        console.error("Element with id 'songList' not found.")
    }

    searchSongs()
}

document.addEventListener('DOMContentLoaded', () => {
    const audios = document.querySelectorAll('audio')

    audios.forEach(audio => {
        audio.addEventListener('play', event => {
            const songName = event.target.getAttribute('name')
            const username = '<%= username %>'
            addListened(username, songName)
        })
    })
})