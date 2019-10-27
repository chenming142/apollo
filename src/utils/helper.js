Array.prototype.getRdItem = function () {
	return this[Math.floor(Math.random() * this.length)];
}