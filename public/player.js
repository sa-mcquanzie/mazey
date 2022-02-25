class Player extends Character{
	constructor(maze) {
		super(maze)
		this.name = "player"
		this.quests = []
		this.moved = false
	}

	update() {
		super.update()
		this.cell.visited = true
		this.maze.walls.forEach(wall => {
			if ((wall.x == this.cell.x && wall.y == this.cell.y) ||
			(wall.x == this.cell.x + cellSize && wall.y == this.cell.y && wall.dir == "vertical") ||
			(wall.y == this.cell.y + cellSize && wall.x == this.cell.x && wall.dir == "horizontal")
			) {
				wall.visible = true
			}
		})
	}
}