const music = document.getElementById("music");
const sceneSound = document.getElementById("sceneSound");
const egisSound = document.getElementById("egisSound");
const jumpscare = document.getElementById("jumpscare");
const actionSound = new Audio("sound4.mp3");
actionSound.preload = "auto";

const jumpscarePreload = new Image();
jumpscarePreload.src = "jumpscare.png";

let jumpscareTimer = null;

let musicEnabled = true;
let effectsEnabled = true;
let volume = 0.5;
let userStartedAudio = false;

music.volume = volume;
sceneSound.volume = volume;
egisSound.volume = volume;
actionSound.volume = volume;

function showJumpscare() {
    if (jumpscare.style.display === "block") return;

    jumpscare.style.display = "block";

    clearTimeout(jumpscareTimer);
    jumpscareTimer = setTimeout(() => {
        jumpscare.style.display = "none";
    }, 3000);
}

function updateAudioSettings() {
    music.volume = volume;
    sceneSound.volume = volume;
    egisSound.volume = volume;
    actionSound.volume = volume;

    if (!musicEnabled) {
        music.pause();
    } else if (music.paused && userStartedAudio) {
        music.play().catch(() => {});
    }

    document.getElementById("musicToggle").textContent =
        "Musiikki: " + (musicEnabled ? "PÄÄLLÄ" : "POIS");

    document.getElementById("effectsToggle").textContent =
        "Ääniefektit: " + (effectsEnabled ? "PÄÄLLÄ" : "POIS");
}

function startMusic() {
    userStartedAudio = true;

    if (musicEnabled) {
        music.play().catch(() => {});
    }
}

function unlockAudio() {
    sceneSound.src = "sound1.mp3";

    [sceneSound, egisSound].forEach(a => {
        a.muted = true;
        a.play().then(() => {
            if (a.muted) {
                a.pause();
                a.currentTime = 0;
                a.muted = false;
            }
        }).catch(() => {
            a.muted = false;
        });
    });
}

function playEffect(audio, file) {
    if (!effectsEnabled) return;

    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.src = file;
    audio.volume = volume;
    audio.play().catch(() => {});
}

function playSceneSound(index) {
    if (!effectsEnabled) return;

    sceneSound.pause();
    sceneSound.currentTime = 0;
    sceneSound.muted = false;
    sceneSound.src = "sound" + (index + 1) + ".mp3";
    sceneSound.volume = volume;
    sceneSound.play().catch(() => {});
}

function playActionSound() {
    if (!effectsEnabled) return;

    actionSound.pause();
    actionSound.currentTime = 0;
    actionSound.volume = volume;
    actionSound.play().catch(() => {});
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    updateAudioSettings();

    if (musicEnabled) {
        startMusic();
    }
}

function toggleEffects() {
    effectsEnabled = !effectsEnabled;

    if (!effectsEnabled) {
        sceneSound.pause();
        egisSound.pause();
        actionSound.pause();
    }

    updateAudioSettings();
}

function changeVolume(value) {
    volume = Number(value) / 100;
    document.getElementById("volumeValue").textContent =
        value + "%";

    updateAudioSettings();
}

// Scene Toivo tekstit :OOOOOOOOO

const scenes = [
    {
        title: "Koulupäivä",
        text: 'Eero sai tunnilla idean: "Menempäs koulun jälkeen kauppaan ja ostan Egiksen!"',
        image: "egis1.png"
    },
    {
        title: "Mietintäää",
        text: '"Vanhempani ovat kyllä kieltäneet Egikset ja niiden juonnin..."',
        image: "egis2.png"
    },
    {
        title: "Suunnitelma",
        text: '"Mutta mitä jos juon sen hiljaa, nopeaa huoneessani ja ilman että isä rankaisee?" Eero mietti.',
        image: "egis3.png"
    }
];

let currentScene = 0;
let sceneTimer = null;
let noiseTimer = null;
let gamePhase = 0;
let noise = 0;
let speed = 0;
let progress = 0;
let actionStart = 0;
let lastNoiseTime = Date.now();
let gameFinished = false;
let storyRunId = 0;

const preloadedSceneImages = scenes.map(scene => {
    const image = new Image();
    image.src = scene.image;
    return image;
});

const scenesReady = Promise.all(
    preloadedSceneImages.map(image => {
        if (image.complete && image.naturalWidth > 0) {
            return typeof image.decode === "function"
                ? image.decode().catch(() => {})
                : Promise.resolve();
        }

        return new Promise(resolve => {
            const finishLoading = () => {
                if (typeof image.decode === "function" && image.naturalWidth > 0) {
                    image.decode().catch(() => {}).finally(resolve);
                } else {
                    resolve();
                }
            };

            image.addEventListener("load", finishLoading, { once: true });
            image.addEventListener("error", resolve, { once: true });
        });
    })
);

function openPanel(id) {
    closePanels();
    document.getElementById(id).style.display = "block";
}

function closePanels() {
    document.getElementById("credits").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

async function startStory() {
    closePanels();
    clearTimeout(sceneTimer);
    clearTimeout(noiseTimer);

    startMusic();
    unlockAudio();

    const runId = ++storyRunId;

    await scenesReady;

    if (runId !== storyRunId) return;

    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "none";
    document.getElementById("story").style.display = "block";

    currentScene = 0;
    showScene(runId);
}

function showScene(runId) {
    clearTimeout(sceneTimer);

    if (runId !== storyRunId) return;

    const story = document.getElementById("story");
    const scene = scenes[currentScene];

    story.style.backgroundImage = 'url("' + scene.image + '")';
    document.getElementById("sceneTitle").textContent = scene.title;
    document.getElementById("narration").textContent = scene.text;

    playSceneSound(currentScene);

    const sceneStartedAt = performance.now();

    function advanceScene() {
        if (runId !== storyRunId) return;

        const elapsed = performance.now() - sceneStartedAt;
        const remaining = Math.max(0, 3000 - elapsed);

        if (remaining > 0) {
            sceneTimer = setTimeout(advanceScene, remaining);
            return;
        }

        if (currentScene < scenes.length - 1) {
            currentScene++;
            showScene(runId);
        } else {
            startGame();
        }
    }

    sceneTimer = setTimeout(advanceScene, 3000);
}

function skipScene() {
    clearTimeout(sceneTimer);

    if (currentScene < scenes.length - 1) {
        currentScene++;
        showScene(storyRunId);
    } else {
        startGame();
    }
}

function startGame() {
    clearTimeout(sceneTimer);
    clearTimeout(noiseTimer);
    ++storyRunId;

    sceneSound.pause();

    document.getElementById("story").style.display = "none";
    document.getElementById("game").style.display = "block";

    playEffect(egisSound, "egis.mp3");

    gamePhase = 0;
    noise = 0;
    speed = 0;
    progress = 0;
    gameFinished = false;
    lastNoiseTime = Date.now();

    document.getElementById("can").textContent = "EGIS";
    document.getElementById("can").style.transform = "none";
    document.getElementById("gameText").textContent =
        "Eero löytää Egis-tölkin huoneestaan.";
    document.getElementById("gameStatus").textContent =
        "Avaa tölkki aloittaaksesi.";
    document.getElementById("actionButton").textContent =
        "Avaa Egis";

    updateMeters();
    decayNoise();
}

function gameAction() {
    if (gameFinished) return;

    playActionSound();

    if (Math.random() < 0.1) {
        showJumpscare();
    }

    const now = Date.now();

    if (gamePhase === 0) {
        gamePhase = 1;
        actionStart = now;
        noise = Math.min(100, noise + 35);
        lastNoiseTime = now;

        document.getElementById("can").style.transform =
            "rotate(-10deg)";

        document.getElementById("gameText").textContent =
            "Egis on avattu. Eero alkaa juoda sitä.";
        document.getElementById("gameStatus").textContent =
            "Tölkki avattu.";
        document.getElementById("actionButton").textContent =
            "Juo Egistä";
    } else {
        const elapsed = Math.max(0.1, (now - actionStart) / 1000);

        speed = Math.min(100, Math.round(100 / elapsed));
        progress = Math.min(100, progress + 25);
        noise = Math.min(100, noise + Math.max(5, speed * 0.35));
        lastNoiseTime = now;
        actionStart = now;

        document.getElementById("can").style.transform =
            "rotate(" + (progress % 2 ? 8 : -8) + "deg)";

        if (progress >= 100) {
            updateMeters();
            finishGame(true);
            return;
        }

        document.getElementById("gameText").textContent =
            "Eero juo Egistä. Hän on juonut " + progress + "% tölkistä.";
        document.getElementById("gameStatus").textContent =
            "Edistyminen: " + progress + "%";
    }

    updateMeters();
}

function vomit() {
    if (gameFinished) return;

    progress = Math.max(0, progress - 25);
    updateMeters();
}

function decayNoise() {
    if (gameFinished) return;

    const now = Date.now();
    const elapsed = (now - lastNoiseTime) / 1000;

    noise = Math.max(0, noise - elapsed * 8);
    lastNoiseTime = now;

    updateMeters();

    if (noise >= 100) {
        finishGame(false);
        return;
    }

    noiseTimer = setTimeout(decayNoise, 100);
}

function updateMeters() {
    document.getElementById("noiseValue").textContent =
        "Ääni: " + Math.round(noise);

    document.getElementById("speedValue").textContent =
        "Nopeus: " + speed;

    document.getElementById("noiseBar").style.width =
        noise + "%";

    document.getElementById("speedBar").style.width =
        speed + "%";

    document.getElementById("progressBar").style.width =
        progress + "%";
}

function finishGame(success) {
    gameFinished = true;
    clearTimeout(noiseTimer);

    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "block";

    if (success) {
        document.getElementById("endingTitle").textContent =
            "Hyvä lopetus";
        document.getElementById("endingText").textContent =
            "Eero sai Egiksen juotua.";
    } else {
        document.getElementById("endingTitle").textContent =
            "Huono lopetus";
        document.getElementById("endingText").textContent =
            "Isä suuttui ja rankaisi Eeroa.";
    }
}

function restartGame() {
    startStory();
}

function exitStory() {
    ++storyRunId;
    clearTimeout(sceneTimer);
    clearTimeout(noiseTimer);

    sceneSound.pause();
    egisSound.pause();
    actionSound.pause();

    document.getElementById("story").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "none";
    document.getElementById("mainMenu").style.display = "flex";
}

function exitGame() {
    window.close();
}

updateAudioSettings();
