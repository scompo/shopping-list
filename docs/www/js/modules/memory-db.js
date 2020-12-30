let items = []

let itemsCounter = 0

async function getId() {
  itemsCounter = itemsCounter + 1
  return itemsCounter
}

async function newItem() {
  const id = await getId()
  return {
    _id: '' + id,
    content: {
      text: "new item"
    }
  }
}

async function addNewItem(item) {
  return items.push(item)
}

async function getItems() {
  return items
}

async function deleteItem(id) {
  const indx = items.findIndex(x => {
    return x._id === id
  })
  items.splice(indx, 1)
}

async function buyItem(id) {
  for(let i of items) {
    if (i._id === id) {
      i.bought = true
    }
  }
}

async function unBuyItem(id) {
  for(let i of items) {
    if (i._id === id) {
      i.bought = false
    }
  }
}

async function editItem(id, content) {
  for(let i of items) {
    if (i._id === id) {
      i.content = content
    }
  }
}

async function byId(id) {
  return getItems()
    .then(items => items.find(x => x._id === id))
}

export { getId, byId, addNewItem, newItem, getItems, deleteItem, buyItem, unBuyItem, editItem }
