// Client socket.io initalization
const requestId = window.location.pathname.split('/').pop(); 
let isChatResolved = false;
const socket = io();

socket.emit('join request chat', requestId);

socket.on('chat status', (msg) => {
    if(msg.isChatResolved){
        window.location.reload();
    }
});


if(!window.isChatResolved){
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('chat-message');
    const replyToAuthor = document.getElementById('replyToAuthor');
    const messagesContainer = document.querySelector('.study-chat__messages');

    const formAction = chatForm.getAttribute('action');

    // AJAX
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = messageInput.value.trim();
        const auth_message_replied = replyToAuthor.value.trim();

        if (!text) return;

        try {
            const response = await fetch(formAction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text, authRepliedMsg: auth_message_replied })
            });

            if (response.ok) {
                messageInput.value = '';
                replyToAuthor.value='';
                chatForm.querySelector('.reply-label')?.remove();
            }
        } catch (err) {
            console.error("Errore durante l'invio del messaggio:", err);
        }
    });
    socket.on('new message', (msg) => {
        const emptyText = document.querySelector('.study-chat__empty');

        if (emptyText) emptyText.remove();

        // Check if this message is a reply
        if (msg.reply_to_message) {
            const label = document.createElement("div");
            label.className = "reply-label";

            if (msg.reply_to_author_id == window.currentUserId){
                    label.textContent = `Rispondendo a tu`;
            } else{
                label.textContent = `Rispondendo a ${msg.reply_to_message ?? "anonimo"}`;
            } 
                messagesContainer.appendChild(label);
        }

        // Create the message
        const article = document.createElement('article');

        if (msg.author_id == window.currentUserId) {
            article.className = 'study-chat__message_owner';
        } else {
            article.className = 'study-chat__message';
        }

        const paragraph = document.createElement('p');
        paragraph.className = 'study-chat__text';
        
        if (msg.author_id == window.currentUserId){
            const author = document.createElement('strong');
            author.textContent = "Tu";

            paragraph.appendChild(author);
            paragraph.appendChild(document.createTextNode(' - ' + msg.content));
        } else{
            const author = document.createElement('strong');
            author.textContent = msg.author;

            paragraph.appendChild(author);
            paragraph.appendChild(document.createTextNode(' - ' + msg.content));
        }
        
        article.appendChild(paragraph);

        if (msg.author_id == window.currentUserId) {
            messagesContainer.appendChild(article);
        } else {
            const row = document.createElement('div');
            row.className = 'study-chat__message-row';

            const replyButton = document.createElement('button');
            replyButton.className = 'study-chat__reply';
            replyButton.type = 'button';
            replyButton.title = 'Rispondi';
            replyButton.setAttribute('aria-label', 'Rispondi');

            replyButton.dataset.authorName = msg.reply_to_message;

            replyButton.innerHTML = `
                <svg width="38" height="38" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true">
                    <path d="M3 19v-2a8 8 0 0 1 8-8h10" />
                    <path d="m16 4 5 5-5 5" />
                </svg>
            `;

            row.appendChild(article);
            row.appendChild(replyButton);
            messagesContainer.appendChild(row);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// Reply to a message
document.addEventListener("click", (event) => {
    const replyButton = event.target.closest(".study-chat__reply");

    if (!replyButton) return;

    const msgAuthorName = replyButton.dataset.authorName;
    const composer = document.querySelector(".study-chat__composer");

    document.getElementById("replyToAuthor").value = msgAuthorName;

    composer.querySelector(".reply-label")?.remove();

    const label = document.createElement("div");
    label.className = "reply-label";
    label.textContent = `Rispondendo a ${msgAuthorName}`;

    const inputRow = composer.querySelector(".study-chat__input-row");
    composer.insertBefore(label, inputRow);
});

document.querySelectorAll(
    '.study-chat__messages .reply-label'
).forEach(label => {
    if (label.dataset.replyAuthorId == window.currentUserId) {
        label.textContent = "Rispondendo a tu";
    }
});

if(document.getElementById("openResolvedPopup")&& !window.isChatResolved){
    // Chat resolved popup 
    const resolvedPopup = document.getElementById("resolvedPopup");
    const openPopup = document.getElementById("openResolvedPopup");
    const closePopup = document.getElementById("closeResolvedPopup");
    const confirmPopup = document.getElementById("confirmResolvedPopup");

    openPopup.addEventListener("click", () => {
        resolvedPopup.classList.add("open");
    });

    closePopup.addEventListener("click", () => {
        resolvedPopup.classList.remove("open");
    });

    confirmPopup.addEventListener("click", async () => {
        try{
            const response = await fetch(`/help-center/chat/resolved/${requestId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                }
            });

            if(response.ok){
                window.location.reload();
            }
        }catch(err){
            console.error("Errore:", err);
        }
    });
}