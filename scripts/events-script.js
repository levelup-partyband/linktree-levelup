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
               <div class="card link" style="flex:0 0 80%; padding: 10px; max-width: 100%; margin:0; display: flex; align-items:center; background-color:#ffffff22; cursor: ${evento.link ? 'pointer' : 'default'}" onclick="apriLink('${evento.link}')">
                 <div style="flex: 1; text-align: center; padding:0 5px;">
                     <div class="event-day" style="font-size: 20px;">${data.toLocaleString('default', { weekday: 'short' }).toUpperCase()}</div>
                     <div class="event-date" style="font-size: 34px; font-weight: bold;">${data.getDate()}</div>
                     <div class="event-month" style="font-size: 20px;">${data.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                 </div>
                 <div style="flex: 7; text-align: center;">
                     <div class="event-name" style="font-size: 20px; font-weight: bold; text-transform: uppercase;">${evento.nome}</div>
                     <div class="event-location" style="font-size: 16px;">${evento.luogo}</div>
                     ${evento.link ? `<div class="event-link" style="font-size: 12px; cursor: pointer;" onclick="if('${evento.link}') window.location.href = '${evento.link}';">Ulteriori informazioni</div>` : ''}
                 </div>
             </div>
            `;

            // Aggiungi la CARD HTML al container degli eventi
            eventContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}
