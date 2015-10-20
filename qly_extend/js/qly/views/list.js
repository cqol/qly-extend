//List page event collection
__tk__define(function (require, exports) {
	var $ = require('../lib/jquery'),
		_ = require('../lib/underscore.js'),
	//Base
		J = {},
		autoDelay = null,
	// 隐藏比价弹出框的延时
		popHideDelay = null,
	// 比价弹出框是否在显示的状态
		isPopupDisplay = false,
		isOnload = false,
		timer = 100;

	window.imgIdArr = [];

	_.extend(J, {
		Product: require('../product'),
		model: require('../models/models'),
		host: require('../host'),
		utils: require('../utils'),
		prefix: require('./prefix').app,
		list: require('./render').list,
		body: $('body'),
		MIN: window.navigator.userAgent.match(/MSIE 6.0/)
	});
	if (J.host.isTBFav) {
		timer = 500;
	}

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
			isTKImage = _.isElement($img.parents('#' + J.prefix + 'media')[0]),
			isMLS = J.host.isMLSList && src.match(/.+_\d{3,}_\d.*\./),
			isMGJ = J.host.isMGJList && $img.parent().hasClass('img'),
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
		} else if (J.host.isTBFav && ($img.hasClass('img-controller-img') ||
			$img.hasClass('controller-img') || $img.hasClass('item-img'))) {
			return true;
		} else if (J.host.isTBList) {
			if (typeof $img.attr('_placeholder') !== 'undefined') {
				return false;
			}
			return true;
		}
		//贪婪模式，通过匹配后缀包含 _210x210.jpg, _b.jpg 两种规则来判断为大图
		else if ((J.host.isTBList || J.host.isTMList) && src.match(/.+_.*x.*.jpg|.+_b.jpg|.+_sum.jpg/g)) {
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
		} else if (J.host.isYHDList) {
			if ($img.closest('.img')[0]) {
				return true;
			} else if ($img.parent().hasClass('product_pic') || $img.parent().hasClass('search_prod_img')) {
				return true;
			} else if ($img.parent().hasClass('pro_img_big') || $img.parent().hasClass('pro_img')) {
				return true;
			} else if ($img.parents('.pic')[0]) {
				return true;
			}
		} else if (J.host.isVjiaList) {
			if ($img.parents('.proInfoImg')[0]) {
				return true;
			}
		} else if (J.host.isDDList) {
			if ($img.parent().hasClass('pic') && !$img.parents('.big')[0]) {
				return true;
			}
		} else if (J.host.isSuningList) {
			if ($img.hasClass('err-product')) {
				return true;
			}
		} else if (J.host.isB2CList) {
			if (_.isElement($img.parents('.p-img')[0]) || $img.parent().attr('href').match(/autorank.jd.com/)) {
				return true;
			}
		} else if (J.host.isGMList) {

			if ($img.hasClass('bigImg')) {
				return true;
			} else if ($img.closest('.pic-wrap')[0]) {
				return true;
			}
		} else if (J.host.isVipList) {
			if ($img.closest('.cat-item-pic')[0]) {
				return true;
			}
		} else if (J.host.isAMXList) {
			if ($img.hasClass('s-access-image') || $img.hasClass('productImage')) {
				return true;
			}
		} else if (J.host.isVanclList) {
			if ($img.hasClass('productPhoto')) {
				return true;
			}
		}

		else {
			return false;
		}
	}

	exports.init = function () {
		// 通过关联鼠标移入移出事件记录比价框是否显示的状态
		var popupBindEvent = _.once(function () {
			var $con = $('#' + J.prefix + 'con');
			$con.on('mouseenter', function () {
				isPopupDisplay = true;
			})
				.on('mouseleave', function () {
					isPopupDisplay = false;
				});
		});

		J.body.on({
			//Show icon
			//TODO list.taobao.com listen button
			'tklist.global.init': function () {
				var delay = null,
				//临时数组 存图片id
					loadImgArr = [],
				//自动触发延迟
				// autoTime = 2000,
					$container = $('#' + J.prefix + 'media');

				$('img:visible').each(function (i, item) {
					var target = $(item);

					if (isImage(item)) {
						//原品点击 id数组
						if (J.host.isTBList || J.host.isTMList) {
							if (!target.data('cqol')) {
								var cqol = new J.Product(this);
								if (cqol.getID() !== '') {
									loadImgArr.push(cqol.getID());
								}
								target.data('cqol', 'true');
							}
						}
						if (!target.data('tk')) {
							target.data('tk', 'true').on('mouseenter', function () {
								var _this = this;

								if (popHideDelay) {
									clearTimeout(popHideDelay);
								}
								if (delay) {
									clearTimeout(delay);
								}
								if (autoDelay) {
									clearTimeout(autoDelay);
								}
								if ($('#' + J.prefix + 'con')[0]) {
									J.body.trigger('tklist.global.remove', [$container]);
								}

								delay = setTimeout(function () {
									J.body.trigger('tklist.global.show', [$(_this)]);
								}, timer);
								//Auto show
								// autoDelay = setTimeout(function () {
								//     J.body.trigger('tklist.global.show', [$(_this), 'auto']);
								// }, autoTime);
							});
							target.on('mouseleave', function () {
								if (delay) {
									clearTimeout(delay);
								}
							});
						}
					}
				});
				//原品点击需求
				/*if (J.host.isTBList || J.host.isTMList) {
				 //匹配上的图片请求广告系统
				 if (loadImgArr.length > 0 || loadImgArr[0]) {
				 var idsStr = '';
				 for (var i = 0, len = loadImgArr.length; i < len; i++) {
				 idsStr += ',' + loadImgArr[i];
				 }
				 $.getJSON('//show.kc.taotaosou.com/cooperation.do?id=' + idsStr.substring(1) +
				 '&jsonp=?', function (data) {
				 $.each(data, function (i, item) {
				 window.imgIdArr.push(item);
				 });
				 });
				 }
				 }*/

				if (_.isElement($container[0]) === false) {
					J.list.render();
					$container = $('#' + J.prefix + 'media');

					$container.on('mouseleave', function () {
						var _this = this;

						if (popHideDelay) {
							clearTimeout(popHideDelay);
						}
						isPopupDisplay = false;
						// 根据需求，隐藏弹出框时延时300ms以方便用户移到最下面的比价产品
						// //199.155.122.129:8080/pages/viewpage.action?pageId=19205004
						// list页·从按钮移到结果框，常常移不到
						popHideDelay = setTimeout(function () {
							if (isPopupDisplay) {
								return;
							}
							if (delay) {
								clearTimeout(delay);
							}
							if (autoDelay) {
								clearTimeout(autoDelay);
							}
							J.body.trigger('tklist.global.remove', [$(_this)]);
						}, 300);
					});

					$('#' + J.prefix + 'source-product').on('click', function () {
						J.body.trigger('tkstat.source.productclick', [this]);
					});

					//关闭淘淘搜比价
					$('#' + J.prefix + 'close').on('click', function () {
						J.body.trigger('tklist.global.remove');

						J.body.trigger('tkstat.global.remove');
					});

					//点击相似宝贝
					$('#' + J.prefix + 'button').on('click', function () {
						J.body.trigger('tkstat.global.button');
					});


				}
			},

			'tklist.global.show': function (e, target, type) {
				var button = $('#' + J.prefix + 'button');
				//显示“相似宝贝”按钮
				function showButton(target, callback) {
					J.body.trigger('tk.global.init', [target[0]]);

					J.list.update();

					J.body.trigger('tkstat.global.hover');
					var underTkData = {
						id: J.Product.item.getID(),
						title: J.Product.item.getTitle(),
						href: J.Product.item.getHref(),
						img: J.Product.item.getImg()
					};
					var btnUrl;
					if (J.host.isTBList || J.host.isTMList) {
						btnUrl = J.utils.getRecomPage(underTkData) + '&utm_source=' + J.utils.site() + '_btn' +
							'&price=' + J.Product.item.getPrice() + '&sales=' + J.Product.item.getSum();
					} else {
						btnUrl = J.utils.getUndertakePage(underTkData) + '&utm_source=' + J.utils.site() + '_btn' +
							'&price=' + J.Product.item.getPrice() + '&sales=' + J.Product.item.getSum();
					}

					// //199.155.122.129:8080/pages/viewpage.action?pageId=19628687
					if (J.utils.isManualDId) {
						btnUrl += '&isauto=1';
					}
					button
						.attr('href', btnUrl)
						.show();

					//TODO 快速移动会重复绑定事件
					button.one('mouseover', callback);
				}

				function open(e, type) {
					var $con = $('#' + J.prefix + 'con');

					popupBindEvent();
					//更新 UI 座标、位置
					function position(target, data) {
						var isRight = ($('html').width() / 1.7 < J.Product.item.box.offset().left);

						target.parent().removeClass(J.prefix + 'right');

						target.removeClass(J.prefix + 'loading');

						if (isRight) {
							target.parent().addClass(J.prefix + 'right');
						}

						if (_.isUndefined(data) === false) {
							J.body.trigger('tkstat.global.tag', data);
						}
						if (data) {
							/*var sexCid = '';
							 if (data.isTtsCategory) {
							 //sexCid += '&cid=' + data.cid + '';
							 if (typeof data.sex !== 'undefined') {
							 sexCid += '&sex=' + data.sex;
							 }
							 }*/
							var underTkData = {
								id: J.Product.item.getID(),
								title: J.Product.item.getTitle(),
								href: J.Product.item.getHref(),
								img: J.Product.item.getImg()
							};
							var btnUrl;

							if (J.host.isTBList || J.host.isTMList) {
								btnUrl = J.utils.getRecomPage(underTkData) + '&utm_source=' + J.utils.site() + '_btn' +
									'&price=' + J.Product.item.getPrice() + '&sales=' + J.Product.item.getSum();
							} else {
								btnUrl = J.utils.getUndertakePage(underTkData) + '&utm_source=' + J.utils.site() + '_btn' +
									'&price=' + J.Product.item.getPrice() + '&sales=' + J.Product.item.getSum();
							}

							// //199.155.122.129:8080/pages/viewpage.action?pageId=19628687
							if (J.utils.isManualDId) {
								btnUrl += '&isauto=1';
							}
							button
								.attr('href', btnUrl)
								.show();
						}

						$con.show();
					}

					J.list.renderBox();
					position($con);
					function bindEvent(data) {
						var tab = '1',
							isNoSameSim = (data.sameList.length === 0) && (data.similarList.length === 0);
						if (isNoSameSim) {
							tab = '3';
						}
						//商品的点击
						$('#' + J.prefix + 'list .J_alink').on('click', function () {
							if (type === 'auto') {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, 'image', tab]);
							} else {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, undefined, tab]);
							}
						});
						//评论的点击
						$('#' + J.prefix + 'list .J_comlink').on('click', function () {
							if (type === 'auto') {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, 'imageCom', tab]);
							} else {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, 'com', tab]);
							}
						});
						//促销标签点击
						$('.' + J.prefix + 'item-tags').on('click', function () {
							if (type === 'auto') {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, 'image', tab]);
							} else {
								J.body.trigger('tkstat.global.product', [data, $(this), undefined, undefined, tab]);
							}
						});
						/*//原商品点击
						 $('#' + J.prefix + 'source-product').one('click', function () {
						 J.body.trigger('tkstat.source.productclick', [this]);
						 });*/
					}

					if (!isOnload) {
						J.body.one({
							'tk.sync.success': function (e, data) {
								$.proxy(J.list.render, J.list);

								//天猫detail看了又看 商品点击
								////199.155.122.129:8080/pages/viewpage.action?pageId=19204737
								//J.utils.listProductIdArr = [];
								//J.utils.listProductIds = '';
								J.list.render(e, data, type);

								position($con, data);
								//点击淘淘搜比价 logo
								$('#' + J.prefix + 'logo').one('click', function () {
									J.body.trigger('tkstat.global.logo');
								});

								//点击查看更多按钮
								$('#' + J.prefix + 'move').one('click', function () {
									J.body.trigger('tkstat.global.more');
								});
								bindEvent(data);
							},
							'tk.sync.fail': function (e, text) {
								J.list.fail(text);
								position($con);
							},
							'tk.sync.promoprice': function (e, data) {
								J.list.render(e, data, 'promoprice');
								bindEvent(data);
							}
						});
						J.model.fetch();
						isOnload = true;
					} else {
						return false;
					}
					if (_.isString(type) && type === 'auto') {
						J.body.trigger('tkstat.global.focus', 'auto');
					} else {
						J.body.trigger('tkstat.global.focus', 'button');
					}
				}

				if (type === 'auto') {
					$('#' + J.prefix + 'button').trigger('mouseenter', [type]);
				} else {
					showButton(target, open);
				}
			},

			'tklist.global.remove': function () {
				var media = $('#' + J.prefix + 'media'),
					con = $('#' + J.prefix + 'con');

				if (autoDelay) {
					clearTimeout(autoDelay);
				}

				//Hide container
				$('#' + J.prefix + 'button').hide();
				media.css('visibility', 'hidden');
				con.removeClass(J.prefix + 'loading').hide();
				isOnload = false;
				J.list.render();
			}
		});
	};
});
