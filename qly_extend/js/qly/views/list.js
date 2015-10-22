//List page event collection
__tk__define(function (require, exports) {
	var $ = require('../lib/jquery'),
		_ = require('../lib/underscore.js');

	var	Product =require('../product'),
		host = require('../host'),
		utils = require('../utils'),
		prefix = require('./prefix').app,
		list = require('./render').list,
		body = $('body');
	var tpl = require('../templates');

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
				$('img:visible').each(function (i, item) {
					var target = $(item);
					if (isImage(item)) {
						if (!target.data('tk')) {
							target.data('tk', 'true');
							Product.item = new Product(target[0]);
							console.log(Product.item.getID());
							if (Product.item.getID()) {
								if (Product.item.box[0]) {
									var box = Product.item.box.closest('.item');
									box.append(tpl['qly/list.box']({id: Product.item.getID()}));
								}
							}
						}
					}
				});
			}
		});
	};
});
