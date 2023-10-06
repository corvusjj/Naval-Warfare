import { describe, expect, it } from 'vitest';
import Ship from '../ship';

describe('Carrier (length of 5)', () => {
    it('hit 2 times, not sunk', () => {
        const carrier = new Ship(5);
        carrier.hit();
        carrier.hit();
        expect(carrier.numOfHits).toBe(2);
        expect(carrier.sunk).toBe(false);
    });

    it('hit 5 times, sunk', () => {
        const carrier = new Ship(5);
        for(let i = 0; i < 5; i++) {
            carrier.hit();
        }
        expect(carrier.numOfHits).toBe(5);
        expect(carrier.sunk).toBe(true);
    });
});

describe('Cruiser (length of 3)', () => {
    it('hit 3 times, sunk', () => {
        const cruiser = new Ship(3);
        for(let i = 0; i < 3; i++) {
            cruiser.hit();
        }
        expect(cruiser.numOfHits).toBe(3);
        expect(cruiser.sunk).toBe(true);
    });

    it('num of length should be equal to 0 if not hit', () => {
        const cruiser = new Ship(3);
        expect(cruiser.numOfHits).toBe(0);
    });
});
