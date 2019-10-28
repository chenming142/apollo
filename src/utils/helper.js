Array.prototype.getRdItem = function() {
  return this[Math.floor(Math.random() * this.length)];
}

export function generateRdNum(min, max) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * min + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (max - min + 1) + min, 10);
      break;
  }
}

let arr = Array.from({
        length: 10
      }, () =>
      generateRdNum(0, 1)
    );
console.log(arr);