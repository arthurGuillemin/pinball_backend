
function tabulation(index) {
    return "    ".repeat(index);

}


const obj = {
    classToExclude: ["WebSocket", "Person"],
    log(obj) {
        let result = "########################################################\n";
        result += this.boucle(obj);
        console.log(result);
    },
    boucle(objToLog, key, index) {
        let leResultat = "";
        if (this.classToExclude.includes(objToLog.constructor.name)) {
            objToLog = "(# " + objToLog.constructor.name + " #)";
        }
        if (!index) {
            index = 0;
        }
        if (Array.isArray(objToLog)) {
            if (key) {
                leResultat += tabulation(index) + "" + key + " : [\n";
            } else {
                leResultat += tabulation(index) + "[\n";
            }
            index++;
            for (var a in objToLog) {
                leResultat += this.boucle(objToLog[a], a, index);
            }
            leResultat += tabulation(index - 1) + "]\n";
        } else if (typeof objToLog === "object") {
            if (key) {
                leResultat += tabulation(index) + "" + key + " : {";
            } else {
                leResultat += tabulation(index) + "{";
            }
            leResultat += "\n";
            index++;
            for (var a in objToLog) {
                leResultat += this.boucle(objToLog[a], a, index);
            }
            leResultat += tabulation(index - 1) + "}\n";
        } else {
            leResultat += tabulation(index) + key + " => " + objToLog + " ";
            leResultat += "\n";
        }
        return leResultat;
    }
}

// export default {
//     add: add,
//     substract: substract,
//     obj: obj
// }

export default obj;