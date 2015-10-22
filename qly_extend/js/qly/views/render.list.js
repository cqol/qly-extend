__tk__define(function (require, exports, module) {
	var tpl = require('../templates');
	var Product = require('../product'),
		host = require('../host'),
		$ = require('../lib/jquery'),
		utils = require('../utils'),
		body = $('body');
	require('../lib/jquery.webui-popover');

	var qutu = require('./price/qutu');

	function app(data, item) {
		this.init(data, item);
	};

	app.prototype = {
		init: function (data, item) {
			this.render(data);
		},
		render: function (data) {
			var box = Product.item.box.closest('.item');
			var itemData = data[Product.item.getID()];
			var _this = this;
			if (itemData) {
				box.append(tpl['qly/list.box'](itemData));

				this.taosearch(itemData);
				this.msearch(itemData);
				this.mztc(itemData);
				this.taoword(itemData);
				this.price(itemData);
			}
		},
		taosearch: function (data) {
			$('.QLY-taobaosearch').webuiPopover({
				content: tpl['qly/detail.taosearch']({list: data.zrssList, time: data.updateTime}),
				width: 358,
				trigger: 'hover',
				animation: 'pop',
			});
		},
		ztc: function (data) {
			$('.QLY-ztc').webuiPopover({
				content: tpl['qly/detail.ztc']({list: data.ztcList, time: data.updateTime}),
				width: 358,
				trigger: 'hover',
				animation: 'pop',
			});
		},
		msearch: function (data) {
			$('.QLY-msearch').webuiPopover({
				content: tpl['qly/detail.msearch']({list: data.zrssMList, time: data.updateTime}),

				width: 358,
				trigger: 'hover',
				animation: 'pop',
			});
		},
		mztc: function (data) {
			$('.QLY-mztc').webuiPopover({
				content: tpl['qly/detail.msearch']({list: data.ztcMList, time: data.updateTime}),
				width: 358,
				trigger: 'hover',
				animation: 'pop',
			});
		},
		price: function (data) {
			var price = Product.item.getPrice();
			$('.QLY-price').webuiPopover({
				type: 'async',
				url: 'https://browserre.taotaosou.com/priceHistory.do?' +
				'itemId=' + Product.item.getID() +
				'&website=' + host.webSite +
				'&price=' + Product.item.getPrice() +
				'&callback=?',
				content: function () {
					return tpl['qly/detail.history']({time: data.updateTime});
				},

				width: 460,
				height: 300,
				trigger: 'hover',
				animation: 'pop',
				async: {
					before: function (that, xhr) {
						console.log('before');
					},//executed before ajax request
					success: function (that, data) {
						new qutu(data, that.$target, price);
					}//executed after successful ajax request
				}
			});
		},
		taoword: function (data) {
			$('.QLY-taoword').webuiPopover({
				content: tpl['qly/detail.taoword']({time: data.updateTime}),
				width: 358,
				trigger: 'hover',
				animation: 'pop',
			});
		}
	}
	return app;
});

