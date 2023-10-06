export default class Ship {
    private length: number;
    private hits: number;
    private isVertical: boolean;
    private sunk: boolean;

    constructor(length:number) {
        this.length = length;
        this.hits = 0;
        this.isVertical = true;
        this.sunk = false;
    }

    getDirection() {
        return this.isVertical? 'vertical': 'horizontal';
    }

    toggleDirection() {
        if (this.isVertical) {
            this.isVertical = false;
        } else this.isVertical = true;
    }

    getLength() {
        return this.length;
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

    numOfHits() {
        return this.hits;
    }
}
