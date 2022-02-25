class Room {
	constructor(x, y, w, h) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.area = w * h
		this.doors = []
		this.cells = []
		this.perimeter = []
		this.walls = []

		for (let i = this.x; i < this.x + this.w * cellSize; i += cellSize) {
			this.walls.push(new Wall(i, this.y, cellSize, "north"))
		}
		for (let i = this.y; i < this.y + this.h * cellSize; i += cellSize) {
			this.walls.push(new Wall(this.x + this.w * cellSize - cellSize, i, cellSize, "east"))
		}
		for (let i = this.x; i < this.x + this.w * cellSize; i += cellSize) {
			this.walls.push(new Wall(i, this.y + this.h * cellSize - cellSize, cellSize, "south"))
		}
		for (let i = this.y; i < this.y + this.h * cellSize; i += cellSize) {
			this.walls.push(new Wall(this.x, i, cellSize, "west"))
		}
	}

	show() {
		noStroke()
		fill(0)
		// rect(this.x, this.y, this.w * cellSize, this.h * cellSize)

		// this.walls.forEach((wall) => wall.show())
	}
}