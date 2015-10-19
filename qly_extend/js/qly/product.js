__tk__define(function (require) {
	var location = window.location,
		href = location.href,
		host = location.host,
		$ = require('./lib/jquery'),
	//Base
		J = {
			utils: require('./utils'),
			host: require('./host')
		};

	//### 商品属性 ###
	//param target {Element} 商品对象
	function Product(target) {
		var DETAIL_TAOBAO_COM = J.host.isDetail,

		//s.taobao.com
			S_TAOBAO_COM = $('.col.item')[0] && $(target).parents('.col.item')[0] ||
				$('#mainsrp-itemlist')[0] && $(target).parents('.item')[0],

		//list 右侧 p4p 商品
			LIST_TAOBAO_P4P = $('.item-box')[0] && $(target).parents('.item-box')[0],

		//s.taobao.com 小图
			S_TAOBAO_COM_THUMBNAIL = $('.row.icon-datalink')[0] && $(target).parents('.row.icon-datalink'),

		//meilishuo.com list
			LIST_MEILISHUO_COM = J.host.isMLSList && $(target).parents('.np_pic.hover_pic'),

		//mogujie.com list
			LIST_MOGUJIE_COM = J.host.isMGJList && $(target).parent().parent(),

		//Detail page: mougujie.com, meilishuo.com
			DETAIL_MEILISHUO_MOGUJIE_COM = J.host.isMGJDetail || J.host.isMLSDetail,

		//item.jd.com
			DETAIL_B2C_COM = J.host.isB2CDetail,

			LIST_B2C_COM = J.host.isB2CList;

		this.target = target;

		if (DETAIL_TAOBAO_COM || DETAIL_B2C_COM || LIST_B2C_COM || J.host.isYHDDetail || J.host.isYHDList || J.host.isAMXDetail ||
			J.host.isVjiaDetial || J.host.isVjiaList || J.host.isDDList || J.host.isDDDetail || J.host.isGMDetail || J.host.isAMXList ||
			J.host.isSuningDetail || J.host.isSuningList || J.host.isVanclDetail || J.host.isVipDetail || J.host.isVipList) {
			this.box = $(target);
		} else if ($(target).closest('.pic') || J.host.isVanclList) {
			this.box = $(target);
		} else if (S_TAOBAO_COM) {
			this.box = $(target).parents('.item');
		} else if (LIST_TAOBAO_P4P) {
			this.box = $(target).parents('.item-box');
		} else if (S_TAOBAO_COM_THUMBNAIL) {
			this.box = $(target).parents('.row.icon-datalink');
		} else if (LIST_MEILISHUO_COM) {
			this.box = $(target).parents('.np_pic.hover_pic');
		} else if (LIST_MOGUJIE_COM) {
			this.box = $(target).parent().parent();
		} else if (DETAIL_MEILISHUO_MOGUJIE_COM) {
			this.box = $(target);
		} else if ($('.col')[0] && $(target).parents('.photo')) {
			this.box = $(target);
		} else {
			this.box = $(target).parents('li').length > 0 ? $(target).parents('li') : $(target).parents('.product');
		}

		if (!this.box[0]) {
			throw new Error('not find imgBox; disable!');
		}
	}

	Product.item = {};
	Product.isTBID = false;
	Product.prototype = {
		//### 获取商品ID ###
		getID: function () {
			var img = this.target,
				anchor = $(img).parents('a'),
				anchorHref = anchor.attr('href'),
				_id = '';

			if (J.host.isB2CDetail) {
				_id = window.pageConfig.product.skuid.toString();
			}
			else if (J.host.isB2CList || J.host.isVjiaList || J.host.isSuningList) {
				if (anchorHref.match(/[0-9].*\./)) {
					_id = anchorHref.match(/[0-9].*\./)[0].slice(0, -1);
				}
			}
			else if (J.host.isDDList) {
				_id = anchorHref.match(/[0-9]+/)[0];
			}
			else if (J.host.isYHDList) {
				//http://item.yhd.com/item/30137067
				if (anchorHref.match(/item\/[0-9]{5,9}/)) {
					_id = anchorHref.match(/item\/([0-9]{5,9})/)[1];
				}
			}
			else if (J.host.isVipDetail) {
				if (location.href.match(/[0-9]+-[0-9]+/)) {
					_id = location.href.match(/[0-9]+-([0-9]+)/)[1];
				}
			}
			else if (J.host.isVipList) {
				if (anchorHref.match(/[0-9]+-[0-9]+/)) {
					_id = anchorHref.match(/[0-9]+-([0-9]+)/)[1];
				}
			}
			else if (J.host.isGMDetail) {
				if (location.href.match(/product\/(.+)-/)) {
					_id = location.href.match(/product\/(.+)-/)[1];
				} else {
					_id = href.match(/[0-9]+/)[0];
				}
			}
			else if (J.host.isGMList) {
				if (anchorHref.match(/product\/(.+)-/)) {
					_id = anchorHref.match(/product\/(.+)-/)[1];
				} else {
					_id = anchorHref.match(/item.gome.com.cn\/(.+)-/)[1];
				}
			}
			else if (J.host.isAMXDetail) {
				if (location.href.match(/http:\/\/www.amazon.cn\/.*?\/dp\/(\w+)\/.*?/)) {
					_id = location.href.match(/http:\/\/www.amazon.cn\/.*?\/dp\/(\w+)\/.*?/)[1];
				} else if (location.href.match(/http:\/\/www.amazon.cn\/dp\/(\w+)\/.*?/)) {
					_id = location.href.match(/http:\/\/www.amazon.cn\/dp\/(\w+)\/.*?/)[1];
				}
				else {
					_id = location.href.match(/http:\/\/www.amazon.cn\/.*?\/product\/(\w+)\/.*?/)[1];
				}
			}
			else if (J.host.isAMXList) {
				if (this.box.parents('.prod')[0]) {
					_id = this.box.parents('.prod').attr('name');
				} else if (this.box.parents('.s-result-item')[0]){
					_id = this.box.parents('.s-result-item').data().asin;
				}
			}
			else if (J.host.isPaipaiDetail) {
				_id = location.pathname.substring(1);
			}
			else if (J.host.isPaipaiList) {
				if (anchorHref.match(/http:\/\/auction1.paipai.com\/(.+).+/)[1]) {
					_id = anchorHref.match(/http:\/\/auction1.paipai.com\/(.+).+/)[1];
				}
			}
			else if (J.host.isYixunDetail) {
				if (location.pathname.match(/item-([0-9].*)\./)[1]) {
					_id = location.pathname.match(/item-([0-9].*)\./)[1];
				}
			}
			else if (J.host.isYixunList) {
				if (anchorHref.match(/item-([0-9].*)\./)[1]) {
					_id = anchorHref.match(/item-([0-9].*)\./)[1];
				}
			}
			else if (J.host.isYHDDetail) {
				if (location.pathname.split(/\//)[2]) {
					_id = location.pathname.split(/\//)[2];
				}
				//_id = href.match(/[0-9]{5,9}\?/)[0].slice(0, -1);
			}
			else if (J.host.isVjiaDetial || J.host.isSuningDetail ||
				J.host.isVanclDetail || J.host.isJumeiDetail) {
				_id = href.match(/[0-9].*\./)[0].slice(0, -1);
			}
			else if (J.host.isDDDetail) {
				_id = href.match(/[0-9]+/)[0];
			}
			else if (J.host.isVanclList) {
				_id = anchorHref.match(/[0-9].*\./)[0].slice(0, -1);
			}
			//s.taobao.com
			else if (this.box.attr('nid')) {
				_id = this.box.attr('nid');
			}
			//taobao list
			else if (J.host.isTBList) {
				if (anchor[0] && anchor.attr('stat')) {
					_id = anchor.attr('stat').split('|')[0].split('-')[1];
				} else if (J.utils.sliceID(anchorHref)) {
					_id = J.utils.sliceID(anchorHref);
				} else if ($(img).parents('.item').attr('nid')) {
					_id = $(img).parents('.item').attr('nid');
				}
				else {
					_id = '';
				}
			}
			//detail.taobao.com
			else if (J.host.isTBDetail) {
				_id = J.utils.sliceID(href);
			}
			else if (J.host.isJuDetail) {
				_id = J.utils.sliceID(anchorHref);
			}
			else if ((anchorHref && host === J.host.tbList) || //list.taobao.com
				J.host.isTBFav) {
				_id = J.utils.sliceID(anchorHref);
			}
			else if (J.host.isTMList || J.host.isTMDetail) {
				var i;
				//list.tmall.com
				if (anchorHref && J.host.isTMList) {
					//list 存在 u_id 的问题
					if (anchorHref.match(/mallstItemId/)) {
						i = anchorHref.indexOf('mallstItemId=') + 13;
					} else if (anchorHref.match(/default_item_id/)) {
						i = anchorHref.indexOf('default_item_id=') + 16;
					} else {
						i = anchorHref.indexOf('id=') + 3;
					}
					_id = anchorHref.slice(i, anchorHref.indexOf('&', i));
				}
				//detail.tmall.com
				else if (J.host.isTMDetail) {
					if (href.match(/default_item_id/)) {
						_id = href.slice(href.indexOf('default_item_id=') + 16, href.length);
					} else if (href.match(/mallstItemId/)) {
						i = href.indexOf('mallstItemId=') + 11;
						_id = J.utils.sliceID(href.slice(i, href.indexOf('&', i)));
					} else {
						_id = J.utils.sliceID(href);
					}
				}
			}
			//店铺首页
			else if ((J.host.isTBShop || J.host.isTMShop) && J.utils.sliceID(anchorHref)) {
				_id = J.utils.sliceID(anchorHref);
			}
			//List page: meilishuo.com
			else if (J.host.isMLSList) {
				try {
					if (J.utils.sliceID(decodeURIComponent(anchorHref))) {
						_id = J.utils.sliceID(decodeURIComponent(anchorHref));
					} else {
						_id = anchorHref.match(/[0-9]{10}/);
					}
				} catch (e) {
					_id = anchorHref.match(/[0-9]{10}/);
				}
			}
			//List page: mogujie.com
			else if (J.host.isMGJList) {
				if (anchorHref.match(/[0-9].*\?/)) {
					_id = anchorHref.match(/[0-9].*\?/)[0].slice(0, -1);
				} else {
					_id = J.utils.getUrlParam(anchorHref, 'i');
				}

			}
			//Detail page: meilishuo and mogujie
			else if (J.host.isMGJDetail || J.host.isMLSDetail) {
				var pathName = window.location.pathname,
					pathArr = pathName.split('/'),
					len = pathArr.length;
				_id = pathArr[len - 1];
			}



			return _id;
		},
		isTBID: function () {
			var img = this.target,
				anchor = $(img).parents('a'),
				anchorHref = anchor.attr('href'),
				tbId = false;
			if (J.host.isMLSList) {
				try {
					if (J.utils.sliceID(decodeURIComponent(anchorHref))) {
						tbId = true;
					}
				} catch (e) {
					tbId = false;
				}
			}
			return tbId;
		},
		//### 获取商品标题 ###
		getTitle: function () {
			var img = this.target,
				docTitle = document.title,
				title = '',
				tbTitle = img.parentNode && img.parentNode.title,

			//s.taobao.com
			//search.taobao.com
				S_TAOBAO_COM = ( host === J.host.tbListS || host === 'search.taobao.com' || host === 's8.taobao.com' ) &&
					(this.box.find('.summary a').text()),

			//list.taobao.com
				LIST_TAOBAO_COM = (host === J.host.tbList) && (this.box.find('.title').text()),

			//search1.taobao.com
				SEARCH1_TAOBAO_COM = (host === J.host.tbSearch1) && (this.box.find('.J_ItemDesc').data('item-desc'));
			if (J.host.isYHDDetail) {
				//title = docTitle;
				title = $('#productMainName').attr('title');
				//} else if (J.host.isSuningList && $(img).parent().next().hasClass('inforBg')) {
			} else if (J.host.isSuningList) {
				if (this.box.closest('.item')[0]) {
					title = this.box.closest('.item').find('.i-name').text();
				} else {
					title = img.alt;
				}
			} else if (J.host.isMGJDetail) {
				if ($('.goods-title')[0]) {
					title = $('.goods-title').text();
				} else if ($('.shop_link')[0]) {
					title = $('.shop_link')[0].title;
				}
				//图片上的title商品的标题
				else if ($('#itemimg')[0]) {
					title = $('#itemimg')[0].title;
				}
				//属于商品描述性信息
				/*else if($('.share_content')[0]) {
				 title = $('.share_content').eq(0).text();
				 }*/
			}
			else if (J.host.isAMXList) {
				if (this.box.parents('.prod')[0]) {
					title = this.box.parents('.prod').find('.newaps').text();
				} else if (this.box.parents('.s-result-item')[0]){
					title = this.box.parents('.s-result-item').find('.s-access-title').text();
				}
			}
			else if (J.host.isYHDList) {
				if (img.title) {
					title = img.title;
				} else if (img.alt) {
					title = img.alt;
				} else if ($(img).parent().hasClass('search_prod_img')) {
					title = $(img).parents('.search_item_box').find('.title').text();
				} else if ($(img).parent().hasClass('pro_img_big')) {
					title = $(img.parentNode.parentNode).find('.name').text();
				} else if ($(img).parent().hasClass('search_prod_img')) {
					title = img.parentNode.title;
				} else if ($(img).parents('.itemBox')[0]) {
					title = $(img).parents('.itemBox').find('.proName a')[0].title;
				}
			}
			else if (J.host.isSuningDetail) {
				if (document.getElementById('itemDisplayName')) {
					title = $('#itemDisplayName').text();
				} else {
					title = $('#productDisplayName').text();
				}
			}
			else if (J.host.isPaipaiDetail || J.host.isJuDetail) {
				title = document.title;
			}
			else if (J.host.isB2CDetail) {
				//title = docTitle.replace('-京东商城', '');
				if ($('#name h1')[0]) {
					title = $('#name h1').text();
				} else {
					title = this.target.alt;
				}
			} else if (J.host.isB2CList) {
				if (img.alt) {
					title = img.alt;
				} else if ($(img.parentNode.parentNode.parentNode).find('.p-name')[0]) {
					//var _title = img.title;
					title = $(img.parentNode.parentNode.parentNode).find('.p-name').text().replace(tbTitle, '');
				} else if ($(img.parentNode.parentNode.parentNode).find('.rate')[0]) {
					title = $(img.parentNode.parentNode.parentNode).find('.rate').text().replace(tbTitle, '');
				}
			}
			else if (J.host.isVanclDetail) {
				if (img.title) {
					title = img.title;
				}
			}

			//母婴类目 list：窄屏，商品图大小 220 * 220
			else if (img.title !== '') {
				title = img.title;
			}
			//淘宝主搜有时候出现为你找到的商品中
			else if (img.alt && img.alt !== '') {
				title = img.alt;
			}
			//蘑菇街只从<img>取标题，取不到就设为空值
			else if (J.host.isMGJList) {
				title = '';
			} else if (tbTitle !== '') {
				title = tbTitle;
			} else if (J.host.isTBList) {
				title = img.parentNode.parentNode.parentNode.parentNode.children[0].children[0].title;

				if (S_TAOBAO_COM) {
					title = S_TAOBAO_COM;
				} else if (LIST_TAOBAO_COM) {
					title = LIST_TAOBAO_COM;
				} else if (SEARCH1_TAOBAO_COM) {
					//Get html source code, use tmpl() transcoding
					title = $.tmpl(SEARCH1_TAOBAO_COM).text();
				} else if ($(img.parentNode.parentNode.parentNode.parentNode).hasClass('col-item')) {
					title = $(img.parentNode.parentNode.parentNode.parentNode).find('h5').text();
				} else if ($(img.parentNode.parentNode.parentNode.parentNode).hasClass('item')) {
					title = $(img.parentNode.parentNode.parentNode.parentNode).find('.title').text();
				} else if (this.box.closest('.pic')[0]) {
					title = this.box.closest('.product-item').find('.title a').attr('title');
				}
			}
			else if (J.host.isTMList) {
				//美容馆 list
				if ($(img.parentNode.parentNode.parentNode).find('.product-title')[0]) {
					title = $(img.parentNode.parentNode.parentNode).find('.product-title').text();
				}
				//普通天猫 list
				else {
					if ($(img.parentNode.parentNode.parentNode).find('.productTitle')[0]) {
						title = $(img.parentNode.parentNode.parentNode).find('.productTitle').text();
					}
				}
			} else if (J.host.isTBDetail) {
				title = docTitle.replace('-淘宝网', '');
			}
			else if (J.host.isTMDetail) {
				title = docTitle.replace('-tmall.com天猫', '');
			}
			else if (J.host.isTBFav) {
				if (img.parentNode.className === 'img-wrap') {
					title = $(img.parentNode.parentNode).find('.cont .g_price').text();
				} else if (img.parentNode.className === 'img') {
					title = $(img.parentNode.parentNode.parentNode).find('.img-item-title').text();
				} else if (img.parentNode.className === 'shop-icon') {
					title = $(img.parentNode.parentNode.parentNode).find('.shop-title')[0].title;
				}
				else {
					title = $(img.parentNode.parentNode.parentNode).find('.title')[0].getElementsByTagName('a')[0].title;
				}
			}
			//店铺首页
			else if (href.match(/shop/) || $(img).parents('li').find('a').eq(1).text()) {
				title = $(img).parents('li').find('a').eq(1).text();
			}
			else if (J.host.isMLSDetail) {
				if ($('.tui_tle')[0]) {
					title = $('.tui_tle a').text();
				} else if ($('.s_tle')[0]) {
					title = $('h3.s_tle').text();
				}
			}
			else if (J.host.isVipDetail) {
				if ($('.pib_title_detail')[0]) {
					title = $('.pib_title_detail').text();
				} else {
					title = document.title.replace('_唯品会', '');
				}
			}


			else if (J.host.isGMDetail) {
				if ($('.prdtit')[0]) {
					title = $('.prdtit').text();
				}
			}

			else if (J.host.isAMXDetail) {
				if (document.getElementById('productTitle')) {
					title = $('#productTitle').text();
				}
			}
			if (typeof title === 'undefined') {
				title = '';
			}

			return $.trim(title.slice(0, 100));
		},

		//### 获取店铺等级 ###
		//仅详情页
		getLevel: function () {
			var level = '',
				src = '',
				map;

			if (!J.host.isDetail) {
				return level;
			}

			map = {
				's_red_1.gif': 1,
				's_red_2.gif': 2,
				's_red_3.gif': 3,
				's_red_4.gif': 4,
				's_red_5.gif': 5,
				's_blue_1.gif': 6,
				's_blue_2.gif': 7,
				's_blue_3.gif': 8,
				's_blue_4.gif': 9,
				's_blue_5.gif': 10,
				's_cap_1.gif': 11,
				's_cap_2.gif': 12,
				's_cap_3.gif': 13,
				's_cap_4.gif': 14,
				's_cap_5.gif': 15,
				's_crown_1.gif': 16,
				's_crown_2.gif': 17,
				's_crown_3.gif': 18,
				's_crown_4.gif': 19,
				's_crown_5.gif': 20
			};

			if (J.host.isTM) {
				level = 30;
			} else if ($('.rank')[0] && $('.rank')[0].src) {
				src = $('.rank').attr('src').match(/s_.*/)[0];

				if (src && map[src]) {
					level = map[src];
				}
			} else {
				level = '';
			}

			return level;
		},

		getBrand: function () {
			var brand = '';
			if (host.isTMDetail) {
				if ($('.J_EbrandLogo')[0]) {
					brand = $('.J_EbrandLogo').text();
				}
			}
			return brand;
		},

		//### 获取商品图片 ###
		getImg: function () {
			var img = '',
				detailData = $('#J_itemViewed')[0] ? $('#J_itemViewed').data('value') : '';

			//格式化图片地址，
			//从 i[0-9]/ 开始取，到第一个 .jpg 为止。
			//source: http://img01.taobaocdn.com/bao/uploaded/i5/T1ZpYHXfpkXXaPUl.Z_033408.jpg_460x460.jpg
			//result: i5/T1ZpYHXfpkXXaPUl.Z_033408.jpg
			//param {String} imgSrc 商品图片
			function imgFormat(imgSrc) {
				if (imgSrc) {
					if (imgSrc.match(/png/)) {
						return imgSrc.replace(/.*\/i/, 'i').replace(/png.*/, 'png');
					} else if (imgSrc.match(/gif/)) {
						return imgSrc.replace(/.*\/i/, 'i').replace(/gif.*/, 'gif');
					} else {
						return imgSrc.replace(/.*\/i/, 'i').replace(/jpg.*/, 'jpg');
					}
				}
			}

			if (J.host.isTBDetail) {
				//部分淘宝页面存在 JSON 数据输出错误的情况，导致取不到图片，
				//在这种情况下使用正则取图片地址。
				//参考：[item.taobao.com](http://item.taobao.com/item.htm?id=17770054022)
				if (typeof detailData === 'string') {
					img = detailData.replace(/.*pic":"/, '').replace(/".*/, '');
				}
				//淘宝详情页
				else if (typeof detailData === 'object' && detailData.pic) {
					img = detailData.pic;
				}
			} else if (J.host.isTMDetail) {
				var tmImg = $('[name=photo_url]').val(),
					tmOffImg = document.getElementById('J_ImgBooth');

				//天猫详情页
				if (tmImg) {
					img = tmImg;
				}
				//天猫下架商品
				else if (tmOffImg) {
					img = imgFormat(tmOffImg.src);
				}
			}
			//List
			else if (J.host.isTBList || J.host.isTMList) {
				img = imgFormat(this.target.src);
			}
			else if (J.host.isAMXDetail) {
				img = $('#imgTagWrapperId img').data('old-hires');
			}
			else if (typeof this.target.src !== 'undefined' && this.target.src !== '') {
				img = this.target.src;
			}
			else if (J.host.isDDDetail) {
				img = document.getElementById('largePic').src;
			}
			else if (J.host.isVipDetail) {
				img = $('.J_mer_bigImgZoom').attr('href');
			}
			else if (J.host.isGMList) {
				img = this.target.src;
			}
			return img;
		},

		//### 获取商品价格 ###
		getPrice: function () {
			var price = '',
				detailData = $('#J_itemViewed')[0] ? $('#J_itemViewed').data('value') : '',

			//list.taobao.com
				LIST_TAOBAO_COM = this.box.find('.price strong').eq(0).text(),

			//meilishuo.com list
				LIST_MEILISHUO_COM = this.box.find('.price').eq(0).text(),

			//mogujie.com list
				LIST_MOGUJIE_COM = this.box.find('.p').eq(0).text(),


				IS_TM_HIDEN = $('#J_PromoPrice').hasClass('tb-hidden') || $('#J_PromoPrice').hasClass('hidden');


			//因为JS的浮点数运算有BUG，不能直接乘以100
			//这里先将浮点数转换 string，然后用正则删除 "."
			function numberFormat(num) {
				if (num) {
					if (typeof num === 'number') {
						num = num.toString();
					}

					return num.replace(/\./, '');
				}
			}

			//delete ￥
			if (this.box.find('.col.price').text()) {
				price = this.box.find('.col.price').text().slice(1);
			}
			//s.taobao.com 有优惠价
			else if (this.box.find('.price em')[1] && this.box.find('.price em').eq(1).text()) {
				price = this.box.find('.price em').eq(1).text();
			} else if (this.box.find('.price em').text()) {
				price = this.box.find('.price em').text();
			} else if (LIST_TAOBAO_COM) {
				price = LIST_TAOBAO_COM;
			} else if (this.box.find('.g_price strong')[0] && this.box.find('.g_price strong').eq(0).text()) {
				if (href.match(/shop_collect_list/)) {
					//price = this.box.find('.g_price strong').eq(0).text();
					price = $(this.target).parents('.item-show').find('.g_price strong').text();
				} else {
					price = this.box.find('.g_price strong').eq(0).text();
				}

			} else if (this.box.find('.productPrice em').attr('title')) {
				price = this.box.find('.productPrice em').attr('title');
			} else if (J.host.isTBList) {
				if (this.box.closest('.grid-item')[0]) {
					price = this.box.closest('.grid-item').find('.price-num').text() + '00';
				} else if (this.box.closest('.item').find('.price')[0]) {
					price = this.box.closest('.item').find('.price').text();
				} else {
					price = this.box.closest('.product-item').find('.price-num').text();
				}
			}
			//list 右侧 p4p 商品
			if (this.box.find('.price').text()) {
				price = this.box.find('.price').text();
				if (!price.toString().match(/\./)) {
					price = price.toString() + '00';
				}
				if (this.box.find('.price .origin-price')[0]) {
					price = this.box.find('.price').html().toString().replace(/span.*/g, '');
					price = price.match(/[0-9].+[0-9]+/)[0];
				}
			}
			//Detail
			else if (typeof detailData === 'object' && detailData.price) {
				price = detailData.price;
			} else if ($('#J_PromoBox').text()) {
				price = $('#J_PromoBox').text().replace(/[^\x00-\xff]*/g, '');
			} else if (LIST_MEILISHUO_COM) {
				price = LIST_MEILISHUO_COM;
			} else if (LIST_MOGUJIE_COM) {
				price = LIST_MOGUJIE_COM;
				if (price.match(/\./)) {
					price = price.replace(/\./, '');
				} else {
					price = price + '00';
				}
			}
			//淘宝详情页促销价
			if (window.TB && window.TB.PromoData && window.TB.PromoData.def && window.TB.PromoData.def[0] && window.TB.PromoData.def[0].price) {
				price = numberFormat(window.TB.PromoData.def[0].price);
			}

			//天猫详情页
			//由于数据是异步获取，所以直接使用天猫详情页的实现
			if (J.host.isTMDetail && window.KISSY) {
				if (window.KISSY._TMD_Config && window.KISSY._TMD_Config.itemDO && window.KISSY._TMD_Config.itemDO.reservePrice) {
					price = numberFormat(window.KISSY._TMD_Config.itemDO.reservePrice);
				}

				if ($('#J_StrPriceModBox').hasClass('tm-price-cur')) {
					price = $('#J_StrPriceModBox .tm-price').text();
				} else if ($('#J_PromoBox')[0]) {
					price = $('#J_PromoBox .J_CurPrice').text();
				} else {
					price = $('#J_PromoPrice .tm-price').text();
				}
			}

			if (J.host.isMGJDetail) {
				if (document.getElementById('J_NowPrice')) {
					price = $('#J_NowPrice').text();
				} else if (document.getElementById('_sku_top_price')){
					price = $('#_sku_top_price b').text();
				}

			} else if (J.host.isPaipaiDetail) {
				if (document.getElementById('commodityCurrentPrice')) {
					price = $('#commodityCurrentPrice').text();
				}
			} else if (J.host.isYixunDetail) {
				if ($('.mod_price')[0]) {
					price = $('.mod_price').eq(0).text();
				}
			} else if (J.host.isYixunList) {
				if (this.box.closest('.mod_goods')[0]) {
					price = this.box.closest('.mod_goods').find('.mod_price').text();
				}
			} else if (J.host.isJumeiDetail) {
				if ($('.price_num')[0]) {
					price = $('.price_num').eq(0).text() + '00';
				}
			} else if (J.host.isJuDetail) {
				if ($('.currentPrice')[0]) {
					price = $('.currentPrice').eq(0).text();
				}
			}
			if (J.host.isMLSDetail) {
				if (document.getElementById('price-now')) {
					price = $('#price-now').text();
				} else {
					price = $('.sku_meta .price').text();
				}
			}
			if (J.host.isB2CDetail) {
				if (document.getElementById('jd-price')) {
					price = $('#jd-price').text();
				} else if (document.getElementById('price')) {
					price = $('#price strong').text();
				}
				else {
					price = $('.l_info_a b').eq(0).text();
				}
			}
			if (J.host.isDDDetail) {
				if (document.getElementById('promo_price')){
					price = $('#promo_price').text();
				}
				if (document.getElementById('salePriceTag')) {
					price = $('#salePriceTag').text();
				}
			}
			if (J.host.isYHDDetail) {
				if (document.getElementById('current_price')) {
					price = $('#current_price').text() + '00';
				}
			} else if (J.host.isYHDList) {
				if (this.box.parents('.itemBox')[0]) {
					price = this.box.parents('.itemBox').find('.num').attr('yhdprice') + '00';
				} else if (this.box.closest('.search_item_box')[0]) {
					price = this.box.parents('.search_item_box').find('.price').text() + '00';
				}
			} else if (J.host.isVjiaList) {
				if (this.box.closest('.proInfoBox')[0]) {
					price = this.box.closest('.proInfoBox').find('.proPrice .fl').text() + '00';
				}
			} else if (J.host.isSuningList) {
				if (this.box.closest('.item')[0]) {
					price = this.box.closest('.item').find('.price strong').text();
				}
			} else if (J.host.isGMList) {
				if (this.box.closest('.prdli')[0]) {
					price = this.box.closest('.prdli').find('.price').text();
				}
			} else if (J.host.isVanclList) {
				if (this.box.closest('.productwrapper')[0]) {
					price = this.box.closest('.productwrapper').find('.Sprice').text();
				}
			}
			if (J.host.isVanclDetail) {
				if ($('.cuxiaoPrice')[0]) {
					price = $('.cuxiaoPrice strong').text();
				}
			}
			if (J.host.isVipDetail) {
				if ($('.pbox_price')[0]) {
					price = $('.pbox_price em').text() + '00';
				} else {
					price = $('.pbox-price em').text() + '00';
				}
			} else if (J.host.isVipList) {
				if (this.box.parents('.cat-list-item')[0]) {
					price = this.box.parents('.cat-list-item').find('.cat-pire-nub').text() + '00';
				}
			}
			if (J.host.isSuningDetail) {
				if (document.getElementById('promoPrice')) {
					price = $('#promoPrice').text();
				} else if (document.getElementById('promotionPrice')){
					price = $('#promotionPrice').text();
				}
			} else if (J.host.isGMDetail) {//prdPrice
				if (document.getElementById('prdPrice')) {
					price = $('#prdPrice').text();
				}
			} else if (J.host.isVjiaDetial) {
				if (document.getElementById('SpecialPrice')) {
					price = $('#SpecialPrice').text();
				}
			} else if (J.host.isAMXList) {
				if (this.box.parents('.prod')[0]) {
					price = this.box.parents('.prod').find('.newp .bld').text();
				} else if (this.box.parents('.s-result-item')[0]){
					price = this.box.parents('.s-result-item').find('.s-price').text();
				}
			} else if (J.host.isAMXDetail) {
				if (document.getElementById('priceblock_saleprice')) {
					price = $('#priceblock_saleprice').text();

				} else if (document.getElementById('priceblock_ourprice')) {
					price = $('#priceblock_ourprice').text();
				} else if ($('.priceLarge')[0]) {
					price = $('.priceLarge').text();
				}
			} else if (J.host.isB2CList) {
				if (this.box.parents('.gl-item')[0]) {
					price = this.box.parents('.gl-item').find('.p-price strong').text();
				} else {
					price = this.box.parents('.lh-wrap').find('.J_price').text();
				}
			} else if (J.host.isMGJList) {
				price = this.box.find('.price_info').text();
			} else if (J.host.isDDList) {

				if (this.box.closest('.shop_box')[0]) {
					price = this.box.closest('.shop_box').find('.price_n').text();
				} else {
					price = this.box.parent().parent().find('.d_price').text();
				}
			} else if (J.host.isTMList) {
				if (this.box.closest('.product')[0]) {
					price = this.box.closest('.product').find('.productPrice').text();
				}
			} else if (J.host.isMLSList) {
				if (this.box.closest('.new_poster')[0]) {
					price = this.box.closest('.new_poster').find('.price').text();
				}
			} else if (J.host.isPaipaiList) {
				if (this.box.closest('.hproduct')[0]) {
					price = this.box.closest('.hproduct').find('.price').text();
				}
			}

			if (J.host.isTBDetail) {
				if (!IS_TM_HIDEN) {
					//|| document.getElementById('J_PromoPrice').style.display === 'none'
					if (document.getElementById('J_PromoPrice')) {
						price = $('#J_PromoPrice .tb-rmb-num').eq(0).text();
					} else {
						price = $('#J_StrPriceModBox .tb-rmb-num').eq(0).text();
					}
				}

				if (price === '') {
					price = $('#J_StrPrice .tb-rmb-num').text();
				}
			} else if (this.box.find('.now-price').text()) {
				price = this.box.find('.now-price').text();
			}
			if (price && price.toString().match(/\./)) {
				price = $.trim(numberFormat(price));
			}
			if (price.match(/-/)) {
				price = price.replace(/-.+/, '');
			}
			if (price.match(/,/)) {
				price = price.replace(/,/, '');
			}

			return price.replace(/[^\x00-\xff]*/g, '').replace(/¥/g, '');
		},

		//### 获取商品原价 ###
		getOriPrice: function () {
			var price = '';

			//因为JS的浮点数运算有BUG，不能直接乘以100
			//这里先将浮点数转换 string，然后用正则删除 "."
			function numberFormat(num) {
				if (num) {
					if (typeof num === 'number') {
						num = num.toString();
					}

					return num.replace(/\./, '');
				}
			}

			if (J.host.isTBDetail) {
				price = $('#J_StrPrice').text();
			} else if (J.host.isTMDetail) {
				price = $('#J_StrPriceModBox .tm-price').text();
			}

			if (price && price.toString().match(/\./)) {
				price = $.trim(numberFormat(price));
			}
			if (price.match(/-/)) {
				price = price.replace(/-.+/, '');
			}
			if (price.match(/,/)) {
				price = price.replace(/,/, '');
			}

			return price.replace(/[^\x00-\xff]*/g, '').replace(/¥/g, '');
		},

		//### 获取商品链接 ###
		getHref: function () {
			var href = '',
				DETAIL_B2C_COM = J.host.isB2CDetail;
			if (J.host.isTBDetail || J.host.isTMDetail ||
				J.host.isB2CDetail || J.host.isYHDDetail ||
				J.host.isVipDetail || J.host.isGMDetail ||
				J.host.isVjiaDetial || J.host.isDDDetail ||
				J.host.isSuningDetail || J.host.isVanclDetail ||
				J.host.isAMXDetail ||J.host.isMGJDetail || J.host.isMLSDetail) {
				href = location.href;
			} else if (DETAIL_B2C_COM) {
				href = window.pageConfig.product.href;
			} else if (this.target.nodeName === 'IMG') {
				if ($(this.target).parents('a')[0]) {
					href = $(this.target).parents('a')[0].href;
				}
			} else if (this.target.nodeName === 'A') {
				href = this.target.href;
			} else {
				href = location.href;
			}

			return href;
		},

		//### 获取性别 ###
		getSex: function () {
			var sex = '',
				title = this.getTitle();

			if (title.match(/男/)) {
				sex = '男';
			} else if (title.match(/女/)) {
				sex = '女';
			}

			return sex;
		},

		//### 商品销量 ###
		getSum: function () {
			var sum = '0',
			//s.taobao.com
			//s8.taobao.com
				S_TAOBAO_COM = ( host === J.host.tbListS || host === 's8.taobao.com' ) && this.box.find('.col.dealing').text(),

			//p4p product
				P4P_LIST = this.box.find('.dealing .dealnum').text(),

			//search.taobao.com
				SEARCH_TAOBAO_COM = ( host === 'search.taobao.com' ) && this.box.find('.col.dealing div:eq(0)').text(),

			//list.taobao.com
				LIST_TAOBAO_COM = ( host === J.host.tbList ) && this.box.find('.quantity .num').text(),

			//search1.taobao.com
				SEARCH1_TAOBAO_COM = ( host === J.host.tbSearch1 ) && this.box.find('.trade-num').text(),

			//list.tmall.com
				LIST_TM_COM = ( J.host.isTMList ) && this.box.find('.productStatus em').text(),

			//item.taobao.com
				TB_DETAIL = ( J.host.isTBDetail ) && $('.J_SellCounter').eq(0).text(),

			//detail.tmall.com
				TM_DETAIL = ( J.host.isTMDetail ) && $('.tm-count').eq(1).text();

			function format(str) {
				//删除字符中包含的 acsii 字符，目的是只保留数字
				var sum = str.replace(/[^\x00-\xff]*/g, '');

				if (str.match(/万/)) {
					sum = sum + '万';
				}

				return $.trim(sum);
			}

			if (this.box.find('.person-count').text()) {
				sum = format(this.box.find('.person-count').text());
			}

			if (this.box.find('.transaction').text()) {
				sum = format(this.box.find('.transaction').text());
			}

			if (this.box.find('.sale').text()) {
				sum = format(this.box.find('.sale').text());
			}

			if (this.box.find('.amount').text()) {
				sum = format(this.box.find('.amount').text());
			}

			if (P4P_LIST && P4P_LIST.match(/笔/)) {
				sum = format(P4P_LIST);
			}

			if (S_TAOBAO_COM) {
				sum = format(S_TAOBAO_COM);
			}

			if (LIST_TAOBAO_COM) {
				sum = format(LIST_TAOBAO_COM);
			}

			if (SEARCH1_TAOBAO_COM) {
				sum = format(SEARCH1_TAOBAO_COM);
			}

			if (SEARCH_TAOBAO_COM && SEARCH_TAOBAO_COM.match(/笔/)) {
				sum = SEARCH_TAOBAO_COM.replace(/.*交/, '').replace(/[^\x00-\xff]*/g, '');
			}

			if (LIST_TM_COM) {
				sum = format(LIST_TM_COM);
			}

			if (TB_DETAIL) {
				sum = TB_DETAIL;
			}

			if (TM_DETAIL) {
				sum = format(TM_DETAIL);
			}

			if (J.host.isTBFav && this.box.find('.tuijian-sell')[0]) {
				sum = format(this.box.find('.tuijian-sell').text());
			}
			//天猫详情页
			//由于数据是异步获取，所以直接使用天猫详情页的实现
			if (J.host.isTMDetail && window.KISSY) {
				window.KISSY.use('malldetail/model/product', function (b, pro) {
					pro.onChange('salesCount', function (data) {
						if (data) {
							sum = data.monTotal;
						}
					});
				});
			}

			return sum;
		},

		//### 商品评价数 ###
		getFeedBackCount: function () {
			var sum = '0';
			if (J.host.isTBDetail) {
				sum = $('.J_RateCounter').text();
			}
			else if (J.host.isTMDetail) {
				sum = $('.tm-count').eq(0).text();
			}

			return sum;
		},

		//### 商品类目 ID ###
		getCid: function () {
			var categoryID = '';

			if ($('#J_itemViewed')[0] && $('#J_itemViewed').attr('catid')) {
				categoryID = $('#J_itemViewed').attr('catid');
			} else if (document.getElementById('tb-beacon-aplus')) {
				categoryID = document.getElementById('tb-beacon-aplus').getAttribute('exparams');
				if (categoryID.match(/^.*item%5f([0-9]{3,9})&.*$/)) {
					categoryID = categoryID.match(/^.*item%5f([0-9]{3,9})&.*$/)[1];
				}
			}

			//天猫详情页
			//由于数据是异步获取，所以直接使用天猫详情页的实现
			/*if (J.host.isTMDetail && window.KISSY && window.KISSY._TMD_Config && window.KISSY._TMD_Config.itemDO && window.KISSY._TMD_Config.itemDO.categoryId) {
			 categoryID = window.KISSY._TMD_Config.itemDO.categoryId;
			 } else if (J.host.isB2CDetail) {
			 categoryID = window.pageConfig.product.cat.toString();
			 }*/

			return categoryID;
		},

		//### 商品所在地 ###
		getLocation: function () {
			var location = '';

			if (this.box.find('.place').text()) {
				location = this.box.find('.place').text();
			} else if ($('.tb-location em').eq(0).text()) {
				location = $('.tb-location em').eq(0).text();
			} else if ($('.bts-extend:first li:last').text()) {
				location = $('.bts-extend:first li:last').text().replace(/.*：/, '');
			} else if ($('.locus').eq(0).text()) {
				location = $.trim($('.locus').eq(0).text().replace(/.*：/, '')).replace(/,/, '');
			} else if ($('.locus').eq(0).text()) {
				location = $.trim($('.locus').eq(0).text().replace(/.*：/, '')).replace(/,/, '');
			} else if (this.box.find('.loc').text()) {
				location = this.box.find('.loc').text();
			}

			//天猫详情页
			//由于数据是异步获取，所以直接使用天猫详情页的实现
			if (J.host.isTMDetail && window.KISSY) {
				window.KISSY.use('malldetail/model/product', function (b, pro) {
					pro.onChange('delivery', function (data) {
						if (data) {
							location = data.deliveryAddress;
						}
					});
				});
			}

			return $.trim(location);
		},

		//### 商家旺旺昵称 ###
		getNick: function () {
			var nick = '';

			if (this.box.find('.ww-light').data('nick')) {
				nick = this.box.find('.ww-light').data('nick');
			} else if ($('.J_WangWang').eq(0).data('nick')) {
				nick = $('.J_WangWang').eq(0).data('nick');
			} else if ($('.ww-light').eq(0).data('nick')) {
				nick = $('.ww-light').eq(0).data('nick');
			}

			return nick;
		},

		//### 获取包袋类目的款式 ###
		getItemStyle: function () {
			var result = false;

			if (J.host.isDetail) {
				if (this.getCid() === '50012010' && $('.attributes-list').text().match(/款式/)) {
					$('.attributes-list li').each(function (i, item) {
						if ($(item).text().match(/款式/)) {
							result = $(item).text().slice(4, $(item).text().length);
						}
					});
				}
			}

			return result;
		}

	};

	//暴露接口
	return Product;
});
