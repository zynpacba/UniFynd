"use strict";
/* ========================================
   UNIFYND - PROFILE PAGE
======================================== */
/* ========================================
   2. INITIALIZE LUCIDE ICONS
======================================== */
function initializeIcons() {
    const lucide = window.lucide;
    lucide?.createIcons();
}
/* ========================================
   3. LISTING FILTERS
======================================== */
function initializeListingFilters() {
    const listingTabs = document.querySelectorAll(".listing-tab");
    const statusFilter = document.querySelector(".status-filter");
    const listings = document.querySelectorAll(".profile-listing");
    const emptyState = document.getElementById("listing-empty-state");
    const resetFiltersButton = document.getElementById("reset-filters");
    let selectedType = "all";
    let selectedStatus = "all";
    /* Apply Combined Filters */
    function applyFilters() {
        let visibleCount = 0;
        listings.forEach(listing => {
            const itemType = listing.querySelector(".item-type");
            const itemStatus = listing.querySelector(".status-select");
            /* Check Listing Type */
            const matchesType = selectedType === "all" ||
                itemType?.classList.contains(selectedType);
            /* Check Listing Status */
            const matchesStatus = selectedStatus === "all" ||
                itemStatus?.value === selectedStatus;
            /* Show or Hide Listing */
            const isVisible = matchesType && matchesStatus;
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
    function updateActiveTab() {
        listingTabs.forEach(tab => {
            const isActive = tab.dataset.filter === selectedType;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-pressed", String(isActive));
        });
    }
    /* All Items / Lost / Found */
    listingTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            selectedType =
                (tab.dataset.filter || "all");
            updateActiveTab();
            applyFilters();
        });
    });
    /* Status Dropdown Filter */
    statusFilter?.addEventListener("change", () => {
        selectedStatus =
            statusFilter.value;
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
        const statusSelect = listing.querySelector(".status-select");
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
        selectedStatus = statusFilter.value;
    }
    updateActiveTab();
    applyFilters();
}
/* ========================================
   4. PROFILE STATISTICS
======================================== */
function updateStatistics() {
    const listings = document.querySelectorAll(".profile-listing");
    let totalCount = listings.length;
    let activeCount = 0;
    let returnedCount = 0;
    /* Count Listing Statuses */
    listings.forEach(listing => {
        const statusSelect = listing.querySelector(".status-select");
        if (statusSelect?.value === "active") {
            activeCount++;
        }
        if (statusSelect?.value === "returned") {
            returnedCount++;
        }
    });
    /* Find Statistics Cards */
    const totalElement = document.querySelector(".stat-listings + .stat-information strong");
    const activeElement = document.querySelector(".stat-active + .stat-information strong");
    const returnedElement = document.querySelector(".stat-returned + .stat-information strong");
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
function initializeDeleteModal() {
    const deleteModal = document.querySelector("#delete-modal");
    const confirmDelete = document.querySelector("#confirm-delete");
    const cancelDelete = document.getElementById("cancel-delete");
    const closeDeleteModal = document.getElementById("close-delete-modal");
    const deleteButtons = document.querySelectorAll(".delete-button");
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
