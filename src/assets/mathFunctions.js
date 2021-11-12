// compute rolling mean on a week window
function meanWeek(tabValues) {
  let weekAverage = [];
  for (let i = 0; i < tabValues.length - 6; i++) {
    weekAverage.push((tabValues[i] + tabValues[i + 1] + tabValues[i + 2] + tabValues[i + 3] + tabValues[i + 4] + tabValues[i + 5] + tabValues[i + 6]) / 7);
  }
  return weekAverage;
}

// return the derivative of an array
function derivate(cumulativeValues) {
  let derivative = [];
  for (let i = 0; i < cumulativeValues.length - 1; i++) {
    derivative.push(cumulativeValues[i + 1] - cumulativeValues[i]);
  }
  return derivative;
}

// return the derivative of an array
function derivateEachTwoDays(cumulativeValues) {
  let derivative = [];
  for (let i = 0; i < cumulativeValues.length - 2; i++) {
    derivative.push(cumulativeValues[i + 2] - cumulativeValues[i]);
  }
  return derivative;
}

// return the sum of the two array, if the first array is empty it returns the second Array
function sumArray(firstArray, secondArray) {
  if (firstArray.length == 0) {
    return secondArray;
  } else {
    if (firstArray.length != secondArray.length) {
      console.log("ERROR: the two arrays need to have the same length or the first array need to be empty !");
    } else {
      return firstArray.map((el, indx) => {
        return el + secondArray[indx];
      });
    }
  }
}

// function ordering values of bar plot with the corresponding labels
function order(labels, values) {
  let object = [];
  values.forEach((value, index) => {
    object.push({
      label: labels[index],
      val: value,
    });
  });
  object.sort((a, b) => {
    return b.val - a.val;
  });
  let labelsSort = [];
  let valuesSort = [];
  object.forEach((d) => {
    labelsSort.push(d.label);
    valuesSort.push(d.val);
  });
  // return {labels:labelsSort, values: valuesSort}
  return [labelsSort, valuesSort];
}

// remove outlier
function removeSenselessValues(values, senselessMultiplier = 5) {
  return values.map((value, index) => {
    const previousValue = index === 0 ? value : values[index - 1];
    const nextValue = index === values.length - 1 ? value : values[index + 1];

    if (value > senselessMultiplier * previousValue) return null;
    if (value > senselessMultiplier * nextValue) return null;
    return value;
  });
}

function toTimeSerie(labels, values) {
  let timeSerie = {};
  labels.forEach((lab, index) => (timeSerie[lab] = values[index]));
  return timeSerie;
}

function median(values) {
  if (values.length === 0) throw new Error("No inputs");

  values.sort(function(a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

export { meanWeek, derivate, sumArray, derivateEachTwoDays, order, removeSenselessValues, toTimeSerie, median };
