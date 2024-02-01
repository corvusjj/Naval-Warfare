import Ship from "../gameTemplates/ship";

export function fleetStandard() {
    return {
        c: new Ship(5),  // carrier
        b: new Ship(4),  // battleship
        r: new Ship(3),  // cruiser
        s: new Ship(3),  // submarines
        d: new Ship(2)   // destroyer 
    }
}
