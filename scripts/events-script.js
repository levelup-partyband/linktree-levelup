function popolaEventi() {
    var eventContainer = document.getElementById('event-container');

    // Ottieni la data odierna per confrontarla con le date degli eventi
    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per il confronto corretto

    // Filtra gli eventi futuri
    var eventiFuturi = arEventi.filter(function(evento) {
        // Converte la data nel formato corretto (MM/GG/YYYY)
        var dataParts = evento.data.split('/');
        var dataFormatted = dataParts[1] + '/' + dataParts[0] + '/' + dataParts[2];
        var data = new Date(dataFormatted);
        
        // Verifica se la data è valida e se non è passata
        return !isNaN(data.getTime()) && (data >= oggi);
    });

    // Controlla se ci sono eventi futuri
    if (eventiFuturi.length === 0) {
        // Mostra il messaggio "Date in aggiornamento" se non ci sono eventi futuri
        eventContainer.innerHTML = `
            <div style="text-align: center; font-size: 20px; font-weight: bold; color: white; padding: 20px;">
                Date in aggiornamento
            </div>
        `;
        return;
    }

    // Per ogni evento futuro nell'array
    eventiFuturi.forEach(function(evento) {
        // Converte la data nel formato corretto (MM/GG/YYYY)
        var dataParts = evento.data.split('/');
        var dataFormatted = dataParts[1] + '/' + dataParts[0] + '/' + dataParts[2];
        var data = new Date(dataFormatted);
       
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
                 ${evento.indirizzo ? `<a class="event-address" style="font-size: 12px; margin-top:2px; cursor: pointer; z-index:999; text-decoration:${evento.indirizzo ? 'underline':'none'}" onclick="apriLink('${evento.indirizzoLink}')">${evento.indirizzo}</a>` : ''}
             </div>
         </div>
        `;

        // Aggiungi la CARD HTML al container degli eventi
        eventContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function apriLink(link) {
  if (link) 
    window.open(link, '_blank');
}
/*
function popolaEventi() {
    var eventContainer = document.getElementById('event-container');

    // Ottieni la data odierna per confrontarla con le date degli eventi
    var oggi = new Date();
    oggi.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per il confronto corretto


    // Per ogni evento nell'array
    arEventi.forEach(function(evento) {
        // Converte la data nel formato corretto (MM/GG/YYYY)
        var dataParts = evento.data.split('/');
        var dataFormatted = dataParts[1] + '/' + dataParts[0] + '/' + dataParts[2];
        var data = new Date(dataFormatted);
       
        // Verifica se la data è valida e se non è passata
        if (!isNaN(data.getTime()) && (data >= oggi)) {
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
                     ${evento.indirizzo ? `<a class="event-address" style="font-size: 12px; margin-top:2px; cursor: pointer; z-index:999; text-decoration:${evento.indirizzo ? 'underline':'none'}" onclick="apriLink('${evento.indirizzoLink}')">${evento.indirizzo}</a>` : ''}
                 </div>
             </div>
            `;

            // Aggiungi la CARD HTML al container degli eventi
            eventContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}

function apriLink(link) {
  if (link) 
    window.open(link, '_blank');
}
// ${evento.indirizzo ? `<a href="${evento.indirizzoLink}" class="event-address" style="font-size: 12px; margin-top:2px; cursor: pointer;" target="_blank">${evento.indirizzo}</a>` : ''} 
*/
