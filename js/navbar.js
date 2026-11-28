"use strict";
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
function isAuthenticated() {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}
/* ========================================
   UPDATE NAVBAR VISIBILITY
======================================== */
function updateNavbar() {
    const authenticated = isAuthenticated();
    const authElements = document.querySelectorAll(".site-header .auth-only");
    const guestElements = document.querySelectorAll(".site-header .guest-only");
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
function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    updateNavbar();
    window.location.href = "/pages/landing_page.html";
}
/* ========================================
   LOGOUT EVENT LISTENER
======================================== */
function initializeLogout() {
    const logoutButtons = document.querySelectorAll(".site-header .logout-button");
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
function initializeNavbar() {
    updateNavbar();
    initializeLogout();
}
/* ========================================
   PAGE LOAD
======================================== */
document.addEventListener("DOMContentLoaded", initializeNavbar);
/* ========================================
   AUTHENTICATION SYNC BETWEEN TABS
======================================== */
window.addEventListener("storage", (event) => {
    if (event.key === AUTH_STORAGE_KEY ||
        event.key === null) {
        updateNavbar();
    }
});
