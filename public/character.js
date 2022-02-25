class Character {
	constructor(maze, name) {
		this.maze = maze
		this.x = floorTo(cellSize, randIntBetween(0, mazeWidth - cellSize))
		this.y = floorTo(cellSize, randIntBetween(0, mazeHeight - cellSize))
		this.name = name
		this.id = this.maze.characters.length
		this.inventory = []
		this.cell
		this.update()
		this.maze.characters.push(this)
	}

	take(item) {
		this.inventory.push(item)
		this.cell.removeItem(item)
		item.owner = this
	}

	update() {
		this.cell = this.maze.cellAt(this.x, this.y)
	}

	show() {
		noStroke()
		fill(255, 0, 0)
		rectMode(CENTER)
		ellipseMode(CENTER)
		ellipse(this.x + cellSize / 2, this.y + cellSize / 2, cellSize - 8)		
	}
}