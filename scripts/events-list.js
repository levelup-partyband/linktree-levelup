let arEventi = [   
   { nome: "Quel Filo che ci Unisce", data: "02/06/2025", luogo: "Sant'Egidio alla Vibrata (TE)", link: "https://www.facebook.com/events/681740024674212", indirizzo: "Viale Abruzzi, 64016 Sant'Egidio alla Vibrata TE", indirizzoLink: "https://maps.app.goo.gl/8yDfzbYnwmheSMQJ6" },
   { nome: 'Sagra delle Crepes 2025', data: '08/06/2025', luogo: 'Chiesa dei Frati - Ascoli Piceno (AP)', link: 'https://www.facebook.com/events/689821517127706/', indirizzo: 'Via Assisi, 2, 63100 Ascoli Piceno AP', indirizzoLink: 'https://g.co/kgs/nxZtRpD' },
   { nome: 'Festa Privata - Matrimonio', data: '14/06/2025', luogo: 'Marina Palmense (FM)', link: '', indirizzo: '', indirizzoLink: '' },
   { nome: 'Moto Giro FMI', data: '21/06/2025', luogo: 'Melfi (PZ)', link: 'https://www.facebook.com/events/1203175651273608/', indirizzo: 'Via della Cittadinanza Attiva, 85025, Melfi PZ', indirizzoLink: 'https://maps.app.goo.gl/zE2mZGGLH64oPDHf8' },
   { nome: 'Chalet Mimosa 45', data: '12/07/2025', luogo: 'Grottammare (AP)', link: 'https://www.facebook.com/events/689821517127706/', indirizzo: 'Lungomare della Repubblica, 45, 63066 Grottammare AP', indirizzoLink: 'https://maps.app.goo.gl/rA84smajfJGYoykT6' },
   { nome: 'Un Borgo di Birra', data: '14/07/2025', luogo: 'Civitella del Tronto (TE)', link: '', indirizzo: '', indirizzoLink: '' },
   { nome: '24° Sagra dei<br>Maccheroncini alla Pagliarana', data: '31/07/2025', luogo: 'Pagliare del Tronto (AP)', link: 'https://www.facebook.com/events/687396143877688/', indirizzo: 'Piazza Kennedy, 63078 Pagliare del Tronto AP', indirizzoLink: 'https://maps.app.goo.gl/hrujjeCpyioHprJF6' },
   { nome: "Chalet Casablanca", data: '04/08/2024', luogo: "Porto d'Ascoli (AP)", link: '', indirizzo: '', indirizzoLink: '' },
   { nome: "Ferragosto", data: '15/08/2025', luogo: "Grottammare (AP)", link: 'https://www.facebook.com/events/664786599737380/', indirizzo: 'Piazza Pericle Fazzini, Grottammare AP', indirizzoLink: 'https://maps.app.goo.gl/owku9aeAHm6BPfxD7' },
   { nome: "Memorial", data: '30/08/2024', luogo: "Villa Marchesa, Sant'Edigio (TE)", link: '', indirizzo: '', indirizzoLink: '' },
];
let arEventi2024 = [
   // { nome: "Festa di Sant'Antonio", data: '15/06/2024', luogo: 'Spelonga (AP)', link: '', indirizzo: '', indirizzoLink: '' },
   { nome: 'Sagra di Case di Coccia', data: '29/06/2024', luogo: 'Case di Coccia - Folignano (AP)', link: 'https://www.facebook.com/events/2188491668194611/', indirizzo: 'Piazza di Via Ivrea, Case di Coccia (AP)', indirizzoLink: 'https://maps.app.goo.gl/Te7qTcCRs8eUL9B79' },
   { nome: '"Settimana Santa" Biancorossa', data: '08/07/2024', luogo: 'Sestiere Piazzarola - Ascoli Piceno (AP)', link: 'https://www.facebook.com/events/1003807131250235/', indirizzo: 'Via della Cartiera, 1, 63100 Ascoli Piceno AP', indirizzoLink: 'https://maps.app.goo.gl/uqoh7dRdUKPyobdE7' },
   { nome: 'Sagra della Tagliata', data: '18/07/2024', luogo: 'Piane di Morro - Folignano (AP)', link: 'https://www.facebook.com/events/1272323350820389/', indirizzo: 'Piazza Giovanni Paolo II, Piane di Morro (AP)', indirizzoLink: 'https://maps.app.goo.gl/o8VwZFkG4ZLWJ1qB9' },
   { nome: 'Castorano Experiences - Borgo Aperto', data: '28/07/2024', luogo: 'Castorano (AP)', link: 'https://www.facebook.com/events/1204267337567299/', indirizzo: 'Piazza Belvedere, Castorano (AP)', indirizzoLink: 'https://maps.app.goo.gl/Y5RRP7LmbFKS8x7V9' },
   { nome: 'Piazzetta e Campari', data: '01/08/2024', luogo: "Sant'Egidio di Monsampolo (AP)", link: 'https://www.facebook.com/events/320271224484642/', indirizzo: "Contrada Sant'Egidio, 45 B, 63077 Monsampolo (AP)", indirizzoLink: 'https://maps.app.goo.gl/sS3irn2B1tdxnTRs8' },
   { nome: 'Festa in Campagna', data: '31/08/2024', luogo: 'Tassanare di Rosora (AN)', link: 'https://www.facebook.com/FestaTassanare', indirizzo: 'Tassanare di Rosora (AN)', indirizzoLink: 'https://maps.app.goo.gl/CpeHn3qmBQVEpsAj8' },
   { nome: 'Maxelâ', data: '06/09/2024', luogo: 'Ascoli Piceno', link: 'https://www.facebook.com/share/Bhg8hdHitSsT958E/', indirizzo: 'Via Tornasacco, 7, 63100 Ascoli Piceno AP', indirizzoLink: 'https://maps.app.goo.gl/tBGiskCGwXKSiWry7' },
   { nome: 'Festa Privata - Matrimonio', data: '21/09/2024', luogo: 'Monteprandone (AP)', link: '', indirizzo: '', indirizzoLink: '' },
   { nome: 'Capodanno 2025', data: '31/12/2024', luogo: 'Albergo Ristorante Terme - Acquasanta Terme (AP)', link: 'https://www.facebook.com/events/573668735379455/', indirizzo: 'P.za Terme, 20, 63095 Acquasanta Terme (AP)', indirizzoLink: 'https://maps.app.goo.gl/b1e1UpB2zoqSAy7n8' },
];
