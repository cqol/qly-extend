__tk__define(function (require, exports, module) {
	var $ = require('../lib/jquery'),
		_ = require('../lib/underscore.js'),
		Product = require('../product'),

		host = require('../host'),

		prefix = require('./prefix'),

		model = require('../models/models'),

		utils = require('../utils'),

		list,
		fragment,
		body = $('body');

	require('../lib/jquery.tmpl');

	list = {
		getMedia: function () {
			return $('#' + prefix.app + 'media');
		},

		//### Restore DOM ###
		restore: function () {
			//Source product
			//淘宝天猫list页原品点击
			if (host.isTBList || host.isTMList) {
				var clickSrc = Product.item.getHref();
				var lpvID = Product.item.getID() || 'P4P';
				var isTransLink = false;
				if (window.imgIdArr.length > 0) {
					$.each(window.imgIdArr, function (i, item) {
						if (item.id === lpvID) {
							if (item.st) {
								isTransLink = item.st;
							}
						}
					});
				}
				if (isTransLink) {
					//clickSrc = '//search.taotaosou.com/transfer.htm?' + clickSrc;
					clickSrc = isTransLink;
				}
				$('#' + prefix.app + 'source-product').attr('href', clickSrc).removeClass(prefix.app + 'hidden');
			}
			else {
				$('#' + prefix.app + 'source-product').attr('href', Product.item.getHref()).removeClass(prefix.app + 'hidden');
			}

		},

		update: function () {
			var target = $(Product.item.target),
				btn = $('#' + prefix.app + 'button'),
				box;

			if (target.parents('.pic-box')[0]) {
				box = target.parents('.pic-box');
			} else {
				box = target;
			}

			Product.item.newBox = box;

			this.restore();

			//### Update position ###
			this.getMedia()
				.css({
					top: target.offset().top + 'px',
					left: target.offset().left + 'px',
					width: target.outerWidth() + 'px',
					height: target.outerHeight() + 'px'
				})
				.css('visibility', 'visible');

			if (target.outerWidth() > 170) {
				btn.css({
					left: '30%'
				});
			} else if (target.outerWidth() > 80) {
				btn.css({
					left: '15%'
				});
			} else {
				btn.css({
					left: '0'
				});
			}
		},
		/**/
		template: {
			container: templates['tbtm.list.box.container'],
			body: templates['tbtm.list.box.body'],
			tab: templates['tbtm.list.box.tab'],
			retab: templates['tbtm.list.box.retab']
		},

		render: function (e, data, type, callback) {
			if (data) {
				this.renderInit(data, type);
			} else {
				this.renderBox();
			}
			if (callback) {
				callback();
			}
		},

		renderBox: function () {
			var $body = $('#' + prefix.app + 'bd');

			if ($body[0]) {
				$body.html($.tmpl(this.template.body, {app: prefix.app}));
			} else {
				$.tmpl(this.template.container, {app: prefix.app}).appendTo('body');
			}
		},

		renderInit: function (data, type) {
			var list = $('#' + prefix.app + 'list'),
				self = this,

			//No found product
				isNoFound = (data.sameList.length === 0) && (data.similarList.length === 0),
			//isNoFound = (data.sameList.length === 0) && (data.similarList.length === 0) && (data.recomList.length === 0),

			//No found same and similar
				isNoSameSim = (data.sameList.length === 0) && (data.similarList.length === 0),
			//Has same product
				isSameList = data.sameList[0],

			//Has similar product
				isSimilarList = data.similarList[0],

			//Has recomList product
				isRecomList = 'recomList' in data && data.recomList[0],

			//点击来源, 两个标签
				tab,

			//Four same product
			//isFourSame = (data.mType !== '1') && (data.mType !== '4') && (data.mType !== '5') && (data.mType !== '6'),

			/*for pirce_stat*/
				vCate = data.isTtsCategory,
				spid = data.itemId;

			if (host.isAMXList) {
				data.host = prefix.app + 'AMX-list';
			}

			if (list[0]) {
				list.html('');
			} else {
				$('#' + prefix.app + 'bd').html($.tmpl(this.template.body, {app: prefix.app}));
				list = $('#' + prefix.app + 'list');
			}
			var tabBox = $('.' + prefix.app + 'bd-tab');

			if (tabBox[0]) {
				tabBox.html('');
			}
			$('.' + prefix.app + 'bd-loading').hide();
			$('.' + prefix.app + 'bd-itemlist').show();

			$('.' + prefix.app + 'tag-move').attr('href', data.more + (utils.isManualDId ? '&isauto=1' : ''));
			//无同款 无相似 无推荐
			if (isNoSameSim) {
				this.noFound(data);
			}
			//有推荐
			else if (isRecomList && isNoSameSim) {
				fragment = document.createDocumentFragment();
				$.each(data.recomList, function (i, item) {
					item.index = i;
					$.extend(item, {
						isCom: true
					});
					self.renderProduct(item, fragment, vCate, spid, true);
				});
				list.append(fragment);
				tab = '3';

				$.tmpl(this.template.retab, {app: prefix.app}).appendTo(tabBox);
				if (type === 'auto') {
					body.trigger('tkstat.global.success', [data, 'image', 'recom']);
				} else if (type !== 'promoprice') {
					body.trigger('tkstat.global.success', [data, 'touch', 'recom']);
				}
				$('.' + prefix.app + 'tag-move').attr('href', data.more + '#nav_qul' + (utils.isManualDId ? '&isauto=1' : ''));
			}
			//无同款出相似
			else {
				if (isSameList) {
					fragment = document.createDocumentFragment();
					$.each(data.sameList, function (i, item) {
						item.index = i;
						self.renderProduct(item, fragment, vCate, spid);
					});
					list.append(fragment);
					$.tmpl(this.template.tab, {app: prefix.app}).appendTo(tabBox);
					if (isSimilarList) {
						var re_box = $('#J-' + prefix.app + 'recon');
						re_box.empty();
						fragment = document.createDocumentFragment();
						$.each(data.similarList, function (i, item) {
							item.index = i;
							self.renderProduct(item, fragment, vCate, spid);
						});
						re_box.append(fragment);
						$('#J-' + prefix.app + 're').attr('data-show', 'isData');
					}
				} else if (isSimilarList) {
					fragment = document.createDocumentFragment();

					$.each(data.similarList, function (i, item) {
						item.index = i;
						self.renderProduct(item, fragment, vCate, spid);
					});
					list.append(fragment);
					$.tmpl(this.template.retab, {app: prefix.app}).appendTo(tabBox);
				}

				tab = '1';

				if (type === 'auto') {
					body.trigger('tkstat.global.success', [data, 'image', 'same']);
				} else if (type !== 'promoprice') {
					body.trigger('tkstat.global.success', [data, 'touch', 'same']);
				}
			}

			//Add tips text
			$('.' + prefix.app + 'tag-source').attr('title', '你正在搜索的原商品');
			$('.' + prefix.app + 'tag-price').attr('title', '价格更便宜');
			$('.' + prefix.app + 'tag-sum').attr('title', '月销量更高');
			$('.' + prefix.app + 'tag-credit').attr('title', '店铺信誉更高');

			/*添加事件*/
			this.event(list, data, tab);
		},

		renderTuanProduct: function (data, container, recom) {
			var template = templates['tbtm.list.tuan.product'];
			var templateData;

			if (data.index < 4) {

				utils.listProductIds += ',' + data.sourceId;
				if (recom) {
					templateData = _.extend({}, data, {
						app: prefix.app,
						img: data.picUrl + '_90x90.jpg',
						clickUrl: data.clickUrl + '?utm_medium=ttk&utm_source=' + utils.site() + '_tuan'
					});
				} else {
					templateData = _.extend({}, data, {
						app: prefix.app,
						img: data.picUrl + '_90x90.jpg',
						clickUrl: data.clickUrl + '?utm_medium=ttk&utm_source=' + utils.site() + '_tuan'
					});
				}
				$.tmpl(template, templateData).appendTo(container);
			}
		},

		renderProduct: function (data, container, vCate, spid, recom) {
			var template = templates['tbtm.list.box.product'];
			var templateData;

			if (data.index < 4) {

				utils.listProductIds += ',' + data.sourceId;
				if (recom) {
					templateData = _.extend({}, data, {
						app: prefix.app,
						img: data.picUrl + '_60x60.jpg',
						comUrl: data.clickUrl + '&on_comment=1'
					});
				} else {
					templateData = _.extend({}, data, {
						app: prefix.app,
						img: data.picUrl + '_60x60.jpg',
						comUrl: data.clickUrl + '&on_comment=1',
						clickUrl: data.clickUrl
					});
					//天猫detail看了又看 商品点击
					////199.155.122.129:8080/pages/viewpage.action?pageId=19204737
					if (utils.listProductIdArr[0]) {
						$.each(utils.listProductIdArr, function (i, item) {
							if (item.id === data.sourceId.toString()) {
								if (item.st) {
									templateData.clickUrl = item.st;
								}
							}
						});
					}
				}
				$.tmpl(template, templateData).appendTo(container);
			}
		},

		event: function (container, data) {
			var allItem = $('#' + prefix.app + 'list li'),
				tabLink = $('.' + prefix.app + 'bd-tab a'),
				tabSame = $('#J-' + prefix.app + 'same'),
				tabRe = $('#J-' + prefix.app + 're'),
				reCon = $('#J-' + prefix.app + 'recon'),
				cls = prefix.app + 'select',
				act = prefix.app + 'active',
				_this = this,
				isReConDisplay = false,
				sexCid = '';

			sexCid += '&cid=' + data.cid + '';
			if (typeof data.sex !== 'undefined') {
				sexCid += '&sex=' + data.sex;
			}
			allItem.on('mouseenter', function () {
				var $target = $(this);
				allItem.removeClass(cls);

				$target.addClass(cls);
				//$img.attr('src', $imgSrc);
			});

			allItem.eq(0).trigger('mouseenter');
			//触发次数
			var tNum = 1;
			tabSame.on('mouseenter', function () {
				container.show();
				reCon.hide();
				tNum++;
				tabLink.removeClass(act);
				$(this).addClass(act);
				if (tNum > 1) {
					body.trigger('tkstat.global.display', [data, '2']);
				} else {
					body.trigger('tkstat.global.display', [data, '1']);
				}
				//标签触碰日志
				utils.stat('Focus_Tab', true);
				utils.stat('TabFr_Success_T', true);
				/*$('#' + prefix.app + 'move').attr('href', utils.getUndertakePage(Product.item.getID(), Product.item.getTitle()) + '&utm_source=' + utils.site() + '_more' + sexCid +
				 '&title=' + encodeURIComponent(Product.item.getTitle()) + '&price=' + Product.item.getPrice() + '&pic=' + '//img.taobaocdn.com/bao/uploaded/' + Product.item.getImg() + '&sales=' + Product.item.getSum() +
				 (utils.isManualDId ? '&isauto=1' : ''));*/
			});
			tabRe.on('mouseenter', function () {
				tabLink.removeClass(act);
				tabRe.addClass(act);
				//标签触碰日志
				utils.stat('Focus_Tab', true);
				container.hide();
				reCon.show();
				$('#' + prefix.app + 'move').attr('href', 'http://search.taotaosou.com/transfer.htm?//www.chaoji99.com/?utm_medium=ttk&utm_source=' + utils.site() + '_more_tuan');

				if (!tabRe.attr('data-show')) {
					model.reCom();
					var comRender = function (data, status) {
						var isreData = data.recomList[0];
						if (isreData) {
							isReConDisplay = true;
							fragment = document.createDocumentFragment();
							$.each(data.recomList, function (i, item) {
								item.index = i;
								$.extend(item, {
									isCom: true
								});
								_this.renderTuanProduct(item, fragment, true);
							});
							reCon.append(fragment);
							var reConLi = $('#J-' + prefix.app + 'recon li');
							reConLi.on('mouseenter', function () {
								var $target = $(this);
								reConLi.removeClass(cls);
								$target.addClass(cls);
							});
							if (status === 'retouch') {
								body.trigger('tkstat.global.display', [data, '4']);
							}
							$('#J-TK-recon .J_alink').on('click', function () {
								body.trigger('tkstat.global.product', [data, $(this), undefined, undefined, '4']);
							});

							//$('#' + prefix.app + 'move').attr('href', '//bijia.taotaosou.com/sale_list.html?channel=21&utm_medium=ttk&utm_source=TB_Detail_more_tuan');
						} else {
							//_this.fail(data);
							body.trigger('tk.recom.fail', ['不妙！高峰期遭遇堵车，请稍后再试。']);
						}
					};
					body.one({
						'tk.recom.success': function (e, data) {
							utils.stat('TabFr_Success_T', true);
							comRender(data, 'retouch');
						},
						'tk.recom.promoprice': function (e, data) {
							if (reCon[0]) {
								reCon.html('');
								comRender(data, 'promoprice');
							}
						},
						'tk.recom.fail': function () {
							$('#J-TK-recon').html('<div id="TK-404-recom"></div>');
							body.trigger('tkstat.global.timeout');
						}
					});
					tabRe.attr('data-show', 'isData');
				} else {
					if (isReConDisplay) {
						utils.stat('TabFr_Success_T', true);
					}
					body.trigger('tkstat.global.display', [data, '4']);
				}
			});

		},

		noFound: function (data) {
			var template = templates['tbtm.list.box.nofound'];
			try {
				/*//临时处理
				 data.siAdList[0].img = data.siAdList[0].img + '_80x80.jpg';
				 data.siAdList[1].img = data.siAdList[1].img + '_80x80.jpg';
				 data.siAdList[2].img = data.siAdList[2].img + '_80x80.jpg';
				 data.siAdList[0].url = data.siAdList[0].url + '?utm_medium=ttk&utm_source=' + utils.site() +
				 '_none';
				 data.siAdList[1].url = data.siAdList[1].url + '?utm_medium=ttk&utm_source=' + utils.site() +
				 '_none';
				 data.siAdList[2].url = data.siAdList[2].url + '?utm_medium=ttk&utm_source=' + utils.site() +
				 '_none';*/
				$('#' + prefix.app + 'bd').html($.tmpl(template, data));

				//Stat
				body.trigger('tkstat.nofound.show', 'pic');

				$('.' + prefix.app + '404-click').on('click', function () {
					body.trigger('tkstat.nofound.click', 'pic');
				});

				//关闭淘淘搜比价
				$('.' + prefix.app + 'close').on('click', function () {
					body.trigger('tklist.global.remove');
				});
			} catch (err) {
				//console.log(err);
			}
		},

		fail: function (text) {
			this.renderBox();

			$('#' + prefix.app + 'bd').html(text).addClass(prefix.app + 'fail');
			body.trigger('tkstat.global.timeout');
		}
	};

	module.exports = {
		init: list
	};
});
