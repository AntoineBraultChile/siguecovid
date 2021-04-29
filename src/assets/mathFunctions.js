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

export  {meanWeek,derivate}
