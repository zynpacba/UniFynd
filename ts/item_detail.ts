(() => {

    // ================= DEMO SETTINGS =================

    const DEMO_MODE = true;

    // Options: "guest", "visitor", "owner"
    const DEMO_VIEWER = "guest" as string;

    // Options: "lost", "found"
    const DEMO_ITEM_TYPE = "found" as string;

    // Options: "active", "returned"
    const DEMO_ITEM_STATUS = "active" as string;

    // Options: "success", "empty", "error"
    const DEMO_MATCHING_STATE = "success" as string;

    // ================= DEMO ITEM DATA =================

    const demoItem = {
        id: "1",
        name: "Wireless Headphones",
        type: DEMO_ITEM_TYPE,
        status: DEMO_ITEM_STATUS,
        category: "Electronics",
        campus: "Kavacık Kuzey Campus",
        location: "Library",
        specificLocation: "Second floor, near the study desks",
        description: "Black wireless headphones with padded ear cushions. Found near the study desks in the campus library.",
        itemDate: "2026-11-23",
        postedDate: "2026-11-24",
        image: "",
        ownerId: "101"
    };

    // ================= DEMO USER DATA =================

    const currentUser = {
        isLoggedIn: DEMO_VIEWER !== "guest",
        id: DEMO_VIEWER === "owner" ? "101" : "202"
    };

    // ================= DEMO MATCHING DATA =================

    const demoMatches = [
        {
            id: "2",
            name: "Black Wireless Headphones",
            type: "lost",
            status: "active",
            category: "Electronics",
            campus: "Kavacık Kuzey Campus",
            location: "Library",
            description: "Black Bluetooth headphones lost near the library study area.",
            date: "2026-11-23",
            image: "",
            similarity: 0.94
        },
        {
            id: "3",
            name: "Bluetooth Headset",
            type: "lost",
            status: "active",
            category: "Electronics",
            campus: "Kavacık Kuzey Campus",
            location: "Classroom",
            description: "A black wireless headset with soft ear cushions.",
            date: "2026-11-22",
            image: "",
            similarity: 0.86
        },
        {
            id: "4",
            name: "Black Audio Headphones",
            type: "lost",
            status: "active",
            category: "Electronics",
            campus: "Kavacık Kuzey Campus",
            location: "Library",
            description: "Black over-ear headphones missing since Monday.",
            date: "2026-11-21",
            image: "",
            similarity: 0.78
        }
    ];

    // ================= DOM ELEMENTS =================

    const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
    const navContent = document.getElementById("nav-content");
    const successBanner = document.getElementById("success-banner");
    const itemLoading = document.getElementById("item-loading");
    const itemError = document.getElementById("item-error");
    const itemContent = document.getElementById("item-content");
    const itemImage = document.getElementById("item-image") as HTMLImageElement | null;
    const photoPlaceholder = document.getElementById("photo-placeholder");
    const itemType = document.getElementById("item-type");
    const itemStatus = document.getElementById("item-status");
    const contactCard = document.getElementById("contact-card");
    const managementCard = document.getElementById("management-card");
    const messageBtn = document.getElementById("message-btn") as HTMLButtonElement | null;
    const verificationNotice = document.getElementById("verification-notice");
    const editItemBtn = document.getElementById("edit-item-btn") as HTMLButtonElement | null;
    const markReturnedBtn = document.getElementById("mark-returned-btn") as HTMLButtonElement | null;
    const matchingLocked = document.getElementById("matching-locked");
    const matchingProgress = document.getElementById("matching-progress");
    const matchingResults = document.getElementById("matching-results");
    const matchingEmpty = document.getElementById("matching-empty");
    const matchingError = document.getElementById("matching-error");
    const progressBar = document.getElementById("matching-progress-bar") as HTMLProgressElement | null;
    const matchesGrid = document.getElementById("matches-grid");
    const matchCardTemplate = document.getElementById("match-card-template") as HTMLTemplateElement | null;
    const retryMatchingBtn = document.getElementById("retry-matching-btn") as HTMLButtonElement | null;
    const matchingLoginBtn = document.getElementById("matching-login-btn") as HTMLAnchorElement | null;
    const matchingSignupLink = document.getElementById("matching-signup-link") as HTMLAnchorElement | null;

    // ================= APPLICATION STATE =================

    let currentItem = { ...demoItem };
    let matchingTimer: number | null = null;
    let matchingClosed: HTMLElement | null = null;

    // ================= HELPER FUNCTIONS =================

    function setText(id: string, text: string) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    function showElement(element: HTMLElement | null) {
        if (element) {
            element.hidden = false;
        }
    }

    function hideElement(element: HTMLElement | null) {
        if (element) {
            element.hidden = true;
        }
    }

    function formatDate(date: string) {
        const formattedDate = new Date(date + "T00:00:00");
        return formattedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function formatShortDate(date: string) {
    const formattedDate = new Date(date + "T00:00:00");
    return formattedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    }

    function capitalize(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    // ================= MOBILE NAVBAR =================

    function setupNavbar() {
        if (!menuToggle || !navContent) {
            return;
        }

        menuToggle.addEventListener("click", () => {
            const isOpen = navContent.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navContent.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navContent.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                navContent.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ================= URL PARAMETERS =================

    function getItemId() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    function isNewReport() {
        const params = new URLSearchParams(window.location.search);
        return params.get("created") === "true";
    }

    // ================= LOGIN REDIRECTION =================

    function getLoginUrl() {
        const returnUrl = window.location.pathname + window.location.search;
        return "login.html?next=" + encodeURIComponent(returnUrl);
    }

    function setupAuthenticationLinks() {
        if (matchingLoginBtn) {
            matchingLoginBtn.href = getLoginUrl();
        }

        if (matchingSignupLink) {
            const returnUrl = window.location.pathname + window.location.search;
            matchingSignupLink.href = "register.html?next=" + encodeURIComponent(returnUrl);
        }
    }

    // ================= LOAD ITEM =================

    function loadItem() {
        showElement(itemLoading);
        hideElement(itemContent);
        hideElement(itemError);
        hideElement(successBanner);

        const id = getItemId();

        if (!DEMO_MODE) {
            showItemError("Item Unavailable", "The item service is not connected yet.");
            return;
        }

        if (id && id !== "1") {
            const selectedMatch = demoMatches.find(match => match.id === id);

            if (!selectedMatch) {
                showItemError("Item Not Found", "This item may have been removed or is unavailable.");
                return;
            }

            currentItem = {
                ...demoItem,
                id: selectedMatch.id,
                name: selectedMatch.name,
                type: selectedMatch.type,
                status: selectedMatch.status,
                category: selectedMatch.category,
                campus: selectedMatch.campus,
                location: selectedMatch.location,
                specificLocation: "",
                description: selectedMatch.description,
                itemDate: selectedMatch.date,
                postedDate: selectedMatch.date,
                image: selectedMatch.image,
                ownerId: "303"
            };
        } else {
            currentItem = { ...demoItem };

            if (currentItem.type === "lost") {
                currentItem.description =
                    "Black wireless headphones with padded ear cushions. Lost near the study desks in the campus library.";
            }
        }

        hideElement(itemLoading);
        showElement(itemContent);
        renderItem();
        updateContactCard();
        showSuccessBanner();
        initializeMatching();
    }

    // ================= ITEM ERROR STATE =================

    function showItemError(title: string, message: string) {
        hideElement(itemLoading);
        hideElement(itemContent);
        hideElement(successBanner);

        setText("item-error-title", title);
        setText("item-error-message", message);
        showElement(itemError);
    }

    // ================= RENDER ITEM DETAILS =================

    function renderItem() {
        setText("item-name", currentItem.name);
        setText("item-description", currentItem.description);
        setText("item-category", currentItem.category);
        setText("item-campus", currentItem.campus);
        setText("item-location", currentItem.location);
        setText("item-specific-location", currentItem.specificLocation);
        setText("posted-date", formatDate(currentItem.postedDate));
        setText("item-date", formatDate(currentItem.itemDate));
        document.getElementById("posted-date")
            ?.setAttribute("datetime", currentItem.postedDate);

        document.getElementById("item-date")
            ?.setAttribute("datetime", currentItem.itemDate);

        const specificLocationRow = document.getElementById("specific-location-row");
        if (currentItem.specificLocation) {
            showElement(specificLocationRow);
        } else {
            hideElement(specificLocationRow);
        }

        updateItemType();
        updateItemStatus();
        displayItemPhoto();

        document.title = "UniFynd — " + currentItem.name;
    }

    // ================= LOST / FOUND TYPE =================

    function updateItemType() {
        if (!itemType) {
            return;
        }

        itemType.classList.remove("lost", "found");
        itemType.classList.add(currentItem.type);
        itemType.textContent = capitalize(currentItem.type);

        if (currentItem.type === "lost") {
            setText("item-date-label", "Date Lost");
        } else {
            setText("item-date-label", "Date Found");
        }
    }

    // ================= ACTIVE / RETURNED STATUS =================

    function updateItemStatus() {
        if (!itemStatus) {
            return;
        }

        itemStatus.classList.remove("active", "returned");
        itemStatus.classList.add(currentItem.status);
        itemStatus.textContent = capitalize(currentItem.status);
    }

    // ================= ITEM PHOTO =================

    function displayItemPhoto() {
        if (!itemImage) {
            return;
        }

        if (currentItem.image) {
            itemImage.src = currentItem.image;
            itemImage.alt = currentItem.name;
            showElement(itemImage);
            hideElement(photoPlaceholder);
        } else {
            itemImage.removeAttribute("src");
            hideElement(itemImage);
            showElement(photoPlaceholder);
        }

        itemImage.onerror = () => {
            hideElement(itemImage);
            showElement(photoPlaceholder);
        };
    }

    // ================= USER PERMISSIONS =================

    function isListingOwner() {
        return currentUser.isLoggedIn && currentUser.id === currentItem.ownerId;
    }

    // ================= CONTACT / MANAGEMENT CARD =================

    function updateContactCard() {
        hideElement(contactCard);
        hideElement(managementCard);
        hideElement(verificationNotice);

        // Returned listing
        if (currentItem.status === "returned") {
            showElement(contactCard);
            setText("contact-title", "Successfully Returned!");
            setText("contact-description", "This item has been reunited with its owner.");

            if (messageBtn) {
                messageBtn.textContent = "Listing Closed";
                messageBtn.disabled = true;
            }
            return;
        }

        // Listing owner
        if (isListingOwner()) {
            showElement(managementCard);
            if (editItemBtn) {
                editItemBtn.disabled = false;
            }
            if (markReturnedBtn) {
                markReturnedBtn.disabled = false;
            }
            return;
        }

        // Guest or signed-in visitor
        showElement(contactCard);

        if (currentItem.type === "found") {
            setText("contact-title", "Contact the Finder");
            setText("contact-description", "Think this is your item? Get in touch with the finder.");
            showElement(verificationNotice);
        } else {
            setText("contact-title", "Contact the Owner");
            setText("contact-description", "Have you found this item? Get in touch with its owner.");
        }

        if (messageBtn) {
            messageBtn.disabled = false;
            if (currentUser.isLoggedIn) {
                setText("message-btn-text", "Send a Message");
            } else {
                setText("message-btn-text", "Log In to Contact");
            }
        }
    }

    // ================= MESSAGE BUTTON =================

    function setupMessageButton() {
        messageBtn?.addEventListener("click", () => {
            if (currentItem.status === "returned") {
                return;
            }
            if (isListingOwner()) {
                return;
            }
            if (!currentUser.isLoggedIn) {
                window.location.href = getLoginUrl();
                return;
            }

            // TODO: Connect the messaging page.
            alert("The messaging feature will be available soon.");
        });
    }

    // ================= MANAGEMENT ACTIONS =================

    function setupManagementActions() {
        editItemBtn?.addEventListener("click", () => {
            if (!isListingOwner() || currentItem.status === "returned") {
                return;
            }

            // TODO: Connect the item editing feature.
            alert("The edit listing feature will be available soon.");
        });

        markReturnedBtn?.addEventListener("click", () => {
            if (!isListingOwner() || currentItem.status === "returned") {
                return;
            }

            const confirmed = window.confirm(
                "Has this item been successfully returned to its owner? This will close the listing."
            );
            if (!confirmed) {
                return;
            }

            // TODO: Save the new status to the backend.
            currentItem.status = "returned";
            updateItemStatus();
            updateContactCard();
            showSuccessBanner();
            showMatchingClosed();
        });
    }

    // ================= SUCCESS BANNER =================

    function showSuccessBanner() {
        if (isNewReport() && isListingOwner() && currentItem.status === "active") {
            showElement(successBanner);
        } else {
            hideElement(successBanner);
        }
    }

    // ================= AI MATCHING STATES =================

    function stopMatchingTimer() {
        if (matchingTimer !== null) {
            window.clearInterval(matchingTimer);
            matchingTimer = null;
        }
    }

    function hideAllMatchingStates() {
        hideElement(matchingLocked);
        hideElement(matchingProgress);
        hideElement(matchingResults);
        hideElement(matchingEmpty);
        hideElement(matchingError);
        hideElement(matchingClosed);
    }

    function initializeMatching() {
        stopMatchingTimer();
        hideAllMatchingStates();

        // Returned items cannot be matched.
        if (currentItem.status === "returned") {
            showMatchingClosed();
            return;
        }

        // Guests cannot access matching results.
        if (!currentUser.isLoggedIn) {
            showElement(matchingLocked);
            return;
        }

        // New reports start matching automatically.
        if (isNewReport() && isListingOwner()) {
            startMatching();
        } else {
            showMatchingOutcome();
        }
    }

    // ================= AI MATCHING PROGRESS =================

    function startMatching() {
        if (!currentUser.isLoggedIn || currentItem.status !== "active") {
            return;
        }

        stopMatchingTimer();
        hideAllMatchingStates();
        showElement(matchingProgress);

        let progress = 0;
        updateProgress(progress);

        // DEMO ONLY:
        // Simulates the matching process.
        // This is not real AI processing progress.
        matchingTimer = window.setInterval(() => {
            progress += 25;
            updateProgress(progress);

            if (progress >= 100) {
                stopMatchingTimer();
                showMatchingOutcome();
            }
        }, 700);
    }

    function updateProgress(progress: number) {
        if (progressBar) {
            progressBar.value = progress;
        }
        setText("progress-percentage", progress + "%");

        if (progress === 0) {
            setText("matching-status", "Starting AI Smart Matching...");
            setText("progress-description", "Preparing the item information.");
        } else if (progress === 25) {
            setText("matching-status", "Analyzing your item...");
            setText("progress-description", "Processing the item name and description.");
        } else if (progress === 50) {
            setText("matching-status", "Searching relevant listings...");
            setText("progress-description", "Looking for active listings across your campus.");
        } else if (progress === 75) {
            setText("matching-status", "Comparing item descriptions...");
            setText("progress-description", "Evaluating semantic similarities.");
        } else {
            setText("matching-status", "Matching completed!");
            setText("progress-description", "The matching process is complete.");
        }
    }

    // ================= FILTER AND SORT MATCHES =================

    function getPotentialMatches() {
        // DEMO ONLY:
        // Similarity scores are predefined.
        // Real semantic matching will run on the backend.
        let candidates = [...demoMatches];

        if (currentItem.id !== demoItem.id) {
            candidates.push({
                id: demoItem.id,
                name: demoItem.name,
                type: demoItem.type,
                status: demoItem.status,
                category: demoItem.category,
                campus: demoItem.campus,
                location: demoItem.location,
                description: demoItem.description,
                date: demoItem.itemDate,
                image: demoItem.image,
                similarity: 0.94
            });
        } else if (currentItem.type === "lost") {
            // Reverse the sample listings for Lost mode.
            candidates = candidates.map(match => ({
                ...match,
                type: "found",
                description: match.description
                    .replace("lost", "found")
                    .replace("missing since", "found on")
            }));
        }

        return candidates
            .filter(match => {
                return (
                    match.id !== currentItem.id &&
                    match.type !== currentItem.type &&
                    match.status === "active" &&
                    match.campus === currentItem.campus &&
                    match.category === currentItem.category
                );
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);
    }

    // ================= MATCHING OUTCOME =================

    function showMatchingOutcome() {
        if (currentItem.status === "returned") {
            showMatchingClosed();
            return;
        }

        if (!currentUser.isLoggedIn) {
            hideAllMatchingStates();
            showElement(matchingLocked);
            return;
        }

        if (DEMO_MATCHING_STATE === "error") {
            showMatchingError();
            return;
        }

        if (DEMO_MATCHING_STATE === "empty") {
            showNoMatches();
            return;
        }

        const matches = getPotentialMatches();
        if (matches.length === 0) {
            showNoMatches();
        } else {
            renderMatches(matches);
            
        }
    }

    // ================= RENDER MATCHING RESULTS =================

    function renderMatches(matches: typeof demoMatches) {
        if (!matchesGrid || !matchCardTemplate) {
            showMatchingError();
            return;
        }

        hideAllMatchingStates();
        matchesGrid.replaceChildren();
        showElement(matchingProgress);
        updateProgress(100);
        showElement(matchingResults);

        const matchLabel = matches.length === 1 ? " Potential Match" : " Potential Matches";
        setText("match-count", matches.length + matchLabel);

        matches.forEach(match => {
            const card = matchCardTemplate.content.cloneNode(true) as DocumentFragment;

            function setCardText(selector: string, value: string) {
                const element = card.querySelector(selector);
                if (element) {
                    element.textContent = value;
                }
            }

            setCardText(".match-name", match.name);
            setCardText(".match-description", match.description);
            setCardText(".match-category", match.category);
            setCardText(".match-campus", match.campus);
            setCardText(".match-location", match.location);
            setCardText(".match-date", formatShortDate(match.date));
            card.querySelector(".match-date")
                ?.setAttribute("datetime", match.date);
            setCardText(".similarity-label", "Similarity: " + match.similarity.toFixed(2));

            // Lost / Found badge
            const matchType = card.querySelector(".match-type");
            if (matchType) {
                matchType.textContent = capitalize(match.type);
                matchType.classList.remove("lost", "found");
                matchType.classList.add(match.type);
            }

            // Match photo
            const matchImage = card.querySelector<HTMLImageElement>(".match-image");
            const matchPlaceholder = card.querySelector<HTMLElement>(".match-photo-placeholder");

            if (matchImage && match.image) {
                matchImage.src = match.image;
                matchImage.alt = match.name;
                showElement(matchImage);
                hideElement(matchPlaceholder);

                matchImage.onerror = () => {
                    hideElement(matchImage);
                    showElement(matchPlaceholder);
                };
            } else {
                hideElement(matchImage);
                showElement(matchPlaceholder);
            }

            // View details link
            const detailLink = card.querySelector<HTMLAnchorElement>(".match-detail-link");
            if (detailLink) {
                detailLink.href = "item_detail.html?id=" + encodeURIComponent(match.id);
            }

            matchesGrid.appendChild(card);
        });
    }

    // ================= NO MATCHES STATE =================

    function showNoMatches() {
        stopMatchingTimer();
        hideAllMatchingStates();
        showElement(matchingProgress);
        updateProgress(100);
        showElement(matchingEmpty);
    }

    // ================= MATCHING ERROR STATE =================

    function showMatchingError() {
        stopMatchingTimer();
        hideAllMatchingStates();
        showElement(matchingError);

        if (retryMatchingBtn) {
            retryMatchingBtn.disabled = false;
        }
    }

    function setupRetryMatching() {
        retryMatchingBtn?.addEventListener("click", () => {
            startMatching();
        });
    }

    // ================= MATCHING CLOSED STATE =================

    function showMatchingClosed() {
        stopMatchingTimer();
        hideAllMatchingStates();

        matchingClosed = document.getElementById("matching-closed");

        // Create a fallback if the HTML section has not been added yet.
        if (!matchingClosed && matchingLocked?.parentElement) {
            matchingClosed = document.createElement("div");
            matchingClosed.id = "matching-closed";
            matchingClosed.className = "matching-locked";

            const heading = document.createElement("h3");
            heading.textContent = "Matching Closed";

            const description = document.createElement("p");
            description.textContent =
                "This item has been successfully returned. No further matching is needed.";

            matchingClosed.append(heading, description);
            matchingLocked.parentElement.appendChild(matchingClosed);
        }

        showElement(matchingClosed);
    }

    // ================= INITIALIZE PAGE =================

    function initializePage() {
        setupNavbar();
        setupAuthenticationLinks();
        setupMessageButton();
        setupManagementActions();
        setupRetryMatching();
        loadItem();
    }

    initializePage();

})();