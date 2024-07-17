// Dati degli eventi
var arEventi = [   
   // { nome: "Festa di Sant'Antonio", data: '15/06/2024', luogo: 'Spelonga (AP)', link: '', indirizzo: '', indirizzoLink: '' },
   { nome: 'Festa di Case di Coccia', data: '29/06/2024', luogo: 'Case di Coccia - Folignano (AP)', link: 'https://www.facebook.com/events/2188491668194611/', indirizzo: 'Piazza di Via Ivrea, Case di Coccia (AP)', indirizzoLink: 'https://maps.app.goo.gl/Te7qTcCRs8eUL9B79' },
   { nome: '"Settimana Santa" Biancorossa', data: '08/07/2024', luogo: 'Sestiere Piazzarola - Ascoli Piceno (AP)', link: 'https://www.facebook.com/events/1003807131250235/', indirizzo: 'Via della Cartiera, 1, 63100 Ascoli Piceno AP', indirizzoLink: 'https://maps.app.goo.gl/uqoh7dRdUKPyobdE7' },
   { nome: 'Sagra della Tagliata', data: '18/07/2024', luogo: 'Piane di Morro - Folignano (AP)', link: 'https://www.facebook.com/events/1272323350820389/', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9' },
   { nome: 'Castorano Borgo Aperto', data: '28/07/2024', luogo: 'Castorano (AP)', link: '', indirizzo: 'Piazza Giacomo Leopardi, Castorano (AP)', indirizzoLink: 'https://maps.app.goo.gl/6BDVsgiJckWHyzfMA' },
   { nome: 'Piazzetta e Campari', data: '01/08/2024', luogo: "Sant'Egidio di Monsampolo", link: 'https://www.facebook.com/events/320271224484642/', indirizzo: "Contrada Sant'Egidio, 45 B, 63077 Monsampolo (AP)", indirizzoLink: 'https://maps.app.goo.gl/sS3irn2B1tdxnTRs8' },
   { nome: 'Festa in Campagna', data: '31/08/2024', luogo: 'Tassanare di Rosora (AN)', link: 'https://www.facebook.com/FestaTassanare', indirizzo: 'Tassanare di Rosora (AN)', indirizzoLink: 'https://maps.app.goo.gl/CpeHn3qmBQVEpsAj8' },
   { nome: 'Festa Privata - Matrimonio', data: '21/09/2024', luogo: '', link: '', indirizzo: '', indirizzoLink: '' },
];
// { nome: 'Festa Società Sportiva', data: '07/07/2024', luogo: "Monsampolo", link: '', indirizzo: '', indirizzoLink: '' },

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
                     ${evento.indirizzo ? `<a href="${evento.indirizzoLink}" class="event-address" style="font-size: 12px; margin-top:2px; cursor: pointer;" target="_blank">${evento.indirizzo}</a>` : ''}
                 </div>
             </div>
            `;

            // Aggiungi la CARD HTML al container degli eventi
            eventContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}
