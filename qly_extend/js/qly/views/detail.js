__tk__define(function (require, exports, module) {
	var $ = require('../lib/jquery'),
		utils = require('../utils'),
		Product = require('../product'),
		host = require('../host'),
		tpl = require('../templates');
	require('../lib/jquery.webui-popover'),

		module.exports = {
			init: function () {
				var data = {
					spid: 520120525716,
					pid: 3438435147,
					sid: 167912,
					zrssList: [
						{
							kw: "茵曼裤",
							page: 1,
							num: 1
						},
						{
							kw: "打底裤 紧身",
							page: 1,
							num: 1
						},
						{
							kw: "棉质打底裤",
							page: 1,
							num: 1
						},
						{
							kw: "黑色打底裤棉质",
							page: 1,
							num: 1
						},
						{
							kw: "茵曼裤子 女",
							page: 1,
							num: 1
						},
						{
							kw: "紧身裤棉 女",
							page: 1,
							num: 2
						},
						{
							kw: "打底裤棉",
							page: 1,
							num: 2
						},
						{
							kw: "打底裤 修身款",
							page: 1,
							num: 2
						},
						{
							kw: "紧身裤棉质",
							page: 1,
							num: 2
						},
						{
							kw: "茵曼打底裤",
							page: 2,
							num: 3
						}
					],
					ztcList: [
						{
							kw: "茵曼裤",
							page: 0,
							num: 1
						},
						{
							kw: "茵曼打底裤",
							page: 0,
							num: 1
						},
						{
							kw: "绒羊茵曼女装店",
							page: 0,
							num: 4
						},
						{
							kw: "snidel爆款",
							page: 0,
							num: 5
						},
						{
							kw: "茵莎蔓姿打底裤",
							page: 0,
							num: 7
						},
						{
							kw: "原创打底裤文艺女",
							page: 0,
							num: 19
						},
						{
							kw: "休闲打底裤女薄",
							page: 0,
							num: 21
						},
						{
							kw: "ungrid",
							page: 0,
							num: 24
						},
						{
							kw: "少女打底裤 纯棉",
							page: 0,
							num: 26
						},
						{
							kw: "打底 原单",
							page: 0,
							num: 26
						}
					],
					zrssMList: [
						{
							kw: "茵曼旗舰店 长裤",
							page: 1,
							num: 1
						},
						{
							kw: "茵曼裤",
							page: 1,
							num: 2
						},
						{
							kw: "茵曼裤子 女",
							page: 1,
							num: 2
						},
						{
							kw: "紧身裤棉质",
							page: 1,
							num: 3
						},
						{
							kw: "棉质裤女秋",
							page: 1,
							num: 3
						},
						{
							kw: "茵曼打底裤",
							page: 3,
							num: 22
						},
						{
							kw: "秋装 女",
							page: 4,
							num: 9
						},
						{
							kw: "秋装女打底裤",
							page: 6,
							num: 13
						}
					],
					ztcMList: [
						{
							kw: "棉质打底裤女外穿",
							page: 4,
							num: 21
						}
					],
					zrssKeywordNum: 11,
					zrssMKeywordNum: 8,
					ztcKeywordNum: 225,
					ztcMKeywordNum: 1,
					createTime: "2015-06-24",
					updateTime: "2015-06-24",
					offSaleTime: "3天4小时54分37秒"
				};

				console.log('init detail js');
				if (utils.getContainer()) {
					$(this.template(data)).insertBefore(utils.getContainer());
					this.render(data);
				} else {
					console.error('未匹配detail页');
				}
			},
			template: tpl['qly/detail.box'],

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
							require('./price/qutu').init(data, that.$target);
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
			},
			render: function (data) {
				this.taosearch(data);
				this.ztc(data);
				this.msearch(data);
				this.mztc(data);

				this.price(data);
				this.taoword(data);
			}
		};
});
