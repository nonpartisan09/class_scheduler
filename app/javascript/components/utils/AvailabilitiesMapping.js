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
    const allEntries = Object.values(this.availabilitiesRaw);
    return allEntries.flat();  
  }
}


//TODO
// var SAMPLE = {
//   0: [
//     {day: 1, end_time: '01:00', start_time:'00:02'},
//     {day: 2, end_time: '01:00', start_time:'00:02'}
//   ],
//   1: [
//     {day: 2, end_time: '02:45', start_time:'01:30'},
//     {day: 3, end_time: '02:45', start_time:'01:30'}
//   ],
//   2: [
//     {day: 6, end_time: '12:00', start_time:'10:00'}
//   ]
// };

//const testObj = new AvailabilityMapping(SAMPLE);
// console.log(testObj.getFlattenedAvailabilities());

export default AvailabilityMapping;