// compute rolling mean on a week window
function meanWeek(tabValues){
  let weekAverage=[];
  for (let i=0;i<tabValues.length-7; i++){
    weekAverage.push((tabValues[i]+tabValues[i+1]+tabValues[i+2]+tabValues[i+3]+tabValues[i+4]+tabValues[i+5]+tabValues[i+6])/7)
  }
  return weekAverage;
}

// return the derivative of an array
function derivate(cumulativeValues){
  let derivative = []
  for ( let i=0; i < cumulativeValues.length-1;i++){
    derivative.push(cumulativeValues[i+1]-cumulativeValues[i])
  }
  return derivative;
}

// return the sum of the two array, if the first array is empty it returns the second Array
function sumArray(firstArray, secondArray){
  if (firstArray.length == 0){
    return secondArray;
  }else{
    if (firstArray.length != secondArray.length){
      console.log('ERROR: the two arrays need to have the same length or the first array need to be empty !');
    }else{
      return firstArray.map((el,indx) => {return el + secondArray[indx]});
    }
  }
}

export  {meanWeek,derivate,sumArray}
