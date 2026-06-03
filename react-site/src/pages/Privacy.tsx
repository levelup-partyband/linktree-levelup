import { useEffect } from 'react';
import { CONTACTS } from '../lib/contacts';

const UPDATED = 'giugno 2026';

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl sm:text-2xl text-brand-pink tracking-wide mt-10 mb-3">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-white/75 leading-relaxed mb-3">{children}</p>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="text-white/75 leading-relaxed">{children}</li>;
}

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="container-x py-16 max-w-3xl">
      <div className="text-xs uppercase tracking-[0.3em] text-brand-pink mb-3">Informativa</div>
      <h1 className="font-display font-black text-4xl sm:text-5xl mb-2">Privacy Policy</h1>
      <p className="text-white/50 text-sm mb-8">Ultimo aggiornamento: {UPDATED}</p>

      <P>
        La presente informativa descrive come vengono trattati i dati personali degli utenti che utilizzano
        l'applicazione e il sito <strong className="text-white/90">LEVEL UP</strong> (di seguito “il Servizio”),
        in conformità al Regolamento UE 2016/679 (GDPR).
      </P>

      <H>1. Titolare del trattamento</H>
      <P>
        Il titolare del trattamento è <strong className="text-white/90">LEVEL UP Party Band</strong>.
        Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a{' '}
        <a href={CONTACTS.email} className="text-brand-pink hover:underline">{CONTACTS.emailAddress}</a>.
      </P>

      <H>2. Dati che raccogliamo</H>
      <P>Il Servizio è pensato per raccogliere il minimo indispensabile. In particolare:</P>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <LI>
          <strong className="text-white/90">Dati forniti volontariamente</strong>: quando ci contatti
          (via WhatsApp, Instagram, Messenger o email) o compili un modulo, trattiamo i dati che ci comunichi
          (es. nome, recapiti, dettagli dell'evento).
        </LI>
        <LI>
          <strong className="text-white/90">Dati inseriti negli strumenti del sito</strong> (es. preventivo,
          brief evento): vengono salvati esclusivamente <strong className="text-white/90">in locale sul tuo
          dispositivo</strong> (memoria del browser) e non sono trasmessi ai nostri server.
        </LI>
        <LI>
          <strong className="text-white/90">Dati tecnici di navigazione</strong>: il Servizio è ospitato su
          GitHub Pages, che per motivi di sicurezza e funzionamento può registrare dati tecnici come l'indirizzo
          IP e il tipo di browser.
        </LI>
      </ul>
      <P>Non raccogliamo categorie particolari di dati e non effettuiamo profilazione.</P>

      <H>3. Finalità e base giuridica</H>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <LI>Rispondere alle tue richieste di contatto e preventivo (base giuridica: tua richiesta / misure precontrattuali).</LI>
        <LI>Organizzare ed erogare il servizio musicale eventualmente concordato (esecuzione del contratto).</LI>
        <LI>Garantire il funzionamento e la sicurezza del sito (legittimo interesse).</LI>
      </ul>

      <H>4. Conservazione dei dati</H>
      <P>
        I dati di contatto sono conservati per il tempo necessario a gestire la tua richiesta e gli eventuali
        obblighi contrattuali e di legge. I dati salvati negli strumenti del sito restano sul tuo dispositivo
        finché non li elimini tu (svuotando i campi o i dati del browser).
      </P>

      <H>5. Condivisione con terze parti</H>
      <P>
        Non vendiamo né cediamo i tuoi dati. Possono essere trattati da fornitori che ci aiutano a erogare il
        Servizio, ciascuno per le proprie finalità e secondo le proprie informative:
      </P>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <LI>GitHub Pages (hosting del sito);</LI>
        <LI>Meta Platforms (WhatsApp, Instagram, Messenger) e Google (email), se scegli di contattarci tramite questi canali.</LI>
      </ul>

      <H>6. Cookie e tecnologie simili</H>
      <P>
        Il sito <strong className="text-white/90">non utilizza cookie di profilazione o di marketing</strong>.
        Utilizza esclusivamente la memoria locale del browser (localStorage) per salvare, sul tuo dispositivo,
        i dati che inserisci negli strumenti del sito. Puoi cancellarli in qualsiasi momento dalle impostazioni
        del browser.
      </P>

      <H>7. I tuoi diritti</H>
      <P>In qualità di interessato hai diritto, nei limiti di legge, a:</P>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <LI>accedere ai tuoi dati e ottenerne copia;</LI>
        <LI>chiederne la rettifica o la cancellazione;</LI>
        <LI>limitarne o opporti al trattamento;</LI>
        <LI>richiedere la portabilità dei dati;</LI>
        <LI>proporre reclamo al Garante per la protezione dei dati personali.</LI>
      </ul>
      <P>
        Per esercitare questi diritti scrivi a{' '}
        <a href={CONTACTS.email} className="text-brand-pink hover:underline">{CONTACTS.emailAddress}</a>.
      </P>

      <H>8. Sicurezza</H>
      <P>
        Adottiamo misure tecniche e organizzative ragionevoli per proteggere i dati. Nessun sistema è però
        sicuro al 100%: ti invitiamo a non comunicarci dati non necessari.
      </P>

      <H>9. Minori</H>
      <P>
        Il Servizio non è rivolto a minori di 14 anni e non raccogliamo consapevolmente i loro dati.
      </P>

      <H>10. Modifiche a questa informativa</H>
      <P>
        Potremo aggiornare questa informativa nel tempo. La versione aggiornata sarà sempre disponibile a questo
        indirizzo, con la data di ultimo aggiornamento indicata in alto.
      </P>

      <H>11. Contatti</H>
      <P>
        Per qualsiasi domanda su questa informativa o sul trattamento dei tuoi dati:{' '}
        <a href={CONTACTS.email} className="text-brand-pink hover:underline">{CONTACTS.emailAddress}</a>.
      </P>
    </div>
  );
}
