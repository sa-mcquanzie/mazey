function preload() {
	knlImage = loadImage("sprites/kenny_nl_roguelike/sheets/map_items_transparent.png")
	pathSheet = new Spritesheet(knlImage, pathData, 16, 1)
	natureSheet = new Spritesheet(knlImage, natureData, 16, 1)
	customStructureImage = loadImage("sprites/custom/sheets/structures.png")
	customStructureSheet = new Spritesheet(customStructureImage, customStructureData, 16, 0)
}

function setup() {	
	canvasContainer = createDiv()
	canvasContainer.id("canvasContainer")
	canv = createCanvas(canvasWidth, canvasHeight)
	canv.parent(canvasContainer)

	pathSheet.addSprites()
	natureSheet.addSprites()
	customStructureSheet.addSprites()

	maze = new Maze({path: pathSheet, nature: natureSheet, structure: customStructureSheet})
	player = new Player(maze)
	rightPanel = new Panel("rightPanel")
	addressLine = new AddressLine("addressLine", rightPanel, player)
	locationDescription = new LocationDescription("locationDescription", rightPanel, player)
	cellItemList = new ItemList("cellItemList", rightPanel, player)
	lastPlayerPosition = player.cell

	centerCanvas()
	background(0, 0, 0)
	colorMode(RGB, 255, 255, 255, 1)

	console.log("Created new maze")
}

function draw() {
	background(0, 0, 0)
	showAndUpdateAll()
}

function centerCanvas() {
  let x = (windowWidth - width) / 2
	let y = (windowHeight - height) / 2
	canvasContainer.position(x, y)
}

function windowResized() {
  centerCanvas();
}

function keyPressed() {
	if (keyCode === 38 &&
		(!player.cell.wall.north || player.cell.neighbour.north?.openSpaceAdjacent == true) && player.y > 0) {
		player.y -= cellSize
	}
	if (keyCode === 39 && (!player.cell.wall.east || player.cell.neighbour.east?.openSpaceAdjacent == true) && player.x < mazeWidth - cellSize) {
		player.x += cellSize
	}
	if (keyCode === 40 && (!player.cell.wall.south || player.cell.neighbour.south?.openSpaceAdjacent == true) && player.y < mazeHeight - cellSize) {
		player.y += cellSize
	}
	if (keyCode === 37 && (!player.cell.wall.west || player.cell.neighbour.west?.openSpaceAdjacent == true) && player.x > 0) {
		player.x -= cellSize
	}
}

function mouseClicked() {
}

function showAndUpdateAll() {
	maze.show()
	player.update()
	player.show()
	updatePanel()
}

function updatePanel() {
	if (player.cell !== lastPlayerPosition) {
		addressLine.update()
		cellItemList.update()
		lastPlayerPosition = player.cell
	}
}