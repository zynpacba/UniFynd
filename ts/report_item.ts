/* ================= DOM ELEMENTS ================= */

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navContent = document.getElementById("nav-content")!;

const reportForm = document.getElementById("report-form") as HTMLFormElement;
const reportTypes = document.querySelectorAll<HTMLInputElement>('input[name="type"]');

const itemName = document.getElementById("item-name") as HTMLInputElement;
const itemCategory = document.getElementById("item-category") as HTMLSelectElement;
const description = document.getElementById("item-description") as HTMLTextAreaElement;
const descriptionCount = document.getElementById("description-count")!;

const itemCampus = document.getElementById("item-campus") as HTMLSelectElement;
const itemLocation = document.getElementById("item-location") as HTMLSelectElement;
const specificLocation = document.getElementById("specific-location") as HTMLInputElement;

const dateLabel = document.getElementById("date-label")!;
const itemDate = document.getElementById("item-date") as HTMLInputElement;

const submitButton = document.getElementById("submit-report") as HTMLButtonElement;
const submitLabel = document.getElementById("submit-label")!;

const verificationSection = document.getElementById("verification-section") as HTMLFieldSetElement;
const verificationDetails = document.getElementById("verification-details") as HTMLTextAreaElement;

const photoUpload = document.getElementById("photo-upload")!;
const photoInput = document.getElementById("item-photo") as HTMLInputElement;
const photoPreview = document.getElementById("photo-preview")!;

const previewImage = document.getElementById("preview-image") as HTMLImageElement;
const photoName = document.getElementById("photo-name")!;
const photoSize = document.getElementById("photo-size")!;

const removePhoto = document.getElementById("remove-photo")!;
const photoError = document.getElementById("photo-error")!;
const formMessage = document.getElementById("form-message")!;


/* ================= MOBILE NAVBAR ================= */

menuToggle?.addEventListener("click", () => {
    const isOpen = navContent.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});

document.querySelectorAll(".nav-content a").forEach(link => {
    link.addEventListener("click", () => {
        navContent.classList.remove("open");

        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation");
    });
});


/* ================= REPORT TYPE ================= */

function getSelectedReportType() {
    const selected = document.querySelector<HTMLInputElement>(
        'input[name="type"]:checked'
    );

    if (selected?.value === "lost" || selected?.value === "found") {
        return selected.value;
    }

    throw new Error("Invalid report type.");
}

function updateReportType() {
    const isFound = getSelectedReportType() === "found";

    dateLabel.textContent = isFound
        ? "Date Found"
        : "Date Lost";

    submitLabel.textContent = isFound
        ? "Report Found Item"
        : "Report Lost Item";

    verificationSection.hidden = !isFound;
    verificationSection.disabled = !isFound;
}

reportTypes.forEach(type => {
    type.addEventListener("change", updateReportType);
});

updateReportType();


/* ================= CHARACTER COUNTER ================= */

function updateCharacterCount() {
    const currentLength = description.value.length;
    const maxLength = description.maxLength;

    descriptionCount.textContent = `${currentLength} / ${maxLength}`;

    descriptionCount.classList.toggle(
        "near-limit",
        currentLength >= maxLength * 0.9
    );

    descriptionCount.classList.toggle(
        "at-limit",
        currentLength >= maxLength
    );
}

description.addEventListener("input", updateCharacterCount);

updateCharacterCount();


/* ================= DATE VALIDATION ================= */

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function validateDate() {
    itemDate.max = getTodayDate();

    const isValid = itemDate.value <= itemDate.max;

    itemDate.setCustomValidity(
        isValid ? "" : "Please select today or a past date."
    );

    return isValid;
}

itemDate.addEventListener("input", validateDate);

validateDate();


/* ================= PHOTO SETTINGS ================= */

const allowedPhotoTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const maxPhotoSize = 5 * 1024 * 1024;

let selectedPhoto: File | null = null;
let previewUrl: string | null = null;


/* ================= PHOTO ERROR MESSAGES ================= */

function showPhotoError(message: string) {
    photoError.textContent = message;
    photoError.hidden = false;
}

function clearPhotoError() {
    photoError.textContent = "";
    photoError.hidden = true;
}


/* ================= PHOTO VALIDATION ================= */

function validatePhoto(file: File) {

    if (!allowedPhotoTypes.includes(file.type)) {
        showPhotoError("Please upload a JPG, PNG or WEBP image.");
        return false;
    }

    if (file.size === 0) {
        showPhotoError("The selected file is empty.");
        return false;
    }

    if (file.size > maxPhotoSize) {
        showPhotoError("The photo must be smaller than or equal to 5 MB.");
        return false;
    }

    clearPhotoError();

    return true;
}


/* ================= FILE SIZE FORMAT ================= */

function formatFileSize(bytes: number) {

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


/* ================= PHOTO PREVIEW ================= */

function showPhotoPreview(file: File) {

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }

    selectedPhoto = file;
    previewUrl = URL.createObjectURL(file);

    previewImage.src = previewUrl;

    photoName.textContent = file.name;
    photoSize.textContent = formatFileSize(file.size);

    photoPreview.hidden = false;
    photoUpload.hidden = true;
}


/* ================= PHOTO SELECTION ================= */

function handlePhoto(file: File | undefined) {

    if (!file) {
        return;
    }

    if (!validatePhoto(file)) {
        photoInput.value = "";
        return;
    }

    showPhotoPreview(file);
}

photoInput.addEventListener("change", () => {
    handlePhoto(photoInput.files?.[0]);
});


/* ================= DRAG AND DROP ================= */

photoUpload.addEventListener("dragover", event => {
    event.preventDefault();

    photoUpload.classList.add("drag-over");
});

photoUpload.addEventListener("dragleave", event => {
    const relatedTarget = event.relatedTarget;

    if (
        !(relatedTarget instanceof Node) ||
        !photoUpload.contains(relatedTarget)
    ) {
        photoUpload.classList.remove("drag-over");
    }
});

photoUpload.addEventListener("drop", event => {
    event.preventDefault();

    photoUpload.classList.remove("drag-over");

    const files = event.dataTransfer?.files;

    if (!files || files.length === 0) {
        return;
    }

    if (files.length > 1) {
        showPhotoError("Please upload only one photo.");
        return;
    }

    handlePhoto(files[0]);
});


/* ================= REMOVE PHOTO ================= */

function resetPhoto() {

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }

    selectedPhoto = null;
    previewUrl = null;

    photoInput.value = "";

    previewImage.removeAttribute("src");

    photoName.textContent = "";
    photoSize.textContent = "";

    photoPreview.hidden = true;
    photoUpload.hidden = false;

    clearPhotoError();
}

removePhoto.addEventListener("click", () => {
    resetPhoto();

    photoInput.focus();
});


/* ================= FORM MESSAGES ================= */

function showFormMessage(
    message: string,
    type: "success" | "error" | "info"
) {
    formMessage.textContent = message;

    formMessage.classList.remove("success", "error", "info");
    formMessage.classList.add(type);

    formMessage.hidden = false;
}

function clearFormMessage() {
    formMessage.textContent = "";

    formMessage.classList.remove("success", "error", "info");

    formMessage.hidden = true;
}


/* ================= ALLOWED SELECT VALUES ================= */

const allowedCategories = [
    "electronics",
    "documents",
    "accessories",
    "clothing",
    "other"
];

const allowedCampuses = [
    "kavacik-kuzey",
    "kavacik-guney",
    "halic"
];

const allowedLocations = [
    "library",
    "classroom",
    "lecture-hall",
    "cafeteria",
    "dining-area",
    "laboratory",
    "copy-center",
    "conference-hall",
    "store",
    "other"
];


/* ================= SELECT VALIDATION ================= */

function getSelectValue(
    select: HTMLSelectElement,
    allowedValues: string[]
) {
    if (!allowedValues.includes(select.value)) {
        throw new Error(`Invalid value for ${select.name}.`);
    }

    return select.value;
}


/* ================= COLLECT REPORT DATA ================= */

function collectReportData() {

    const type = getSelectedReportType();

    const reportData = {
        type: type,

        title: itemName.value.trim(),

        category: getSelectValue(
            itemCategory,
            allowedCategories
        ),

        description: description.value.trim(),

        campus: getSelectValue(
            itemCampus,
            allowedCampuses
        ),

        location: getSelectValue(
            itemLocation,
            allowedLocations
        ),

        specific_location: specificLocation.value.trim(),

        event_date: itemDate.value,

        photo: selectedPhoto
    };

    if (type === "found") {
        return {
            ...reportData,
            verification_details: verificationDetails.value.trim()
        };
    }

    return reportData;
}


/* ================= FORM DATA CONVERSION ================= */

function createFormData(
    reportData: ReturnType<typeof collectReportData>
) {
    const formData = new FormData();

    formData.append("type", reportData.type);
    formData.append("title", reportData.title);
    formData.append("category", reportData.category);
    formData.append("description", reportData.description);
    formData.append("campus", reportData.campus);
    formData.append("location", reportData.location);
    formData.append("specific_location", reportData.specific_location);
    formData.append("event_date", reportData.event_date);

    if (reportData.photo) {
        formData.append("photo", reportData.photo);
    }

    if (
        reportData.type === "found" &&
        "verification_details" in reportData &&
        reportData.verification_details
    ) {
        formData.append(
            "verification_details",
            reportData.verification_details
        );
    }

    return formData;
}


/* ================= FORM SUBMISSION ================= */

reportForm.addEventListener("submit", event => {

    event.preventDefault();

    clearFormMessage();

    validateDate();

    if (!reportForm.reportValidity()) {
        return;
    }

    submitButton.disabled = true;

    try {

        const reportData = collectReportData();

        if (!reportData.title || !reportData.description) {

            showFormMessage(
                "Please enter a valid item name and description.",
                "error"
            );

            return;
        }

        if (reportData.photo && !validatePhoto(reportData.photo)) {
            return;
        }

        const formData = createFormData(reportData);

        // Backend integration will be added here.
        // formData will be sent to the selected API.

        showFormMessage(
            "Your report is ready. Saving is not available yet.",
            "info"
        );

    } catch (error) {

        const message = error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        showFormMessage(message, "error");

    } finally {

        submitButton.disabled = false;

    }
});