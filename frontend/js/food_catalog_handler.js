const shopPageData = {
	//allShopsFoodList: JSON.parse(json),
	
	checkDataInStorage () {
		const jsonFromStorage = localStorage.getItem('MyFoodDelivery');
		if (jsonFromStorage) {
			this.shopDataFromStorage = JSON.parse(jsonFromStorage);
			return true;
		} else return false;
	},
	
	getShopTitleFromStorage () {
		if ( this.checkDataInStorage () ) {
			return Object.keys(this.shopDataFromStorage)[0];				
		} else return 'McDonny';
	},
	
	getShopDataFromStorage () {
		if ( this.checkDataInStorage () ) {
			return Object.values(this.shopDataFromStorage)[0];				
		};
	},
	
	setAllShopsFoodList () {
		const shopInStorage = this.getShopTitleFromStorage ();
		const shopDataFromStorage = this.getShopDataFromStorage ();
		if (shopDataFromStorage) {
			shopDataFromStorage.forEach(storageItem => {
				const foodBlock = this.allShopsFoodList[shopInStorage].find(item => storageItem.title == item.title);
				foodBlock.isPicked = storageItem.isPicked;
				foodBlock.quantity = storageItem.quantity;
			});
		}
	},

	renderCurrentShopFoodList () {
		const foodListBlock = document.querySelector('.food_list');
		const temp = document.querySelector('template');
		const shopData = this.allShopsFoodList[this.pickedShop];
			shopData.forEach(item => {
			const clone = temp.content.cloneNode(true);
			clone.querySelector('.food_title').textContent = item.title;
			clone.querySelector('.food_price').textContent = item.price;
			clone.querySelector('button').addEventListener('click', () => this.cartHandler (item));
			foodListBlock.append(clone);
		});
	},
	
	selectShopButton () {
		const shop = document.querySelector('#'+this.pickedShop);
		shop.classList.add('shop_active');
	},
	
	setPickedShop (item) {
		this.pickedShop = item.id;
	},
	
	setShopButtonsHandler () {
		const shopsButtons = [...document.querySelectorAll('.shops_list_button')];
		shopsButtons.forEach((item, index, array) => {
			const foodList = document.querySelector('.food_list');
			item.addEventListener('click', () => {
				const shopInStorage = this.getShopTitleFromStorage ();
				[...foodList.children].forEach(item => item.remove());
				array.forEach(item => item.classList.remove('shop_active'));
				if (item.id != shopInStorage && this.checkDataInStorage ()) this.showAttentionMessage ();
				this.setPickedShop (item);
				this.renderCurrentShopFoodList ();
				this.selectShopButton ();
			});
		});
	},
	
	saveShopDataInStorage () {
		const dataToStorage = {};
		dataToStorage[this.pickedShop] = this.pickedFood;
		const jsonToStorage = JSON.stringify(dataToStorage);
		localStorage.setItem('MyFoodDelivery',jsonToStorage);
	},
	
	cartHandler (item) {
		item.isPicked = true;
		this.pickedFood = this.allShopsFoodList[this.pickedShop].filter(item => item.isPicked == true);
		this.saveShopDataInStorage ();
	},
	
	showAttentionMessage () {
		const attentionMessage = document.querySelector('.attention');
		attentionMessage.style.display = 'flex';
	},
	
	hideAttentionMessage () {
		const attentionMessage = document.querySelector('.attention');
		attentionMessage.style.display = 'none';
	},
	
	setAttentionButtons () {
		const okBtn = document.querySelector('.message_button > button');
		okBtn.addEventListener('click', () => {
			this.hideAttentionMessage ();
		});
	},

	setSHopPageDataHandler () {
		this.pickedShop = this.getShopTitleFromStorage ();
		this.renderCurrentShopFoodList ();
		this.selectShopButton ();
		this.setShopButtonsHandler ();
		this.setAttentionButtons ();
		this.setAllShopsFoodList ();
		this.navButtonHandler ();
	},
	
	navButtonHandler () {
		const navArr = [...document.querySelectorAll('a')];
		const [shopPage, shopCartPage, historyPage] = navArr;
		document.addEventListener('click', function(e) {
			if (e.target.closest('nav')) navArr.forEach(item => item.classList.remove('active'));
			if (e.target == shopPage) {
				shopPage.classList.add('active');
			} else if (e.target == shopCartPage) {
				shopCartPage.classList.add('active');
			} else if (e.target == historyPage) {
				historyPage.classList.add('active');
			} 
		});
	}
}

fetch('https://tarasmarkov6.github.io/shop/backend/food_catalog.json')
	.then(response => response.json())
	.then(json => {shopPageData['allShopsFoodList'] = json;
					shopPageData.setSHopPageDataHandler ();
});


/*
document.addEventListener('DOMContentLoaded', function() {
	
	const url = '../../backeend/food_catalog.json';
	const promise = fetch(url);
	promise
		.then(response => {
			if (response.ok) return response.json;
		})
		.then(json => console.log(json))
		.catch(error => console.log(error));
	
	const storageJSON = localStorage.getItem('MyFoodDelivery');
	const storageData = JSON.parse(storageJSON);
	const pickedShop = storageData ? [...Object.keys(storageData)] : 'McDonny';
	renderJSON (pickedShop);
	selectShop (pickedShop);
});

function renderJSON (shop) {
	const foodList = document.querySelector('.food_list');
	const temp = document.querySelector('template');
	const shopData = obj[shop];
	shopData.forEach(item => {
		const clone = temp.content.cloneNode(true);
		clone.querySelector('.food_title').textContent = item.title;
		clone.querySelector('.food_price').textContent = item.price;
		clone.querySelector('button').addEventListener('click', () => cartHandler (item));
		foodList.append(clone);
	});
}

function selectShop (shopArg) {
	const shop = document.querySelector('#'+shopArg);
	shop.classList.add('shop_active');
}

const shopsButtons = [...document.querySelectorAll('.shops_list_button')];

shopsButtons.forEach((item, index, array) => {
	const foodList = document.querySelector('.food_list');
	item.addEventListener('click', function() {
		[...foodList.children].forEach(item => item.remove());
		array.forEach(item => item.classList.remove('shop_active'));
		const pickedShop = item.id;
		obj = JSON.parse(json);
		renderJSON (pickedShop);
		selectShop (pickedShop);
	});
});

function 
*/

