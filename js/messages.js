// KwikConnectHub - Messages Page JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  STATE
    // ══════════════════════════════
    let activeConvId    = null;
    let conversations   = [];
    let isMobileView    = window.innerWidth <= 768;

    // ══════════════════════════════
    //  AVATAR DROPDOWN
    // ══════════════════════════════
    const navAvatarWrap  = document.getElementById('navAvatarWrap');
    const avatarDropdown = document.getElementById('avatarDropdown');

    navAvatarWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => avatarDropdown.classList.add('hidden'));

    // ══════════════════════════════
    //  LOAD USER PROFILE
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadProfile() {
        // TODO: GET /api/user/profile
        // const res  = await fetch('/api/user/profile');
        // const data = await res.json();
        // document.getElementById('navAvatar').textContent    = data.initials;
        // document.getElementById('navAvatarName').textContent = data.firstName;
    }

    // ══════════════════════════════
    //  LOAD CONVERSATIONS
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadConversations() {
        // TODO: GET /api/messages/conversations
        // const res  = await fetch('/api/messages/conversations');
        // const data = await res.json();
        // conversations = data.conversations;
        // renderConversations(conversations);

        // Show empty state until API is connected
        renderConversations([]);
    }

    function renderConversations(convs) {
        const list  = document.getElementById('convList');
        const empty = document.getElementById('convEmpty');

        if (!convs || convs.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        list.innerHTML = convs.map(conv => `
            <div class="conv-item ${conv.id === activeConvId ? 'active' : ''}"
                 data-id="${conv.id}" onclick="openConversation('${conv.id}')">
                <div class="conv-avatar">
                    ${conv.avatar ? `<img src="${conv.avatar}" alt="${conv.name}">` : conv.initials || conv.name?.charAt(0) || '?'}
                    ${conv.online ? '<span class="online-badge"></span>' : ''}
                </div>
                <div class="conv-body">
                    <div class="conv-name">${conv.name}</div>
                    <div class="conv-preview ${conv.unread ? 'unread' : ''}">${conv.lastMessage || 'No messages yet'}</div>
                </div>
                <div class="conv-meta">
                    <span class="conv-time">${conv.time || ''}</span>
                    ${conv.unread ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    // ══════════════════════════════
    //  OPEN CONVERSATION
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function openConversation(convId) {
        activeConvId = convId;

        // Update active state
        document.querySelectorAll('.conv-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === convId);
        });

        // Show chat panel
        document.getElementById('chatEmptyState').classList.add('hidden');
        document.getElementById('chatActive').classList.remove('hidden');

        // Mobile: hide conv panel
        if (isMobileView) {
            document.getElementById('convPanel').classList.add('hidden-mobile');
            document.getElementById('backToConvs').classList.remove('hidden');
        }

        // TODO: GET /api/messages/conversation/:convId
        // const res  = await fetch(`/api/messages/conversation/${convId}`);
        // const data = await res.json();
        // setActiveChatHeader(data.participant);
        // renderMessages(data.messages);

        // Clear messages area until API is connected
        document.getElementById('messagesArea').innerHTML = `
            <div class="date-divider">Today</div>
        `;
        document.getElementById('chatName').textContent       = 'Provider';
        document.getElementById('chatStatusText').textContent = 'Online';
        document.querySelector('.status-dot').classList.add('online');
        document.getElementById('chatAvatar').textContent = 'P';
    }

    window.openConversation = openConversation;

    function setActiveChatHeader(participant) {
        document.getElementById('chatName').textContent       = participant.name;
        document.getElementById('chatStatusText').textContent = participant.online ? 'Online' : 'Offline';
        document.querySelector('.status-dot').classList.toggle('online', participant.online);
        document.getElementById('chatAvatar').textContent = participant.initials || participant.name?.charAt(0) || '?';

        if (participant.avatar) {
            document.getElementById('chatAvatar').innerHTML = `<img src="${participant.avatar}" alt="${participant.name}">`;
        }
    }

    // ══════════════════════════════
    //  RENDER MESSAGES
    // ══════════════════════════════
    function renderMessages(messages) {
        const area = document.getElementById('messagesArea');
        if (!messages || messages.length === 0) {
            area.innerHTML = '<div class="date-divider">No messages yet</div>';
            return;
        }

        let html = '';
        let lastDate = '';

        messages.forEach(msg => {
            if (msg.date !== lastDate) {
                html += `<div class="date-divider">${msg.date}</div>`;
                lastDate = msg.date;
            }
            html += createMessageHTML(msg);
        });

        area.innerHTML = html;
        scrollToBottom();
        lucide.createIcons();
    }

    function createMessageHTML(msg) {
        const isSent = msg.isSent;
        return `
            <div class="msg-group ${isSent ? 'sent' : 'received'}">
                ${!isSent ? `<div class="msg-group-avatar">${msg.senderInitials || '?'}</div>` : ''}
                <div class="msg-bubbles">
                    <div class="msg-bubble">${escapeHtml(msg.text)}</div>
                    <span class="msg-time">${msg.time}</span>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function scrollToBottom() {
        const area = document.getElementById('messagesArea');
        area.scrollTop = area.scrollHeight;
    }

    // ══════════════════════════════
    //  SEND MESSAGE
    // ══════════════════════════════
    function sendMessage() {
        const input = document.getElementById('messageInput');
        const text  = input.value.trim();

        if (!text || !activeConvId) return;

        // Optimistically add message to UI
        const area = document.getElementById('messagesArea');
        const now  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const msgEl = document.createElement('div');
        msgEl.className = 'msg-group sent';
        msgEl.innerHTML = `
            <div class="msg-bubbles">
                <div class="msg-bubble">${escapeHtml(text)}</div>
                <span class="msg-time">${now}</span>
            </div>
        `;
        area.appendChild(msgEl);
        scrollToBottom();

        input.value = '';

        // TODO: POST /api/messages/conversation/:activeConvId
        // await fetch(`/api/messages/conversation/${activeConvId}`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ text })
        // });
    }

    document.getElementById('sendBtn').addEventListener('click', sendMessage);

    document.getElementById('messageInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ══════════════════════════════
    //  BACK TO CONVERSATIONS (mobile)
    // ══════════════════════════════
    document.getElementById('backToConvs').addEventListener('click', () => {
        document.getElementById('convPanel').classList.remove('hidden-mobile');
        document.getElementById('chatEmptyState').classList.remove('hidden');
        document.getElementById('chatActive').classList.add('hidden');
        document.getElementById('backToConvs').classList.add('hidden');
        activeConvId = null;
    });

    // ══════════════════════════════
    //  SEARCH CONVERSATIONS
    // ══════════════════════════════
    document.getElementById('convSearch').addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        // TODO: filter conversations locally or call GET /api/messages/conversations?search=query
        const filtered = conversations.filter(c =>
            c.name.toLowerCase().includes(query) ||
            (c.lastMessage || '').toLowerCase().includes(query)
        );
        renderConversations(filtered);
    });

    // ══════════════════════════════
    //  FILE ATTACHMENT
    // ══════════════════════════════
    document.getElementById('attachBtn').addEventListener('click', () => {
        document.getElementById('fileAttach').click();
    });

    document.getElementById('fileAttach').addEventListener('change', function () {
        if (this.files.length === 0) return;
        // TODO: upload file to /api/messages/upload then send message with attachment
        showToast('File attachment coming soon!');
        this.value = '';
    });

    // ══════════════════════════════
    //  NEW CONVERSATION
    // ══════════════════════════════
    document.getElementById('newMsgBtn').addEventListener('click', () => {
        // TODO: open new conversation modal / search for users
        showToast('Start a conversation by booking a service first.');
    });

    // ══════════════════════════════
    //  VIEW ORDER BUTTON
    // ══════════════════════════════
    document.getElementById('viewOrderBtn').addEventListener('click', () => {
        if (!activeConvId) return;
        // TODO: navigate to related order  /  open order detail modal
        showToast('Order details coming soon!');
    });

    // ══════════════════════════════
    //  RESPONSIVE RESIZE
    // ══════════════════════════════
    window.addEventListener('resize', () => {
        isMobileView = window.innerWidth <= 768;
        if (!isMobileView) {
            document.getElementById('convPanel').classList.remove('hidden-mobile');
            document.getElementById('backToConvs').classList.add('hidden');
        }
    });

    // ══════════════════════════════
    //  TOAST
    // ══════════════════════════════
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msg   = document.getElementById('toastMsg');
        const icon  = toast.querySelector('i');
        msg.textContent = message;
        icon.setAttribute('data-lucide', type === 'error' ? 'alert-circle' : 'check-circle');
        icon.style.color = type === 'error' ? '#f87171' : '#6ee7b7';
        lucide.createIcons();
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
    window.showToast = showToast;

    // ══════════════════════════════
    //  INIT
    // ══════════════════════════════
    loadProfile();
    loadConversations();

    // Check URL params for pre-selected conversation
    const urlParams = new URLSearchParams(window.location.search);
    const convId    = urlParams.get('conv');
    if (convId) openConversation(convId);

    console.log('🚀 Messages page loaded!');
});
