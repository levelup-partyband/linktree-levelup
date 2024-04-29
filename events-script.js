// Dati degli eventi
var arEventi = [
   {
      nome: 'Festa di Case di Coccia',
      data: '29/06/2024',
      luogo: 'Case di Coccia - Folignano (AP)',
      link: ''
   },
   {
      nome: 'Sagra della Tagliata',
      data: '18/07/2024',
      luogo: 'Piane di Morro - Folignano (AP)',
      link: ''
   },
];

// Funzione per popolare gli eventi nel documento HTML
function popolaEventi() {
   var eventContainer = document.getElementById('event-container');

   // Per ogni evento nell'array
   arEventi.forEach(function(evento) {
      console.log('evento:',evento);
      // Creiamo la card dell'evento
      var card = document.createElement('div');
      card.classList.add('card', 'link');
      card.style.flex = '0 0 80%';
      card.style.padding = '10px';
      card.style.maxWidth = '100%';
      card.style.margin = '0';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.backgroundColor = '#ffffff22';

      // Costruiamo il contenuto della card dell'evento
      var dataEvento = new Date(evento.data);
      card.innerHTML = `
         <div style="flex: 1; text-align: center; padding:0 5px;">
            <div style="font-size: 20px;">${dataEvento.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase()}</div>
            <div style="font-size: 34px; font-weight: bold;">${dataEvento.getDate()}</div>
            <div style="font-size: 20px;">${dataEvento.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase()}</div>
         </div>
         <div style="flex: 7; text-align: center;">
            <div style="font-size: 20px; font-weight: bold; text-transform: uppercase">${evento.nome}</div>
            <div style="font-size: 16px;">${evento.luogo}</div>
         </div>
      `;

      // Aggiungiamo la card dell'evento al container degli eventi
      eventContainer.appendChild(card);
   });
}

// Chiamata alla funzione per popolare gli eventi
popolaEventi();
