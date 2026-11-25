const searchInput = document.getElementById('search-input');
const requestsList = document.getElementById('requests-list');
const defaultRequests = document.getElementById('other-actions-toHideInsearch');

const DEBOUNCE_MS = 300;
const STATUS_LABELS = {
    OPEN: 'Aperta',
    RESOLVED: 'Risolta',
    REMOVED: 'Rimossa'
};

let debounceTimer = null;
let currentController = null;

// Evita che titoli/email con caratteri speciali rompano l'HTML (o eseguano codice)
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showResultsView() {
    defaultRequests.hidden = true;
    requestsList.hidden = false;
}

// Ripristina le richieste predefinite ("Domande del giorno" e "Le tue domande")
function resetDefault() {
    clearTimeout(debounceTimer);

    // Annulla l'eventuale ricerca ancora in corso: altrimenti la sua risposta,
    // arrivando in ritardo, riaprirebbe i risultati sopra le richieste predefinite
    if (currentController) {
        currentController.abort();
        currentController = null;
    }

    searchInput.value = '';
    requestsList.innerHTML = '';
    requestsList.hidden = true;
    defaultRequests.hidden = false;
}

function renderNoResults() {
    requestsList.innerHTML = `
        <div class="no-results">
            <i class="fa-solid fa-book icon-no-results"></i>
            <p>Nessun risultato</p>
            <button type="button" id="reset-requests">Ripristina richieste predefinite</button>
        </div>
    `;
    document.getElementById('reset-requests').addEventListener('click', resetDefault);
}

function renderResults(requests) {
    showResultsView();
    requestsList.innerHTML = '';

    if (requests.length === 0) {
        renderNoResults();
        return;
    }

    requests.forEach(request => {
        const item = document.createElement('div');
        item.className = 'event-item-inSearch';

        let colorStatus;
        switch(request.status){
            case 'OPEN':
                colorStatus = '#0047AB';
                break;
            case 'RESOLVED':
                colorStatus = '#2E6F40';
                break;
            case 'REMOVED':
                colorStatus = '#FF2400';
                break;
        }

        item.innerHTML = `
            <div class="event-color blue"></div>
            <a class="event-info" onclick="location.href='/help-center/${request.id}'">
                <h3>${escapeHtml(request.title)}</h3>
                <p><i class="fa-solid fa-clock"></i> <em>Pubblicato:</em> ${escapeHtml(request.created_at)}</p>
                <p><i class="fa-solid fa-circle-user"></i> <em>Creato da:</em> ${escapeHtml(request.user_email)}</p>
                <p><i class="fa-solid fa-square-check"></i> <em>Stato:</em> <span style="background-color: ${colorStatus};color: white;font-weight: bolder;">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></p>
            </a>
        `;
        requestsList.appendChild(item);
    });
}

async function runSearch(searchTerm) {
    // Una nuova ricerca annulla quella precedente ancora in volo
    if (currentController) currentController.abort();
    currentController = new AbortController();
    const { signal } = currentController;

    try {
        const response = await fetch(
            `/api/requests/search?q=${encodeURIComponent(searchTerm)}`,
            { signal }
        );

        if (!response.ok) throw new Error('Errore di rete');

        const requests = await response.json();
        renderResults(requests);

    } catch (err) {
        if (err.name === 'AbortError') return; // ricerca annullata di proposito

        console.error('Errore durante la ricerca:', err);
        showResultsView();
        requestsList.innerHTML = `
            <div class="no-results">
                <p>Errore durante la ricerca.</p>
            </div>
        `;
    }
}

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    const searchTerm = searchInput.value.trim();

    // Barra vuota: tornano subito le richieste predefinite
    if (!searchTerm) {
        resetDefault();
        return;
    }

    // Debounce: non una richiesta per ogni tasto premuto
    debounceTimer = setTimeout(() => runSearch(searchTerm), DEBOUNCE_MS);
});
