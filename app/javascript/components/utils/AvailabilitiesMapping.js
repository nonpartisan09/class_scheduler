class AvailabilityMapping {
  constructor(availabilitiesObj) {
    this.availabilitiesRaw = availabilitiesObj;
  }

  generateFlattenedIndexMapping() {
    const entries = Object.values(this.availabilitiesRaw);
    return entries.reduce((map, entry)=>{
      if(map.length === 0) {
        const entrysLastIndex = entry.length - 1;
        map.push(entrysLastIndex);
      }else {
        const previousMaxIndex = map[map.length - 1];
        map.push(entry.length + previousMaxIndex);
      }     
      return map;
    }, []);
  }
    
  getOriginalIndex(flattenedIndex) {
    if (typeof this.indexMapping === 'undefined') {
      this.indexMapping = this.generateFlattenedIndexMapping();
    }
    const index = this.indexMapping.findIndex(entryMaxIndex => flattenedIndex <= entryMaxIndex);
    return index;
  }

  getFlattenedAvailabilities() {
    const availabilities = {};
    const allEntries = Object.values(this.availabilitiesRaw).flat();
    allEntries.forEach((availability, index) => {
      availabilities[index] = availability;
    });

    return { availabilities }; 
  }

  getErrorsCorrectIndices(errors) {
    const messages = [];
    errors.forEach( (message, index) => {
      const originalIndex = this.getOriginalIndex(index);
      const messageProcessed = (message === null) ? '' : message;
      const indexEmpty = (typeof messages[originalIndex] === 'undefined') || (messages[originalIndex] === null);

      if (indexEmpty) {
        messages[originalIndex] = message;
      } else {
        messages[originalIndex] += '\n' + messageProcessed;
      }
    });

    return messages;
  }
}

export default AvailabilityMapping;