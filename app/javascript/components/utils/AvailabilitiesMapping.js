import Availability from './Availability';

class AvailabilityMapping {
  constructor(availabilities) {
    this.availabilitiesMinimized = availabilities;
  }

  //Each availablity contains an array of days
  //Store the highest index value for each availability as if the arrays for days
  // were a flat array
  generateeExpandedIndexMapping() {
    return this.availabilitiesMinimized.reduce((maxIndexList, entry)=>{
      if(maxIndexList.length === 0) {
        const entrysLastIndex = entry.days.length - 1;
        maxIndexList.push(entrysLastIndex);
      }else {
        const previousMaxIndex = maxIndexList[maxIndexList.length - 1];
        maxIndexList.push(entry.days.length + previousMaxIndex);
      }     
      return maxIndexList;
    }, []);
  }
    
  getOriginalIndex(flattenedIndex) {
    if (typeof this.indexMapping === 'undefined') {
      this.indexMapping = this.generateeExpandedIndexMapping();
    }
    const index = this.indexMapping.findIndex(entryMaxIndex => (flattenedIndex <= entryMaxIndex) );
    return index;
  }

  getExpandedAvailabilities() {
    //To match format accepted by server, convert array to an object
    const expandedAvailabilities = {};
  
    let lastIndex = 0;
    this.availabilitiesMinimized.forEach( (availability) => {
      availability.days.forEach(day => {
        expandedAvailabilities[`${lastIndex}`] = {
          day: day,
          start_time: Availability.getTimeString(availability.startTime),
          end_time: Availability.getTimeString(availability.endTime),
        };
        lastIndex++;
      });
    });

    return { availabilities: expandedAvailabilities };
  }

  getErrorsCorrectIndices(errors) {
    const messages = [];
    errors.forEach( (message, index) => {
      const originalIndex = this.getOriginalIndex(index);
      const messageProcessed = (message === null) ? '' : message;

      messages[originalIndex] = messageProcessed;
    });

    return messages;
  }
}

export default AvailabilityMapping;