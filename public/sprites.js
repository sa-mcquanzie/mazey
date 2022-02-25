class Spritesheet {
	constructor(inFile, data, spriteSize, margin = 0) {
		this.image = inFile
		this.data = data
		this.spriteSize = spriteSize
		this.margin = margin
		this.sprites = {}
	}

	addSprites() {
		let spriteNum = 1
		let col = 1
		let row = 1

		for (let y = 0; y <= this.image.height - this.spriteSize; y += this.spriteSize + this.margin) {
			for (let x = 0; x <= this.image.width - this.spriteSize; x += this.spriteSize + this.margin) {
				this.sprites[spriteNum] = {x: x, y: y, row: row, col: col}
				spriteNum += 1
				col += 1
			}
			col = 1
			row += 1
		}
	}
}

class Sprite {
	constructor(sheet, location, name) {
		this.sheet = sheet

		if (Array.isArray(location)) {
			for (const [key, val] of Object.entries(this.sheet.sprites)) {
				if (val.row == location[0] && val.col == location[1]) {
					this.num = key
					break
				}
			}
		} else this.num = location

		this.x = this.sheet.sprites[this.num].x
		this.y = this.sheet.sprites[this.num].y
		this.name = name

		this.size = this.sheet.spriteSize
		this.graphic = createGraphics(this.size, this.size)

		this.graphic.image(this.sheet.image.get(this.x, this.y, this.size, this.size), 0, 0)
	}

	draw(x, y) {
		image(this.graphic, x, y, this.size, this.size)
	}
}