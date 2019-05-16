/**
 * Copyright 2019 Dazoot Software
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author    Lucian for Newsman
 * @copyright 2019 Dazoot Software
 * @license   http://www.apache.org/licenses/LICENSE-2.0
 */

/* globals $, _nzm.run, jQuery */

var NewsmanAnalyticEnhancedECommerce = {

	add: function(Product, Order, Impression) {
		var Products = {};
		var Orders = {};

		var ProductFieldObject = ['id', 'name', 'category', 'brand', 'variant', 'price', 'quantity', 'coupon', 'list', 'position', 'dimension1'];
		var OrderFieldObject = ['id', 'affiliation', 'revenue', 'tax', 'shipping', 'coupon', 'list', 'step', 'option'];

		if (Product != null) {
			if (Impression && Product.quantity !== undefined) {
				delete Product.quantity;
			}

			for (var productKey in Product) {
				for (var i = 0; i < ProductFieldObject.length; i++) {
					if (productKey.toLowerCase() == ProductFieldObject[i]) {
						if (Product[productKey] != null) {
							Products[productKey.toLowerCase()] = Product[productKey];
						}

					}
				}

			}
		}

		if (Order != null) {
			for (var orderKey in Order) {
				for (var j = 0; j < OrderFieldObject.length; j++) {
					if (orderKey.toLowerCase() == OrderFieldObject[j]) {
						Orders[orderKey.toLowerCase()] = Order[orderKey];
					}
				}
			}
		}

		if (Impression) {
			_nzm.run('ec:addImpression', Products);
		} else {
			_nzm.run('ec:addProduct', Products);
		}
	},

	addProductDetailView: function(Product) {
		this.add(Product);
		_nzm.run('ec:setAction', 'detail');
		_nzm.run('send', 'pageview', 'UX', 'detail', 'Product Detail View',{'nonInteraction': 1});
	},

	addToCart: function(Product) {
		this.add(Product);
		_nzm.run('ec:setAction', 'add');
		_nzm.run('send', 'event', 'UX', 'click', 'Add to Cart'); // Send data using an event.
	},

	removeFromCart: function(Product) {
		this.add(Product);
		_nzm.run('ec:setAction', 'remove');
		_nzm.run('send', 'event', 'UX', 'click', 'Remove From cart'); // Send data using an event.
	},

	addProductImpression: function(Product) {
		//_nzm.run('send', 'pageview');
	},

	/**
	id, type, affiliation, revenue, tax, shipping and coupon.
	**/
	refundByOrderId: function(Order) {
		/**
		 * Refund an entire transaction.
		 **/
		_nzm.run('ec:setAction', 'refund', {
			'id': Order.id // Transaction ID is only required field for full refund.
		});
		_nzm.run('send', 'event', 'Ecommerce', 'Refund', {'nonInteraction': 1});
	},

	refundByProduct: function(Order) {
		/**
		 * Refund a single product.
		 **/
		//this.add(Product);

		_nzm.run('ec:setAction', 'refund', {
			'id': Order.id, // Transaction ID is required for partial refund.
		});
		_nzm.run('send', 'event', 'Ecommerce', 'Refund', {'nonInteraction': 1});
	},

	addProductClick: function(Product) {
		var ClickPoint = jQuery('a[href$="' + Product.url + '"].quick-view');

		ClickPoint.on("click", function() {
			
			NewsmanAnalyticEnhancedECommerce.add(Product);
			_nzm.run('ec:setAction', 'click', {
				list: Product.list
			});

			_nzm.run('send', 'event', 'Product Quick View', 'click', Product.list, {
				'hitCallback': function() {
					return !_nzm.run.loaded;
				}
			});
		});

	},

	addProductClickByHttpReferal: function(Product) {
		this.add(Product);
		_nzm.run('ec:setAction', 'click', {
			list: Product.list
		});

		_nzm.run('send', 'event', 'Product Click', 'click', Product.list, {
			'nonInteraction': 1,
			'hitCallback': function() {
				return !_nzm.run.loaded;
			}
		});

	},

	addTransaction: function(Order) {

		//this.add(Product);
		_nzm.run('ec:setAction', 'purchase', Order);
		_nzm.run('send', 'event','Transaction','purchase', {
			'hitCallback': function() {
				$.get(Order.url, {
					orderid: Order.id,
					customer: Order.customer
				});
			}
		});

	},

	addCheckout: function(Step) {
		_nzm.run('ec:setAction', 'checkout', {
			'step': Step
			//'option':'Visa'
		});
		_nzm.run('send', 'pageview');
	}
};
