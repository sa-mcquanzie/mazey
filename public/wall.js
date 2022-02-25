class Wall {
	constructor(x, y, len,dir) {
		this.x = x
		this.y = y
		this.len = len
		this.dir = dir
		this.visible = false
	}

	show() {
		stroke(150)
		strokeWeight(2)
		switch(this.dir) {
		case "horizontal":
			line(this.x, this.y, this.x + this.len, this.y)
			break
		case "vertical":
			line(this.x, this.y, this.x, this.y + this.len)
		}
	}
}