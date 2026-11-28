/* ========================================
   UNIFYND - NAVBAR
======================================== */


/* ========================================
   AUTHENTICATION CONFIGURATION
======================================== */

const AUTH_STORAGE_KEY = "unifynd_is_authenticated";


/* ========================================
   AUTHENTICATION STATUS
======================================== */

function isAuthenticated(): boolean {

    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";

}


/* ========================================
   UPDATE NAVBAR VISIBILITY
======================================== */

function updateNavbar(): void {

    const authenticated = isAuthenticated();

    const authElements =
        document.querySelectorAll<HTMLElement>(
            ".site-header .auth-only"
        );

    const guestElements =
        document.querySelectorAll<HTMLElement>(
            ".site-header .guest-only"
        );

    authElements.forEach((element) => {
        element.hidden = !authenticated;
    });

    guestElements.forEach((element) => {
        element.hidden = authenticated;
    });

}


/* ========================================
   LOGOUT
======================================== */

function handleLogout(): void {

    localStorage.removeItem(AUTH_STORAGE_KEY);

    updateNavbar();

    window.location.href = "/pages/landing_page.html";

}


/* ========================================
   LOGOUT EVENT LISTENER
======================================== */

function initializeLogout(): void {

    const logoutButtons =
        document.querySelectorAll<HTMLElement>(
            ".site-header .logout-button"
        );

    logoutButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            handleLogout();

        });

    });

}


/* ========================================
   INITIALIZE NAVBAR
======================================== */

function initializeNavbar(): void {

    updateNavbar();

    initializeLogout();

}


/* ========================================
   PAGE LOAD
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeNavbar
);


/* ========================================
   AUTHENTICATION SYNC BETWEEN TABS
======================================== */

window.addEventListener("storage", (event) => {

    if (
        event.key === AUTH_STORAGE_KEY ||
        event.key === null
    ) {
        updateNavbar();
    }

});
