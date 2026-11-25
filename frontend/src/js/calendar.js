document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'it',
        editable: true,
        selectable: true,

        events: [{ id: '1', title: 'Riunione Node.js', start: '2026-10-23T10:00:00', end: '2026-10-23T12:00:00' },
                { id: '2', title: 'Consegna Progetto', start: '2026-10-26' }],

        eventDrop: async function(info) {
            const datiAggiornati = {
                start: info.event.startStr,
                end: info.event.endStr || info.event.startStr
            };

            const risposta = await fetch(`/api/eventi/${info.event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datiAggiornati)
            });

            const risultato = await risposta.json();
            if (!risultato.success) {
                alert("Errore nel salvataggio");
                info.revert();
            }
        },

        select: function(info) {
            const titolo = prompt("Inserisci il titolo dell'evento:");
            if (titolo) {
                calendar.addEvent({
                    title: titolo,
                    start: info.startStr,
                    end: info.endStr,
                    allDay: info.allDay
                });
            }
            calendar.unselect();
        }
    });

    calendar.render();
});