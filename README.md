# pinball_backend
backend du flipper ; Un seul serveur Socket.io avec  plusieurs namespaces/rooms -- /controllers pour les ESP32 et /screens pôur les 3 ecrans
Archi : 

flipper-server/
├── src/
│   ├── index.js               ← point d'entree
│   │
│   ├── config/
│   │   └── db.js              ← connection db supabase
│   │
│   ├── routes/
│   │   └── scores.js          ← api scores 
│   │
│   ├── sockets/
│   │   ├── index.js           ← init socket, branche les namespaces
│   │   ├── screens.js         ← namespace /screens (playfield ↔ backglass ↔ dmd)
│   │   └── controllers.js     ← namespace /controllers (ESP32 → playfield)
│   │
│   └── game/
│       └── state.js           ← state de la partie en cours (score, billes, etc.)
│
├── package.json
└── .env                      
