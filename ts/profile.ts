
/* ========================================
   UNIFYND - PROFILE PAGE
======================================== */


/* ========================================
   1. TYPE DEFINITIONS
======================================== */

type ListingType = "all" | "lost" | "found";

type ListingStatus = "all" | "active" | "returned";

interface LucideLibrary {
    createIcons(): void;
}


/* ========================================
   2. INITIALIZE LUCIDE ICONS
======================================== */

function initializeIcons(): void {

    const lucide = (
        window as Window & { lucide?: LucideLibrary }
    ).lucide;

    lucide?.createIcons();

}


/* ========================================
   3. LISTING FILTERS
======================================== */

function initializeListingFilters(): void {

    const listingTabs =
        document.querySelectorAll<HTMLButtonElement>(
            ".listing-tab"
        );

    const statusFilter =
        document.querySelector<HTMLSelectElement>(
            ".status-filter"
        );

    const listings =
        document.querySelectorAll<HTMLElement>(
            ".profile-listing"
        );

    const emptyState =
        document.getElementById("listing-empty-state");

    const resetFiltersButton =
        document.getElementById("reset-filters");


    let selectedType: ListingType = "all";

    let selectedStatus: ListingStatus = "all";


    /* Apply Combined Filters */

    function applyFilters(): void {

        let visibleCount = 0;

        listings.forEach(listing => {

            const itemType =
                listing.querySelector<HTMLElement>(
                    ".item-type"
                );

            const itemStatus =
                listing.querySelector<HTMLSelectElement>(
                    ".status-select"
                );


            /* Check Listing Type */

            const matchesType =
                selectedType === "all" ||
                itemType?.classList.contains(selectedType);


            /* Check Listing Status */

            const matchesStatus =
                selectedStatus === "all" ||
                itemStatus?.value === selectedStatus;


            /* Show or Hide Listing */

            const isVisible =
                matchesType && matchesStatus;

            listing.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }

        });


        /* Show Empty State */

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

    }


    /* Update Active Tab */

    function updateActiveTab(): void {

        listingTabs.forEach(tab => {

            const isActive =
                tab.dataset.filter === selectedType;

            tab.classList.toggle("active", isActive);

            tab.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

    }


    /* All Items / Lost / Found */

    listingTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            selectedType =
                (tab.dataset.filter || "all") as ListingType;

            updateActiveTab();

            applyFilters();

        });

    });


    /* Status Dropdown Filter */

    statusFilter?.addEventListener("change", () => {

        selectedStatus =
            statusFilter.value as ListingStatus;

        applyFilters();

    });


    /* Reset Filters */

    resetFiltersButton?.addEventListener("click", () => {

        selectedType = "all";

        selectedStatus = "all";

        if (statusFilter) {
            statusFilter.value = "all";
        }

        updateActiveTab();

        applyFilters();

    });


    /* Listing Status Changes */

    listings.forEach(listing => {

        const statusSelect =
            listing.querySelector<HTMLSelectElement>(
                ".status-select"
            );

        statusSelect?.addEventListener("change", () => {

            updateStatistics();

            applyFilters();

            // TODO (Rami):
            // Save the updated listing status
            // to the database.

        });

    });


    /* Initial State */

    if (statusFilter) {
        selectedStatus = statusFilter.value as ListingStatus;
    }

    updateActiveTab();

    applyFilters();

}


/* ========================================
   4. PROFILE STATISTICS
======================================== */

function updateStatistics(): void {

    const listings =
        document.querySelectorAll<HTMLElement>(
            ".profile-listing"
        );

    let totalCount = listings.length;

    let activeCount = 0;

    let returnedCount = 0;


    /* Count Listing Statuses */

    listings.forEach(listing => {

        const statusSelect =
            listing.querySelector<HTMLSelectElement>(
                ".status-select"
            );

        if (statusSelect?.value === "active") {
            activeCount++;
        }

        if (statusSelect?.value === "returned") {
            returnedCount++;
        }

    });


    /* Find Statistics Cards */

    const totalElement =
        document.querySelector<HTMLElement>(
            ".stat-listings + .stat-information strong"
        );

    const activeElement =
        document.querySelector<HTMLElement>(
            ".stat-active + .stat-information strong"
        );

    const returnedElement =
        document.querySelector<HTMLElement>(
            ".stat-returned + .stat-information strong"
        );


    /* Update Statistics */

    if (totalElement) {
        totalElement.textContent = String(totalCount);
    }

    if (activeElement) {
        activeElement.textContent = String(activeCount);
    }

    if (returnedElement) {
        returnedElement.textContent = String(returnedCount);
    }

}


/* ========================================
   5. DELETE CONFIRMATION MODAL
======================================== */

function initializeDeleteModal(): void {

    const deleteModal =
        document.querySelector<HTMLDialogElement>(
            "#delete-modal"
        );

    const confirmDelete =
        document.querySelector<HTMLButtonElement>(
            "#confirm-delete"
        );

    const cancelDelete =
        document.getElementById("cancel-delete");

    const closeDeleteModal =
        document.getElementById("close-delete-modal");

    const deleteButtons =
        document.querySelectorAll<HTMLButtonElement>(
            ".delete-button"
        );


    if (!deleteModal || !confirmDelete) {
        return;
    }


    /* Open Delete Modal */

    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const itemId = button.dataset.itemId;

            if (!itemId) {
                return;
            }

            confirmDelete.dataset.itemId = itemId;

            deleteModal.showModal();

        });

    });


    /* Cancel Button */

    cancelDelete?.addEventListener("click", () => {

        deleteModal.close();

    });


    /* Close Button */

    closeDeleteModal?.addEventListener("click", () => {

        deleteModal.close();

    });


    /* Confirm Delete */

    confirmDelete.addEventListener("click", () => {

        const itemId = confirmDelete.dataset.itemId;

        if (!itemId) {
            return;
        }

        // TODO (Rami):
        // Verify listing ownership.
        // Delete the listing from the database.
        // Remove the listing after successful deletion.
        // Update statistics and AI matches.
        // Close the modal after successful deletion.

        console.log("Delete requested for item:", itemId);

    });


    /* Clear Selected Item When Modal Closes */

    deleteModal.addEventListener("close", () => {

        delete confirmDelete.dataset.itemId;

    });

}


/* ========================================
   6. INITIALIZE PROFILE PAGE
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeIcons();

    initializeListingFilters();

    updateStatistics();

    initializeDeleteModal();

});
