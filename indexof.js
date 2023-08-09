for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j] === values[i]) {
        indices.push(j);
      }
    }
  }


  let arr = [1, 2, 3, 2, 5];

let values = [2, 2]; 
let indices = [];

for (let i = 0; i < values.length; i++) {
  let value = values[i];
  let index = arr.indexOf(value);
  while (index !== -1) {
    indices.push(index);
    index = arr.indexOf(value, index + 1);
  }
}