export default class Ship {
    length: number;
    numOfHits: number;
    sunk: boolean;

    constructor(length:number) {
        this.length = length;
        this.numOfHits = 0;
        this.sunk = false;
    }

    isSunk() {
        this.sunk = true;
    }

    hit() {
        this.numOfHits += 1;

        if (this.numOfHits === this.length) {
            this.isSunk();
        }
    }
}
