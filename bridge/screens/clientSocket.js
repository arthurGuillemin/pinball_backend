


function Dispatcher(obj) {
    obj.eventListererList = {};
    obj.addEventListener = function (eventType, callbackFunction) {
        eventType = eventType.replace(/\s+/g, '').toUpperCase();
        if (!this.eventListererList[eventType]) {
            this.eventListererList[eventType] = [];
        }
        if (this.eventListererList[eventType].indexOf(callbackFunction) == -1) {
            this.eventListererList[eventType].push(callbackFunction);
        }
    }
    obj.dispatchEvent = function (eventType, data) {
        eventType = eventType.replace(/\s+/g, '').toUpperCase();
        let eventList = this.eventListererList[eventType];
        if (eventList) {
            for (var index in eventList) {
                let callbackFunction = eventList[index];
                if (typeof callbackFunction === "function") {
                    callbackFunction({
                        data: data,
                        currentTarget: this
                    });
                }
            }
        }
    }

}




class ClientSocket {
    uri = "ws://localhost:8080";
    webSocket = false;
    timeoutDelay;
    id = 1;
    autoConnect = true;

    compteur_dev = 0;

    constructor(uri, id) {
        Dispatcher(this);
        if (uri) {
            this.uri = uri;
        }
        if (id) {
            this.id = (id);
        }
    }
    connect(id) {
        if (id) {
            this.id = (id);
        }

        if (this.webSocket && this.webSocket.readyState <= 1) {
            return false;
        }
        this.autoConnect = true;
        this.webSocket = new WebSocket(this.uri);
        this.initEvent();
        this.timeoutToKillAndReconnect();

        console.log("try To Connect N°", ++this.compteur_dev);
    }
    tryToConnectAgain() {
        console.log(this.autoConnect);
        if (!this.autoConnect) {
            return false;
        }
        setTimeout(() => {
            this.connect();
        }, 5000);
    }
    close() {
        this.autoConnect = false;
        clearTimeout(this.timeoutDelay);
        this.webSocket.close();
    }
    sendMessage(message, to) {
        var jsonMessage = {
            "text": message,
            "from": this.id
        }
        if (to) {
            jsonMessage.to = to;
        }
        this.webSocket.send(JSON.stringify(jsonMessage));
    }
    timeoutToKillAndReconnect() {
        this.timeoutDelay = setTimeout(function () {
            if (this.webSocket.readyState != WebSocket.OPEN) {
                this.webSocket.close();
            }
        }.bind(this), 10000);
    }
    initEvent() {
        this.webSocket.onopen = () => {
            console.log("Connected...");
            clearTimeout(this.timeoutDelay);
            var handShake = {
                "id": this.id,
                "handShake": true
            }
            this.webSocket.send(JSON.stringify(handShake));
            this.dispatchEvent("OPEN", "");
        };
        this.webSocket.onclose = (arg) => {
            clearTimeout(this.timeoutDelay);
            this.tryToConnectAgain();
            this.dispatchEvent("CLOSE", arg);
        };
        this.webSocket.onerror = (error) => {
            this.dispatchEvent("ERROR", error);
        };
        this.webSocket.onmessage = (e) => {
            this.dispatchEvent("MESSAGE", e.data);
        };
    }
}