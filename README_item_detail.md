# UniFynd — Item Detail Page

## 1. Overview

The Item Detail page displays information about a lost or found item. It allows users to contact the listing creator, manage their own listings, and discover potential matches through AI semantic matching.

The frontend is complete and has been tested in the browser. Backend integration is still required.

### Related Files

| File | Purpose |
|---|---|
| `item_detail.html` | Page structure |
| `css/item_detail.css` | Page styling |
| `ts/item_detail.ts` | Page functionality |
| `js/item_detail.js` | Compiled JavaScript |
| `css/base.css` | Shared design system |
| `css/navbar.css` | Shared navigation styling |

The frontend uses HTML5, CSS3, and Vanilla TypeScript.

Modify the TypeScript file instead of the generated JavaScript file. To compile TypeScript, run:

```bash
npx tsc --watch
```

The backend and database technologies have not been finalized.

## 2. Page Navigation and Item Data

The page retrieves the listing ID from the URL.

Normal navigation:

```text
item_detail.html?id=1
```

After successful item creation:

```text
item_detail.html?id=1&created=true
```

The `created=true` parameter triggers the success banner and automatic matching animation for the listing creator.

### Expected Item Data

```json
{
  "id": "1",
  "name": "Wireless Headphones",
  "type": "found",
  "status": "active",
  "category": "Electronics",
  "campus": "Kavacık Kuzey Campus",
  "location": "Library",
  "specificLocation": "Second floor",
  "description": "Black wireless headphones.",
  "itemDate": "2026-11-23",
  "postedDate": "2026-11-24",
  "image": "",
  "ownerId": "101"
}
```

Important requirements:

- `type`: `lost` or `found`.
- `status`: `active` or `returned`.
- Dates currently use the `YYYY-MM-DD` format.
- `ownerId` represents the listing creator.
- Image and specific location are optional.
- Category, campus, and location identifiers must be consistent with the Report Item and Browse Items pages.
- Missing or invalid item IDs should display an appropriate error.

This structure represents the current frontend data model, not a finalized database schema.

## 3. Authentication and User Permissions

The interface changes according to authentication status, listing ownership, item type, and listing status.

### Active Listings

| Action | Guest | Signed-in Visitor | Listing Creator |
|---|---|---|---|
| View item details | Yes | Yes | Yes |
| View AI matches | No | Yes | Yes |
| Send a message | No | Yes | No |
| Edit listing | No | No | Yes |
| Mark as returned | No | No | Yes |

### Returned Listings

- Item details remain accessible.
- New contact requests are disabled.
- Listing management actions are disabled.
- AI matching is closed.
- Returned listings must be excluded from future matching results.

### Authentication Requirements

Replace the simulated `currentUser` object with real authentication data.

Guests are redirected to the login or registration page with a `next` parameter:

```text
login.html?next=...
```

After authentication, users should return to the original item page. Only safe internal redirects should be accepted.

All permissions must be validated on the backend. Frontend visibility controls alone are not sufficient for security.

## 4. Contact and Listing Management

### Contact

- Found listing: **Contact the Finder**
- Lost listing: **Contact the Owner**
- Guest: **Log In to Contact**
- Listing creator: **Manage Your Listing**
- Returned listing: **Successfully Returned!**

The Send a Message button currently displays a placeholder alert. It must be connected to the messaging system.

The backend should create or retrieve a conversation associated with the listing and its participants.

### Ownership Verification

Found listings display an ownership verification notice.

Private verification information collected during item reporting must never appear in public item responses, matching results, or public AI inputs.

The actual verification workflow must be integrated with the messaging system.

### Listing Management

**Edit Listing:** Currently displays a placeholder alert. It must be connected to an editing interface and database update operation.

**Mark as Returned:** Currently changes the listing status temporarily in the frontend. The backend must save this change permanently after validating listing ownership.

Returned listings should not be permanently deleted.

## 5. AI Smart Matching

AI semantic matching is a required core feature of UniFynd.

Its purpose is to identify related lost and found listings based on meaning rather than exact keyword matches.

### Matching Rules

The current prototype:

- Excludes the current listing.
- Matches Lost listings with Found listings and vice versa.
- Includes only active listings.
- Filters candidates by campus and category.
- Sorts candidates by similarity score.
- Displays the top three results.

Campus and category filters, result limits, and similarity thresholds may be adjusted after real AI testing.

### Proposed Matching Method

1. Retrieve eligible candidate listings.
2. Generate semantic embeddings from public item names and descriptions.
3. Calculate cosine similarity.
4. Rank and return relevant matches.

The embedding model and AI provider have not been selected.

Similarity scores represent semantic similarity, not the probability that two listings describe the same physical item.

### Expected Match Data

```json
{
  "id": "2",
  "name": "Black Wireless Headphones",
  "type": "lost",
  "status": "active",
  "category": "Electronics",
  "campus": "Kavacık Kuzey Campus",
  "location": "Library",
  "description": "Black Bluetooth headphones.",
  "date": "2026-11-23",
  "image": "",
  "similarity": 0.94
}
```

The match date corresponds to `itemDate` in the main item data model.

### Matching UI States

| State | Description |
|---|---|
| Locked | User must log in |
| Loading | Matching is in progress |
| Completed | Matching results are available |
| Empty | No potential matches |
| Error | Matching failed; retry available |
| Closed | Listing has been returned |

The current progress bar increases by 25% every 700 milliseconds. This is a simulation, not actual AI processing progress.

Replace it with real matching status information. If measurable progress is unavailable, use an indeterminate loading indicator.

Matching should start automatically after successful item creation. Existing listings should display available results without unnecessarily restarting the matching process.

Guests must not receive matching results from the backend.

## 6. Demo Configuration and Limitations

The `DEMO SETTINGS` section in `item_detail.ts` allows frontend testing without a backend.

| Variable | Available values |
|---|---|
| `DEMO_MODE` | true, false |
| `DEMO_VIEWER` | guest, visitor, owner |
| `DEMO_ITEM_TYPE` | lost, found |
| `DEMO_ITEM_STATUS` | active, returned |
| `DEMO_MATCHING_STATE` | success, empty, error |

The following data sources are hardcoded:

- `demoItem`
- `currentUser`
- `demoMatches`

### Current Limitations

- Authentication and listing ownership are simulated.
- Item data and similarity scores are hardcoded.
- AI matching progress is simulated.
- Returned status resets after refreshing the page.
- Messaging and editing buttons display placeholder alerts.
- Refreshing a URL containing `created=true` restarts the matching animation.
- Lost demo mode may display inconsistent candidate types when opening match details.
- The navbar does not reflect the real authentication state.
- Setting `DEMO_MODE` to `false` does not establish a backend connection.

All demo settings and hardcoded data must be removed or replaced before production.

## 7. Backend Integration Points

### Main TypeScript Functions

| Function | Integration requirement |
|---|---|
| `loadItem()` | Retrieve item data from the backend |
| `isListingOwner()` | Use authenticated user information |
| `setupMessageButton()` | Connect messaging |
| `setupManagementActions()` | Connect editing and status updates |
| `initializeMatching()` | Retrieve matching status |
| `startMatching()` | Connect real AI processing |
| `getPotentialMatches()` | Replace demo results with real matches |
| `showMatchingOutcome()` | Handle backend matching responses |
| `setupRetryMatching()` | Retry failed matching requests |

Existing rendering functions and UI components can be reused.

### Suggested API Endpoints

These endpoints are proposals, not finalized API contracts.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/items/{id}` | Retrieve item details |
| GET | `/api/auth/me` | Retrieve authenticated user |
| PATCH | `/api/items/{id}` | Edit listing |
| PATCH | `/api/items/{id}/status` | Update listing status |
| GET | `/api/items/{id}/matches` | Retrieve matching results and status |
| POST | `/api/items/{id}/matches` | Request or retry matching |
| POST | `/api/conversations` | Create or retrieve conversation |

The backend must validate authentication, ownership, listing status, and access permissions for all protected operations.

## 8. Testing and Integration Checklist

The frontend developer successfully completed 23 manual browser tests covering user permissions, listing states, AI matching states, navigation, responsive behavior, and match card design.

These tests validate the frontend prototype only.

### Remaining Tasks

- [ ] Connect real item data and image storage.
- [ ] Implement authentication and server-side authorization.
- [ ] Connect login and registration redirects.
- [ ] Update navbar authentication state.
- [ ] Connect messaging and ownership verification.
- [ ] Implement listing editing.
- [ ] Persist returned status.
- [ ] Integrate real AI semantic matching.
- [ ] Connect matching results and processing status.
- [ ] Prevent duplicate matching jobs.
- [ ] Implement API error and retry handling.
- [ ] Connect Report Item redirection.
- [ ] Remove demo settings and hardcoded data.
- [ ] Perform end-to-end and security testing.

**Current status:** Frontend completed and tested. Backend and real AI integration pending.

The existing UI design and functionality should be preserved during backend integration.