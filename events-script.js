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
console.log('arEventi:',arEventi);

// Funzione per popolare gli eventi nel documento HTML
function popolaEventi() {
   var eventContainer = document.getElementById('event-container');
   var eventTemplate = document.getElementById('event-template');

   // Per ogni evento nell'array
   arEventi.forEach(function(evento) {
      // Clona il template
      var clone = eventTemplate.content.cloneNode(true);

      // Popola i dati dell'evento nel clone
      clone.querySelector('.event-name').textContent = evento.nome;
      clone.querySelector('.event-location').textContent = evento.luogo;

      // Converte la data nel formato corretto (MM/GG/YYYY)
      var dataParts = evento.data.split('/');
      var dataFormatted = dataParts[1] + '/' + dataParts[0] + '/' + dataParts[2];
      var data = new Date(dataFormatted);

      // Verifica se la data è valida prima di continuare
      if (!isNaN(data.getTime())) {
         clone.querySelector('.event-day').textContent = data.toLocaleString('default', { weekday: 'short' }).toUpperCase();
         clone.querySelector('.event-date').textContent = data.getDate();
         clone.querySelector('.event-month').textContent = data.toLocaleString('default', { month: 'short' }).toUpperCase();

         // Aggiungi il clone al container degli eventi
         eventContainer.appendChild(clone);
      } else {
         console.error('Data non valida:', evento.data);
      }
   });
}

