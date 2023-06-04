const cartPageData = {
    checkDataInStorage () {
		const jsonFromStorage = localStorage.getItem('MyFoodDelivery');
		if (jsonFromStorage) {
			this.shopDataFromStorage = JSON.parse(jsonFromStorage);
			return true;
		} else return false;
	},
	
	getShopDataFromStorage () {
		if ( this.checkDataInStorage () ) {
			return Object.values(this.shopDataFromStorage);				
		} else return null;
	},
	
	getShopTitleFromStorage () {
		if ( this.checkDataInStorage () ) {
			return Object.keys(this.shopDataFromStorage);				
		} else return null;
	},

	setDataInStorage (e, quantity) {
		if (e.target.closest('.quantity')) {
			const targetBlock = this.shopData.find(item => item.title == e.target.closest('.food_card').querySelector('.food_title').textContent);
			targetBlock.quantity = (quantity > 0) ? quantity : 1;			
		}
		const obj = {};
		obj[this.shopTitle] = this.shopData;
		const json = JSON.stringify(obj);
		localStorage.setItem('MyFoodDelivery', json);
		if (this.shopData.length == 0) localStorage.removeItem('MyFoodDelivery');
	},

	renderCurrentShopFoodList () {
		const cartListBlock = document.querySelector('.cart_list');
		const temp = document.querySelector('template');
		this.shopTitle;
		this.shopData = [];
		if (this.checkDataInStorage ()) {
			this.shopTitle = this.getShopTitleFromStorage ()[0];
			this.shopData = this.getShopDataFromStorage ()[0];
				this.shopData.forEach(item => {
				const clone = temp.content.cloneNode(true);
				clone.querySelector('.food_title').textContent = item.title;
				clone.querySelector('.food_price').textContent = parseFloat(item.price) * item.quantity + ' $';
				clone.querySelector('.quantity').value = item.quantity;
				cartListBlock.append(clone);
			});
		}
		this.cartEmptyTextHandler ();
		this.clearButtonHandler ();
		this.setTotalOrderPrice ();
		this.orderButtonHandler ();
	},
	
	cartEmptyTextHandler () {
		const txt = document.querySelector('.empty_txt');
		if ( this.shopData.length != 0 ) {
			txt.style.display = 'none';
		} else txt.style.display = 'block';
	},
	
	crossHandler () {
		document.addEventListener('click', (e) => {
			if (e.target.closest('.cross')) {
				const cardTitle = e.target.closest('.food_card').querySelector('.food_title').textContent;
				e.target.closest('.food_card').remove();
				this.shopData = this.shopData.filter(item => item.title != cardTitle);
				this.setDataInStorage (e);
				this.cartEmptyTextHandler ();
				this.setTotalOrderPrice ();
			}
		})
	},
	
	inputHandler () {
		document.addEventListener('input', (e) => {
			if (e.target.closest('.quantity')) {
				const targetBlock = this.shopData.find(item => item.title == e.target.closest('.food_card').querySelector('.food_title').textContent);
				const price = parseFloat(targetBlock.price);
				const quantity = e.target.closest('.quantity').value;
				if (quantity < 1) {
					e.target.closest('.quantity').value = 1;
				} else {
					const value = parseFloat(price);
					const totalPrice = value * quantity;
					e.target.closest('.food_card').querySelector('.food_price').textContent = totalPrice.toFixed(2) + ' $';					
				}
				this.setDataInStorage (e, quantity);
				this.setTotalOrderPrice ();
			}
		});
	},

	setTotalOrderPrice () {
		let sum = 0;
		if (this.shopData) {
			this.shopData.forEach(item => {
				sum += parseFloat(item.price) * item.quantity;
			});
		}
		const totalPrice = document.querySelector('.total_sum');
		totalPrice.textContent = ( this.checkDataInStorage () ) ? 'Total: ' + sum.toFixed(2) + ' $' : 'Total: 0 $'; 
	},

	clearButtonHandler () {
		const clearButton = document.querySelector('.clear');
		clearButton.addEventListener('click', () => {
			const cartItems = [...document.querySelectorAll('.food_card')];
			cartItems.forEach(item => item.remove());
			localStorage.removeItem('MyFoodDelivery');
			this.setTotalOrderPrice ();
		});
	},
	
	orderButtonHandler () {
		const orderButton = document.querySelector('.order');
		orderButton.addEventListener('click', () => {
			if ( this.checkDataInStorage() ) {
				const form = document.querySelector('[name="customer_data"]');
				form.submit();
				form.method = 'PUT';
				const json = localStorage.getItem('MyFoodDelivery');
				form.body = json;				
			}

			/*
			console.log(form);
			const name = document.querySelector('#name').value;
			const email = document.querySelector('#mail').value;
			const phone = document.querySelector('#phone').value;
			const address = document.querySelector('#address').value;
			console.log(name);
			console.log(email);
			console.log(phone);
			console.log(address);
			*/
		})
	},
	/*
	setSHopPageDataHandler () {
		this.pickedShop = this.getShopDataFromStorage ();
		this.renderCurrentShopFoodList ();
		this.selectShopButton ();
		this.setShopButtonsHandler ();
		this.setAttentionButtons ();
		this.navButtonHandler ();
	},
	
	navButtonHandler () {
		const navArr = [...document.querySelectorAll('a')];
		const [shopPage, shopCartPage, historyPage] = navArr;
		document.addEventListener('click', function(e) {
			navArr.forEach(item => item.classList.remove('active'));
			if (e.target == shopPage) {
				shopPage.classList.add('active');
			} else if (e.target == shopCartPage) {
				shopCartPage.classList.add('active');
			} else if (e.target == historyPage) {
				historyPage.classList.add('active');
			} 
		});
	}
    */
}

cartPageData.renderCurrentShopFoodList ();
cartPageData.crossHandler ();
cartPageData.inputHandler ();