class Timer {
    t0 = 0;
    label = "";
    id = 0;
    constructor(label) {
        this.label = label;
        this.t0 = Date.now();
        console.log("Begin ", this.label);
    }
    end() {
        var diff = (Date.now() - this.t0) / 1000;
        console.log("end", this.label, diff);

        
    }
}