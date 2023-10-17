import Player from '../player';

function setupAllCoordinates() {
    const coordinates: number[][] = [];
    let [x, y] = [1, 1];

    for (let i = 0; i < 100; i++) {
        if (y > 10) {
            x++;
            y = 1;
        }
        coordinates.push([x, y]);
        y++;
    }

    return coordinates;
}

export default class AiPlayer extends Player {
    enemySquares: number[][];

    constructor(name:string) {
        super(name);
        this.enemySquares = setupAllCoordinates();
    }
}