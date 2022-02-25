class Maze {
	constructor(spriteSheets) {
		this.sheets = spriteSheets
		this.noiseSeed = randIntBetween(1, 100);
		this.noiseIncrement = 0.01;
		this.cells = []
		this.characters = []
		this.items = []
		this.rooms = []
		this.walls = []
		this.sprites = []
		this.structures = []
		this.streets = []

		this.generateCells()
		this.generateSprites()

		while (this.streets.length < 15) { this.generateStreet() } 

		this.generateRooms()
		
		let dirs = ["n", "e", "s", "w"]

		let s = Date.now()

		// while (this.structures.length < 250) {
		// 	if (Date.now() - s > 10000) break
		// 	this.generateStructure(sample(dirs), "house", cellSize)
		// }

		this.generatePaths()
		this.generateVibe()
		this.finaliseWalls()
		this.applyImages()
		this.populate()
		this.markAllUnvisited()
	}

	cellAt(x, y) {
		return this.cells.find(c => c.x == x && c.y == y)
	}

	removeWall(x, y, dir) {
		let wall = this.walls.find(w => (w.x == x && w.y == y && w.dir == dir))
		if (wall) this.walls.splice(this.walls.indexOf(wall), 1)
	}

	markAllUnvisited() {
		this.cells.forEach(cell => cell.visited = false)
	}

	generateCells() {
		for (let y = 0; y < mazeHeight; y+= cellSize) {
			for (let x = 0; x < mazeWidth; x+= cellSize) {
				this.cells.push(new Cell(x, y, this))
				this.walls.push(new Wall(x, y, cellSize, "horizontal"))
				this.walls.push(new Wall(x, y, cellSize, "vertical"))

				if (y == mazeHeight - cellSize) this.walls.push(new Wall(x, mazeHeight, cellSize, "horizontal"))
				if (x == mazeWidth - cellSize) this.walls.push(new Wall(mazeWidth, y, cellSize, "vertical"))
			}
		}

		for (let cell of this.cells) {
			if (cell.y > 0) {
				cell.neighbour.north = this.cells.find(c => {
					return c.x === cell.x && c.y === cell.y - cellSize
				})
				if (cell.x < mazeWidth - cellSize) { cell.neighbour.northeast = this.cells.find(c => {
						return c.x === cell.x + cellSize && c.y === cell.y - cellSize
					})
				}
			}

			if (cell.x < mazeWidth - cellSize) {
				cell.neighbour.east = this.cells.find(c => {
					return c.x === cell.x + cellSize && c.y === cell.y
				})	
			}

			if (cell.y < mazeHeight - cellSize) {
				cell.neighbour.south = this.cells.find(c => {
					return c.x === cell.x && c.y === cell.y + cellSize
				})	
				if (cell.x < mazeWidth - cellSize) {
					cell.neighbour.southeast = this.cells.find(c => {
						return c.x === cell.x + cellSize && c.y === cell.y + cellSize
					})
				}
			}

			if (cell.x > 0) {
				cell.neighbour.west = this.cells.find(c => {
					return c.x === cell.x - cellSize && c.y === cell.y
				})
				if (cell.y < mazeHeight - cellSize) {
					cell.neighbour.southwest = this.cells.find(c => {
						return c.x === cell.x - cellSize && c.y === cell.y + cellSize
				})
				if (cell.y > 0) {
					cell.neighbour.northwest = this.cells.find(c => {
						return c.x === cell.x - cellSize && c.y === cell.y - cellSize
				})
			}
		}
	}
	}
	}

	generateSprites() {
		for (let type of Object.keys(this.sheets.path.data)) {
			for (let [subtype, value] of Object.entries(this.sheets.path.data[type])) {
				this.sprites.push(new Sprite(this.sheets.path, value, `${type}_${subtype}`))
			}
		}
		for (let type of Object.keys(this.sheets.structure.data)) {
			for (let [subtype, value] of Object.entries(this.sheets.structure.data[type])) {
				this.sprites.push(new Sprite(this.sheets.structure, value, `${type}_${subtype}`))
			}
		}
		for (let type of Object.keys(this.sheets.nature.data)) {
			for (let [subtype, value] of Object.entries(this.sheets.nature.data[type])) {
				this.sprites.push(new Sprite(this.sheets.nature, value, `${type}_${subtype}`))
			}
		}
	}

	generateStreet() {
		let street = {}
		street.orientation = sample(["ns", "ew"])
		street.length = randIntBetween(minStreetLength, maxStreetLength)
		let marginY = street.orientation == "ns" ? (street.length + 1) * cellSize : cellSize * 4
		let marginX = street.orientation == "ew" ? (street.length + 1) * cellSize : cellSize * 4

		street.x = floorTo(cellSize, randIntBetween(cellSize, mazeWidth - marginX))
		street.y = floorTo(cellSize, randIntBetween(cellSize, mazeHeight - marginY))

		street.w = street.orientation == "ns" ? 3 * cellSize : (street.length + 1) * cellSize
		street.h = street.orientation == "ew" ? 3 * cellSize : (street.length + 1) * cellSize

		let streetInSpace = false

		for (let other of this.streets) {
			if (intersecting(street.x, street.y, street.w, street.h, other.x, other.y, other.w, other.h)) {
				streetInSpace = true
			}
		}
		for (let other of this.rooms) {
			if (intersecting(street.x, street.y, street.w, street.h, other.x, other.y, other.w, other.h)) {
				streetInSpace = true
			}
		}

		if (streetInSpace) return

		let x = street.x
		let y = street.y

		for (let i in range(0, street.length)) {
			this.cellAt(x, y).onStreet = true
			this.cellAt(x, y).visited = true

			if (street.orientation == "ew") {
				callWithProbability(8, 10, () => {
					this.generateStructure("s", "house", 0, x, y)
					this.cellAt(x, y + (cellSize * 2)).onStreet = true
					this.cellAt(x, y + (cellSize * 2)).visited = true
					this.generateStructure("n", "house", 0, x, y + (cellSize * 2))						
				})

				this.removeWall(x, y + cellSize, "horizontal")
				this.removeWall(x, y + cellSize * 2, "horizontal")
				this.removeWall(x, y + cellSize, "vertical")
				this.cellAt(x, y + (cellSize)).sprite = this.sprites.find(s => s.name == "track_square")

				x += cellSize
			}

			if (street.orientation == "ns") {
				callWithProbability(8, 10, () => {
					this.generateStructure("e", "house", 0, x, y)
					this.cellAt(x + (cellSize * 2), y).onStreet = true
					this.cellAt(x + (cellSize * 2), y).visited = true
					this.generateStructure("w", "house", 0, x + (cellSize * 2), y)
				})

				this.removeWall(x + cellSize, y, "vertical")
				this.removeWall(x + cellSize * 2, y, "vertical")
				this.removeWall(x + cellSize, y, "horizontal")
				this.cellAt(x + (cellSize), y).sprite = this.sprites.find(s => s.name == "track_square")

				y += cellSize
			}
		}

		this.streets.push(street)
	}

	generateRooms() {
		let startTime = Date.now()
		let rooms = 0

		while (rooms < numberOfRooms) {
			let executionTime = Date.now()
			if (executionTime - startTime > 2000) break

			let room = {}
			room.w = randIntBetween(minRoomWidth, maxRoomWidth) * cellSize
			room.h = randIntBetween(minRoomHeight, maxRoomHeight) * cellSize
			room.x = floorTo(cellSize, randIntBetween(cellSize, mazeWidth - room.w - cellSize))
			room.y = floorTo(cellSize, randIntBetween(cellSize, mazeHeight - room.h - cellSize))

			let spaceTaken = false
			for (let other of this.rooms) {
				if ((room != other) &&
				intersecting(room.x, room.y, room.w, room.h, other.x, other.y, other.w, other.h)) {
					spaceTaken = true
				}
			}
			for (let other of this.structures) {
				if (intersecting(room.x, room.y, room.w, room.h, other.x, other.y, structureSize, structureSize)) {
					spaceTaken = true
				}
			}

			if (spaceTaken) continue

			let address = `${sample(openSpaceNames)} ${sample(openSpaceTypes)}`
			

			for (let y = room.y; y < room.y + room.h; y += cellSize) {
				for (let x = room.x; x < room.x + room.w; x += cellSize) {
					let currentCell = this.cellAt(x, y)
					
					this.removeWall(x, y, "horizontal")
					this.removeWall(x, y, "vertical")
					this.removeWall(x + cellSize, y + cellSize, "horizontal")
					this.removeWall(x + cellSize, y + cellSize, "vertical")

					currentCell.visited = true
					currentCell.inOpenSpace = true
					currentCell.address = address

					let tweakEdges = function(mz, cell, edge) {
						let edges = {
							n: ["north"],
							e: ["east"],
							s: ["south"],
							w: ["west"],
							ne: ["north", "east", "northeast"],
							se: ["south", "east", "southeast"],
							nw: ["north", "west", "northwest"],
							sw: ["south", "west", "southwest"]
						}

						let dirs = edges[edge]

						cell.background = mz.sprites.find(s => s.name == "dirt_nesw")
						cell.sprite = mz.sprites.find(s => s.name == `grass_${edge}`)

						dirs.forEach(dir => {
							if (cell.neighbour[dir]) {
								let nb = cell.neighbour[dir]
								if (nb.hasStructure == false) {
									nb.background = mz.sprites.find(s => s.name == "dirt_nesw")
									nb.openSpaceAdjacent = true
									nb.visited = true
								}
							}
						})
					}

					if (currentCell.x == room.x && currentCell.y == room.y) {
						tweakEdges(this, currentCell, "nw")
					}

					if (currentCell.x > room.x && currentCell.x < room.x + (room.w - cellSize) && currentCell.y == room.y) {
						tweakEdges(this, currentCell, "n")
					}

					if (currentCell.x == room.x + (room.w - cellSize) && currentCell.y == room.y) {
						tweakEdges(this, currentCell, "ne")
					}

					if (currentCell.x == room.x + (room.w - cellSize) && currentCell.y > room.y && currentCell.y < room.y + (room.h - cellSize)) {
						tweakEdges(this, currentCell, "e")
					}

					if (currentCell.x == room.x + (room.w - cellSize) && currentCell.y == room.y + (room.h - cellSize)) {
						tweakEdges(this, currentCell, "se")
					}

					if (currentCell.x > room.x && currentCell.x < room.x + (room.w - cellSize) && currentCell.y == room.y + (room.h - cellSize)) {
						tweakEdges(this, currentCell, "s")
					}

					if (currentCell.x == room.x && currentCell.y == room.y + (room.h - cellSize)) {
						tweakEdges(this, currentCell, "sw")
					}

					if (currentCell.x == room.x && currentCell.y > room.y && currentCell.y < room.y + (room.h - cellSize)) {
						tweakEdges(this, currentCell, "w")
					}
					
					if (!currentCell.sprite) currentCell.sprite = this.sprites.find(s => s.name == "grass_nesw")

					let val1 = sample(Object.keys(this.sheets.nature.data))
					let val2 = sample(Object.keys(this.sheets.nature.data[val1]))
					let randomSprite = this.sprites.find(s => s.name == `${val1}_${val2}`)

					callWithProbability(1, 3, () => currentCell.decoration = randomSprite)
				}
			}
			this.rooms.push(room)
			rooms++
		}
	}

	generateStructure(doorDir, structureType, margin = 0, posX = false, posY = false) {

			let structure = {}
			
			structure.x = posX ? posX : floorTo(cellSize, randIntBetween(cellSize, mazeSize - cellSize))
			structure.y = posY ? posY : floorTo(cellSize, randIntBetween(cellSize, mazeSize - cellSize))
			structure.exit = doorDir

			let spaceTaken = false
			for (let other of this.structures) {
				if ((structure != other) &&
				this.cellAt(structure.x, structure.y).onStreet == false &&
				intersecting(structure.x - margin, structure.y - margin, cellSize + margin, cellSize + margin, other.x, other.y, cellSize, cellSize)) {
					spaceTaken = true
				}
			}
			for (let other of this.rooms) {
				if (intersecting(structure.x, structure.y, structure.w, structure.h, other.x, other.y, other.w, other.h)) {
					spaceTaken = true
				}
			}
			for (let other of this.streets) {
				if (intersecting(structure.x - margin, structure.y - margin, cellSize + margin, cellSize + margin, other.x, other.y, other.w, other.h)) {
					spaceTaken = true
				}
			}

			if (spaceTaken) return		

			let currentCell = this.cellAt(structure.x, structure.y)
			
			switch(doorDir) {
			case "north":
				this.removeWall(currentCell.x, currentCell.y, "horizontal")
				break
			case "east":
				this.removeWall(currentCell.x + structureSize, currentCell.y, "vertical")
				break
			case "south":
				this.removeWall(currentCell.x, currentCell.y + structureSize, "horizontal")
				break
			case "west":
				this.removeWall(currentCell.x, currentCell.y, "vertical")
			}

			currentCell.visited = true
			currentCell.hasStructure= true
			let houseColours = ["brown", "yellow", "red", "blue"]
			let randColour = sample(houseColours)
			currentCell.sprite = this.sprites.find(s => s.name == `${structureType}_${randColour}_${doorDir}`)

			this.structures.push(structure)
	}

	generatePaths() {
		let pathNum = 1
		let pathName = sample(pathNames)
		let pathType = sample(pathTypes)
		let stack = []
		let startCell = this.cells.find(c => c.visited == false)
		startCell.visited = true
		startCell.address = `${pathNum} ${pathName} ${pathType}`
		pathNum ++
		stack.push(startCell)

		while (stack.length > 0) {
			let currentCell = stack.pop()

			let n = [currentCell.neighbour.north, currentCell.neighbour.east, currentCell.neighbour.south, currentCell.neighbour.west]
			let unvisitedNeighbours = n.filter(c => (c && (c.visited == false)))

			if (unvisitedNeighbours.length > 0) {
				stack.push(currentCell)
				let nextCell = sample(unvisitedNeighbours)
				if (nextCell.address == "") nextCell.address = `${pathNum} ${pathName} ${pathType}`
				nextCell.onStreet = true
				pathNum ++

				switch(true) {
				case nextCell == currentCell.neighbour.north:
					this.removeWall(currentCell.x, currentCell.y, "horizontal")
					this.removeWall(nextCell.x, nextCell.y + cellSize, "horizontal")
					break
				case nextCell == currentCell.neighbour.east:
					this.removeWall(currentCell.x + cellSize + currentCell.y, "vertical")
					this.removeWall(nextCell.x, nextCell.y, "vertical")			
					break
				case nextCell == currentCell.neighbour.south:
					this.removeWall(currentCell.x, currentCell.y + cellSize, "horizontal")
					break
				case nextCell == currentCell.neighbour.west:
					this.removeWall(currentCell.x, currentCell.y, "vertical")
				}
				nextCell.visited = true
				stack.push(nextCell)
			} else {
				pathNum = 1
				pathName = sample(pathNames)
				pathType = sample(pathTypes)
			}
		}
	}

	generateVibe() {
		let edginessOffset = Math.random()
		let gentrificationOffset = Math.random()

		for (let y = 0; y <= (mazeHeight - cellSize); y += cellSize) {
			for (let x = 0; x <= (mazeWidth - cellSize); x += cellSize) {
				this.cellAt(x, y).edginess = Math.floor(10 * noise(edginessOffset + this.noiseIncrement * x,
					edginessOffset + this.noiseIncrement * y))
				this.cellAt(x, y).gentrification = Math.floor(10 * noise(gentrificationOffset + this.noiseIncrement * x,
					gentrificationOffset + this.noiseIncrement * y))
				this.cellAt(x, y).description = "A narrow, winding lane"
			}
		}
	}


	finaliseWalls() {
		this.walls.forEach(wall => {
			if (wall.dir == "horizontal") {
				let south = this.cellAt(wall.x, wall.y)
				let north = this.cellAt(wall.x, wall.y - cellSize)
				if (south) {south.wall.north = true}
				if (north) {north.wall.south = true}	
			}
			if (wall.dir == "vertical") {
				let west = this.cellAt(wall.x - cellSize, wall.y)
				let east = this.cellAt(wall.x, wall.y)
				if (west) {west.wall.east = true}
				if (east) {east.wall.west = true}
			}
		})

		this.applyImages()

		this.cells.forEach(cell => {
			if (cell.openSpaceAdjacent) cell.onStreet = false
			if (cell.onStreet == false && cell.hasStructure == false) {
				this.removeWall(cell.x, cell.y, "horizontal")
				this.removeWall(cell.x, cell.y, "vertical")
				this.removeWall(cell.x, cell.y + cellSize, "horizontal")
				this.removeWall(cell.x + cellSize, cell.y, "vertical")
				for (let [k,v] of Object.entries(cell.wall)) {
					cell.wall[k] = false
				}
			}
		})
	}


	applyImages() {
		this.cells.forEach(cell => cell.applyImage())
	}

	populate() {
		for (let cell of this.cells) {
			let knife = new Item("knife", "A dirty and rusty old blade", 1)
			let addKnife = function() {cell.addItem(knife)}
			callWithProbability(knife.frequency, 100 - cell.edginess, addKnife)
			let spoon = new Item("spoon", "A shiny silver teaspoon", 2)
			let addSpoon = function() {cell.addItem(spoon)}
			callWithProbability(spoon.frequency, 100 - cell.gentrification, addSpoon)
		}
	}

	show() {
		translate(cellSize, cellSize)
		fill(255)
		this.cells.forEach(cell => cell.show())
	}
}

