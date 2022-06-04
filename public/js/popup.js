var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
    overlay = document.getElementById('overlay'),
    popup = document.getElementById('popup'),
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');
    console.log(btnAbrirPopup);
if(btnAbrirPopup){
btnAbrirPopup.addEventListener('click', function () {
    overlay.classList.add('active');
    popup.classList.add('active');
});
}
if(btnCerrarPopup){
btnCerrarPopup.addEventListener('click', function (e) {
    e.preventDefault();
    overlay.classList.remove('active');
    popup.classList.remove('active');
});}