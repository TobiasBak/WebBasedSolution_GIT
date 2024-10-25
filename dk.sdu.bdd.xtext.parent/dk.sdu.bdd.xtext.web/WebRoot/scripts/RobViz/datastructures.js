export {
    Position,
    Offset,
}

class Offset {
    constructor(x, y, z) {
        this.x = Number.parseFloat(x);
        this.y = Number.parseFloat(y);
        this.z = Number.parseFloat(z);
    }

    get x_error() {
        return this.x;
    }

    get y_error() {
        return this.y;
    }

    get z_error() {
        return this.z;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

class Position {
    constructor(x, y, z) {
        this.x = Number.parseFloat(x);
        this.y = Number.parseFloat(y);
        this.z = Number.parseFloat(z);
    }

    subtract(position) {
        return new Offset(this.x - position.x, this.y - position.y, this.z - position.z);
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}




