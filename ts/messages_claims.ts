/* ==================================================
   UNIFYND — MESSAGES & CLAIMS
   ================================================== */

/* ==================== TYPES ==================== */
type Tab = "chats" | "requests";
type Direction = "incoming" | "sent";
type Status = "pending" | "approved" | "declined" | "cancelled";

interface Item {
  id: number;
  name: string;
  type: "found" | "lost";
  image: string;
  location: string;
  date: string;
  isOwner: boolean;
  returned: boolean;
}

interface Message {
  text: string;
  direction: "sent" | "received";
  time: string;
  date: string;
}

interface Conversation {
  id: number;
  itemId: number;
  user: string;
  note: string;
  messages: Message[];
}

interface Claim {
  id: number;
  itemId: number;
  user: string;
  direction: Direction;
  status: Status;
  date: string;
  note: string;
  conversationId?: number;
}

/* ==================== MOCK DATA ==================== */
const items: Item[] = [
  {
    id: 101,
    name: "Black Wireless Earbuds",
    type: "found",
    image: "images/items/earbuds.jpg",
    location: "Kavacik South Campus · Library",
    date: "Nov 24, 2026",
    isOwner: true,
    returned: false
  },
  {
    id: 102,
    name: "Blue Water Bottle",
    type: "found",
    image: "images/items/water-bottle.jpg",
    location: "Kavacik South Campus · Cafeteria",
    date: "Nov 25, 2026",
    isOwner: true,
    returned: false
  },
  {
    id: 103,
    name: "Student ID Card",
    type: "found",
    image: "images/items/student-card.jpg",
    location: "Kavacik North Campus · Library",
    date: "Nov 26, 2026",
    isOwner: false,
    returned: false
  },
  {
    id: 104,
    name: "Grey Backpack",
    type: "found",
    image: "images/items/backpack.jpg",
    location: "Kavacik South Campus · Study Area",
    date: "Nov 23, 2026",
    isOwner: false,
    returned: false
  },
  {
    id: 105,
    name: "Silver Keys",
    type: "found",
    image: "images/items/keys.jpg",
    location: "Kavacik North Campus · Entrance",
    date: "Nov 22, 2026",
    isOwner: false,
    returned: false
  }
];

const conversations: Conversation[] = [
  {
    id: 1001,
    itemId: 101,
    user: "Aylin Demir",
    note: "I lost my black earbuds last week.",
    messages: [
      {
        text: "Hi! I think these earbuds might belong to me.",
        direction: "received",
        time: "14:10",
        date: "November 27, 2026"
      },
      {
        text: "Could you describe the charging case?",
        direction: "sent",
        time: "14:18",
        date: "November 27, 2026"
      },
      {
        text: "The case has a small scratch. Would you be available to meet tomorrow?",
        direction: "received",
        time: "14:25",
        date: "November 27, 2026"
      }
    ]
  },
  {
    id: 1002,
    itemId: 102,
    user: "Aylin Demir",
    note: "I lost a blue water bottle near the cafeteria.",
    messages: [
      {
        text: "I think this might be mine...",
        direction: "received",
        time: "11:03",
        date: "November 27, 2026"
      }
    ]
  },
  {
    id: 1003,
    itemId: 105,
    user: "Deniz Kaya",
    note: "There is a small blue keychain attached.",
    messages: []
  }
];

const requests: Claim[] = [
  {
    id: 501,
    itemId: 101,
    user: "Elif Yilmaz",
    direction: "incoming",
    status: "pending",
    date: "November 27, 2026",
    note: "I lost my earbuds in the library. The case has a small scratch."
  },
  {
    id: 502,
    itemId: 102,
    user: "Mert Kaya",
    direction: "incoming",
    status: "pending",
    date: "November 26, 2026",
    note: "My bottle has a small sticker underneath."
  },
  {
    id: 503,
    itemId: 103,
    user: "Elif Yilmaz",
    direction: "sent",
    status: "pending",
    date: "November 27, 2026",
    note: "I lost my student ID near the library."
  },
  {
    id: 504,
    itemId: 104,
    user: "Can Aksu",
    direction: "sent",
    status: "declined",
    date: "November 25, 2026",
    note: "I believe this backpack belongs to me."
  },
  {
    id: 505,
    itemId: 105,
    user: "Deniz Kaya",
    direction: "sent",
    status: "approved",
    date: "November 24, 2026",
    note: "There is a small blue keychain attached.",
    conversationId: 1003
  }
];

/* ==================== HELPERS ==================== */
function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function setText(id: string, text: string): void {
  $(id).textContent = text;
}

function show(id: string, visible: boolean): void {
  $(id).hidden = !visible;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getItem(id: number): Item {
  return items.find(item => item.id === id)!;
}

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ==================== APPLICATION STATE ==================== */
let activeTab: Tab = "chats";
let activeDirection: Direction = "incoming";
let selectedChatId: number | null = null;
let selectedRequestId: number | null = null;

const searchInput = $("conversationSearch") as HTMLInputElement;
const messageInput = $("messageInput") as HTMLInputElement;

/* ==================== TAB NAVIGATION ==================== */
function switchTab(tab: Tab): void {
  activeTab = tab;
  searchInput.value = "";

  selectedChatId = null;
  selectedRequestId = null;

  document.querySelectorAll<HTMLButtonElement>(".inbox-tab").forEach(button => {
    const active = button.dataset.tab === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  show("requestTabs", tab === "requests");

  if (tab === "requests") {
    switchDirection(activeDirection);
    return;
  }

  showEmptyDetail();
  renderLists();
  mobileView("inbox");
}


function switchDirection(direction: Direction): void {
  activeDirection = direction;
  searchInput.value = "";
  selectedRequestId = null;

  document.querySelectorAll<HTMLButtonElement>(".request-tab").forEach(button => {
    const active = button.dataset.filter === direction;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  show("incomingRequestList", direction === "incoming");
  show("sentRequestList", direction === "sent");

  showEmptyDetail();
  renderLists();
  mobileView("inbox");
}


/* ==================== RENDER LISTS ==================== */
function renderLists(): void {
  const query = searchInput.value.toLowerCase().trim();

  function matches(itemId: number): boolean {
    return getItem(itemId).name.toLowerCase().includes(query);
  }

  const filteredChats = conversations.filter(chat => matches(chat.itemId));

  $("chatList").innerHTML = filteredChats
    .map(chat => {
      const item = getItem(chat.itemId);
      const lastMessage = chat.messages[chat.messages.length - 1];
      const preview = item.returned
        ? "Item returned · Conversation closed"
        : lastMessage?.text ?? "Start a conversation.";

      return `
        <button type="button" class="conversation-card ${chat.id === selectedChatId ? "is-selected" : ""}" data-item-id="${item.id}" data-conversation-id="${chat.id}" aria-pressed="${chat.id === selectedChatId}">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" class="conversation-image">
          <div class="conversation-info">
            <div class="conversation-top">
                <h3>${escapeHTML(item.name)}</h3>
                ${item.returned
                    ? '<span class="status-badge status-returned">Closed</span>'
                    : `<time>${escapeHTML(lastMessage?.time ?? "")}</time>`
                }
            </div>
            <p class="conversation-user">
              <i class="fa-regular fa-user"></i>
              ${escapeHTML(chat.user)}
            </p>
            <p class="conversation-preview">${escapeHTML(preview)}</p>
          </div>
        </button>
      `;
    })
    .join("");

  /* Incoming and Sent Request Lists */
  const directions: Direction[] = ["incoming", "sent"];

  directions.forEach(direction => {
    const filteredRequests = requests.filter(
      request => request.direction === direction && matches(request.itemId)
    );

    const container = direction === "incoming" ? $("incomingRequestList") : $("sentRequestList");

    container.innerHTML =
      filteredRequests
        .map(request => {
          const item = getItem(request.itemId);
          const date = new Date(request.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          });

          return `
            <button type="button" class="conversation-card request-card ${request.id === selectedRequestId ? "is-selected" : ""}" data-item-id="${item.id}" data-request-id="${request.id}" data-direction="${request.direction}" data-status="${request.status}" aria-pressed="${request.id === selectedRequestId}">
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" class="conversation-image">
              <div class="conversation-info">
                <h3 class="request-item-name">${escapeHTML(item.name)}</h3>
                <p class="conversation-user">
                  <i class="fa-regular fa-user"></i>
                  ${escapeHTML(request.user)}
                </p>
                <div class="request-card-bottom">
                  <span class="status-badge status-${request.status}">${capitalize(request.status)}</span>
                  <time>${escapeHTML(date)}</time>
                </div>
              </div>
            </button>
          `;
        })
        .join("");
  });

  /* Empty State */
  const visibleCount =
    activeTab === "chats"
      ? filteredChats.length
      : requests.filter(request => request.direction === activeDirection && matches(request.itemId)).length;

  show("emptyListState", visibleCount === 0);
  show("chatList", activeTab === "chats" && visibleCount > 0);
  show("requestList", activeTab === "requests" && visibleCount > 0);
  setText("emptyListMessage", "No matching found.");

  updateCounts();
}

function showDetail(panel: "chat" | "request" | "empty"): void {
  show("chatPanel", panel === "chat");
  show("requestPanel", panel === "request");
  show("emptyDetailPanel", panel === "empty");
}

/* ==================== ITEM INFORMATION ==================== */
function updateItemDetails(
  prefix: "chat" | "request",
  item: Item,
  user: string,
  note: string
): void {
  setText(`${prefix}ItemName`, item.name);
  setText(prefix === "chat" ? "chatUserInfo" : "requestUserName", user);
  if (prefix === "request") {setText("requestSummaryTitle", item.name);}
  setText(`${prefix}ItemLocation`, item.location);
  setText(`${prefix}ItemDate`, `${capitalize(item.type)} on ${item.date}`);
  setText(`${prefix}VerificationNote`, note || "No verification note provided.");

  const badge = $(`${prefix}ItemType`);
  badge.textContent = capitalize(item.type);
  badge.className = `item-badge item-${item.type}`;

  const image = $(`${prefix}ItemImage`) as HTMLImageElement;
  image.src = item.image;
  image.alt = item.name;

  const link = $(`${prefix}ListingLink`) as HTMLAnchorElement;
  link.href = `item_detail.html?id=${item.id}`;
}

/* ==================== ACTIVE CHAT ==================== */
function selectChat(id: number, openMobile = true): void {
  const chat = conversations.find(chat => chat.id === id);
  if (!chat) return;

  selectedChatId = id;
  const item = getItem(chat.itemId);

  showDetail("chat");

  updateItemDetails("chat", item, chat.user, chat.note);

    show("markReturnedButton", item.isOwner && !item.returned);
    show("chatFooter", !item.returned);
    show("returnedState", item.returned);

    messageInput.disabled = item.returned;

    const sendButton = $("messageForm")
    .querySelector("button[type=submit]") as HTMLButtonElement;

    sendButton.disabled = item.returned;

    messageInput.value = "";

  renderMessages(chat);
  renderLists();

  if (openMobile) {
    mobileView("chat");
  }
}

/* ==================== MESSAGE HISTORY ==================== */
function renderMessages(chat: Conversation): void {
  const body = $("chatBody");
  const item = getItem(chat.itemId);

  body.innerHTML = `
    <div class="system-message">
      <i class="fa-solid fa-circle-check"></i>
      ${item.returned ? "This conversation is closed." : "Request approved. You can now communicate about this item."}
    </div>
  `;

  let previousDate = "";

  chat.messages.forEach(message => {
    if (message.date !== previousDate) {
      body.insertAdjacentHTML(
        "beforeend",
        `
          <div class="message-date">
            <span>${escapeHTML(message.date)}</span>
          </div>
        `
      );
      previousDate = message.date;
    }

    const avatar = `
      <div class="message-avatar">
        <i class="fa-solid fa-user"></i>
      </div>
    `;

    const content = `
      <div class="message-content">
        <div class="message-bubble">${escapeHTML(message.text)}</div>
        <time>${escapeHTML(message.time)}</time>
      </div>
    `;

    body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="message-row ${message.direction}">
          ${message.direction === "received" ? avatar + content : content + avatar}
        </div>
      `
    );
  });

  body.scrollTop = body.scrollHeight;
}

/* ==================== REQUEST DETAILS ==================== */
function selectRequest(id: number, openMobile = true): void {
  const request = requests.find(request => request.id === id);
  if (!request) return;

  selectedRequestId = id;
  const item = getItem(request.itemId);

  showDetail("request");

  updateItemDetails("request", item, request.user, request.note);

  setText("requestPersonLabel", request.direction === "incoming" ? "Requested by" : "Sent to");
  setText("requestPerson", request.user);
  setText("requestDate", request.date);
  setText("requestType", item.type === "found" ? "Ownership Claim" : "Contact Request");
  setText(
    "requestDirection",
    request.direction === "incoming" ? "Incoming Request" : "Sent Request"
  );

  const badge = $("requestHeaderStatus");
  badge.textContent = item.returned ? "Closed" : capitalize(request.status);
  badge.className = item.returned
    ? "status-badge status-returned"
    : `status-badge status-${request.status}`;

  renderRequestStatus(request, item);
  renderLists();

  if (openMobile) {
    mobileView("request");
  }
}

/* ==================== REQUEST STATUS ==================== */
function renderRequestStatus(request: Claim, item: Item): void {
  const actionSections = [
    "incomingPendingActions",
    "sentPendingActions",
    "approvedRequestActions",
    "declinedRequestActions",
    "cancelledRequestActions",
    "closedRequestActions"
  ];

  actionSections.forEach(id => show(id, false));

  let title = "";
  let description = "";
  let icon = "";
  let action = "";
  let iconClass = "";

  if (item.returned) {
    title = "Listing Closed";
    description = "This item has already been returned.";
    icon = "fa-solid fa-lock";
    action = "closedRequestActions";
    iconClass = "is-cancelled";
  } else if (request.status === "pending") {
    if (request.direction === "incoming") {
      title = item.type === "found" ? "New Ownership Request" : "New Contact Request";
      description = "Review the verification note before approving.";
      icon = "fa-solid fa-user-clock";

      if (item.isOwner) {
        action = "incomingPendingActions";
      }
    } else {
      title = "Waiting for Approval";
      description = "The listing owner has not responded yet.";
      icon = "fa-regular fa-clock";
      action = "sentPendingActions";
    }
  } else if (request.status === "approved") {
    title = "Request Approved";
    description = "You can now communicate about this item.";
    icon = "fa-solid fa-circle-check";
    action = "approvedRequestActions";
    iconClass = "is-approved";
  } else if (request.status === "declined") {
    title = "Request Declined";
    description = "Messaging is not available for this request.";
    icon = "fa-regular fa-circle-xmark";
    action = "declinedRequestActions";
    iconClass = "is-declined";
  } else {
    title = "Request Cancelled";
    description = "This request is no longer active.";
    icon = "fa-solid fa-ban";
    action = "cancelledRequestActions";
    iconClass = "is-cancelled";
  }

  setText("requestStatusTitle", title);
  setText("requestStatusDescription", description);
  $("requestStatusIcon").className = `request-status-icon ${iconClass}`;
  $("requestStatusIcon").innerHTML = `<i class="${icon}"></i>`;

  if (action) {
    show(action, true);
  }
}

/* ==================== REQUEST ACTIONS ==================== */
function changeRequestStatus(status: Status): void {
  if (activeTab !== "requests") return;

  const request = requests.find(request => request.id === selectedRequestId);
  if (!request || request.status !== "pending") return;

  const item = getItem(request.itemId);
  if (item.returned) return;

  // Only the listing owner can approve or decline.
  if (status === "approved" || status === "declined") {
    if (request.direction !== "incoming" || !item.isOwner) {
      return;
    }
  }

  // Only the sender can cancel a request.
  if (status === "cancelled" && request.direction !== "sent") {
    return;
  }

  const action =
    status === "approved" ? "approve" : status === "declined" ? "decline" : "cancel";

  if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
    return;
  }

  request.status = status;

  // Create a conversation after approval.
  if (status === "approved" && request.conversationId === undefined) {
    const conversationId = Math.max(1000, ...conversations.map(chat => chat.id)) + 1;

    conversations.unshift({
      id: conversationId,
      itemId: request.itemId,
      user: request.user,
      note: request.note,
      messages: []
    });

    request.conversationId = conversationId;
  }

  selectRequest(request.id, false);
}

/* ==================== OPEN CONVERSATION ==================== */
function openConversation(): void {
  const request = requests.find(request => request.id === selectedRequestId);

  if (
    !request ||
    request.status !== "approved" ||
    request.conversationId === undefined ||
    getItem(request.itemId).returned
  ) {
    return;
  }

  switchTab("chats");
  selectChat(request.conversationId);
}

/* ==================== SEND MESSAGE ==================== */
function sendMessage(event: Event): void {
  event.preventDefault();

  if (activeTab !== "chats") return;

  const chat = conversations.find(chat => chat.id === selectedChatId);
  const text = messageInput.value.trim();

  if (!chat || !text || text.length > 2000) return;
  if (getItem(chat.itemId).returned) return;

  const now = new Date();

  chat.messages.push({
    text,
    direction: "sent",
    time: now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    date: now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  });

  // Move the conversation to the top.
  conversations.splice(conversations.indexOf(chat), 1);
  conversations.unshift(chat);

  messageInput.value = "";
  renderMessages(chat);
  renderLists();
  messageInput.focus();
}

/* ==================== MARK AS RETURNED ==================== */
function markAsReturned(): void {
  if (activeTab !== "chats") return;

  const chat = conversations.find(chat => chat.id === selectedChatId);
  if (!chat) return;

  const item = getItem(chat.itemId);
  if (!item.isOwner || item.returned) return;

  if (!window.confirm("Mark this item as returned?")) return;

  item.returned = true;

  // Cancel pending requests for the returned item.
  requests.forEach(request => {
    if (request.itemId === item.id && request.status === "pending") {
      request.status = "cancelled";
    }
  });

  selectChat(chat.id, false);
}

/* ==================== COUNTERS ==================== */
function updateCounts(): void {
  const chatCount = conversations.length;

  const incomingCount = requests.filter(
    request => request.direction === "incoming"
  ).length;

  const sentCount = requests.filter(
    request => request.direction === "sent"
  ).length;

  setText("chatCount", String(chatCount));

  setText("requestCount", String(incomingCount + sentCount));

  setText(
    "incomingRequestCount",
    `${incomingCount} ${incomingCount === 1 ? "request" : "requests"}`
  );

  setText(
    "sentRequestCount",
    `${sentCount} ${sentCount === 1 ? "request" : "requests"}`
  );
}


/* ==================== EMPTY DETAIL ==================== */

function showEmptyDetail(): void {
  showDetail("empty");

  const isChat = activeTab === "chats";

  setText(
    "emptyDetailTitle",
    isChat ? "Select a Conversation" : "Select a Request"
  );

  setText(
    "emptyDetailDescription",
    isChat
      ? "Choose a conversation from your inbox to view messages and reconnect with your campus community."
      : "Select an incoming or sent request to view its details and current status."
  );
}


/* ==================== MOBILE NAVIGATION ==================== */
function mobileView(view: "inbox" | "chat" | "request"): void {
  const layout = $("messagesLayout");

  layout.classList.remove("is-inbox-open", "is-chat-open", "is-request-open");
  layout.classList.add(`is-${view}-open`);
}

/* ==================== EVENT LISTENERS ==================== */

// Active Chats / Requests
document.querySelectorAll<HTMLButtonElement>(".inbox-tab").forEach(button => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab as Tab);
  });
});

// Incoming / Sent Requests
document.querySelectorAll<HTMLButtonElement>(".request-tab").forEach(button => {
  button.addEventListener("click", () => {
    switchDirection(button.dataset.filter as Direction);
  });
});

// Conversation and Request Cards
$("messagesLayout").addEventListener("click", event => {
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLButtonElement>(".conversation-card");

  if (!card) return;

  if (card.dataset.requestId) {
    selectRequest(Number(card.dataset.requestId));
  } else if (card.dataset.conversationId) {
    selectChat(Number(card.dataset.conversationId));
  }
});

// Search
searchInput.addEventListener("input", renderLists);

// Request Actions
$("approveRequestButton").addEventListener("click", () => {
  changeRequestStatus("approved");
});

$("declineRequestButton").addEventListener("click", () => {
  changeRequestStatus("declined");
});

$("cancelRequestButton").addEventListener("click", () => {
  changeRequestStatus("cancelled");
});

$("openConversationButton").addEventListener("click", openConversation);

// Send Message
$("messageForm").addEventListener("submit", sendMessage);

// Mark as Returned
$("markReturnedButton").addEventListener("click", markAsReturned);

// Mobile Back Buttons
document.querySelectorAll(".mobile-back-button").forEach(button => {
  button.addEventListener("click", () => {
    mobileView("inbox");
  });
});

/* ==================== INITIALIZE ==================== */
switchTab("chats");

export {};