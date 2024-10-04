document.addEventListener('DOMContentLoaded', () => {
   const shareButton = document.getElementById('shareButton');

   shareButton.addEventListener('click', async () => {
      if (navigator.share) {
         try {
            await navigator.share({
               title: 'Level Up - party band',
               text: 'Scopri la nostra band, clicca qui per maggiori informazioni!',
               url: window.location.href // Condivide l'URL della pagina corrente
            });
            console.log('Contenuto condiviso con successo');
         } catch (error) {
            console.error('Errore durante la condivisione:', error);
         }
      } else {
         alert('La condivisione non è supportata su questo dispositivo o browser');
      }
   });
});
