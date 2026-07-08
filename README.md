# Pinball Backend — Serveur Central

Serveur Node.js centralisant la logique du flipper virtuel : API REST pour les scores, WebSockets pour la communication en temps réel entre les trois écrans (Playfield, Backglass, DMD) et les contrôleurs ESP32.

---

## Stack technique

- **Node.js** avec ES Modules (`"type": "module"`)
- **Express** — API REST

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

---

## Lancement

```bash
# Dev
npm run dev

```


---

## API REST

### `GET /api/scores`

Retourne le top 5 des scores les plus élevés.

**Réponse**

```json
[
  { "id": 1, "player_name": "Arthur", "score": 42000, "created_at": "..." },
  ...
]
```

---

## Base de données

Table Supabase `scores` :

| Colonne       | Type        | Description               |
| ------------- | ----------- | ------------------------- |
| `id`          | int8        | primary key auto-incr     |
| `player_name` | varchar     | Nom du joueur             |
| `score`       | int8        | Score final               |
| `created_at`  | timestamptz | Date d'insert automatique |

---

## WebSockets 

- `/screens` — Synchronisation entre Playfield, Backglass et DMD
