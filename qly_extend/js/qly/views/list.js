//List page event collection
__tk__define(function (require, exports) {
	var $ = require('../lib/jquery'),
		_ = require('../lib/underscore.js');

	var Product = require('../product'),
		host = require('../host'),
		utils = require('../utils'),
		prefix = require('./prefix').app,
		list = require('./render.list'),
		body = $('body');
	var tpl = require('../templates');

	var data = [
		{
			spid: 44718841980,
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
			ztcKeywordNum: 0,
			ztcMKeywordNum: 1,
			offSaleTime: "3天4小时27分16秒",
			updateTime: "3天4小时27分16秒"
		},
		{
			spid: 521388612951,
			pid: 3490772265,
			sid: 167912,
			zrssList: [
				{
					kw: "文艺范女装",
					page: 1,
					num: 1
				},
				{
					kw: "纯棉衬衫女长袖",
					page: 1,
					num: 1
				},
				{
					kw: "纯棉衬衣女 长袖",
					page: 1,
					num: 1
				},
				{
					kw: "文艺范女装秋装",
					page: 1,
					num: 1
				},
				{
					kw: "文艺范女长袖衬衫",
					page: 1,
					num: 1
				},
				{
					kw: "纯棉衬衫 女",
					page: 1,
					num: 1
				},
				{
					kw: "衬衫女纯棉",
					page: 1,
					num: 1
				},
				{
					kw: "范",
					page: 1,
					num: 1
				},
				{
					kw: "纯棉印花衬衫女",
					page: 1,
					num: 1
				},
				{
					kw: "原创文艺范",
					page: 1,
					num: 1
				}
			],
			zrssMList: [
				{
					kw: "茵蔓",
					page: 1,
					num: 1
				},
				{
					kw: "茵曼长袖女衬衫",
					page: 1,
					num: 2
				},
				{
					kw: "茵曼衬衫女长袖",
					page: 1,
					num: 2
				},
				{
					kw: "茵曼衬衣",
					page: 1,
					num: 2
				},
				{
					kw: "茵曼官方旗舰店",
					page: 1,
					num: 6
				},
				{
					kw: "纯棉长袖衬衫女秋",
					page: 1,
					num: 9
				},
				{
					kw: "秋装新款绣花衬衣",
					page: 1,
					num: 18
				},
				{
					kw: "绣花衬衫女",
					page: 2,
					num: 3
				},
				{
					kw: "女士纯棉衬衫长袖",
					page: 2,
					num: 10
				},
				{
					kw: "印花衬衣女长袖",
					page: 2,
					num: 14
				}
			],
			ztcMList: [
				{
					kw: "茵蔓",
					page: 1,
					num: 1
				},
				{
					kw: "森宿长袖衬衫",
					page: 2,
					num: 22
				},
				{
					kw: "外贸棉麻森女衬衫",
					page: 2,
					num: 22
				},
				{
					kw: "印花白衬衫女长袖",
					page: 3,
					num: 22
				},
				{
					kw: "厚衬衣女",
					page: 3,
					num: 22
				},
				{
					kw: "白衬衫内搭女",
					page: 4,
					num: 21
				},
				{
					kw: "森宿女装衬衫",
					page: 4,
					num: 21
				},
				{
					kw: "茵曼长袖女衬衫",
					page: 5,
					num: 21
				},
				{
					kw: "灯笼袖衬衫女棉",
					page: 6,
					num: 21
				}
			],
			zrssKeywordNum: 40,
			zrssMKeywordNum: 28,
			ztcKeywordNum: 0,
			ztcMKeywordNum: 9,
			updateTime: "2015-10-22",
			offSaleTime: "1天20小时27分20秒"
		}
	];

	var _data = [];
	_.each(data, function (item, i) {
		_data[item.spid] = item
	});


	//判断图片地址为淘宝商品图片
	//后缀必须是jpg
	//包含bao/uploaded/目录
	//尺寸必须大于70x70
	function isImage(img) {
		var src = img.src || $(img).data('ks-lazyload') || $(img).data('ks-lazyload-custom');

		if (_.isUndefined(src)) {
			return false;
		}
		var $img = $(img),
		//TODO 改用 class 区分淘淘搜比价图片会更高效
			isTKImage = _.isElement($img.parents('#' + prefix + 'media')[0]),
			isMLS = host.isMLSList && src.match(/.+_\d{3,}_\d.*\./),
			isMGJ = host.isMGJList && $img.parent().hasClass('img'),
		//s.taobao.com P4P product, use alicdn
			isAliCDN = src.match(/^http:\/\/g\.searc.*\.alicdn\.com/),
			isTBUrl = src.match(/bao\/uploaded|imgextra/),
			isTBSMALL = $img.parent().hasClass('prodpic-item'),
		//taobao list 快速预览
			isQuickLook = $img.parents('#J_QuickPanel')[0],
		//taobao list 淘特色和购买过店铺的宝贝
			isRecommend = $img.parents('.tb-recommend')[0];

		//过滤高宽小于 70px 的图片
		if (($img.width() < 70) || ($img.height() < 70)) {
			return false;
		}
		if (isMLS) {
			if ($img.width() < 170) {
				return false;
			} else {
				return true;
			}
		} else if (isMGJ) {
			return true;
		} else if ($img.hasClass('closeupContentListItemImg')) {
			return true;
		} else if (host.isTBFav && ($img.hasClass('img-controller-img') ||
			$img.hasClass('controller-img') || $img.hasClass('item-img'))) {
			return true;
		} else if (host.isTBList) {
			if (typeof $img.attr('_placeholder') !== 'undefined') {
				return false;
			}
			return true;
		}
		//贪婪模式，通过匹配后缀包含 _210x210.jpg, _b.jpg 两种规则来判断为大图
		else if ((host.isTBList || host.isTMList) && src.match(/.+_.*x.*.jpg|.+_b.jpg|.+_sum.jpg/g)) {
			//根据图片后缀判断图片大小
			//先取到 g_130x，再把 g_ 删除，再把 130x 转换成数值
			if ((parseInt(src.replace(/.*jpg_/, '').replace(/x.*/, ''), 10) < 70) ||
				isTBSMALL || isTKImage || isQuickLook || isRecommend) {
				return false;
			} else if (isTBUrl || isAliCDN) {
				return true;
			}
		} else if (src.match(/blank.gif/) || ($img.width() < 70) || ($img.height() < 70) || isTKImage) {
			return false;
		} else if (host.isYHDList) {
			if ($img.closest('.img')[0]) {
				return true;
			} else if ($img.parent().hasClass('product_pic') || $img.parent().hasClass('search_prod_img')) {
				return true;
			} else if ($img.parent().hasClass('pro_img_big') || $img.parent().hasClass('pro_img')) {
				return true;
			} else if ($img.parents('.pic')[0]) {
				return true;
			}
		} else if (host.isVjiaList) {
			if ($img.parents('.proInfoImg')[0]) {
				return true;
			}
		} else if (host.isDDList) {
			if ($img.parent().hasClass('pic') && !$img.parents('.big')[0]) {
				return true;
			}
		} else if (host.isSuningList) {
			if ($img.hasClass('err-product')) {
				return true;
			}
		} else if (host.isB2CList) {
			if (_.isElement($img.parents('.p-img')[0]) || $img.parent().attr('href').match(/autorank.jd.com/)) {
				return true;
			}
		} else if (host.isGMList) {

			if ($img.hasClass('bigImg')) {
				return true;
			} else if ($img.closest('.pic-wrap')[0]) {
				return true;
			}
		} else if (host.isVipList) {
			if ($img.closest('.cat-item-pic')[0]) {
				return true;
			}
		} else if (host.isAMXList) {
			if ($img.hasClass('s-access-image') || $img.hasClass('productImage')) {
				return true;
			}
		} else if (host.isVanclList) {
			if ($img.hasClass('productPhoto')) {
				return true;
			}
		}

		else {
			return false;
		}
	}

	exports.init = function () {
		body.on({
			'tklist.global.init': function () {
				var _ids = [];
				var _img = [];

				$('img:visible').each(function (i, item) {
					var target = $(item);
					if (isImage(item)) {

						if (!target.data('tk')) {
							target.data('tk', 'true');
							Product.item = new Product(target[0]);
							if (Product.item.getID()) {
								if (Product.item.box[0]) {
									_ids.push(Product.item.getID());
									_img.push(item);
								}
							}
						}
					}
				});
				if (!_ids[0]) {
					return;
				}

				var _parmString = '';
				$(_ids).each(function (i, item) {
					_parmString += ',' + item;
				});

				//$.ajax({
				//	dataType: 'jsonp',
				//	scriptCharset: 'UTF-8',
				//	url: 'http://localhost:8000/allProductsKeyword.do',
				//	data: 'spids=' + _parmString.substring(1),
				//	type: 'GET',
				//	success: function (data) {
				//		console.log(data);
				//		//这里数据
				//	}
				//});


				$(_img).each(function (i, item) {
					Product.item = new Product(item);
					if (Product.item.getID()) {
						if (Product.item.box[0]) {
							_ids.push(Product.item.getID());
							_img.push(item);

							new list(_data, item);
						}
					}
				});
			}
		});
	};
});
