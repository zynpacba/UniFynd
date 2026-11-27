/* ========================================
   UNIFYND - PROFILE SETTINGS PAGE
======================================== */
/* ========================================
1. DOM ELEMENTS
======================================== */
const accountForm = document.querySelector("#account-form");
const passwordForm = document.querySelector("#password-form");
const saveAccountButton = document.querySelector("#save-account");
const updatePasswordButton = document.querySelector("#update-password");
const passwordToggles = document.querySelectorAll(".password-toggle");
const settingsNavLinks = document.querySelectorAll(".settings-nav-link");
const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const currentPassword = document.querySelector("#current-password");
const newPassword = document.querySelector("#new-password");
const confirmPassword = document.querySelector("#confirm-password");
/* ========================================
2. PASSWORD VISIBILITY
======================================== */
passwordToggles.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        if (!targetId)
            return;
        const passwordInput = document.getElementById(targetId);
        if (!passwordInput)
            return;
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        button.setAttribute("aria-pressed", String(isHidden));
        button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        button.innerHTML = isHidden ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
        const lucideWindow = window;
        lucideWindow.lucide?.createIcons();
    });
});
/* ========================================
3. ACCOUNT FORM VALIDATION
======================================== */
function validateAccountForm() {
    if (!accountForm || !firstName || !lastName) {
        return false;
    }
    firstName.setCustomValidity("");
    lastName.setCustomValidity("");
    if (firstName.value.trim() === "") {
        firstName.setCustomValidity("Please enter your first name.");
    }
    if (lastName.value.trim() === "") {
        lastName.setCustomValidity("Please enter your last name.");
    }
    return accountForm.reportValidity();
}
/* Clear validation messages while typing */
[firstName, lastName].forEach((input) => {
    input?.addEventListener("input", () => {
        input.setCustomValidity("");
    });
});
/* Save Account Information */
saveAccountButton?.addEventListener("click", () => {
    accountForm?.requestSubmit();
});
accountForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateAccountForm())
        return;
    // TODO: Send updated account information to the backend.
    alert("Account information is valid. Saving will be available after backend integration.");
});
/* ========================================
4. PASSWORD FORM VALIDATION
======================================== */
function validatePasswordForm() {
    if (!passwordForm || !currentPassword || !newPassword || !confirmPassword) {
        return false;
    }
    newPassword.setCustomValidity("");
    confirmPassword.setCustomValidity("");
    /* Minimum Password Length */
    if (newPassword.value.length < 8) {
        newPassword.setCustomValidity("Your new password must contain at least 8 characters.");
    }
    /* Password Matching */
    if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("The new passwords do not match.");
    }
    return passwordForm.reportValidity();
}
/* Clear validation messages while typing */
newPassword?.addEventListener("input", () => {
    newPassword.setCustomValidity("");
    confirmPassword?.setCustomValidity("");
});
confirmPassword?.addEventListener("input", () => {
    confirmPassword.setCustomValidity("");
});
/* Update Password */
updatePasswordButton?.addEventListener("click", () => {
    passwordForm?.requestSubmit();
});
passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validatePasswordForm())
        return;
    // TODO: Verify the current password through the backend.
    // TODO: Send the password update request to the backend.
    alert("Password validation completed. Password updates will be available after backend integration.");
});
/* ========================================
5. ACTIVE SIDEBAR NAVIGATION
======================================== */
function updateActiveNavigation() {
    const currentSection = window.location.hash || "#account";
    settingsNavLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === currentSection;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "location");
        }
        else {
            link.removeAttribute("aria-current");
        }
    });
}
/* Update active section when navigation changes */
window.addEventListener("hashchange", updateActiveNavigation);
/* Initialize active navigation */
updateActiveNavigation();
export {};
