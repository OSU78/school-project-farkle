var modal = document.querySelector(".mainModal");
var trigger = document.querySelector(".btnModal");
var closeButton = document.querySelector(".close-button");




function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }

}
/*  verifie si les champs sont remplis avant d'ouvrir la modal */



trigger.addEventListener("click", ()=>{
    console.log(document.getElementById("roomName").value);
    console.log(document.getElementById("playerName").value);
    if((document.getElementById("playerName").value.length >= 4) && (document.getElementById("roomName").value.length >= 4) )
    {
        toggleModal();
    }
    else{
        alert("Veuillez remplir les champs");
    }
})


closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);