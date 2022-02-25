class Item {
	constructor(name, description, frequency) {
		this.name = name
		this.description = description
		this.frequency = frequency
		this.cell
		this.owner
	}

	placeInCell(maze, x, y) {
		let cell = maze.cellAt(x, y)
		cell.addItem(this)
		this.cell = cell
	}

	placeInInventory(maze, character) {
		maze.characters.find(c => c.id === character.id).inventory.push(this)
		this.owner = character
	}
}