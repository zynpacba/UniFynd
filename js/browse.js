    // Mobile navbar
    const menuToggle = document.querySelector(".menu-toggle");
    const navContent = document.querySelector(".nav-content");

    menuToggle.addEventListener("click", () => {
      const isOpen = navContent.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });


    // Temporary sample listings.
    // Later these will be replaced with API data.

    const items = [
      {
        id: 1,
        title: "Black AirPods",
        description: "Lost my black AirPods near the library entrance.",
        type: "lost",
        category: "electronics",
        campus: "kavacik-kuzey",
        campusLabel: "Kavacık Kuzey Campus",
        location: "library",
        locationLabel: "Library",
        date: "2026-11-22",
        image: null
      },
      {
        id: 2,
        title: "Student ID Card",
        description: "Found a student ID card near the cafeteria.",
        type: "found",
        category: "documents",
        campus: "kavacik-güney",
        campusLabel: "Kavacık Güney Campus",
        location: "cafeteria",
        locationLabel: "Student Cafeteria",
        date: "2026-11-21",
        image: null
      },
      {
        id: 3,
        title: "Blue Backpack",
        description: "A blue backpack was left in the study area.",
        type: "found",
        category: "accessories",
        campus: "halic",
        campusLabel: "Haliç Campus",
        location: "library",
        locationLabel: "Library",
        date: "2026-11-20",
        image: null
      },
      {
        id: 4,
        title: "Silver Necklace",
        description: "Lost a silver necklace in the classroom.",
        type: "lost",
        category: "accessories",
        campus: "kavacik-güney",
        campusLabel: "Kavacık Güney Campus",
        location: "classroom",
        locationLabel: "Classroom",
        date: "2026-11-18",
        image: null
      },
      {
        id: 5,
        title: "Black Hoodie",
        description: "Found a black hoodie in the library.",
        type: "found",
        category: "clothing",
        campus: "halic",
        campusLabel: "Haliç Campus",
        location: "library",
        locationLabel: "Library",
        date: "2026-11-16",
        image: null
      },
      {
        id: 6,
        title: "USB Flash Drive",
        description: "Lost a small USB drive in the study area.",
        type: "lost",
        category: "electronics",
        campus: "kavacik-kuzey",
        campusLabel: "Kavacık Kuzey Campus",
        location: "lecture-hall",
        locationLabel: "Lecture Halls",
        date: "2026-11-14",
        image: null
      }
    ];


    // Elements
    const searchForm = document.getElementById("browse-search-form");
    const searchInput = document.getElementById("browse-search-input");

    const categoryButtons = document.querySelectorAll(".category-btn");

    const typeFilter = document.getElementById("filter-type");
    const campusFilter = document.getElementById("filter-campus");
    const locationFilter = document.getElementById("filter-location");
    const dateFilter = document.getElementById("filter-date");
    const sortFilter = document.getElementById("sort-items");

    const itemsGrid = document.getElementById("items-grid");
    const resultsCount = document.getElementById("results-count");
    const emptyState = document.getElementById("empty-state");
    const pagination = document.getElementById("pagination");

    let selectedCategory = "all";
    let currentPage = 1;
    const itemsPerPage = 6;


    // Read search query from navbar
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get("q") || "";

    searchInput.value = initialQuery;


    // Safe HTML output for item text
    function escapeHTML(value) {
      return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        };

        return entities[character];
      });
    }


    // Date formatting
    function formatDate(dateString) {
      return new Date(dateString + "T00:00:00").toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric"
        }
      );
    }


    // Item card
    function createItemCard(item) {
      const safeTitle = escapeHTML(item.title);
      const safeCategory = escapeHTML(item.category);
      const safeCampus = escapeHTML(item.campusLabel);
      const safeLocation = escapeHTML(item.locationLabel);

      const imageContent = item.image
        ? `<img src="${escapeHTML(item.image)}"
                alt="${safeTitle}"
                loading="lazy">`
        : `<div class="item-image-placeholder" aria-hidden="true">
             <span>⌕</span>
           </div>`;

      return `
        <article class="item-card">

          <div class="item-image">
            ${imageContent}

            <span class="item-type item-type-${item.type}">
              ${item.type === "lost" ? "Lost" : "Found"}
            </span>
          </div>

          <div class="item-card-content">

            <span class="item-category">${safeCategory}</span>

            <h3>${safeTitle}</h3>

            <p class="item-description">
              ${escapeHTML(item.description)}
            </p>

            <div class="item-meta">
                <span class="item-meta-row">
                    <span class="meta-icon" aria-hidden="true">📍</span>
                    <span>${safeCampus} · ${safeLocation}</span>
                </span>

                <span class="item-meta-row">
                    <span class="meta-icon" aria-hidden="true">📅</span>
                    <span>${formatDate(item.date)}</span>
                </span>
            </div>

            <a href="item_detail.html?id=${encodeURIComponent(item.id)}"
               class="item-details-btn">
              View Details <span aria-hidden="true">↗</span>
            </a>

          </div>
        </article>
      `;
    }


    // Apply all filters
    function getFilteredItems() {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const type = typeFilter.value;
      const campus = campusFilter.value;
      const location = locationFilter.value;
      const days = dateFilter.value;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return items.filter((item) => {
        const searchableText =
          `${item.title} ${item.description}`.toLocaleLowerCase();

        const matchesSearch = searchableText.includes(query);

        const matchesCategory =
          selectedCategory === "all" ||
          item.category === selectedCategory;

        const matchesType =
          type === "all" || item.type === type;

        const matchesCampus =
          campus === "all" || item.campus === campus;

        const matchesLocation =
          location === "all" || item.location === location;

        let matchesDate = true;

        if (days !== "all") {
          const itemDate = new Date(item.date + "T00:00:00");
          const difference =
            (now - itemDate) / (1000 * 60 * 60 * 24);

          matchesDate =
            difference >= 0 && difference <= Number(days);
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesCampus &&
          matchesLocation &&
          matchesDate
        );
      });
    }


    // Sort items
    function sortItems(filteredItems) {
      const sortValue = sortFilter.value;

      return [...filteredItems].sort((a, b) => {
        if (sortValue === "oldest") {
          return a.date.localeCompare(b.date);
        }

        if (sortValue === "az") {
          return a.title.localeCompare(b.title);
        }

        return b.date.localeCompare(a.date);
      });
    }


    // Render pagination
    function renderPagination(totalPages) {
      pagination.innerHTML = "";

      if (totalPages <= 1) {
        pagination.hidden = true;
        return;
      }

      pagination.hidden = false;

      for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = page;
        button.className =
          page === currentPage ? "page-btn active" : "page-btn";

        if (page === currentPage) {
          button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
          currentPage = page;
          renderItems();
        });

        pagination.appendChild(button);
      }
    }


    // Render items
    function renderItems() {
      const filteredItems = sortItems(getFilteredItems());

      const totalPages = Math.ceil(
        filteredItems.length / itemsPerPage
      );

      currentPage = Math.max(
        1,
        Math.min(currentPage, totalPages || 1)
      );

      const startIndex = (currentPage - 1) * itemsPerPage;
      const visibleItems = filteredItems.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      itemsGrid.innerHTML = visibleItems
        .map(createItemCard)
        .join("");

      resultsCount.textContent =
        `Showing ${visibleItems.length} of ${filteredItems.length} items`;

      emptyState.hidden = filteredItems.length !== 0;
      itemsGrid.hidden = filteredItems.length === 0;

      renderPagination(totalPages);
    }


    // Reset pagination when filters change
    function updateResults() {
      currentPage = 1;
      renderItems();
    }


    // Category buttons
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach((categoryButton) => {
          const isActive = categoryButton === button;

          categoryButton.classList.toggle("active", isActive);
          categoryButton.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        });

        updateResults();
      });
    });


    // Search
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateResults();
    });


    // Dropdown filters
    [typeFilter, campusFilter, locationFilter, dateFilter, sortFilter]
      .forEach((filter) => {
        filter.addEventListener("change", updateResults);
      });


    // Clear filters
    function clearFilters() {
      searchInput.value = "";

      typeFilter.value = "all";
      campusFilter.value = "all";
      locationFilter.value = "all";
      dateFilter.value = "all";
      sortFilter.value = "newest";

      selectedCategory = "all";

      categoryButtons.forEach((button) => {
        const isActive = button.dataset.category === "all";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("q");
      window.history.replaceState({}, "", url);

      updateResults();
    }

    document.getElementById("clear-filters")
      .addEventListener("click", clearFilters);

    document.getElementById("empty-clear-btn")
      .addEventListener("click", clearFilters);


    // Initial rendering
    renderItems();
