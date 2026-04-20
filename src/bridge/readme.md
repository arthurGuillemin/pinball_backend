# 📡 MQTT Client – Node.js

Ce projet est un client MQTT simple écrit en Node.js utilisant la bibliothèque `mqtt`. Il permet de se connecter à un broker MQTT, de s’abonner à un topic et de recevoir/envoyer des messages.

---

## 🚀 Fonctionnalités

* Connexion à un broker MQTT
* Abonnement à un topic spécifique
* Réception et parsing des messages JSON
* Envoi d’un message à la connexion
* Gestion des événements (reconnexion, erreur, offline, etc.)

---

## 📦 Installation

1. Cloner le projet ou copier le fichier
2. Installer les dépendances :

```bash
npm install mqtt
```

---

## ⚙️ Configuration

Trois serveurs MQTT sont définis dans le code :

```js
const PROF_MQTT_SERVER_LINK = "mqtt://captain.dev0.pandor.cloud:1884";
const BATNA_MQTT_SERVER_LINK = "mqtt://batna.freemyip.com:1883";
const LOCAL_MQTT_SERVER_LINK = "mqtt://localhost:1883";
```

👉 Par défaut, le client se connecte à :

```js
PROF_MQTT_SERVER_LINK
```

Tu peux changer le serveur en modifiant cette ligne :

```js
const mqttClient = mqtt.connect(PROF_MQTT_SERVER_LINK);
```

---

## 🧭 Topic utilisé

```js
const MQTT_TOPIC = "Pinball/Younes";
```

Le client :

* s’abonne à ce topic
* écoute les messages entrants
* attend un JSON valide

---

## ▶️ Lancement

```bash
node index.js
```

---

## 🔁 Comportement

### À la connexion :

* Souscription au topic
* Envoi d’un message :

```text
Client Say → Hello mqtt
```

---

### À la réception d’un message :

* Conversion en JSON
* Affichage dans la console

```js
mqttClient.on("message", (topic, message) => {
    const telemetry = JSON.parse(message.toString());
    console.log(telemetry);
});
```

⚠️ Assure-toi que les messages reçus sont bien au format JSON.

---

## ⚡ Gestion des événements

| Événement   | Description              |
| ----------- | ------------------------ |
| `connect`   | Connexion réussie        |
| `message`   | Message reçu             |
| `error`     | Erreur de connexion      |
| `close`     | Connexion fermée         |
| `reconnect` | Tentative de reconnexion |
| `offline`   | Client hors ligne        |

---

## 🔄 Reconnexion automatique

Le client tente de se reconnecter toutes les secondes :

```js
reconnectPeriod: 1000
```

---

## 🛠️ Améliorations possibles

* Gestion d’erreurs JSON (`try/catch`)
* Ajout d’un système de logs structuré
* Support de plusieurs topics
* Configuration via variables d’environnement (.env)
* Ajout d’un publisher séparé

---

## 📌 Exemple de message attendu

```json
{
  "temperature": 22.5,
  "humidity": 60
}
```

---

## 👨‍💻 Auteur
- Pinbal Groupe N° 007 