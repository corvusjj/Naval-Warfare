function coordinateSeeker(currentCoord:number[], direction:string, span:number) {
    const x:number = currentCoord[0];
    const y:number = currentCoord[1];

    let coordinates:number[] = [];

    switch (direction) {
        case 'top':
            coordinates = [(x - span), y];
            break;
        case 'right':
            coordinates = [x, (y + span)];
            break;
        case 'bottom':
            coordinates = [(x + span), y];
            break;
        case 'left':
            coordinates = [x, (y - span)];
            break;
    }

    const appCoord:number[] = coordinates;
    const interfaceCoord:string = coordinates.join('-');

    return [appCoord, interfaceCoord];
}

export { coordinateSeeker }
