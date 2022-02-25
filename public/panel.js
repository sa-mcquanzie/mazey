class Panel {
	constructor(id) {
		this.div = createDiv()
		this.div.id(id)
		this.div.parent(canvasContainer)
	}
}

class PanelElement {
	constructor(id, parent) {
		this.parent = parent
		this.div = createDiv()
		this.div.id(id)
		this.div.parent(parent.div)
	}

	hide() {this.div.hide()}
	show() {this.div.show()}
}

class AddressLine extends PanelElement {
	constructor(id, parent, player) {
		super(id, parent)

		this.player = player
		this.update()
	}

	update() {
		this.div.html(`<p class="addressText">${this.player.cell.address}</p>`)
	}
}

class LocationDescription extends PanelElement {
	constructor(id, parent, player) {
		super(id, parent)

		this.player = player
		this.div.class = "locationDescription"
		this.paragraph = createElement("p")
		this.paragraph.parent(this.div)
		this.update()
	}

	update() {
		this.paragraph.html(`${this.player.cell.description}`)
	}
}

class ItemList extends PanelElement {
	constructor(id, parent, player) {
		super(id, parent)

		this.player = player
		this.div.class("itemList")
		this.ul = createElement("ul")
		this.ul.parent(this.div)
		this.lh = createElement("lh", "Items here")
		this.lh.parent(this.ul)
		this.div.hide()
		this.update()
	}

	update() {
		for (let [ind, child] of Object.entries(this.ul.child())) {
			if (ind > 0) child.remove()
		}

		if (this.player.cell.items.length > 0) {
			this.div.show()

			for (let item of this.player.cell.items) {
				let li = createElement("li", `${item.name}`)
				li.addClass("expanded")
				li.toggleClass("expanded")
				li.addClass("grabbable")
				li.toggleClass("grabbable")
				li.parent(this.ul)

				let description = createElement("p", `${item.description}`)
				description.parent(li)
				description.hide()

				li.mouseOver(() => {
					if (keyIsDown(SHIFT)) {
						li.toggleClass("grabbable")
						console.log("grab")
					}
				})

				li.mouseOut(() => {
					if (li.hasClass("grabbable")) {
						li.toggleClass("grabbable")
					}
				})

				li.mouseClicked(() => {
					if (li.hasClass("grabbable")) {
						this.player.take(item)
						for (let child of li.child()) child.remove()
						li.remove()
					} else {
						li.toggleClass("grabbable")
						li.toggleClass("expanded")
						li.hasClass("expanded") ? description.show() : description.hide()
					}
				})
			}
		} else {
			this.div.hide()
		}
	}
}
