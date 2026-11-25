//Search and filter
const searchInput = document.getElementById('search-input');
const materialsList = document.getElementById('materials-list');
const filterBtn = document.getElementById('filter-btn');
const filterCount = document.getElementById('filter-count');
const filterPopup = document.getElementById('filter-popup');
const filterApply = document.getElementById('filter-apply');
const filterReset = document.getElementById('filter-reset');
const filterBoxes = filterPopup.querySelectorAll('input[type="checkbox"]');

const state = { q: '', tags: [] }; //keep the search text and the selected tags together in one place
let requestId = 0; //counts requests so we can ignore slow, outdated answers
let debounceTimer; //holds the timer that delays the search while the user types

//turn special characters into safe text --> no injection HTML
const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

materialsList.addEventListener('click', (e) => {
    //close popup with the 'X'
    const closeBtn = e.target.closest('.popup-close');
    if (closeBtn) {
        closeBtn.closest('.popup-wrapper').classList.remove('open');
        return;
    }

    //close popup if the dark background was clicked
    if (e.target.classList.contains('popup-wrapper')) {
        e.target.classList.remove('open');
        return;
    }

    //do nothing if the popup was clicked
    if (e.target.closest('.popup-wrapper')) return;

    //open popup details
    const card = e.target.closest('.card');
    if (card && card.nextElementSibling) {
        card.nextElementSibling.classList.add('open');
    }
});

//open popup filter
filterBtn.addEventListener('click', () => {
    filterBoxes.forEach(cb => {
        cb.checked = state.tags.includes(Number(cb.value));
    });
    filterPopup.classList.add('open');
});

//close popup filter
filterPopup.addEventListener('click', (e) => {
    if (e.target === filterPopup || e.target.closest('.popup-close')) {
        filterPopup.classList.remove('open');
    }
});

//save filters and reload the list
filterApply.addEventListener('click', (e) => {
    e.preventDefault();
    state.tags = [...filterBoxes]
        .filter(cb => cb.checked)
        .map(cb => Number(cb.value));

    updateFilterCount();
    filterPopup.classList.remove('open');
    fetchMaterials();
});

//uncheck every tag and reload list
filterReset.addEventListener('click', (e) => {
    e.preventDefault();
    filterBoxes.forEach(cb => cb.checked = false);
    state.tags = [];

    updateFilterCount();
    filterPopup.classList.remove('open');
    fetchMaterials();
});

//show number of tags selected
function updateFilterCount() {
    filterCount.textContent = state.tags.length ? `(${state.tags.length})` : '';
}

//search manage --> wait 250ms after the last keystroke, then search
searchInput.addEventListener('input', (e) => {
    state.q = e.target.value.trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchMaterials, 250);
});

//load list
async function fetchMaterials() {
    const currentRequest = ++requestId;

    //build the URL parameters
    const params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.tags.length) params.set('tags', state.tags.join(','));

    try {
        const response = await fetch(`/api/materials/search?${params.toString()}`);
        if (!response.ok) throw new Error('Network error');

        const materials = await response.json();

        //if a newer request has started, throw this answer away.
        if (currentRequest !== requestId) return;

        renderMaterials(materials);
    } catch (err) {
        console.error('Search error:', err);
    }
}

//render list with the cards
function renderMaterials(materials) {
    if (materials.length === 0) {
        materialsList.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-book icon-no-results"></i>
                <p id="description">Nessun risultato</p>
            </div>
        `;
        return;
    }

    materialsList.innerHTML = materials.map(materialTemplate).join('');
}

//list template with materials
function materialTemplate(material) {
    const tags = material.tags || [];
    const tags3 = material.tags_3 || tags.slice(0, 3);
    const hasMoreTags = material.hasMoreTags ?? tags.length > 3;

    return `
        <div class="card">
            <div class="card-icon">
                <i class="fa-solid fa-file-lines"></i>
            </div>

            <div class="card-body">
                <h3 class="card-filename">${escapeHtml(material.filename)}</h3>
                <p class="card-description">${escapeHtml(material.description)}</p>
            </div>

            <div class="card-tags">
                ${tags3.map(t => `<span class="tag">${escapeHtml(t.name)}</span>`).join('')}
                ${hasMoreTags ? `<span class="tag-others">+ Altri...</span>` : ''}
            </div>

            <div class="card-footer">
                <div class="card-uploader">
                    <i class="fa-regular fa-user"></i>
                    <span>${escapeHtml(material.author?.email)}</span>
                </div>

                <div class="card-date">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${escapeHtml(material.created_at)}</span>
                </div>
            </div>
        </div>

        <div class="popup-wrapper">
            <div class="popup">
                <button type="button" class="popup-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div class="popup-header">
                    <div class="popup-file-icon">
                        <i class="fa-solid fa-file-lines"></i>
                    </div>

                    <h2>${escapeHtml(material.filename)}</h2>
                    <span class="popup-subtitle">Dettagli del materiale</span>
                </div>

                <div class="popup-content">
                    <div class="popup-info">
                        <div class="popup-description-section">
                            <div class="popup-description-title">
                                <i class="fa-solid fa-message"></i>
                                <span class="info-label">Descrizione materiale</span>
                            </div>

                            <div class="popup-description">
                                <p>${escapeHtml(material.description) || 'Nessuna descrizione disponibile.'}</p>
                            </div>
                        </div>

                        <div class="popup-info-row popup-tags-row">
                            <i class="fa-solid fa-tags"></i>

                            <div class="popup-tags-content">
                                <span class="info-label">Tag associati</span>

                                ${tags.length
            ? `<div class="popup-tags">
                                           ${tags.map(t => `<span class="tag">${escapeHtml(t.name)}</span>`).join('')}
                                       </div>`
            : `<span class="info-value">Nessun tag associato</span>`}
                            </div>
                        </div>

                        <div class="popup-info-row">
                            <i class="fa-regular fa-user"></i>
                            <div>
                                <span class="info-label">Caricato da</span>
                                <span class="info-value">${escapeHtml(material.author?.email)}</span>
                            </div>
                        </div>

                        <div class="popup-info-row">
                            <i class="fa-solid fa-weight-hanging"></i>
                            <div>
                                <span class="info-label">Dimensione</span>
                                <span class="info-value">${escapeHtml(material.file_size ?? 0)} KB</span>
                            </div>
                        </div>

                        <div class="popup-info-row">
                            <i class="fa-solid fa-download"></i>
                            <div>
                                <span class="info-label">Download</span>
                                <span class="info-value">${escapeHtml(material.download_count ?? 0)}</span>
                            </div>
                        </div>

                        <div class="popup-info-row">
                            <i class="fa-regular fa-calendar"></i>
                            <div>
                                <span class="info-label">Data di caricamento</span>
                                <span class="info-value">${escapeHtml(material.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="popup-actions">
                        <a class="download" href="/materials/download/${encodeURIComponent(material.id)}">
                            <i class="fa-solid fa-download"></i>
                            Scarica materiale
                        </a>

                        <a class="report" href="/materials/report/${encodeURIComponent(material.id)}">
                            <i class="fa-solid fa-flag"></i>
                            Segnala materiale
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
}