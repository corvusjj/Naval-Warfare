export default class Ship {
    private length: number;
    private hits: number;
    private sunk: boolean;

    constructor(length:number) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    isSunk() {
        return this.sunk? true: false;
    }

    hit() {
        this.hits += 1;

        if (this.hits === this.length) {
            this.sunk = true;
        }
    }

    get numOfHits() {
        return this.hits;
    }
}
