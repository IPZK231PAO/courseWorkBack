document.addEventListener('DOMContentLoaded', function () {
    const audioElements = document.querySelectorAll('audio');
  
    audioElements.forEach(audio => {
      audio.addEventListener('play', function () {
        audioElements.forEach(otherAudio => {
          if (otherAudio !== audio) {
            otherAudio.pause();
            const parentLi = otherAudio.closest('li');
            if (parentLi) {
              parentLi.classList.remove('playing');
            }
          }
        });
  
        
        const parentLi = this.closest('li');
        if (parentLi) {
          parentLi.classList.add('playing');
        }
      });
  
      audio.addEventListener('pause', function () {
        const parentLi = this.closest('li');
        if (parentLi) {
          parentLi.classList.remove('playing');
        }
      });
  
      audio.addEventListener('ended', function () {
        const parentLi = this.closest('li');
        if (parentLi) {
          parentLi.classList.remove('playing');
        }
      });
    });
  });