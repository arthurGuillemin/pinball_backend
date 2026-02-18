# Pinball Backend — Serveur Central

Serveur Node.js centralisant la logique du flipper virtuel : API REST pour les scores, WebSockets pour la communication en temps réel entre les trois écrans (Playfield, Backglass, DMD) et les contrôleurs ESP32.

---

## Stack technique

- **Node.js** avec ES Modules (`"type": "module"`)
- **Express** — API REST
- **Socket.io** — Communication temps réel
- **Supabase** — Base de données PostgreSQL hébergée
- **dotenv** — Gestion des variables d'environnement
- **nodemon** — Rechargement automatique en développement

---

## Installation

```bash
npm install
```

---

## Variables d'environnement

Crée un fichier `.env` à la racine du projet :

```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxxx
```

Les valeurs `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont disponibles dans le dashboard Supabase sous **Settings > API**.

---

## Lancement

```bash
# Dev 
npm run dev

# Prod
npm start
```

---

## Structure du projet

```
src/
├── index.js          # Point d'entrée — serveur HTTP, Express, Socket.io
├── config/
│   └── db.js         # Init du client Supabase
└── routes/
    └── scores.js     # REST pour les scores
```

---

## API REST

### `GET /api/scores`

Retourne le top 10 des scores les plus élevés.

**Réponse**
```json
[
  { "id": 1, "player_name": "Arthur", "score": 42000, "created_at": "..." },
  ...
]
```

---

### `POST /api/scores`

Ajoute un nouveau score.

**Body**
```json
{
  "player_name": "Arthur",
  "score": 42000
}
```

**Réponse** `201`
```json
{ "id": 2, "player_name": "Arthur", "score": 42000, "created_at": "..." }
```

---

## Base de données

Table Supabase `scores` :

| Colonne | Type | Description |
|---|---|---|
| `id` | int8 | primary key auto-incr |
| `player_name` | varchar | Nom du joueur |
| `score` | int8 | Score final |
| `created_at` | timestamptz | Date d'insert automatique |

---

## WebSockets (a venir)

Deux namespaces Socket.io seront implémentés :

- `/screens` — Synchronisation entre Playfield, Backglass et DMD
- `/controllers` — Réception des inputs depuis les ESP32 (flippers, start, nudge)