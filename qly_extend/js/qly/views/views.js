//Views 模块统一出口，外部调用，只要依赖此模块即可
__tk__define(function (require, exports, module) {
	var win = window,

		$ = require('../lib/jquery'),
		host = require('../host'),
		utils = require('../utils'),
		body = $('body');
	// 淘宝、天猫详情页
	function taobao_detail() {
		//图片位置对象
		var getContainer = function () {
			var img;
			if (host.isTBDetail || host.isTMDetail) {
				img = $('#J_ImgBooth')[0];
			} else if (host.isB2CDetail) {
				if ($('.land_a_pic')[0]) {
					img = $('.land_a_pic .err-product')[0];
				} else if (document.getElementById('spec-big')) {
					img = $('#spec-big img')[0];
				} else {
					img = $('#spec-n1 img')[0];
				}
			} else if (host.isYHDDetail) {
				img = $('#J_prodImg')[0];
			} else if (host.isVjiaDetial) {
				img = $('.sp-bigImg img')[0];
			} else if (host.isDDDetail) {
				img = $('#largePic')[0];
			} else if (host.isSuningDetail) {
				if (document.getElementById('bigImage')) {
					img = document.getElementById('bigImage');
				} else {
					img = $('#bigImg img')[0];
				}
			} else if (host.isVanclDetail) {
				img = $('#midimg')[0];
			} else if (host.isMLSDetail) {
				img = $('.twitter_pic')[0];
			} else if (host.isMGJDetail) {
				if ($('#J_BigImg')[0]) {
					img = $('#J_BigImg')[0];
				} else {
					img = $('.gallery_big img').eq(0)[0];
				}
			} else if (host.isVipDetail) {
				/*if (document.getElementById('J_mer_ImgReview')) {
				 img = $('#J_mer_ImgReview')[0];
				 } else {
				 img = $('.bt_good_img')[0];
				 }*/
				img = $('.zoomPad img')[0];

			} else if (host.isGMDetail) {
				img = $('.j-bpic-b')[0];
			} else if (host.isAMXDetail) {
				if (document.getElementById('prodImage')) {
					img = document.getElementById('prodImage');
				} else {
					img = $('#imgTagWrapperId img')[0];
				}
			} else if (host.isPaipaiDetail) {
				img = document.getElementById('pfhlkd_smallImage');
			} else if (host.isYixunDetail) {
				img = document.getElementById('xgalleryImg');
			} else if (host.isJumeiDetail) {
				img = document.getElementById('product_img');
			} else if (host.isJuDetail) {
				img = $('.J_zoom')[0];
			}

			return img;
		};
		try {
			if (getContainer()) {
				require('./detail').init();
			} else {
				console.error('未匹配detail页图片...');
			}
		} catch (e) {
			console.log(e.message);
		}
	}

	// 淘宝、天猫list
	function taobao_list() {
		console.log('list');
	}


	//### 初始化淘淘搜比价 ###
	//生成 #TK DOM；
	//为淘淘搜比价添加事件：移入、移出、按钮移入、点击；
	//为商品图片添加事件：移入、移出；
	function init() {

		if (host.isDetail) {
			setTimeout(function () {
				taobao_detail();
			}, 200);
		}
	}

	//暴露初始化接口
	module.exports = {
		init: init
	};
});
