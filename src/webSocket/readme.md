# WebSocket Communication - ESP32 Pinball

## Message Format

All WebSocket messages use the following JSON structure:

```json
{
  "type": "message",
  "direction": "LEFT",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

---

# Fields

| Field | Type | Description |
|---|---|---|
| `type` | string | Message type |
| `direction` | string | Control direction or button |
| `event` | string | Triggered event |
| `strengh` | number | Launcher power value |
| `to` | string | Message receiver |
| `from` | string | Message sender |

---

# Events

| Event | Description |
|---|---|
| `DOWN` | Button pressed |
| `UP` | Button released |

---

# Directions

| Direction | Description |
|---|---|
| `LEFT` | Left flipper |
| `RIGHT` | Right flipper |
| `LAUNCHER` | Ball launcher |
| `START` | Start button |
| `RED` | Red button |
| `WHITE` | White button |
| `BLUE` | Blue button |

---

# Examples

## LEFT

### Press

```json
{
  "type": "message",
  "direction": "LEFT",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "LEFT",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```

---

## RIGHT

### Press

```json
{
  "type": "message",
  "direction": "RIGHT",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "RIGHT",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```

---

## LAUNCHER

### Pull launcher

```json
{
  "type": "message",
  "direction": "LAUNCHER",
  "event": "DOWN",
  "strengh": 0,
  "to": "pinball",
  "from": "ESP32"
}
```

### Launch ball

```json
{
  "type": "message",
  "direction": "LAUNCHER",
  "event": "UP",
  "strengh": 80,
  "to": "pinball",
  "from": "ESP32"
}
```

---

## START

### Press

```json
{
  "type": "message",
  "direction": "START",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "START",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```

---

## RED

### Press

```json
{
  "type": "message",
  "direction": "RED",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "RED",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```

---

## WHITE

### Press

```json
{
  "type": "message",
  "direction": "WHITE",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "WHITE",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```

---

## BLUE

### Press

```json
{
  "type": "message",
  "direction": "BLUE",
  "event": "DOWN",
  "to": "pinball",
  "from": "ESP32"
}
```

### Release

```json
{
  "type": "message",
  "direction": "BLUE",
  "event": "UP",
  "to": "pinball",
  "from": "ESP32"
}
```