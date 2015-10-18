__tk__define(function (require, exports, module) {
	var location = window.location,
		host = location.host;

	var $ = require('../lib/jquery'),
		utils = require('../utils'),
		tpl = require('../templates');
	require('../lib/jquery.webui-popover'),

		module.exports = {
			init: function () {
				console.log('init list js');
				if (utils.getContainer()) {
					$(this.template()).insertBefore(utils.getContainer());
					this.render();
				} else {
					console.error('未匹配detail页');
				}
			},
			template: tpl['qly/detail.box'],

			taosearch: function () {
				$('.QLY-taobaosearch').webuiPopover({
					//content: tpl['qly/detail.table'](),
					//type:'async',
					//url:'http://192.168.1.226:8000/addFav',
					content: tpl['qly/detail.taosearch'](),

					width: 358,
					trigger: 'hover',
					animation: 'pop',
					//async: {
					//	before: function(that, xhr) {
					//		console.log('before');
					//		console.log(xhr.promise());
					//	},//executed before ajax request
					//	success: function(that, data) {
					//		console.log(data)
					//	}//executed after successful ajax request
					//}
				});
			},
			ztc: function () {
				$('.QLY-ztc').webuiPopover({
					//content: tpl['qly/detail.table'](),
					//type:'async',
					//url:'http://192.168.1.226:8000/addFav',
					content: tpl['qly/detail.ztc'](),

					width: 358,
					trigger: 'hover',
					animation: 'pop',
					//async: {
					//	before: function(that, xhr) {
					//		console.log('before');
					//		console.log(xhr.promise());
					//	},//executed before ajax request
					//	success: function(that, data) {
					//		console.log(data)
					//	}//executed after successful ajax request
					//}
				});
			},
			price: function () {
				console.log('价格曲线');
				$('.QLY-price').webuiPopover({
					type:'async',
					url:'http://192.168.1.78:8000/addFav',
					content: function () {
						return tpl['qly/detail.ztc']();
					},

					width: 358,
					height: 200,
					trigger: 'hover',
					animation: 'pop',
					async: {
						before: function(that, xhr) {
							console.log('before');
						},//executed before ajax request
						success: function(that, data) {
							console.log('_success');
						}//executed after successful ajax request
					}
				});
			},
			taoword: function () {
				$('.QLY-taoword').webuiPopover({
					//content: tpl['qly/detail.table'](),
					//type:'async',
					//url:'http://192.168.1.226:8000/addFav',
					content: tpl['qly/detail.taoword'](),

					width: 358,
					trigger: 'hover',
					animation: 'pop',
					//async: {
					//	before: function(that, xhr) {
					//		console.log('before');
					//		console.log(xhr.promise());
					//	},//executed before ajax request
					//	success: function(that, data) {
					//		console.log(data)
					//	}//executed after successful ajax request
					//}
				});
			},
			msearch: function () {
				$('.QLY-msearch').webuiPopover({
					//content: tpl['qly/detail.table'](),
					//type:'async',
					//url:'http://192.168.1.226:8000/addFav',
					content: tpl['qly/detail.msearch'](),

					width: 358,
					trigger: 'hover',
					animation: 'pop',
					//async: {
					//	before: function(that, xhr) {
					//		console.log('before');
					//		console.log(xhr.promise());
					//	},//executed before ajax request
					//	success: function(that, data) {
					//		console.log(data)
					//	}//executed after successful ajax request
					//}
				});
			},
			mztc: function () {
				$('.QLY-mztc').webuiPopover({
					//content: tpl['qly/detail.table'](),
					//type:'async',
					//url:'http://192.168.1.226:8000/addFav',
					content: tpl['qly/detail.msearch'](),

					width: 358,
					trigger: 'hover',
					animation: 'pop',
					//async: {
					//	before: function(that, xhr) {
					//		console.log('before');
					//		console.log(xhr.promise());
					//	},//executed before ajax request
					//	success: function(that, data) {
					//		console.log(data)
					//	}//executed after successful ajax request
					//}
				});
			},
			render: function () {
				this.taosearch();
				this.ztc();
				this.msearch();
				this.mztc();


				this.price();
				this.taoword();
			}
		};
});
