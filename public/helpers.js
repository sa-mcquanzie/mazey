function sample(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function mapRange(num, startR1, endR1, startR2, endR2) {
	return (num - startR1) * (endR2 - startR2) / (endR1 - startR1) + startR2;
}

function randIntBetween(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))
}

function floorTo(n, val) {
	return Math.floor(val/n) * n
}

function ceilTo(n, val) {
	return Math.ceil(val/n) * n
}

function intersecting(x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1) {
		return false
	} else {
		return true
	}
}

function capitalise(string) {
	strArray = string.split('')
	strArray[0] = string[0].toUpperCase()
	return strArray.join('')
}

function callWithProbability(frequency, sampleSize, func) {
	let sampleSpace = range(1, sampleSize)
	let hits = range(1, frequency)
	let choice = sample(sampleSpace)
	if (hits.includes(choice)) func()
}

function repeat(times, func) {
	for (let i = 0; i < times; i++) {
		func()
	}
}