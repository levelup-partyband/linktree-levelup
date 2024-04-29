// Dati degli eventi
var arEventi = [
   { nome: 'Festa di Case di Coccia', data: '29/06/2024', luogo: 'Case di Coccia - Folignano (AP)', link: '', indirizzo: 'Piazza di Via Ivrea, Case di Coccia (AP)', indirizzoLink: 'https://maps.app.goo.gl/Te7qTcCRs8eUL9B79'},
   { nome: 'Sagra della Tagliata', data: '18/07/2024', luogo: 'Piane di Morro - Folignano (AP)', link: '', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9'},
];

function popolaEventi() {
    var eventContainer = document.getElementById('event-container');

    // Ottieni la data odierna per confrontarla con le date degli eventi
    var oggi = new Date();

    // Per ogni evento nell'array
    arEventi.forEach(function(evento) {
        // Converte la data nel formato corretto (MM/GG/YYYY)
        var dataParts = evento.data.split('/');
        var dataFormatted = dataParts[1] + '/' + dataParts[0] + '/' + dataParts[2];
        var data = new Date(dataFormatted);

        // Verifica se la data è valida e se non è passata
        if (!isNaN(data.getTime()) && (data >= oggi || data.getDate() === oggi.getDate())) {
            // Costruisci direttamente il template CARD utilizzando la sintassi dei template string
            var cardHTML = `
                <div class="card-evento">
                   <div class="event-date">
                       <div class="event-day">${data.toLocaleString('default', { weekday: 'short' }).toUpperCase()}</div>
                       <div class="event-number">${data.getDate()}</div>
                       <div class="event-month">${data.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                   </div>
                   <div class="event-details">
                       <div class="event-name">${evento.nome}</div>
                       <div class="event-location">${evento.luogo}</div>
                       ${evento.indirizzo ? `<a href="${evento.indirizzoLink}" class="event-address" target="_blank">${evento.indirizzo}</a>` : ''}
                   </div>
               </div>
            `;

            // Aggiungi la CARD HTML al container degli eventi
            eventContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}
