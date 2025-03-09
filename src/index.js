

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
