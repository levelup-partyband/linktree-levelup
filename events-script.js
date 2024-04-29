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
      console.log('evento:',evento);
      // Clona il template
      var clone = eventTemplate.content.cloneNode(true);

      // Popola i dati dell'evento nel clone
      var dataEvento = new Date(evento.data);
      clone.querySelector('.event-day').textContent = dataEvento.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
      clone.querySelector('.event-date').textContent = dataEvento.getDate();
      clone.querySelector('.event-month').textContent = dataEvento.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase();
      clone.querySelector('.event-name').textContent = evento.nome;
      clone.querySelector('.event-location').textContent = evento.luogo;

      // Aggiungi il clone al container degli eventi
      eventContainer.appendChild(clone);
   });
}
