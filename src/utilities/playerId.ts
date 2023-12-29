const idGenerator = {
    idUsed: [] as string[],

    setId() {
        if (this.idUsed.length > 2) this.idUsed = this.idUsed.slice(2);

        const min = 1000;
        const max = 9999; 
      
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        const idToString = randomNumber.toString();
        this.idUsed.push(idToString);
      
        return idToString;
    }
}

export default idGenerator;
  