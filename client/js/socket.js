const existingPlayers = [];
const frontBtn = {
    login: document.getElementById('loginOne'),
}

var counterTour=0;
var myTurnSave = false;
var playerPlayed = "";
const socket = io.connect("http://127.0.0.1:8000")

const roomName = getQueryStringValue('roomName');
const playerName = getQueryStringValue('playerName');

if (roomName && playerName) {
    //alert("you are connected")
    socket.emit('loginEvent', {
        name: playerName,
        roomId: roomName
    })

}

function getQueryStringValue(variable) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(variable);
}

//Fonction pour afficher le timer de 20 secondes avant de passer le tour ou de lancer les dés
var timer = null;
var counter = 70;
function startTimer(name) {
   counter=11;
   
    const maxCount = 0;
    const root = document.documentElement; // Accéder à l'élément :root

    timer = setInterval(() => {
            counter--;

            // Mettre à jour la variable CSS --timer avec la valeur du timer
            root.style.setProperty("--timer", `"${counter}"`);

            if (counter == maxCount) {
                clearInterval(timer);
                counterTour=0;
                console.log("70 secondes se sont écoulées.");
                document.querySelector("#" + name).classList.remove('myTurn');
             
                if (myTurnSave && playerPlayed == playerName) {
                    console.log("C'est votre tour")
                   
                    socket.emit('myChoice', {
                       "payload":{"state" : true},
                    });
                    document.querySelector('.me').classList.remove('myTurn');
                    counter = 70
                }
            }

        },
        1000);
}


function convertObjectToArray(variable) {
    if (Array.isArray(variable)) {
        console.log("La variable est un tableau");
    } else if (typeof variable === "object" && variable !== null) {
        console.log("La variable est un objet");

        // Convertir l'objet en tableau avec les paires clé-valeur
        const keyValueArray = Object.entries(variable);
        console.log("Objet converti en tableau avec clés et valeurs:", keyValueArray);

        // Convertir l'objet en tableau avec uniquement les valeurs
        const valuesArray = Object.values(variable);
        console.log("Objet converti en tableau avec uniquement les valeurs:", valuesArray);
        return valuesArray;

    } else {
        console.log("La variable n'est ni un objet ni un tableau");
        return false
    }
}



function ready2playFarkle(e) {
    if (e.classList.contains('clickReady')) {
        e.classList.remove('clickReady');
        console.log("ready2playFarkle")
        socket.emit('clientIsReady');
    }
};


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
                myTurnSave = true;
                playerPlayed = name;
               console.log("C'est votre tour")


            } else {

                newPlayerCard.classList.remove('myTurn');
            }


            if (ready2play) {
                newPlayerCard.classList.add('ready');
                readyTemplate = ' <span class="playerStatus clickReady bgGreen"> Prêt 💪</span>'
            } else {

            }
            if (!isAlive) {
                newPlayerCard.classList.add('dead');
            }

            document.querySelector('.currentScore').innerText = currentScore;
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
                        if( counterTour<1){
                            
                            startTimer(name);
                           
                            counterTour++;
                        }
                        else{
                            counter = 70
                        }
                        



                    }



                }
            }


        }
    }





}


 // GAME players choice
 window.addEventListener('DOMContentLoaded', () => {
 if (document.querySelector('#playDice')) {
    document.querySelector('#playDice').addEventListener('click', () => {
        console.log("playDice")
        
        if (myTurnSave && playerPlayed == playerName) {
            console.log("C'est votre tour")
           
            socket.emit('myChoice', {
               "payload":{"state" : true},
            });
            document.querySelector('.me').classList.remove('myTurn');
            counter = 70
        }
        else {
            console.log("Ce n'est pas votre tour")
        }
    });



    // Le joueur passe son tour et sauvegarde son score
    document.querySelector('#saveMyScore').addEventListener('click', () => {
        console.log("playDice")
        
        if (myTurnSave && playerPlayed == playerName) {
            console.log("C'est votre tour")
           
            socket.emit('myChoice', {
               "payload":{"state" : false},
            });
            document.querySelector('.me').classList.remove('myTurn');
            counter = 70
        }
        else {
            console.log("Ce n'est pas votre tour")
        }
    }
    );
}
 })





socket.on('responseLogin', (data) => {
    console.log("you get connected ", data)
})



socket.emit('myChoice', {
   "payload":{"state" : true},
});

// GAME WINNERS 
socket.on('gameWin', (data) => {
    console.log("GAME WINNER", data)
})


socket.on('loseThisOne', () => {
    console.log("Vous avez perdu ce tour")
   // alert("Vous avez perdu ce tour")
})



socket.on('oneMoreTime', () => {
    console.log("Vous pouvez continue à jouer")
    //alert("Vous pouvez continue à jouer")
}
)







socket.on('refreshListStatus', (data) => {

    // const players = data["payload"][0]["data"];
    // const nbrPlayers = Object.keys(data["payload"][0]["data"]).length;
    // console.log(nbrPlayers)
    // console.log(players)
    console.log(data)

    // const roomData = data.payload[0];
    var roomData = data;
    console.log("ROOM DATA : " + roomData)
    if (roomData != false) {
        updatePlayerSection(roomData);
    }

});