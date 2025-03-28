

const buttonMenu = document.getElementById("menu-button");
const menu = document.getElementById("page-tabs");
buttonMenu.addEventListener("click", () => {

    if (buttonMenu.classList.contains("closed")) {
        openMenu();
        return;
    }

    closeMenu();
})


const openMenu = () => {
    buttonMenu.querySelector("img").src = "assets/icons/close-svgrepo-com.svg";
    buttonMenu.classList.remove("closed");

    menu.classList.remove("hidden");
}

const closeMenu = () => {
    buttonMenu.querySelector("img").src = "assets/icons/menu-svgrepo-com.svg";
    buttonMenu.classList.add("closed");

    menu.classList.add("hidden");
}

const locationMapUrl = new Map();
locationMapUrl.set("São Paulo", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1525542549803!2d-46.58714562373215!3d-23.562963861652886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5eaf6988f685%3A0x4fec87ce3b087a87!2sDon%20Contabil!5e0!3m2!1sen!2sbr!4v1743132457475!5m2!1sen!2sbr" );

function handleAddressClick(location) {

    const iframe = document.getElementById("mapa");

    const gbiAdreessButton = document.getElementById("gbi-address");
    const spAdreessButton = document.getElementById("sp-address");

    //guanambi
    let url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3867.570332692972!2d-42.785827923951906!3d-14.219918586163603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x75ac47f69e1a04b%3A0xf78e29236bf81e3!2sDon%20Contabilidade%20Digital%20%7C%20Contabilidade%20sem%20burocracia!5e0!3m2!1sen!2sbr!4v1743135388559!5m2!1sen!2sbr";

    if (locationMapUrl.has(location)) {
        url = locationMapUrl.get(location);
        gbiAdreessButton.classList.remove("active");
        spAdreessButton.classList.add("active");
    } else {
        gbiAdreessButton.classList.add("active");
        spAdreessButton.classList.remove("active");
    }

    iframe.src = url;
}