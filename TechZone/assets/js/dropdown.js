const toggle = document.querySelector('#button');
const menu = document.querySelector('.menu-filter');
if (toggle && menu) {
    toggle.addEventListener("click", ()=> menu.classList.toggle("active"));
}

function Iphone() {
    window.location.href = "iphone.html";
}

function cu_redirect() {
    window.location.href = "cu.html";
}

function samsung() {
    window.location.href = "samsung.html";
}

function nam_redirect() {
    window.location.href = "nam.html";
}