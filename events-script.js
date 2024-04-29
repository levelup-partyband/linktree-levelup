// Dati degli eventi
var arEventi = [
   {
      nome: 'Festa di Case di Coccia',
      data: '29/06/2024',
      luogo: 'Case di Coccia - Folignano (AP)',
      link: ''
   },
   // Altri eventi...
];

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

      var data = new Date(evento.data);
      clone.querySelector('.event-day').textContent = data.getDate();
      clone.querySelector('.event-month').textContent = data.toLocaleString('default', { month: 'short' }).toUpperCase();
      clone.querySelector('.event-year').textContent = data.getFullYear();

      // Aggiungi il clone al container degli eventi
      eventContainer.appendChild(clone);
   });
}

// Chiamata alla funzione per popolare gli eventi
popolaEventi();
