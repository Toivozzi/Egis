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

let musiikkiPaalla = false;
let efektitPaalla = true;
let musiikinAanenvoimakkuus = 0.5;
let efektienAanenvoimakkuus = 0.5;
let vaikeustaso = "Helppo";
let ensimmainenAaniJoKaynnistetty = false;

musiikki.volume = musiikinAanenvoimakkuus;
musiikki.loop = true;

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

function kaikkiAanet() {
    return [
        kohtausAani,
        egisAani,
        toimintoAani,
        nappainAani,
        voittoAani,
        havioAani,
        oksennusAani,
        jumpscareAani
    ];
}

function asetaTeksti(tunniste, teksti) {
    const elementti = document.getElementById(tunniste);
    if (elementti) elementti.textContent = teksti;
}

function asetaLiukusaadin(tunniste, arvo) {
    const elementti = document.getElementById(tunniste);
    if (elementti && Number(elementti.value) !== arvo) {
        elementti.value = arvo;
    }
}

function paivitaMusiikinNaytto() {
    const prosentti = Math.round(musiikinAanenvoimakkuus * 100);
    asetaTeksti("musicVolumeValue", prosentti + "%");
    asetaLiukusaadin("musicVolume", prosentti);
}

function paivitaEfektienNaytto() {
    const prosentti = Math.round(efektienAanenvoimakkuus * 100);
    asetaTeksti("effectsVolumeValue", prosentti + "%");
    asetaLiukusaadin("effectsVolume", prosentti);
}

function asetaMusiikinVoimakkuus() {
    musiikki.volume = Math.max(0, Math.min(1, musiikinAanenvoimakkuus));
}

function asetaEfektienVoimakkuus() {
    kaikkiAanet().forEach(aani => {
        aani.volume = Math.max(0, Math.min(1, efektienAanenvoimakkuus));
    });
}

function paivitaAaniAsetukset() {
    asetaMusiikinVoimakkuus();
    asetaEfektienVoimakkuus();
    paivitaMusiikinNaytto();
    paivitaEfektienNaytto();

    if (!musiikkiPaalla) {
        musiikki.pause();
    }

    document.getElementById("musicToggle").textContent =
        "Musiikki: " + (musiikkiPaalla ? "PÄÄLLÄ" : "POIS");

    document.getElementById("effectsToggle").textContent =
        "Ääniefektit: " + (efektitPaalla ? "PÄÄLLÄ" : "POIS");
}

function kaynnistaMusiikki() {
    if (!musiikkiPaalla) return;

    asetaMusiikinVoimakkuus();

    if (musiikki.paused) {
        musiikki.play().catch(() => {});
    }
}

function vaihdaMusiikki() {
    musiikkiPaalla = !musiikkiPaalla;

    if (musiikkiPaalla) {
        musiikki.currentTime = 0;
        kaynnistaMusiikki();
    } else {
        musiikki.pause();
        musiikki.currentTime = 0;
    }

    paivitaAaniAsetukset();
}

function vaihdaEfektit() {
    efektitPaalla = !efektitPaalla;

    if (!efektitPaalla) {
        kaikkiAanet().forEach(aani => aani.pause());
    }

    paivitaAaniAsetukset();
}

function vaihdaMusiikinAanenvoimakkuutta(arvo) {
    musiikinAanenvoimakkuus = Number(arvo) / 100;
    asetaMusiikinVoimakkuus();
    paivitaMusiikinNaytto();
}

function vaihdaEfektienAanenvoimakkuutta(arvo) {
    efektienAanenvoimakkuus = Number(arvo) / 100;
    asetaEfektienVoimakkuus();
    paivitaEfektienNaytto();
}

function vaihdaAanenvoimakkuutta(arvo) {
    musiikinAanenvoimakkuus = Number(arvo) / 100;
    efektienAanenvoimakkuus = Number(arvo) / 100;
    asetaMusiikinVoimakkuus();
    asetaEfektienVoimakkuus();
    paivitaMusiikinNaytto();
    paivitaEfektienNaytto();
    asetaTeksti("volumeValue", arvo + "%");
    asetaLiukusaadin("volume", Number(arvo));
}

function liitaLiukusaadin(tunniste, toiminto) {
    const elementti = document.getElementById(tunniste);
    if (!elementti) return;

    elementti.addEventListener("input", () => {
        toiminto(elementti.value);
    });
}

liitaLiukusaadin("musicVolume", vaihdaMusiikinAanenvoimakkuutta);
liitaLiukusaadin("effectsVolume", vaihdaEfektienAanenvoimakkuutta);
liitaLiukusaadin("volume", vaihdaAanenvoimakkuutta);

function soitaEfekti(aani, tiedosto) {
    if (!efektitPaalla) return;

    aani.pause();
    aani.currentTime = 0;
    aani.muted = false;
    aani.src = tiedosto;
    aani.volume = efektienAanenvoimakkuus;
    aani.play().catch(() => {});
}

function soitaKohtausAani(tiedosto) {
    if (!efektitPaalla) return;

    kohtausAani.pause();
    kohtausAani.currentTime = 0;
    kohtausAani.muted = false;
    kohtausAani.src = tiedosto;
    kohtausAani.volume = efektienAanenvoimakkuus;
    kohtausAani.play().catch(() => {});
}

function soitaToimintoAani() {
    if (!efektitPaalla) return;

    toimintoAani.pause();
    toimintoAani.currentTime = 0;
    toimintoAani.volume = efektienAanenvoimakkuus;
    toimintoAani.play().catch(() => {});
}

function soitaNappainAani() {
    if (!efektitPaalla) return;

    nappainAani.pause();
    nappainAani.currentTime = 0;
    nappainAani.volume = efektienAanenvoimakkuus;
    nappainAani.play().catch(() => {});
}

document.addEventListener("click", tapahtuma => {
    const nappi = tapahtuma.target.closest("button");

    if (!nappi || nappi.id === "actionButton") return;

    soitaNappainAani();
});

function naytaJumpscare() {
    if (jumpscare.style.display === "block") return;

    jumpscare.style.display = "block";
    soitaEfekti(jumpscareAani, "sound8.mp3");

    clearTimeout(jumpscareAjastin);

    jumpscareAjastin = setTimeout(() => {
        jumpscare.style.display = "none";
    }, 3000);
}

const kohtaukset = [
    {
        title: "Koulupäivä",
        text: 'Eero sai tunnilla idean: "Menempäs koulun jälkeen kauppaan ja ostan Egiksen!"',
        image: "egis1.png",
        sound: "sound1.mp3"
    },
    {
        title: "Koulupäivä",
        text: 'Opettaja: "Eero, et nuku tunnilla! Laskeppas nämä laskut:"',
        image: "egis1.png",
        sound: "sound1.mp3",
        quiz: true
    },
    {
        title: "Mietintää",
        text: '"Vanhempani ovat kyllä kieltäneet Egikset ja niiden juonnin..."',
        image: "egis2.png",
        sound: "sound2.mp3"
    },
    {
        title: "Suunnitelma",
        text: '"Mutta mitä jos juon sen hiljaa, nopeaa huoneessani ja ilman että isä rankaisee?" Eero miettii.',
        image: "egis3.png",
        sound: "sound3.mp3"
    },
    {
        title: "Kauppa",
        text: "Eero menee kauppaan ja huomaa Egiksen maksavan 1,55 €. Hänellä on 2,00 €. Paljonko rahaa hänelle jää?",
        image: "egis5.png",
        sound: "sound1.mp3",
        shopQuiz: true
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

function haeQuizAlue() {
    let alue = document.getElementById("quizArea");

    if (!alue) {
        alue = document.createElement("div");
        alue.id = "quizArea";

        const laatikko = document.querySelector("#story .story-box");
        const ensimmainenNappi = laatikko.querySelector("button");

        laatikko.insertBefore(alue, ensimmainenNappi);
    }

    return alue;
}

function haeSkipNappi() {
    return (
        document.getElementById("skipButton") ||
        document.querySelector('#story button[onclick="ohitaKohtaus()"]')
    );
}

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

    const kaynnistysNumero = ++tarinanKaynnistysNumero;

    ensimmainenAaniJoKaynnistetty = false;

    if (efektitPaalla) {
        soitaKohtausAani("sound1.mp3");
        ensimmainenAaniJoKaynnistetty = true;
    }

    kaynnistaMusiikki();

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
    const quizArea = haeQuizAlue();
    const skipButton = haeSkipNappi();

    tarina.style.backgroundImage = 'url("' + kohtaus.image + '")';
    tarina.style.backgroundPosition = "";
    tarina.style.backgroundSize = "";
    tarina.style.backgroundRepeat = "";

    document.getElementById("sceneTitle").textContent = kohtaus.title;
    document.getElementById("narration").textContent = kohtaus.text;

    quizArea.innerHTML = "";

    if (efektitPaalla) {
        if (nykyinenKohtaus === 0 && ensimmainenAaniJoKaynnistetty) {
            ensimmainenAaniJoKaynnistetty = false;
        } else {
            soitaKohtausAani(kohtaus.sound);
        }
    }

    if (skipButton) {
        skipButton.style.display = "inline-block";
    }

    if (kohtaus.quiz) {
        const ohje = document.createElement("p");
        ohje.textContent =
            "Vastaa kaikkiin kolmeen laskuun ennen jatkamista. Voit myös ohittaa tämän, jos olet laiska, painamalla 'Skippaa' nappia.";

        const laskut = [
            { teksti: "Lasku 1. 13 + 74 =", vastaus: "87" },
            { teksti: "Lasku 2. 7 × 8 =", vastaus: "56" },
            { teksti: "Lasku 3. 6² =", vastaus: "36" }
        ];

        quizArea.appendChild(ohje);

        const kentat = [];

        laskut.forEach((lasku, indeksi) => {
            const rivi = document.createElement("div");
            rivi.style.display = "block";
            rivi.style.width = "100%";
            rivi.style.marginBottom = "12px";

            const label = document.createElement("label");
            label.textContent = lasku.teksti;
            label.htmlFor = "laskuVastaus" + indeksi;
            label.style.display = "block";

            const input = document.createElement("input");
            input.type = "number";
            input.id = "laskuVastaus" + indeksi;
            input.placeholder = "Vastauksesi";
            input.autocomplete = "off";
            input.style.display = "block";

            kentat.push(input);
            rivi.append(label, input);
            quizArea.appendChild(rivi);
        });

        const tarkista = document.createElement("button");
        tarkista.type = "button";
        tarkista.textContent = "Tarkista vastaukset";

        const palaute = document.createElement("p");
        palaute.id = "quizFeedback";

        tarkista.addEventListener("click", () => {
            const kaikkiOikein = kentat.every((input, indeksi) => {
                return input.value.trim() === laskut[indeksi].vastaus;
            });

            if (kaikkiOikein) {
                palaute.textContent = "Kaikki oikein! Eero voi jatkaa.";
                kentat.forEach(input => input.disabled = true);
                tarkista.disabled = true;

                kohtausAjastin = setTimeout(() => {
                    siirrySeuraavaanKohtaukseen(kaynnistysNumero);
                }, 1200);
            } else {
                palaute.textContent =
                    "Kaikki vastaukset eivät ole oikein. Yritä uudelleen!";
            }
        });

        quizArea.append(tarkista, palaute);
        kentat[0].focus();
        return;
    }

    if (kohtaus.shopQuiz) {
        const label = document.createElement("label");
        label.textContent = "Paljonko rahaa jää? Kirjoita vastaus euroina:";
        label.htmlFor = "kauppaVastaus";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "kauppaVastaus";
        input.placeholder = "Esim. 0,80";
        input.autocomplete = "off";

        const tarkista = document.createElement("button");
        tarkista.type = "button";
        tarkista.textContent = "Tarkista";

        const palaute = document.createElement("p");
        palaute.id = "quizFeedback";

        tarkista.addEventListener("click", tarkistaKaupanVastaus);

        input.addEventListener("keydown", tapahtuma => {
            if (tapahtuma.key === "Enter") {
                tarkistaKaupanVastaus();
            }
        });

        quizArea.append(label, input, tarkista, palaute);
        input.focus();
        return;
    }

    kohtausAjastin = setTimeout(() => {
        siirrySeuraavaanKohtaukseen(kaynnistysNumero);
    }, 4000);
}

function siirrySeuraavaanKohtaukseen(kaynnistysNumero) {
    if (kaynnistysNumero !== tarinanKaynnistysNumero) return;

    clearTimeout(kohtausAjastin);

    if (nykyinenKohtaus < kohtaukset.length - 1) {
        nykyinenKohtaus++;
        naytaKohtaus(kaynnistysNumero);
    } else {
        kaynnistaPeli();
    }
}

function tarkistaKaupanVastaus() {
    const input = document.getElementById("kauppaVastaus");
    const palaute = document.getElementById("quizFeedback");

    if (!input || !palaute) return;

    const vastaus = input.value.trim().replace(",", ".").replace("€", "");
    const numero = Number(vastaus);

    if (Number.isFinite(numero) && Math.abs(numero - 0.45) < 0.001) {
        palaute.textContent = "Oikein! Eerolle jää 0,45 €. Hän pääsee kotiin.";
        input.disabled = true;

        const tarkista = document.querySelector("#quizArea button");
        if (tarkista) tarkista.disabled = true;

        kohtausAjastin = setTimeout(() => {
            siirrySeuraavaanKohtaukseen(tarinanKaynnistysNumero);
        }, 1200);
    } else {
        palaute.textContent = "Ei ihan oikein. Yritäppä uudelleen!";
        input.focus();
        input.select();
    }
}

function ohitaKohtaus() {
    clearTimeout(kohtausAjastin);
    siirrySeuraavaanKohtaukseen(tarinanKaynnistysNumero);
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
    document.getElementById("actionButton").textContent = "Avaa Egis";

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

        document.getElementById("can").style.transform = "rotate(-10deg)";

        document.getElementById("gameText").textContent =
            "Egis on avattu. Eero alkaa juoda sitä.";

        document.getElementById("gameStatus").textContent = "Tölkki avattu.";

        document.getElementById("actionButton").textContent = "Juo Egistä";

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

    document.getElementById("noiseBar").style.width = melu + "%";
    document.getElementById("speedBar").style.width = nopeus + "%";
    document.getElementById("progressBar").style.width = edistyminen + "%";
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
        document.getElementById("endingTitle").textContent = "Hyvä lopetus";
        document.getElementById("endingText").textContent =
            "Eero sai Egiksen juotua.";
    } else {
        document.getElementById("endingTitle").textContent = "Huono lopetus";
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

    kaikkiAanet().forEach(aani => aani.pause());

    document.getElementById("story").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("ending").style.display = "none";
    document.getElementById("mainMenu").style.display = "flex";
}

function poistuPelista() {
    window.close();
}

paivitaAaniAsetukset();