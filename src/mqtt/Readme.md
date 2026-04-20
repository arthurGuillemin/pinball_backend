# 📡 MQTT Broker avec Mosquitto (Docker)

Ce projet permet de déployer rapidement un broker MQTT en utilisant **Eclipse Mosquitto** via Docker Compose.

---

## 🚀 Configuration

Voici le fichier `docker-compose.yml` utilisé :

```yaml
version: '3.7'

services:
  mqtt:
    image: eclipse-mosquitto:latest
    container_name: MyMosquitto
    restart: always
    ports:
      - '1883:1883'
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
```

---

## 📂 Structure des dossiers

Assurez-vous que les dossiers suivants existent dans votre projet :

```
mosquitto/
├── config/
├── data/
└── log/
```

---

## ▶️ Lancement du service

Démarrez le broker MQTT avec la commande :

```bash
docker-compose up -d
```

Vérifiez que le conteneur fonctionne :

```bash
docker ps
```

---

## 🌐 Accès et test

Le broker MQTT est exposé sur le port :

```
1883
```

### 🔗 Endpoint de test

Vous pouvez tester la connectivité via :

```
http://batna.freemyip.com:1883
```

⚠️ Remarque : MQTT utilise un protocole spécifique, donc ce lien HTTP sert uniquement à vérifier l'accessibilité réseau (pas une interface web).

---

## 🧪 Exemple de test avec Mosquitto CLI

### Publier un message :

```bash
mosquitto_pub -h batna.freemyip.com -p 1883 -t test/topic -m "Hello MQTT"
```

### Souscrire à un topic :

```bash
mosquitto_sub -h batna.freemyip.com -p 1883 -t test/topic
```

---

## ⚙️ Configuration Mosquitto

Le fichier de configuration principal doit être placé dans :

```
./mosquitto/config/mosquitto.conf
```

Exemple minimal :

```conf
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
```

---

## 🔒 Sécurité (optionnel mais recommandé)

Pour un usage en production :

- Désactiver `allow_anonymous`
- Ajouter un fichier de mots de passe
- Configurer TLS/SSL

---

## 📝 Logs

Les logs sont disponibles dans :

```
./mosquitto/log/
```

---

## 📦 Arrêt du service

```bash
docker-compose down
```

---

## ✅ Résumé

- Broker MQTT prêt à l’emploi
- Persistance des données et logs
- Facilement extensible pour la production

---

💡 Astuce : utilisez des outils comme **MQTT Explorer** ou **Node-RED** pour tester visuellement vos messages MQTT.
