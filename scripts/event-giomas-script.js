// Dati degli eventi
const arEventi = [   
  { band: "StarLiga - Ligabue tribute", nome: "Comizio - Venagrande", data: '01/06/2024', confermata: true, },
  { band: "Jam Quintet - Italian tribute", nome: "Kasì Bar", data: '02/06/2024', confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "???", data: '07/06/2024',  confermata: false, },
  { band: "Various Artist", nome: "RETROMANIA 80", data: '08/06/2024',  confermata: false, },
  { band: "Level Up - party band", nome: "Festa di Sant'Antonio", data: '15/06/2024', confermata: true, luogo: 'Spelonga (AP)', link: '', indirizzo: '', indirizzoLink: '' },
  { band: "StarLiga - Ligabue tribute", nome: "Sestiere di Porta Maggiore", data: '21/06/2024',  confermata: false, },
  { band: "Level Up - party band", nome: 'Festa di Case di Coccia', data: '29/06/2024', confermata: true , luogo: 'Case di Coccia - Folignano (AP)', link: '', indirizzo: 'Piazza di Via Ivrea, Case di Coccia (AP)', indirizzoLink: 'https://maps.app.goo.gl/Te7qTcCRs8eUL9B79' },

  { band: "Level Up - party band", nome: "Festa Società Sportiva Monsampolo", data: '07/07/2024', confermata: false, luogo: 'Piane di Morro - Folignano (AP)', link: '', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9' },
  { band: "In Rock - Deep Purple tribute", nome: "opening - Heros & Monsters", data: '14/07/2024', confermata: true, luogo: 'Piane di Morro - Folignano (AP)', link: '', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9' },
  { band: "Level Up - party band", nome: 'Sagra della Tagliata', data: '18/07/2024', confermata: true, luogo: 'Piane di Morro - Folignano (AP)', link: '', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9' },
  { band: "StarLiga - Ligabue tribute", nome: "Sagra de Lu Bocculotte co lu Castrate", data: '19/07/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "San Benedetto", data: '21/07/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Gagliano di Campli", data: '25/06/2024',  confermata: true, },
  
  { band: "Level Up - party band", nome: 'Piazzetta e Campari', data: '01/08/2024',  confermata: true, luogo: "Sant'Egidio di Monsampolo", link: '', indirizzo: '', indirizzoLink: '' },
  { band: "StarLiga - Ligabue tribute", nome: "Aquilano di Tossicia", data: '03/08/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Force", data: '04/08/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Monteprandone", data: '05/08/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Ripattoni di Bellante", data: '15/08/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Falciano", data: '24/08/2024',  confermata: true, },
  { band: "StarLiga - Ligabue tribute", nome: "Tommy's Cafè", data: '30/08/2024',  confermata: true, },
  { band: "Level Up - party band", nome: "Memorial Villa Marchesa", data: '31/08/2024',  confermata: false,false},

  { band: "StarLiga - Ligabue tribute", nome: "Santa Maria di Acquasanta", data: '08/09/2024',  confermata: true, },
  { band: "Level Up - party band", nome: 'Festa Privata - Matrimonio', data: '21/09/2024', luogo: '', link: '', indirizzo: '', indirizzoLink: '' },
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
