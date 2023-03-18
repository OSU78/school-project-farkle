if (document.querySelector(".mainModal")) {
    var modal = document.querySelector(".mainModal")
}
if (document.querySelector(".btnModal")) {
    var trigger = document.querySelector(".btnModal")
}
if (document.querySelector(".close-button")) {
    var closeButton = document.querySelector(".close-button")
}




function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }

}
/*  verifie si les champs sont remplis avant d'ouvrir la modal */

const frontBtn = {
    login: document.getElementById('loginOne'),
}

const socket = io.connect("http://127.0.0.1:8000")



socket.on('responseLogin', (data) => {
    console.log("you get connected ", data)
})
socket.on('refreshListStatus', (data) => {
    console.log(data)
})

if (trigger) {


    trigger.addEventListener("click", () => {
        var roomName = document.getElementById("roomName").value;
        var playerName = document.getElementById("playerName").value;
        if ((document.getElementById("playerName").value.length >= 4) && (document.getElementById("roomName").value.length >= 4)) {
            // Construire l'URL avec les paramètres

          

            const url = `https://farkle.vercel.app/game.html?roomName=${encodeURIComponent(roomName)}&playerName=${encodeURIComponent(playerName)}`;

            // Rediriger vers la page "game.html"
            window.location.href = url;
        } else {
            alert("Veuillez remplir les champs");
        }
    })

}


closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);