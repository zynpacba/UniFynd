# UniFynd – Login & Register Pages

## 1. Files

- `login.html` – User login page.
- `register.html` – User registration page.
- `css/auth.css` – Shared authentication page styles.
- `css/base.css` – Global styles and color variables.

Both pages use HTML, CSS and inline SVG. No JavaScript or TypeScript is required.

## 2. Form Fields

| Field Name | Type | Login | Register |
|---|---|---|---|
| `full_name` | text | No | Required |
| `email` | email | Required | Required |
| `password` | password | Required | Required |
| `confirm_password` | password | No | Required |

Both forms use `method="post"`. The form `action` attributes must be added during backend integration.

## 3. Existing Frontend Validation

- Required field validation.
- Email format validation.
- Minimum 8-character password for registration.
- Password masking.

## 4. Backend Requirements

**Registration:**
- Validate all submitted fields.
- Check whether the email is already registered.
- Verify that both passwords match.
- Securely hash passwords before storing them.
- Create the user account.
- Handle successful registration and error messages.

**Login:**
- Verify email and password.
- Manage user authentication and sessions securely.
- Redirect authenticated users to the user dashboard.
- Display an error message for invalid credentials.

**General:**
- Implement logout functionality.
- Update navigation based on authentication status.
- Protect pages and actions that require authentication.
- Implement server-side validation, HTTPS and appropriate CSRF protection.

## 5. Current Status

- Frontend design: Completed.
- Responsive design: Implemented.
- Backend integration: Pending.
- Authentication endpoints: Not defined.
- Backend and database technologies: Not finalized.


# Landing Page — UniFynd

## Overview

The public entry page of UniFynd. Users can browse and search for lost and found items without authentication. Login is required to report an item.

## Main Features

- **Search Bar:** Sends the search query to `browse_items.html` using the GET parameter `q`.
- **I Lost Something:** Redirects to `browse_items.html`.
- **I Found Something:** Redirects to `report_item.html`.
- **Recently Reported Items:** Displays three sample lost/found item cards.
- **Navigation:** Home, Browse Items, How It Works, Log In and Sign Up.
- **Responsive Navbar:** Mobile menu toggle.

## Backend Integration Required

- Replace sample item cards with the three most recently reported items from the database.
- Each item card should display its title, Lost/Found status, location, category and image.
- Handle the search query on the Browse Items page.
- Require authentication before submitting an item report.
- Replace Log In and Sign Up with Dashboard and Log Out for authenticated users.
- Connect navigation links to the corresponding application routes.

## Related Files

| File | Purpose |
|---|---|
| `landing_page.html` | Page structure |
| `base.css` | Global styles |
| `navbar.css` | Shared navigation styles |
| `landing.css` | Landing page styles |
| `landing.js` | Mobile menu and automatic footer year |

## Current Status

Frontend implemented. Database connection, authentication and backend integration are pending. The AI matching illustration is for demonstration purposes only.


# Report Item Page

## 1. Overview

The Report Item page allows users to create lost or found item reports. After successful submission, users should be redirected to the Item Detail page, where AI Semantic Matching results will be displayed.

## 2. Related Files

- `report_item.html`
- `css/report_item.css`
- `ts/report_item.ts`
- `js/report_item.js` (compiled from TypeScript)

## 3. Form Fields

| Field Name | Data Type | Required | Validation |
|---|---|---|---|
| `type` | String | Yes | `lost` or `found` |
| `title` | String | Yes | Max. 100 characters |
| `category` | String | Yes | Predefined values |
| `description` | String | Yes | Max. 1000 characters |
| `campus` | String | Yes | Predefined values |
| `location` | String | Yes | Predefined values |
| `specific_location` | String | No | Max. 150 characters |
| `event_date` | Date | Yes | YYYY-MM-DD, no future dates |
| `photo` | File | No | JPG, PNG, WEBP; max. 5 MB |
| `verification_details` | String | No | Max. 500 characters; found items only |

## 4. Allowed Values

**Category:** `electronics`, `documents`, `accessories`, `clothing`, `other`

**Campus:** `kavacik-kuzey`, `kavacik-guney`, `halic`

**Location:** `library`, `classroom`, `lecture-hall`, `cafeteria`, `dining-area`, `laboratory`, `copy-center`, `conference-hall`, `store`, `other`

## 5. Implemented Frontend Features

- Dynamic Lost/Found report selection.
- Description character counter.
- Required field and date validation.
- Single photo upload with drag-and-drop, preview and removal.
- File type and size validation.
- Conditional Ownership Verification section for found items.
- Form validation and error messages.
- FormData creation for API integration.

## 6. Backend Requirements

- Require user authentication before creating a report.
- Accept POST requests using `multipart/form-data`.
- Repeat all frontend validation rules on the server side.
- Generate a unique item ID.
- Associate the report with the authenticated user.
- Store the report, creation timestamp and optional photo.
- Set the initial report status to active.
- Keep `verification_details` private and exclude it from public API responses.
- Trigger AI Semantic Matching after successful report creation.
- Return the created item ID for redirection to `item_detail.html?id=ITEM_ID`.
- Return appropriate success and error responses.

## 7. Integration Point

In `report_item.ts`, the `createFormData()` function prepares the request data. The API request should be implemented inside the form submission event listener, after FormData creation.

Modify the TypeScript source rather than the compiled JavaScript file.

## 8. Current Status

**Frontend:** Implemented.

**Backend:** Pending.

The form currently validates and prepares data but does not send an API request, save reports, redirect users or perform AI matching. API endpoints and response formats are not yet defined.


# UniFynd – Browse Items Page

## Overview

The Browse Items page allows both guests and registered users to browse and search lost and found listings without requiring authentication.

## Features

- Dynamic lost and found item cards.
- Search by item title or description.
- Category filtering: Electronics, Documents, Accessories, Clothing and Other.
- Listing type filtering: Lost / Found.
- Campus filtering: Kavacık Kuzey, Kavacık Güney and Haliç.
- Building / Location filtering.
- Date filtering: Last 7, 30 or 90 days.
- Sorting: Newest First, Oldest First and Name A–Z.
- Pagination (6 items per page).
- Result counter, Clear Filters button and empty result state.
- View Details redirects to `item_detail.html?id={id}`.
- Report an Item redirects to `report_item.html`.
- Responsive design.

## Expected Item Data

| Field | Data Type |
|---|---|
| `id` | Number |
| `title` | String |
| `description` | String |
| `type` | `lost` / `found` |
| `category` | String |
| `campus` | String |
| `campusLabel` | String |
| `location` | String |
| `locationLabel` | String |
| `date` | YYYY-MM-DD |
| `image` | URL / null |

## Backend Integration Requirements

- Replace temporary sample listings with real database records through an API.
- Support combined search, filtering, sorting and pagination.
- Return the total number of matching listings.
- Use consistent category, campus and location values across Browse Items and Report Item pages.
- Allow public access to listings without authentication.
- Require authentication for reporting items and accessing AI Matching.

## Current Status

The frontend prototype uses temporary sample data and client-side filtering. API integration and authentication are pending. API endpoints and the final data structure will be agreed upon with the backend developer.



# UniFynd - Profile 

## 1. Overview

The Profile Page is a personal dashboard where users can manage their lost and found listings, review AI matches, and check recent activities.

## 2. Related Files

- `profile.html` – Page structure and content.
- `profile.css` – Page-specific styling and responsive design.
- `profile.ts` – Client-side functionality.
- `profile.js` – Compiled TypeScript file.
- `base.css` and `navbar.css` – Shared styles.

## 3. Implemented Features

- **Navbar:** Navigation links, Create New Item button, and notification popup.
- **Sidebar:** User information and account navigation.
- **Statistics:** Total, Active, and Returned listing counts update automatically when listing statuses change.
- **Listing Filters:** Combined filtering by item type (All Items, Lost, Found) and status (All Statuses, Active, Returned).
- **Empty State:** Displays a message and Clear Filters button when no listings match.
- **Status Management:** Active (blue) and Returned (green) with dynamic color changes.
- **Delete Confirmation:** Opens a confirmation modal and captures the selected item ID.
- **AI Matches:** Displays sample matches and similarity scores.
- **Recent Activity:** Displays sample notifications.
- **Responsive Design:** Supports desktop, tablet, and mobile layouts.

## 4. Navigation Parameters

| Action | Destination |
|---|---|
| Create New Item | `report_item.html` |
| View | `item_detail.html?id=1` |
| Edit | `report_item.html?mode=edit&id=1` |
| Review AI Match | `item_detail.html?id=5` |

The IDs are sample values and must be assigned dynamically during backend integration.

## 5. Backend Requirements (Rami)

- Retrieve authenticated user information and personal listings.
- Implement authentication, authorization, and Log Out.
- Retrieve item images and listing details.
- Pre-fill the Report Item form when `mode=edit` is provided.
- Save listing updates and status changes to the database.
- Implement deletion using `data-item-id`. Remove the listing and refresh statistics and AI matches after successful deletion.
- Connect the AI semantic matching system and display actual similarity scores.
- Retrieve notifications and synchronize both Recent Activity sections.
- Protect private ownership verification details and prevent unauthorized listing modifications.

## 6. Development Status

- Frontend structure and styling: Completed.
- Client-side functionality: Implemented.
- Sample images and final browser testing: Pending.
- Backend and database integration: Pending.
- AI matching integration: Pending.

Compile `profile.ts` into `js/profile.js` before running the page.


# UniFynd — Profile Settings Page

## Overview

The Profile Settings page allows authenticated users to manage their personal information, university and campus details, and account password.

## Files

- `profile_settings.html` — Page structure and forms.
- `css/profile_settings.css` — Page styling and responsive layout.
- `ts/profile_settings.ts` — Client-side interactions and form validation.
- `js/profile_settings.js` — Compiled JavaScript.
- `assets/header.png` — Reusable campus header illustration.

## Features

- Account information management.
- University and campus selection.
- Password change form.
- Show/hide password functionality.
- Required field and email format validation.
- Minimum password length and password matching validation.
- Active sidebar navigation.
- Native notification popover.
- Responsive design.

## Dependencies

- `base.css`
- `navbar.css`
- `profile.css`
- Lucide Icons
- Google Fonts (DM Sans and Inter)

## Backend Integration — TODO

- Implement authentication and access control.
- Retrieve and update user account information.
- Verify the current password and securely update the password.
- Implement email change verification.
- Retrieve university, campus, and notification data from the database.
- Perform server-side validation and return appropriate success or error responses.

## Current Status

Frontend implementation is prepared. Account information and notifications currently use sample data. Form validation is implemented, but account and password changes require backend integration.

TypeScript compilation and browser testing are pending.

# 404 — Page Not Found

The 404 page provides a user-friendly error screen when users attempt to access a non-existent page. Its design reflects UniFynd's campus-focused lost-and-found concept.

### Features

- Custom 404 error message and campus-themed illustration.
- Navigation options based on the user's authentication status.
- Responsive design for desktop, tablet, and mobile devices.
- CSS-only mobile navigation.
- Notification popover for authenticated users.
- Consistent colors, typography, and branding.

### Related Files

- `404.html` — Page structure.
- `css/404.css` — Page-specific styling.
- `css/base.css` — Shared styles and design variables.
- `css/navbar.css` — Shared navigation styles.
- `assets/404.png` — Custom error page illustration.

### Technical Notes

No JavaScript is required for this page.

Authentication-based navigation, real notification data, and HTTP 404 error handling will be implemented during backend integration.


# Help & FAQ Page

**Files:** `help_faq.html`, `help_faq.css`

The Help & FAQ page provides answers to frequently asked questions and allows users to contact the UniFynd support team. It is accessible to both guests and registered users.

**Features:**
- Interactive FAQ accordion with seven questions.
- Information about item reporting, AI matching, ownership verification, privacy, and listing statuses.
- Help and support section with email contact functionality.
- Custom FAQ and Help illustrations.
- Responsive design for desktop, tablet, and mobile devices.
- Navigation structure prepared for authentication and notifications.

**Technical Details:**
- Developed using HTML5 and CSS3.
- Uses native HTML accordion functionality without JavaScript or TypeScript.
- Reuses `base.css` and `navbar.css`.
- Uses `faq.png` and `help.png` from the assets folder.

**Pending Tasks:**
- Update the official support email address.
- Integrate authentication and notification functionality.
- Verify protected page redirection and browser compatibility.

**Status:** Frontend completed — backend integration and testing pending.


# About Us Page

**Status:** Frontend completed.

**Files:**
- `about_us.html`
- `css/about_us.css`
- `assets/about-us.png`

**Features:**
- Project introduction, mission, and vision.
- Campus-focused approach, AI semantic matching,
  privacy, and ownership verification.
- Four-step How It Works guide.
- Section navigation and back-to-top links.
- Responsive design and custom illustration.
- Guest and authenticated navbar layouts.

**Pending:**
- Authentication and notification integration.
- Final browser and responsive testing.


