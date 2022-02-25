class Cell {
	constructor(x, y, maze) {
		this.x = x
		this.y = y
		this.maze = maze
		this.address = ""
		this.description = ""
		this.pathQuality = "track"
		this.visited = false
		this.inOpenSpace = false
		this.openSpaceAdjacent = false
		this.hasStructure = false
		this.onStreet = false
		this.items = []
		this.characters = []
		this.neighbour = {
			north:			null,
			east:				null,
			south:			null,
			west:				null,
			northeast:	null,
			southeast:	null,
			southwest:	null,
			northwest:	null
		}
		this.wall = {
			north:	false,
			east:		false,
			south:	false,
			west:		false
		}
		this.gentrification = 0
		this.edginess = 0
		this.background = null
		this.sprite = null
		this.decoration = null
	}

	addItem(item) {this.items.push(item)}
	removeItem(item) {this.items.splice(this.items.indexOf(item), 1)}

	addCharacter(character) {this.characters.push(character)}
	removeCharacter(character) {this.characters.splice(this.characters.indexOf(character), 1)}

	exit(d) { return this.wall[d] ? false : true }

	isOpenSpace() {
		return (this.exit("north") && this.exit("east") && this.exit("south") && this.exit("west"))
	}

	applyImage() {
		let directions = ["north", "east", "south", "west"]
		let exits = []
		let str

		if (this.background == null) {
			if (this.inOpenSpace == true) {
				this.background = this.maze.sprites.find(s => s.name == "grass_nesw")
			} else {
			this.background = this.maze.sprites.find(s => s.name == "dirt_nesw")
		}
	}

		if (this.sprite == null && this.openSpaceAdjacent == false) {
			for (let dir of directions) { if (this.exit(dir))	exits.push(dir.charAt(0)) }
			str = `${this.pathQuality}_${exits.join("")}`
			this.sprite = this.maze.sprites.find(s => s.name == str)
		}

		// for (let [k, v] of Object.entries(this.neighbour)) {
		// 	if (v && (v.openSpaceAdjacent == true) && this.openSpaceAdjacent == false && v.inOpenSpace == false && this.inOpenSpace == false) {
		// 		this.sprite = this.maze.sprites.find(s => s.name == `${this.pathQuality}_nesw`)
		// 	}
		// }
	}

	show() {
		noStroke()
		rectMode(CENTER)
		fill(mapRange(this.edginess, 0, 10, 0, 255), 0, mapRange(this.gentrification, 0, 10, 0, 255), 50)
		this.background.draw(this.x, this.y)
		if (this.sprite) {
			this.sprite.draw(this.x, this.y)
		}
		if (this.decoration) {
			this.decoration.draw(this.x, this.y)
		}
	}
}