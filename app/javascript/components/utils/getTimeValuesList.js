function getTimeValuesList(firstValue, lastValue) {
  const list = [];

  for (let i = firstValue; i <= lastValue; i++) {
    if( i < 10)
      list[i] = '0' + i.toString();  
    else
      list[i] = i.toString();
  }
  return list;
    
  }
    
  export default getTimeValuesList;