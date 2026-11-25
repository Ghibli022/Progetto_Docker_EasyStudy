# Easy Study – Installazione con Docker

Questo progetto si basa sulla dockerizzazione del progetto di semestre di Jan Vidal e Amel Cehic (la dockerizzazione è stata fatta unicamente da Jan).

## Funzionalità disponibili

In questa versione di produzione sarà possibile utilizzare le seguenti funzionalità:

- Effettuare il login e accedere al proprio account.
- Creare richieste di aiuto e unirsi a quelle esistenti.
- Caricare file, scaricarli e segnalarli. Per utilizzare la funzionalità di segnalazione è necessario configurare un servizio SMTP (vedi .env.example).

## 1. Dockerfile multi-stage

Il Dockerfile utilizza due stage:

**Build**
- Utilizza un'immagine Node.js.
- Installa gli strumenti necessari per compilare le dipendenze.
- Copia `package.json` e `package-lock.json`.
- Installa le dipendenze con `npm ci --omit=dev`.

**Production**
- Crea un'immagine Node.js pulita.
- Copia le dipendenze installate nel primo stage.
- Copia il codice backend e frontend.
- Configura i permessi e avvia il server.

La struttura multi-stage permette di ottenere un'immagine finale più leggera, senza includere gli strumenti utilizzati solamente durante la compilazione.

## 3. Docker Compose

Il file `docker-compose.yml` gestisce due servizi:

- **Backend:** viene costruito localmente utilizzando il Dockerfile ed espone la porta 3000.
- **Database:** utilizza MariaDB e carica lo script SQL iniziale contenente la struttura del database + alcuni dati obbligatori.

Sono inoltre configurati due volumi persistenti:

- `mariadb_data`: conserva i dati del database.
- `uploads_data`: conserva i file caricati dagli utenti.

## 4. Configurazione

Prima di avviare il progetto, creare il file `.env` partendo da `.env.example`.

Su Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Aprire `.env` e modificare le credenziali.

Variabili principali:

| Variabile | Descrizione |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Password root di MariaDB |
| `MYSQL_DATABASE` | Nome del database |
| `DB_NAME` | Database utilizzato dal backend |
| `DB_USER` | Utente del database |
| `DB_PASSWORD` | Password del database |
| `SESSION_SECRET` | Chiave segreta delle sessioni |
| `SMTP_USER` | Utente email |
| `SMTP_PASS` | Password email |
| `RESEND_API_KEY` | Chiave API Resend |

Per le credenziali e la chiave API di SMTP è consigliato usare il servizio "Resend" gratuito e intuitivo.
Se il backend utilizza root, `DB_PASSWORD` deve essere uguale a `MYSQL_ROOT_PASSWORD`.

## 5. Avvio

È necessario avere Docker Desktop installato e avviato.

Aprire il terminale nella cartella contenente `docker-compose.yml`.

**1. Avviare i servizi:**

```bash
docker compose up -d
```

**2. Verificare lo stato dei container:**

```bash
docker compose ps
```

**3. Visualizzare i log:**

```bash
docker compose logs
```

**4. Aprire l'applicazione:**

http://localhost:3000

## 6. Arresto

Per arrestare i container mantenendo i dati:

```bash
docker compose down
```

Per avviare nuovamente:

```bash
docker compose up -d
```

**Attenzione:** il comando seguente elimina anche i volumi e tutti i dati salvati:

```bash
docker compose down -v
```

Utilizzarlo solamente per effettuare un reset completo.

