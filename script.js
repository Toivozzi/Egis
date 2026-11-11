const musiikki = document.getElementById("music");
const kohtausAani = document.getElementById("sceneSound");
const egisAani = document.getElementById("egisSound");
const jumpscare = document.getElementById("jumpscare");

const toimintoAani = new Audio("sound4.mp3");
const nappainAani = new Audio("sound9.mp3");
const voittoAani = new Audio("sound5.mp3");
const havioAani = new Audio("sound6.mp3");
const oksennusAani = new Audio("sound7.mp3");
const jumpscareAani = new Audio("sound8.mp3");

toimintoAani.preload = "auto";
nappainAani.preload = "auto";
voittoAani.preload = "auto";
havioAani.preload = "auto";
oksennusAani.preload = "auto";
jumpscareAani.preload = "auto";

const jumpscareKuva = new Image();
jumpscareKuva.src = "jumpscare.png";

let jumpscareAjastin = null;

let musiikkiPaalla = true;
let efektitPaalla = true;
let aanenvoimakkuus = 0.5;
let aanetKaynnistetty = false;
let vaikeustaso = "Helppo";

function vaihdaVaikeustasoa() {
    if (vaikeustaso === "Helppo") {
        vaikeustaso = "Keskitaso";
    } else if (vaikeustaso === "Keskitaso") {
        vaikeustaso = "Vaikea";
    } else {
        vaikeustaso = "Helppo";
    }

    document.getElementById("difficultyToggle").textContent =
        "Vaikeustaso: " + vaikeustaso;
}

musiikki.volume = aanenvoimakkuus;
kohtausAani.volume = aanenvoimakkuus;
egisAani.volume = aanenvoimakkuus;
toimintoAani.volume = aanenvoimakkuus;
nappainAani.volume = aanenvoimakkuus;
voittoAani.volume = aanenvoimakkuus;
havioAani.volume = aanenvoimakkuus;
oksennusAani.volume = aanenvoimakkuus;
jumpscareAani.volume = aanenvoimakkuus;

function naytaJumpscare() {
    if (jumpscare.style.display === "block") return;

    jumpscare.style.display = "block";

    soitaEfekti(jumpscareAani, "sound7.mp3");

    clearTimeout(jumpscareAjastin);
    jumpscareAjastin = setTimeout(() => {
        jumpscare.style.display = "none";
    }, 3000);
}

function paivitaAaniAsetukset() {
    musiikki.volume = aanenvoimakkuus;
    kohtausAani.volume = aanenvoimakkuus;
    egisAani.volume = aanenvoimakkuus;
    toimintoAani.volume = aanenvoimakkuus;
    nappainAani.volume = aanenvoimakkuus;
    voittoAani.volume = aanenvoimakkuus;
    havioAani.volume = aanenvoimakkuus;
    oksennusAani.volume = aanenvoimakkuus;
    jumpscareAani.volume = aanenvoimakkuus;

    if (!musiikkiPaalla) {
        musiikki.pause();
    } else if (musiikki.paused && aanetKaynnistetty) {
        musiikki.play().catch(() => {});
    }

    document.getElementById("musicToggle").textContent =
        "Musiikki: " + (musiikkiPaalla ? "PÄÄLLÄ" : "POIS");

    document.getElementById("effectsToggle").textContent =
        "Ääniefektit: " + (efektitPaalla ? "PÄÄLLÄ" : "POIS");
}

function kaynnistaMusiikki() {
    aanetKaynnistetty = true;

    if (musiikkiPaalla) {
        musiikki.play().catch(() => {});
    }
}

function avaaAanet() {
    kohtausAani.src = "sound1.mp3";

    [kohtausAani, egisAani].forEach(aani => {
        aani.muted = true;
        aani.play().then(() => {
            if (aani.muted) {
                aani.pause();
                aani.currentTime = 0;
                aani.muted = false;
            }
        }).catch(() => {
            aani.muted = false;
        });
    });
}

function soitaEfekti(aani, tiedosto) {
    if (!efektitPaalla) return;

    aani.pause();
    aani.currentTime = 0;
    aani.muted = false;
    aani.src = tiedosto;
    aani.volume = aanenvoimakkuus;
    aani.play().catch(() => {});
}

function soitaKohtausAani(numero) {
    if (!efektitPaalla) return;

    kohtausAani.pause();
    kohtausAani.currentTime = 0;
    kohtausAani.muted = false;
    kohtausAani.src = "sound" + (numero + 1) + ".mp3";
    kohtausAani.volume = aanenvoimakkuus;
    kohtausAani.play().catch(() => {});
}

function soitaToimintoAani() {
    if (!efektitPaalla) return;

    toimintoAani.pause();
    toimintoAani.currentTime = 0;
    toimintoAani.volume = aanenvoimakkuus;
    toimintoAani.play().catch(() => {});
}

function soitaNappainAani() {
    if (!efektitPaalla) return;

    nappainAani.pause();
    nappainAani.currentTime = 0;
    nappainAani.volume = aanenvoimakkuus;
    nappainAani.play().catch(() => {});
}

document.addEventListener("click", tapahtuma => {
    const nappi = tapahtuma.target.closest("button");

    if (!nappi || nappi.id === "actionButton") return;

    soitaNappainAani();
});

function vaihdaMusiikki() {
    musiikkiPaalla = !musiikkiPaalla;
    paivitaAaniAsetukset();

    if (musiikkiPaalla) {
        kaynnistaMusiikki();
    }
}

function vaihdaEfektit() {
    efektitPaalla = !efektitPaalla;

    if (!efektitPaalla) {
        kohtausAani.pause();
        egisAani.pause();
        toimintoAani.pause();
        nappainAani.pause();
        voittoAani.pause();
        havioAani.pause();
        oksennusAani.pause();
        jumpscareAani.pause();
    }

    paivitaAaniAsetukset();
}

function vaihdaAanenvoimakkuutta(arvo) {
    aanenvoimakkuus = Number(arvo) / 100;
    document.getElementById("volumeValue").textContent =
        arvo + "%";

    paivitaAaniAsetukset();
}

const kohtaukset = [
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

let nykyinenKohtaus = 0;
let kohtausAjastin = null;
let meluAjastin = null;
let nopeusAjastin = null;
let pelivaihe = 0;
let melu = 0;
let nopeus = 0;
let edistyminen = 0;
let toiminnonAloitus = 0;
let viimeisinMeluPaivitys = Date.now();
let peliPaattynyt = false;
let tarinanKaynnistysNumero = 0;

const ladatutKohtausKuvat = kohtaukset.map(kohtaus => {
    const kuva = new Image();
    kuva.src = kohtaus.image;
    return kuva;
});

const kohtauksetValmiina = Promise.all(
    ladatutKohtausKuvat.map(kuva => {
        if (kuva.complete && kuva.naturalWidth > 0) {
            return typeof kuva.decode === "function"
                ? kuva.decode().catch(() => {})
                : Promise.resolve();
        }

        return new Promise(resolve => {
            const latausValmis = () => {
                if (typeof kuva.decode === "function" && kuva.naturalWidth > 0) {
                    kuva.decode().catch(() => {}).finally(resolve);
                } else {
                    resolve();
                }
            };

            kuva.addEventListener("load", latausValmis, { once: true });
            kuva.addEventListener("error", resolve, { once: true });
        });
    })
);

function avaaPaneeli(tunniste) {
    suljePaneelit();
    document.getElementById(tunniste).style.display = "block";
}

function suljePaneelit() {
    document.getElementById("credits").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

async function kaynnistaTarina() {
    suljePaneelit();
    clearTimeout(kohtausAjastin);
    clearTimeout(meluAjastin);
    clearInterval(nopeusAjastin);

    kaynnistaMusiikki();
    avaaAanet();

    const kaynnistysNumero = ++tarinanKaynnistysNumero;

    await kohtauksetValmiina;

    if (kaynnistysNumero !== tarinanKaynnistysNumero) return;

    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "none";
    document.getElementById("story").style.display = "block";

    nykyinenKohtaus = 0;
    naytaKohtaus(kaynnistysNumero);
}

function naytaKohtaus(kaynnistysNumero) {
    clearTimeout(kohtausAjastin);

    if (kaynnistysNumero !== tarinanKaynnistysNumero) return;

    const tarina = document.getElementById("story");
    const kohtaus = kohtaukset[nykyinenKohtaus];

    tarina.style.backgroundImage = 'url("' + kohtaus.image + '")';
    document.getElementById("sceneTitle").textContent = kohtaus.title;
    document.getElementById("narration").textContent = kohtaus.text;

    soitaKohtausAani(nykyinenKohtaus);

    const kohtauksenAloitusaika = performance.now();

    function siirrySeuraavaanKohtaukseen() {
        if (kaynnistysNumero !== tarinanKaynnistysNumero) return;

        const kulunutAika = performance.now() - kohtauksenAloitusaika;
        const jaljella = Math.max(0, 3000 - kulunutAika);

        if (jaljella > 0) {
            kohtausAjastin = setTimeout(siirrySeuraavaanKohtaukseen, jaljella);
            return;
        }

        if (nykyinenKohtaus < kohtaukset.length - 1) {
            nykyinenKohtaus++;
            naytaKohtaus(kaynnistysNumero);
        } else {
            kaynnistaPeli();
        }
    }

    kohtausAjastin = setTimeout(siirrySeuraavaanKohtaukseen, 3000);
}

function ohitaKohtaus() {
    clearTimeout(kohtausAjastin);

    if (nykyinenKohtaus < kohtaukset.length - 1) {
        nykyinenKohtaus++;
        naytaKohtaus(tarinanKaynnistysNumero);
    } else {
        kaynnistaPeli();
    }
}

function kaynnistaPeli() {
    clearTimeout(kohtausAjastin);
    clearTimeout(meluAjastin);
    clearInterval(nopeusAjastin);
    ++tarinanKaynnistysNumero;

    kohtausAani.pause();

    document.getElementById("story").style.display = "none";
    document.getElementById("game").style.display = "block";

    soitaEfekti(egisAani, "egis.mp3");

    pelivaihe = 0;
    melu = 0;
    nopeus = 0;
    edistyminen = 0;
    peliPaattynyt = false;
    viimeisinMeluPaivitys = Date.now();

    document.getElementById("can").textContent = "EGIS";
    document.getElementById("can").style.transform = "none";
    document.getElementById("gameText").textContent =
        "Eero löytää Egis-tölkin huoneestaan.";
    document.getElementById("gameStatus").textContent =
        "Avaa tölkki aloittaaksesi.";
    document.getElementById("actionButton").textContent =
        "Avaa Egis";

    paivitaMittarit();
    laskeMelua();
}

function kaynnistaNopeusmittari() {
    clearInterval(nopeusAjastin);

    nopeusAjastin = setInterval(() => {
        if (peliPaattynyt || pelivaihe !== 1) return;

        const kulunutAika = Math.max(
            0.1,
            (Date.now() - toiminnonAloitus) / 1000
        );

        nopeus = Math.min(100, Math.round(100 / kulunutAika));

        paivitaMittarit();
    }, 100);
}

function pelitoiminto() {
    if (peliPaattynyt) return;

    soitaToimintoAani();

    if (Math.random() < 0.1) {
        naytaJumpscare();
    }

    const nyt = Date.now();

    if (pelivaihe === 0) {
        pelivaihe = 1;
        toiminnonAloitus = nyt;
        melu = Math.min(100, melu + 35);
        viimeisinMeluPaivitys = nyt;

        document.getElementById("can").style.transform =
            "rotate(-10deg)";

        document.getElementById("gameText").textContent =
            "Egis on avattu. Eero alkaa juoda sitä.";

        document.getElementById("gameStatus").textContent =
            "Tölkki avattu.";

        document.getElementById("actionButton").textContent =
            "Juo Egistä";

        kaynnistaNopeusmittari();
    } else {
        const kulunutAika = (nyt - toiminnonAloitus) / 1000;

        nopeus = Math.min(
            100,
            Math.round(100 / Math.max(0.1, kulunutAika))
        );

        let vaikeusKerroin = 30;

        if (vaikeustaso === "Keskitaso") {
            vaikeusKerroin = 10;
        } else if (vaikeustaso === "Vaikea") {
            vaikeusKerroin = 6;
        }

        const lisattyMelu = Math.max(
            0,
            30 - kulunutAika * vaikeusKerroin
        );

        melu = Math.min(100, melu + lisattyMelu);
        edistyminen = Math.min(100, edistyminen + 25);

        viimeisinMeluPaivitys = nyt;
        toiminnonAloitus = nyt;

        document.getElementById("can").style.transform =
            "rotate(" + (edistyminen % 2 ? 8 : -8) + "deg)";

        if (melu >= 100) {
            paivitaMittarit();
            paataPeli(false);
            return;
        }

        if (edistyminen >= 100) {
            paivitaMittarit();
            paataPeli(true);
            return;
        }

        document.getElementById("gameText").textContent =
            "Eero juo Egistä. Hän on juonut " + edistyminen + "% tölkistä.";

        document.getElementById("gameStatus").textContent =
            "Edistyminen: " + edistyminen + "%";
    }

    paivitaMittarit();
}

function oksennus() {
    if (peliPaattynyt) return;

    soitaEfekti(oksennusAani, "sound7.mp3");

    edistyminen = Math.max(0, edistyminen - 25);
    paivitaMittarit();
}

function laskeMelua() {
    if (peliPaattynyt) return;

    const nyt = Date.now();
    const kulunutAika = (nyt - viimeisinMeluPaivitys) / 1000;

    melu = Math.max(0, melu - kulunutAika * 8);
    viimeisinMeluPaivitys = nyt;

    paivitaMittarit();

    if (melu >= 100) {
        paataPeli(false);
        return;
    }

    meluAjastin = setTimeout(laskeMelua, 100);
}

function paivitaMittarit() {
    document.getElementById("noiseValue").textContent =
        "Ääni: " + Math.round(melu);

    document.getElementById("speedValue").textContent =
        "Nopeus: " + nopeus;

    document.getElementById("noiseBar").style.width =
        melu + "%";

    document.getElementById("speedBar").style.width =
        nopeus + "%";

    document.getElementById("progressBar").style.width =
        edistyminen + "%";
}

function paataPeli(voitto) {
    peliPaattynyt = true;
    clearTimeout(meluAjastin);
    clearInterval(nopeusAjastin);

    if (voitto) {
        soitaEfekti(voittoAani, "sound5.mp3");
    } else {
        soitaEfekti(havioAani, "sound6.mp3");
    }

    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "block";

    if (voitto) {
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

function aloitaPeliUudelleen() {
    kaynnistaTarina();
}

function poistuTarinasta() {
    ++tarinanKaynnistysNumero;
    clearTimeout(kohtausAjastin);
    clearTimeout(meluAjastin);
    clearInterval(nopeusAjastin);
    clearTimeout(jumpscareAjastin);

    jumpscare.style.display = "none";

    kohtausAani.pause();
    egisAani.pause();
    toimintoAani.pause();
    nappainAani.pause();
    voittoAani.pause();
    havioAani.pause();
    oksennusAani.pause();
    jumpscareAani.pause();

    document.getElementById("story").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "none";
    document.getElementById("mainMenu").style.display = "flex";
}

function poistuPelista() {
    window.close();
}

paivitaAaniAsetukset();