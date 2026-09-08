/**
 * ============================================================================
 * MÓDULO INDEPENDIENTE DE NOTAS - Arcanis: Trials of Mastery
 * FIX DEFINITIVO: El modal ya no bloquea los demás botones al iniciar.
 * ============================================================================
 */

const NotesSystem = {
    cache: null,
    isOpen: false,

    init: function () {
        // FORZAR estado cerrado al iniciar
        this.forceClosedState();
        this.bindEvents();
    },

    forceClosedState: function () {
        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        this.isOpen = false;

        if (modal) {
            modal.classList.remove('open');
            modal.style.display = 'none';
            modal.style.pointerEvents = 'none';
        }

        if (overlay) {
            overlay.classList.remove('open');
            overlay.style.display = 'none';
            overlay.style.pointerEvents = 'none';
        }
    },

    bindEvents: function () {
        const notesBtn = document.getElementById('btn-notas');
        if (notesBtn) {
            notesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleModal();
            });
        }

        const closeBtn = document.getElementById('notes-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        const overlay = document.getElementById('notes-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }
    },

    toggleModal: function () {
        if (this.isOpen) {
            this.closeModal();
        } else {
            this.openModal();
        }
    },

    openModal: function () {
        this.isOpen = true;

        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (!modal || !overlay) return;

        // Activar clics SOLO cuando está abierto
        overlay.style.display = 'block';
        overlay.style.pointerEvents = 'auto';

        modal.style.display = 'flex';
        modal.style.pointerEvents = 'auto';

        requestAnimationFrame(() => {
            overlay.classList.add('open');
            modal.classList.add('open');
        });

        this.loadNotes();
    },

    closeModal: function () {
        this.isOpen = false;

        const modal = document.getElementById('notes-modal');
        const overlay = document.getElementById('notes-overlay');

        if (!modal || !overlay) return;

        modal.classList.remove('open');
        overlay.classList.remove('open');

        setTimeout(() => {
            // Desactivar completamente los clics
            modal.style.display = 'none';
            modal.style.pointerEvents = 'none';

            overlay.style.display = 'none';
            overlay.style.pointerEvents = 'none';
        }, 300);
    },

    loadNotes: function () {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        // Usar caché si ya se cargó por el SyncEngine u otra llamada
        if (this.cache !== null) {
            this.renderNotes(this.cache);
            return;
        }

        container.innerHTML = '<div class="notes-loading">Cargando notas...</div>';

        if (window.TOMApi && typeof window.TOMApi.fetchNotes === 'function') {
            window.TOMApi.fetchNotes((notes) => {
                if (notes && Array.isArray(notes)) {
                    this.cache = notes;
                    this.renderNotes(this.cache);
                } else {
                    container.innerHTML = '<div class="notes-error">Error al cargar notas.</div>';
                }
            });
        } else {
            container.innerHTML = '<div class="notes-error">TOMApi no está disponible.</div>';
        }
    },

    renderNotes: function (notesList) {
        const container = document.getElementById('notes-list-container');
        if (!container) return;

        container.innerHTML = '';

        if (!notesList.length) {
            container.innerHTML =
                '<div class="notes-empty">No hay notas publicadas aún.</div>';
            return;
        }

        notesList.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const header = document.createElement('div');
            header.className = 'note-header';
            
            const title = document.createElement('h3');
            title.className = 'note-title';
            title.textContent = note.title || note.titulo || 'Sin título';

            const toggleIcon = document.createElement('span');
            toggleIcon.className = 'note-toggle-icon';
            toggleIcon.innerHTML = '▼'; // Simple arrow icon
            
            header.appendChild(title);
            header.appendChild(toggleIcon);

            const body = document.createElement('div');
            body.className = 'note-body';

            const content = document.createElement('div');
            content.className = 'note-content';
            content.innerHTML = String(note.content || note.contenido || '').replace(/\n/g, '<br>');

            const meta = document.createElement('div');
            meta.className = 'note-meta';
            const dateStr = note.date || note.fecha || '';
            const authorStr = note.author || note.autor || 'Anónimo';
            meta.innerHTML = `<strong>Autor:</strong> ${authorStr} <span style="margin:0 10px">|</span> <strong>Fecha:</strong> ${new Date(dateStr).toLocaleString()}`;

            body.appendChild(content);
            body.appendChild(meta);

            card.appendChild(header);
            card.appendChild(body);

            // Toggle logic
            header.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                // Close all others
                container.querySelectorAll('.note-card.expanded').forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });
                
                if (isExpanded) {
                    card.classList.remove('expanded');
                } else {
                    card.classList.add('expanded');
                }
            });

            container.appendChild(card);
        });
    }
};

// Inicialización segura
document.addEventListener('DOMContentLoaded', () => {
    NotesSystem.init();
});
