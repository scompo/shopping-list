import { getId, byId, addNewItem, newItem, getItems, deleteItem, buyItem, unBuyItem, editItem } from './modules/memory-db.js'

async function doAddItem() {
	return newItem()
		.then(item => addNewItem(item))
}

async function clearToBuyList() {
	const toBuyListElement = document.getElementById('to-buy-list')
	toBuyListElement.innerHTML = ''
}

async function clearBoughtList() {
	const boughtListElement = document.getElementById('bought-list')
	boughtListElement.innerHTML = ''
}

async function clearLists() {
	await clearToBuyList()
	await clearBoughtList()
}

function onClickDeleteItem(e) {
	deleteItem(e.target.dataset.id)
		.then(() => refreshUI())
}

function onClickEditItem(e) {
	const id = e.target.dataset.id
	byId(id)
		.then(item => {
			const oldText = item.content.text
			const newText = prompt('Edit: ' + oldText, oldText)
			if(newText && newText !== oldText) {
				return editItem(id, {text: newText})
					.then(() => refreshUI())
			}
		})
}

function onClickBuyItem(e) {
	buyItem(e.target.dataset.id)
		.then(() => refreshUI())
}

function onClickUnBuyItem(e) {
	unBuyItem(e.target.dataset.id)
		.then(() => refreshUI())
}

async function updateToBuyList() {
	const toBuyListElement = document.getElementById('to-buy-list')
	const currentItems = await getItems()
	const toBuyItems = currentItems.filter(x => x && !x.bought)
	for(const item of toBuyItems) {
		let itemElement = await createItemElement({
			item: item
		})

		toBuyListElement.appendChild(itemElement)
	}
}

async function createButton(config) {
	const resultButton = document.createElement('button')
	resultButton.addEventListener('click', config.onClickFunction)
	resultButton.innerHTML = config.html
	resultButton.dataset.id = config.id
	return resultButton
}

async function createText(config) {
	const text = config.item.content.text
	const itemP = document.createElement('p')
	itemP.innerHTML = text
	return itemP
}

async function createItemElement(config) {
	let itemElement = document.createElement('li')
	const item = config.item
	const itemId = item._id

	const buttonDelete = await createButton({
		html: '<img src="img/x-square.svg" data-id="' + itemId + '"></img>',
		id: itemId,
		onClickFunction: onClickDeleteItem
	})
	itemElement.appendChild(buttonDelete)

	const buttonEdit = await createButton({
		html: '<img src="img/edit.svg" data-id="' + itemId + '"></img>',
		id: itemId,
		onClickFunction: onClickEditItem
	})
	itemElement.appendChild(buttonEdit)

	const buttonToggle = await createButton({
		html: (item && item.bought) ? '<img src="img/square.svg" data-id="' + itemId + '"></img>': '<img src="img/check-square.svg" data-id="' + itemId + '"></img>',
		id: itemId,
		onClickFunction: (item && item.bought) ? onClickUnBuyItem : onClickBuyItem
	})
	itemElement.appendChild(buttonToggle)

	const itemP = await createText({item: item})
	itemElement.appendChild(itemP)

	return itemElement
}

async function updateBoughtList() {
	const boughtListElement = document.getElementById('bought-list')
	const currentItems = await getItems()
	const boughtItems = currentItems.filter(x => x && x.bought)
	for(const item of boughtItems) {
		let itemElement = await createItemElement({
			item: item
		})

		boughtListElement.appendChild(itemElement)
	}
}

async function updateLists() {
	await updateToBuyList()
	await updateBoughtList()
}

async function refreshUI() {
	await clearLists()
	await updateLists()
}

function onClickAddItemButton(e) {
	doAddItem()
		.then(() => refreshUI())
}

async function bindAddItemButton() {
	const addItemButton = document.getElementById('add-item')
	addItemButton.addEventListener('click', onClickAddItemButton)
}

async function bindSaveButton() {}

async function bindLoadButton() {}

function onError(e) {
  console.error(e)
}

async function salvaFileTest() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

		console.log('file system open: ' + fs.name);
		fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {

			console.log("fileEntry is file?" + fileEntry.isFile.toString());
			// fileEntry.name == 'someFile.txt'
			// fileEntry.fullPath == '/someFile.txt'
      
      const blob = new Blob([JSON.stringify({prova: "testo"}, null, 2)], {type : 'application/json'});
			writeFile(fileEntry, blob);

		}, onError);

	}, onError);
}

function writeFile(fileEntry, dataObj) {
	// Create a FileWriter object for our FileEntry (log.txt).
	fileEntry.createWriter(function (fileWriter) {

		fileWriter.onwriteend = function() {
			console.log("Successful file write...");
			readFile(fileEntry);
		};

		fileWriter.onerror = function (e) {
			console.log("Failed file write: " + e.toString());
		};

		// If data object is not passed in,
		// create a new Blob instead.
		if (!dataObj) {
			dataObj = new Blob(['some file data'], { type: 'text/plain' });
		}

		fileWriter.write(dataObj);
	});
}

function readFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader();
 
        reader.onloadend = function() {
            console.log("Successful file read: " + this.result);
            //displayFileData(fileEntry.fullPath + ": " + this.result);
        };
 
        reader.readAsText(file);
 
    }, onError);
}

async function caricaFileTest() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

		console.log('file system open: ' + fs.name);
		fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {

			console.log("fileEntry is file?" + fileEntry.isFile.toString());
			// fileEntry.name == 'someFile.txt'
			// fileEntry.fullPath == '/someFile.txt'
			readFile(fileEntry, null);

		}, onError);

	}, onError);
}

async function main () {
	await bindAddItemButton()
	await bindSaveButton()
	await bindLoadButton()
	await refreshUI()
	await salvaFileTest()
}

function onDeviceReady() {
	// Cordova is now initialized. Have fun!

	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	console.log(cordova.file);
	main();
}

//
// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

