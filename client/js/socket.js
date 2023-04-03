// Variables and constants
const socket = io.connect("https://swamp-sweltering-paint.glitch.me/");
const roomName = getQueryStringValue("roomName");
const playerName = getQueryStringValue("playerName");
const playerScore = [];
const existingPlayers = [];
const serverIsAwake = {
    state: false
} // Lorsque l'état est égal à ffalse, nous demandons à l'utilisateur d'être patient.
const frontBtn = {
    login: document.getElementById("loginOne"),
};


var counterTour = 0;
var myTurnSave = false;
var playerPlayed = "";

// Initialisation de la game
initializeGame();



/**
 *    pour prévenir l'utilisateur que le serveur va se réveiller.
 */
const handleErrors = (e) => {
    console.log('veuillez patienté, nous relançons le server')
}

socket.on('connect_error', err => handleErrors(err))

socket.on('connect', () => {
    serverIsAwake.state = true //Si c'est à True, nous lui disons que le chargement est terminer.
    console.log('finish')
})



function initializeGame() {
    if (roomName && playerName) {
        socket.emit("loginEvent", {
            name: playerName,
            roomId: roomName,
        });
    }

    addEventListeners();
}

// Event listeners
function addEventListeners() {
    window.addEventListener("DOMContentLoaded", () => {
        if (document.querySelector("#playDice")) {
            document.querySelector("#playDice").addEventListener("click", handlePlayDiceClick);
            document.querySelector("#saveMyScore").addEventListener("click", handleSaveMyScoreClick);
        }
    });

    socket.on("responseLogin", (data) => console.log("you get connected ", data));
    socket.on("gameWin", (data) => {
        console.log("GAME WINNER", data);
        winnerDisplay(data)
    });
    socket.on("loseThisOne", () => console.log("Vous avez perdu ce tour"));
    socket.on("oneMoreTime", () => console.log("Vous pouvez continue à jouer"));
    socket.on("refreshListStatus", updatePlayerSection);
}

// Utility functions
function getQueryStringValue(variable) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(variable.toUpperCase());
}

// Timer functions
var timer = null;
var counter = 70;

function startTimer(name) {
    counter = 11;
    const maxCount = 0;
    const root = document.documentElement; // Accéder à l'élément :root

    timer = setInterval(() => {
        counter--;

        // Mettre à jour la variable CSS --timer avec la valeur du timer
        root.style.setProperty("--timer", `"${counter}"`);

        if (counter == maxCount) {
            clearInterval(timer);
            counterTour = 0;
            console.log("70 secondes se sont écoulées.");
            document.querySelector("#" + name).classList.remove("myTurn");

            if (myTurnSave && playerPlayed == playerName) {
                console.log("C'est votre tour");
                socket.emit("myChoice", {
                    state: true
                });
                document.querySelector(".me").classList.remove("myTurn");
                counter = 70;
            }
        }
    }, 1000);
}

// Player functions
function ready2playFarkle(e) {
    if (e.classList.contains("clickReady")) {
        e.classList.remove("clickReady");
        console.log("ready2playFarkle");
        socket.emit("clientIsReady");
    }
}

function updatePlayerSection(room, userLeft = null) {
    const playerSection = document.querySelector('.playerG');
    playerSection.innerHTML = ''; // Vider le contenu actuel de la section des joueurs
    var players = room.payload; // Utilisez "payload" pour accéder aux données des joueurs
    if (players.length == 1) {
        console.log("PLAYER /" + players.length)
        players = players[0]
    }
    console.log(players)
    for (const [userId, userData] of Object.entries(players)) {

        if (
            userId !== "inGame" &&
            userId !== "nbUserReady" &&
            userId !== "nbUserInRoom" &&
            userId !== "selectPositionInGame"
        ) {

            console.log(userId)
            const {
                name,
                isAlive,
                myTurn,
                ready2play,
                currentScore,
                scoreTotal,
                scoringDices,
                remainingDices,
                nbDice,
            } = userData;

            console.log("name : " + name)
            // Si l'utilisateur est parti, passer à l'itération suivante sans créer de nouvelle carte
            if (userLeft && name === userLeft) {
                continue;
            }


            // Créer un nouvel élément de carte pour chaque utilisateur
            const newPlayerCard = document.createElement('div');
            newPlayerCard.classList.add('playerDiv');
            newPlayerCard.id = name;
            if (playerName == name) {
                newPlayerCard.classList.add('me');
                var sectionPlayer = '<section class="playerSection meColor">'
                var readyTemplate = ' <span class="playerStatus scaleInOut clickReady" onclick="ready2playFarkle(this)"> Attente 💤</span>'
            } else {
                var sectionPlayer = '<section class="playerSection">'
                var readyTemplate = ' <span class="playerStatus scaleInOut2 clickReady nohover"> Attente 💤</span>'
            }


            //Si c'est le tour du joueur, ajouter la classe "myTurn" à la carte du joueur
            if (myTurn) {
                document.querySelector('#diceRestant').innerText = nbDice;
                document.querySelector(`.scoringDice1`).previousElementSibling.classList.remove('vibrating');
                document.querySelector(`.scoringDice5`).previousElementSibling.classList.remove('vibrating');
                document.querySelector(`.remainingDice1`).previousElementSibling.classList.remove('vibrating');
                document.querySelector(`.remainingDice5`).previousElementSibling.classList.remove('vibrating');

                scoringDices.forEach((dice, index) => {
                    document.querySelector(`.scoringDice${index + 1}`).innerText = dice;
                    console.log(`DICE = scoringDice${index + 1} `)
                    if (index + 1 == 5 || index + 1 == 1) {
                        document.querySelector(`.scoringDice${index + 1}`).previousElementSibling.classList.add('vibrating');

                    }


                })
                remainingDices.forEach((dice, index) => {
                    document.querySelector(`.remainingDice${index + 1}`).innerText = dice;
                    if (index + 1 == 5 || index + 1 == 1) {
                        document.querySelector(`.remainingDice${index + 1}`).previousElementSibling.classList.add('vibrating');
                    }
                })

                console.table(scoringDices)
                myTurnSave = true;
                playerPlayed = name;
                //  alert("currentScore : " + currentScore)
                document.querySelector('.currentScore').innerText = "";
                document.querySelector('.currentScore').innerText = currentScore;
                document.querySelector('#playDice').classList.add('outlineScale');
                console.log("C'est votre tour")
            } else if (!myTurn) {
                document.querySelector('#playDice').classList.remove('outlineScale');
                newPlayerCard.classList.remove('myTurn');
            }
            if (ready2play) {
                newPlayerCard.classList.add('ready');
                readyTemplate = ' <span class="playerStatus clickReady bgGreen"> Prêt 💪</span>'
            }
            if (!isAlive) {
                newPlayerCard.classList.add('dead');
            }

            // Ajouter le contenu HTML à la carte du joueur
            newPlayerCard.innerHTML = `
            <section class="playerPoint">
            <h1>${scoreTotal}</h1> 
            <span>Pt</span>
            </section>
            ${sectionPlayer}
            <p class="PlayerName">${name}</p>
           ${readyTemplate}
            </section>
            `;

            // Ajouter la carte du joueur à la section des joueurs
            const playerSection = document.querySelectorAll('.playerG');
            if (document.querySelectorAll(".playerG")[0].childElementCount < 3) {
                playerSection[0].appendChild(newPlayerCard);
            } else {
                playerSection[1].appendChild(newPlayerCard);
            }

            if (myTurn) {
                if (players.nbUserInRoom == players.nbUserReady) {
                    console.log("TOUT LE MONDE EST PRET")
                    if (document.querySelector("#" + name)) {

                        /* supprimer tout les name */
                        document.querySelectorAll('.playerDiv').forEach((e) => {
                            e.classList.remove('myTurn');
                        })
                        console.log("C'EST A MOI DE JOUER")
                        document.querySelector("#" + name).classList.add('myTurn');
                        if (counterTour < 1) {
                            startTimer(name);
                            counterTour++;
                        } else {
                            counter = 70
                        }
                    }
                }
            }
        }
    }

}


// Play dice
function handlePlayDiceClick() {
    console.log("playDice");

    if (myTurnSave && playerPlayed == playerName) {
        console.log("C'est votre tour");
        socket.emit("myChoice", {
            state: true
        });
        document.querySelector(".me").classList.remove("myTurn");
        counter = 70;
    } else {
        alert("Ce n'est pas votre tour");
        console.log("Ce n'est pas votre tour");
    }
}



// On affiche le gagnant
function winnerDisplay(data) {
    if (data.reason == 1) {
        console.log(data.payload)
        document.querySelector('.winner').classList.add('winnerDisplay');
        document.querySelector('.winner').style.cssText = "opacity:1 ; z-index: 1000"
        document.querySelector('.winnerContent').innerHTML = `
        <section class="confettiBox vibrating"></section>
        <h1 class="vibrating">VOUS AVEZ GAGNER</h1>
        <h2 class="vibrating">Les autres joueurs on abandonné 🥳 , vous ête trop fort</h2>
        `
        generateConfetti(100); // Génère 100 confettis
        document.querySelector(".winner-btn").classList.add("vibrating");
        document.querySelector('.winner-btn').addEventListener('click', () => {
            window.location.href = "https://" + window.location.hostname;
        })
        return
    }

    document.querySelector('.winner').classList.add('winnerDisplay');
    document.querySelector('.winner').style.cssText = "opacity:1 ; z-index: 1000"
    document.querySelector('.winnerContent').innerHTML = `
        <section class="confettiBox"></section>
        <h1 class="vibrating">${data.payload.name}</h1>
        <h2 class="vibrating">gagne la partie</h2>
    `
    generateConfetti(100); // Génère 100 confettis
    document.querySelector(".winner-btn").classList.add("vibrating");
    document.querySelector('.winner-btn').addEventListener('click', () => {
        window.location.href = "https://" + window.location.hostname;
    })
}


// Save my score
function handleSaveMyScoreClick() {
    console.log("saveMyScore");
    if (myTurnSave && playerPlayed == playerName) {
        console.log("C'est votre tour");
        socket.emit("myChoice", {
            state: false
        });
        document.querySelector(".me").classList.remove("myTurn");
        counter = 70;
    } else {
        console.log("Ce n'est pas votre tour");
    }
}








//ANIMATION JS WINNER
function randomColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = randomColor();
    confetti.style.left = Math.floor(Math.random() * 110) + 'vw';
    const animationDuration = Math.random() * 2 + 2; // Génère une durée d'animation aléatoire entre 2 et 4 secondes
    confetti.style.animation = `combinedAnimation ${animationDuration}s linear infinite`;
    confetti.style.animationDelay = `${Math.random() * 2}s`; // Ajoute un délai d'animation aléatoire
    return confetti;
}



function generateConfetti(number) {
    for (let i = 0; i < number; i++) {
        document.querySelector('.confettiBox').appendChild(createConfetti());
    }
}
