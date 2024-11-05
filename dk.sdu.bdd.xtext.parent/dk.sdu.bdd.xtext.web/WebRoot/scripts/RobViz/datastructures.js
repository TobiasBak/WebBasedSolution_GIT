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

/**
 * Represents a position in 3D space.
 * @param {Number} x The x-coordinate of the position.
 * @param {Number} y The y-coordinate of the position.
 * @param {Number} z The z-coordinate of the position.
 */
class Position {
    // Intentionally reordered to match the meaning in three.js
    constructor(x, z, y) {
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





