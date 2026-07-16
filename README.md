# 🌐 Giampaolo Marchioro — Portfolio & Online CV

Questo repository contiene il codice sorgente per il sito web portfolio e curriculum vitae interattivo di **Giampaolo Marchioro (Chef de Cuisine & Pizzaiolo)**.

Il sito è pronto per essere pubblicato gratuitamente su **GitHub Pages** (che fornisce automaticamente la connessione protetta HTTPS/SSL).

---

## 🚀 Guida alla Pubblicazione su GitHub Pages

Segui questi passaggi per mettere il tuo sito online in 5 minuti:

### 1. Inizializzazione di Git e Caricamento su GitHub
1. Accedi al tuo account **GitHub** e crea un nuovo repository pubblico (chiamalo ad esempio `cv-giampaolo`).
2. Apri il terminale del tuo Mac nella cartella del progetto ed esegui i seguenti comandi:
   ```bash
   git init
   git add .
   git commit -m "Primo commit: Sito CV completo"
   git branch -M main
   git remote add origin https://github.com/IL_TUO_USERNAME/cv-giampaolo.git
   git push -u origin main
   ```
   *(Sostituisci `IL_TUO_USERNAME` con il tuo username reale di GitHub)*

### 2. Attivazione di GitHub Pages (Hosting Gratuito & Sicuro HTTPS)
1. Vai sulla pagina del tuo repository appena creato su GitHub.
2. Clicca sulla scheda **Settings** (Impostazioni) in alto.
3. Nel menu a sinistra, clicca su **Pages**.
4. Sotto la sezione **Build and deployment**, imposta la sorgente su **Deploy from a branch**.
5. Sotto **Branch**, seleziona `main` (o `master`) e la cartella `/ (root)`, poi clicca su **Save**.
6. Attendi circa 1-2 minuti. Aggiorna la pagina e vedrai un messaggio in alto con il link del tuo sito online (es: `https://username.github.io/cv-giampaolo/`).
7. **Sicurezza (HTTPS):** Assicurati che l'opzione **Enforce HTTPS** sia spuntata. Questo garantirà che il sito sia contrassegnato come "Sicuro" (con il lucchetto) in qualsiasi browser.

---

## 📧 Configurazione Ricezione Email Automatica (Formspree)

Il modulo di contatto salva tutte le richieste localmente e, come comportamento predefinito, apre il client email del visitatore (es. Outlook o Mail). 
Per fare in modo che le email ti arrivino **automaticamente in background** senza che l'utente debba fare nulla, puoi configurare il servizio gratuito **Formspree**:

1. Vai su [Formspree.io](https://formspree.io/) e crea un account gratuito.
2. Crea un nuovo modulo (chiamalo ad esempio "Contatti CV") e inserisci come email di destinazione `giampaolo@marchioro.org`.
3. Formspree ti fornirà un codice identificativo chiamato **Form ID** (è un codice alfanumerico di 8 caratteri, ad esempio `xvodyqwl`).
4. Apri il file [app.js](file:///Users/mgiam/Documents/GitHub/website%20CV%20MG/app.js) del tuo progetto, trova la riga 478 ed inserisci il tuo ID tra le virgolette:
   ```javascript
   const FORMSPREE_ID = "IL_TUO_ID_FORMSPREE"; // Esempio: "xvodyqwl"
   ```
5. Salva e fai il push delle modifiche su GitHub (`git commit -am "Aggiunto ID Formspree" && git push`). 
Ora, quando un utente invia il modulo, riceverai immediatamente un'email e la notifica sul tuo smartphone!

---

## 📊 Gestione delle Richieste e Pannello di Amministrazione (Admin)

Tutti i messaggi inviati tramite il modulo vengono salvati localmente sul database del browser (`localStorage`).
Puoi accedere a un pannello di gestione protetto per consultare, rispondere o esportare le richieste:

- **Indirizzo del pannello:** Apri la pagina `/admin.html` (es: `https://username.github.io/cv-giampaolo/admin.html`).
- **Password di accesso provvisoria:** `Chef2024!GM`

> ⚠️ **Raccomandazione di sicurezza:** Puoi modificare la password all'interno del file [admin.html](file:///Users/mgiam/Documents/GitHub/website%20CV%20MG/admin.html) alla riga 146 modificando il valore della costante `ADMIN_PASSWORD`.

---

## 📂 Struttura del Progetto

- `index.html` - Pagina principale del curriculum (HTML5 semantico).
- `style.css` - Foglio di stile CSS personalizzato con design claymorphism e slideshow.
- `app.js` - Logica interattiva (cambio lingua, accordion timeline, controllo galleria e invio modulo).
- `db.js` - Gestione database locale (`localStorage`) ed esportazione dati.
- `translations.js` - Pacchetti di traduzione per le 4 lingue (FR, IT, EN, DE).
- `photo-list.js` - Configurazione delle immagini della galleria e delle relative icone SVG tematiche.
- `admin.html` - Pannello amministrativo protetto.
- `LICENSE` - Licenza software (MIT License).
