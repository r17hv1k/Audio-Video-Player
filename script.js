const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i"),
prevBtn = document.querySelector(".prev"),
nextBtn = document.querySelector(".next");
let timer;

let playlist = ['video/video1.mp4', 'video/video2.mp4', 'video/video3.mp4', 'video/video4.mp4', 'video/video5.mp4', 'video/audio.mp3'];
let currentVideoIndex = 0;

const hideControls = () => {
    if (mainVideo.paused) {
        container.classList.add("paused");
    } else {
        container.classList.remove("paused");
        setTimeout(() => {
            container.classList.remove("show-controls");
        }, 1000);
    }
}
hideControls();
// const hideControls = () => {
//     if(mainVideo.paused) return;
//     timer = setTimeout(() => {
//         container.classList.remove("show-controls");
//     }, 3000);
// }

container.addEventListener("mouseenter", () => {
    container.classList.add("show-controls");
});

container.addEventListener("mouseleave", () => {
    hideControls();
});

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("play", () => {
    hideControls();
});

mainVideo.addEventListener("pause", () => {
    hideControls();
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

mainVideo.addEventListener("click", () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});


function playCurrentVideo() {
    mainVideo.src = playlist[currentVideoIndex];
    mainVideo.play();
}

prevBtn.addEventListener("click", () => {
    currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
    playCurrentVideo();
});

nextBtn.addEventListener("click", () => {
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    playCurrentVideo();
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 10);
skipForward.addEventListener("click", () => mainVideo.currentTime += 10);
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));

// Keyboard accessibility
document.addEventListener("keydown", event => {
    switch (event.key) {
        case " ": // Spacebar
            mainVideo.paused ? mainVideo.play() : mainVideo.pause();
            break;
        case "ArrowUp": // Up Arrow
            volumeSlider.value = Math.min(parseFloat(volumeSlider.value) + 0.1, 1);
            volumeSlider.dispatchEvent(new Event('input')); 
            break;
        case "ArrowDown": // Down Arrow
            volumeSlider.value = Math.max(parseFloat(volumeSlider.value) - 0.1, 0);
            volumeSlider.dispatchEvent(new Event('input'));
            break; 
        case "ArrowRight": // Right Arrow
            mainVideo.currentTime += 10;
            break;
        case "ArrowLeft": // Left Arrow
            mainVideo.currentTime -= 10;
            break;
        case "m": // M key
            mainVideo.muted = !mainVideo.muted;
            if (mainVideo.muted) {
                volumeSlider.value = 0;
            } else {
                volumeSlider.value = mainVideo.volume;
            }
            volumeSlider.dispatchEvent(new Event('input'));
            break;
        case "f": // F key
            if (!document.fullscreenElement) {
                container.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            break;
        case "Escape": // Esc key
            document.exitFullscreen();
            break;
        case "w": // W key
            if (!container.classList.contains("minimized")) {
                mainVideo.pause();
                container.classList.add("minimized");
            } else {
                container.classList.remove("minimized");
            }
            break;
        case "n": // N key
            currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
            playCurrentVideo();
            break;
        case "p": // P key
            currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
            playCurrentVideo();
            break;
        default:
            break;
    }
});