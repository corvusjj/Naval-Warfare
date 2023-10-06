import { describe, expect, it } from 'vitest';
import Ship from '../ship';

describe('Carrier (length of 5)', () => {
    it('hit 2 times, not sunk', () => {
        const carrier = new Ship(5);
        carrier.hit();
        carrier.hit();
        expect(carrier.numOfHits()).toBe(2);
        expect(carrier.isSunk()).toBe(false);
    });

    it('hit 5 times, sunk', () => {
        const carrier = new Ship(5);
        for(let i = 0; i < 5; i++) {
            carrier.hit();
        }
        expect(carrier.numOfHits()).toBe(5);
        expect(carrier.isSunk()).toBe(true);
    });

    it('should return "horizontal" from invoking toggleDirection method once', () => {
        const carrier = new Ship(5);
        carrier.toggleDirection();
        expect(carrier.getDirection()).toBe('horizontal');
    });

    it('should return "vertical" as direction by default', () => {
        const carrier = new Ship(5);
        expect(carrier.getDirection()).toBe('vertical');
    })
});

describe('Cruiser (length of 3)', () => {
    it('hit 3 times, sunk', () => {
        const cruiser = new Ship(3);
        for(let i = 0; i < 3; i++) {
            cruiser.hit();
        }
        expect(cruiser.numOfHits()).toBe(3);
        expect(cruiser.isSunk()).toBe(true);
    });

    it('num of hits should be equal to 0 if not hit', () => {
        const cruiser = new Ship(3);
        expect(cruiser.numOfHits()).toBe(0);
    });
    
    it('should return "vertical" from invoking toggleDirection method twice', () => {
        const carrier = new Ship(3);
        carrier.toggleDirection();
        carrier.toggleDirection();
        
        expect(carrier.getDirection()).toBe('vertical');
    });
});
