__tk__define(function (require, exports, module) {
	var $ = require('../lib/jquery'),
		_ = require('../lib/underscore.js'),
		host = require('../host'),
		utils = require('../utils'),
		Product = require('../product'),

		prefix = require('./prefix'),

	//url 加上 `&debug=true`，即可开启 debug 模式，将在控制台输出错误信息
		DEBUG = location.href.match(/&debug=true/),

		body = $('body');

	function disableB5M() {
		var adWrap,
			b5tWrap;

		if (typeof window.com === 'object' && typeof window.com.b5m === 'object') {
			$('head').append('<iframe id="TK-Console"></iframe>');

			//Restore `window.open()` function
			window.open = $('#TK-Console')[0].contentWindow.open;

			//Delete b5m global variable
			window.com = undefined;
			window.$5m = undefined;

			//Remove b5m ad
			adWrap = $('#adv-wrap');
			if (adWrap[0]) {
				adWrap.remove();
			}

			b5tWrap = $('#MiniB5T');
			if (b5tWrap[0]) {
				b5tWrap.remove();
			}
		}
	}

	//Stat event collection
	body.on({
		//Detail page PV
		'tkstat.global.detailpv': function () {
			utils.statLog({
				systemName: 'ttk_dpv',
				id: Product.item.getID()
			});
		},

		//用户主动去触发打开框
		'tkstat.global.focus': function (e, form) {
			var focusForm = '';

			//"右下角按钮"触发次数
			if (form === 'toggle') {
				focusForm = '_Dwn';
			}
			//"tab 标签"触发次数
			else if (form === 'tab') {
				focusForm = '_Lab';
			}
			//"相似按钮"主动触发次数
			else if (form === 'button') {
				focusForm = '_Btn';
			}
			//"相似按钮"自动触发
			else if (form === 'auto') {
				focusForm = '_Img';
			}

			utils.stat('Focus' + focusForm, true);
		},

		//相似按钮点击
		'tkstat.global.button': function () {
			utils.stat('Dclick_Button', true);
			utils.statLog({
				systemName: 'ttk_Btn_log',
				pTyp: host.pageType,
				sPid: 'tb_' + Product.item.getID() || '',
				sPric: Product.item.getPrice() || '',
				sVolum: Product.item.getSum() || '',
				sSpid: (window.g_config && window.g_config.shopId) || '',
				sLevel: Product.item.getLevel(),
				cid: Product.item.getCid() || '',
				url: 1,
				ditch: utils.DITCH_ID || ''
			});
		},

		//调用接口超时
		'tkstat.global.timeout': function () {
			utils.stat('DataTimeout', true);
		},
		'tkstat.global.display': function (e, data, tab) {
			utils.statLog_one({
				systemName: 'ttk_display_log',
				sid: data.sid || '',
				catid: data.cid || '',
				ditch: utils.DITCH_ID || '',
				vcat: data.isTtsCategory ? 1 : 0,
				mType: data.mType,
				TabFr: tab
			});
		},
		//商品组件成功展示的埋点
		'tkstat.global.success': function (e, data, status, tab) {
			//default: default display
			if (status === 'default') {
				utils.stat('Frame_Success_D', true);
			}
			//touch: user touch display
			else if (status === 'touch') {
				utils.stat('Frame_Success_T', true);
			}
			//image: user touch image
			else if (status === 'image') {
				utils.stat('Frame_Success_I', true);
			}
			if (tab === 'same') {
				utils.statLog_one({
					systemName: 'ttk_display_log',
					sid: data.sid || '',
					catid: data.cid || '',
					ditch: utils.DITCH_ID || '',
					vcat: data.isTtsCategory ? 1 : 0,
					mType: data.mType,
					TabFr: 1
				});
			}
			else if (tab === 'recom') {
				utils.statLog_one({
					systemName: 'ttk_display_log',
					sid: data.sid || '',
					catid: data.cid || '',
					ditch: utils.DITCH_ID || '',
					vcat: data.isTtsCategory ? 1 : 0,
					mType: data.mType,
					TabFr: 3
				});
			}
			else {
				utils.statLog_one({
					systemName: 'ttk_display_log',
					sid: data.sid || '',
					catid: data.cid || '',
					ditch: utils.DITCH_ID || '',
					vcat: data.isTtsCategory ? 1 : 0,
					mType: data.mType
				});
			}

			var type = data.dimension;
			var cat = '_cat3';
			if (data.isTtsCategory) {
				cat = '_cat1';
			} else {
				cat = '_cat3';
			}
			if (type.match(/t63/)) {
				utils.stat('show_t63' + cat, true);
			}
			else if (type.match(/GF/) || type.match(/LF/)) {
				utils.stat('show_vsame' + cat, true);
			}
			else if (type.match(/TV/)) {
				utils.stat('show_vsimilar' + cat, true);
			}
			else if (type.match(/recom/)) {
				utils.stat('show_recom' + cat, true);
			}
			else if (type.match(/t051/)) {
				utils.stat('show_t051' + cat, true);
			}
			else if (type.match(/t05/)) {
				utils.stat('show_t05' + cat, true);
			}
			else if (type.match(/api/)) {
				utils.stat('show_api' + cat, true);
			}
			else if (type.match(/style/)) {
				utils.stat('show_style' + cat, true);
			}
			/*else if (type.match(/^tk_v/)) {
			 if (data.matchVSame) {
			 utils.stat('show_vsame', true);
			 } else {
			 utils.stat('show_vsimilar', true);
			 }
			 } else if (type.match(/t05/) && type.match(/api/) && !type.match(/P4P/)) {
			 if (data.standardCat) {
			 utils.stat('show_api_standard', true);
			 } else {
			 utils.stat('show_api_noStandard', true);
			 }
			 } else if (type.match(/t05/) && !type.match(/api/) && !type.match(/P4P/)) {
			 if (data.standardCat) {
			 utils.stat('show_t05_standard', true);
			 } else {
			 utils.stat('show_t05_noStandard', true);
			 }
			 } else if (type.match(/t05/) && type.match(/api/) && type.match(/P4P/)) {
			 utils.stat('show_api_p4p', true);
			 } else if (type.match(/t05/) && !type.match(/api/) && type.match(/P4P/)) {
			 utils.stat('show_t05_p4p', true);
			 }*/
		},

		//标签显示
		'tkstat.global.tag': function () {
			var str = '';
			$('.J-' + prefix.app + 'tag-item').each(function () {
				if ($(this).text().match(/price/)) {
					str += '1';
				}
				if ($(this).text().match(/sum/)) {
					str += '2';
				}
				if ($(this).text().match(/credit/)) {
					str += '3';
				}
			});

			if (str !== '') {
				utils.stat('TB_S_Label_' + str);
			}
		},

		//点击 LOGO
		'tkstat.global.logo': function () {
			utils.stat('Logo_Click', true);
		},

		//点击查看更多
		'tkstat.global.more': function () {
			utils.stat('M_Click', true);
		},

		//点击商品次数埋点
		'tkstat.global.product': function (e, data, target, index, form, tab) {
			var str = '',
				type = data.dimension,
				mType,
				productStat = target.data('stat'),
				ttkClikcLog = {},
				cat = '_cat3_ck';

			if (_.isUndefined(productStat.mType)) {
				if ('mType' in data) {
					if (data.mType[index]) {
						mType = data.mType[index];
					} else {
						mType = data.mType;
					}
				}
			} else {
				mType = productStat.mType;
			}

			//淘客商品点击埋点
			if (target.attr('href').match(/s.click.taobao.com/)) {
				utils.stat('TB_CPS_S_Click');
			}

			//带有促销标签的商品被点击
			if (target.parents('.TK-item').find('.J-' + prefix.app + 'tag-item')[0]) {
				target.parents('.TK-item').find('.J-' + prefix.app + 'tag-item').each(function () {
					if ($(this).text().match(/price/)) {
						str += '1';
					}
					if ($(this).text().match(/sum/)) {
						str += '2';
					}
					if ($(this).text().match(/credit/)) {
						str += '3';
					}
				});
				utils.stat('TB_S_LabelKC_' + str);
			}

			//商品点击总数
			//从图片上触发
			if (form === 'image') {
				utils.stat('S_Click_I', true);
				if (form === 'imageCom') {
					//评论点击埋点
					utils.stat('PL_S_Click_T', true);
				}
			}
			//从按钮触发
			else if (form === 'default') {
				utils.stat('S_Click_D', true);
			}
			//点击商品评论
			else if (form === 'com') {
				utils.stat('PL_S_Click_T', true);
			}
			//从按钮触发
			else {
				utils.stat('S_Click_T', true);
			}
			if (tab === '4') {
				var cType = '';
				if (host.isDetail) {
					cType = 'TB_Detail_more_tuan';
				} else {
					cType = 'TB_list_more_tuan';
				}
				utils.statLog_img({
					systemName: 'bijia_item_click',
					itemId: productStat.pid,
					ctype: cType
				});
			}
			if (tab !== 'undefined') {
				ttkClikcLog = {
					systemName: 'ttk_clikc',
					ditch: utils.DITCH_ID,
					sid: (data.sid || ''),
					pTyp: host.pageType,
					sPric: (data.price || ''),
					sProPric: (data.promoPrice || ''),
					sVolum: (data.sales || '0'),
					sSpid: (data.sellerId || ''),
					sLevel: (data.creditGrade || ''),
					cid: (data.cid || ''),
					pid: (productStat.pid || ''),
					pric: (productStat.pric || ''),
					proPric: (productStat.proPric !== 'null' && productStat.proPric || ''),
					volum: (productStat.volum || ''),
					level: (productStat.level || ''),
					pos: ($('.TK-detail').index(target) || ''),
					mType: (mType || ''),
					TabFr: (tab || ''),
					Website: (productStat.shop || '')
				};

				if (host.isB2CList || host.isB2CDetail) {
					ttkClikcLog.sPid = '';
				} else {
					ttkClikcLog.sPid = data.itemId || 'p4p';
				}

				utils.statLog(ttkClikcLog);
			}


			if (data.isTtsCategory) {
				cat = '_cat1_ck';
			} else {
				cat = '_cat3_ck';
			}

			if (type.match(/t63/)) {
				utils.stat('show_t63' + cat, true);
			}
			else if (type.match(/GF/) || type.match(/LF/)) {
				utils.stat('show_vsame' + cat, true);
			}
			else if (type.match(/TV/)) {
				utils.stat('show_vsimilar' + cat, true);
			}
			else if (type.match(/recom/)) {
				utils.stat('show_recom' + cat, true);
			}
			else if (type.match(/t051/)) {
				utils.stat('show_t051' + cat, true);
			}
			else if (type.match(/t05/)) {
				utils.stat('show_t05' + cat, true);
			}
			else if (type.match(/api/)) {
				utils.stat('show_api' + cat, true);
			}
			else if (type.match(/style/)) {
				utils.stat('show_style' + cat, true);
			}
			/*if (type.match(/t63/)) {
			 utils.stat('show_t63_ck', true);
			 } else if (type.match(/^tk_v/)) {
			 if (data.matchVSame) {
			 utils.stat('show_vsame_ck', true);
			 } else {
			 utils.stat('show_vsimilar_ck', true);
			 }
			 } else if (type.match(/t05/) && type.match(/api/) && !type.match(/P4P/)) {
			 if (data.standardCat) {
			 utils.stat('show_api_standard_ck', true);
			 } else {
			 utils.stat('show_api_noStandard_ck', true);
			 }
			 } else if (type.match(/t05/) && !type.match(/api/) && !type.match(/P4P/)) {
			 if (data.standardCat) {
			 utils.stat('show_t05_standard_ck', true);
			 } else {
			 utils.stat('show_t05_noStandard_ck', true);
			 }
			 } else if (type.match(/t05/) && type.match(/api/) && type.match(/P4P/)) {
			 utils.stat('show_api_p4p_ck', true);
			 } else if (type.match(/t05/) && !type.match(/api/) && type.match(/P4P/)) {
			 utils.stat('show_t05_p4p_ck', true);
			 }*/
		},

		//关闭淘淘搜比价
		'tkstat.global.remove': function () {
			utils.stat('X_click', true);
		},

		//"相似按钮"浮现次数埋点
		'tkstat.global.hover': function () {
			utils.stat('Appear', true);
		},

		//原商品点击统计
		//规则：`href` 里能取到 ID 就传商品 ID，取不到，就当作 P4P 商品
		'tkstat.source.productclick': function (e, target) {
			var isLoading = false,
				param;

			if ((_.isString(target.href)) &&
				(!_.isElement($(target).parents('#' + prefix.app + 'con')[0]))) {
				if ((target.href.match(/item.htm|simba.taobao.com|etao.com|autorank.jd.com|item.jd.com/)) ||
					host.isDDList || host.isYHDList || host.isVjiaList || host.isSuningList) {
					param = {
						systemName: 'ttk_lpv',
						id: utils.sliceID(target.href) || 'P4P',
						status: ''
					};

					isLoading = !$('.' + prefix.app + 'min')[0];

					if (isLoading) {
						param.status = 'success';
					}

					utils.statLog(param);
				}
			}
		},

		//放大镜显示
		'tkstat.mangnifier.open': function () {
			utils.stat('FDJ_PV', true);
		},

		//放大镜内商品点击
		'tkstat.mangnifier.click': function () {
			utils.stat('FDJ_Clk', true);
		},

		//打开评论
		'tkstat.comment.open': function () {
			utils.stat('PL_Show', true);
		},

		//点击评论按钮，滚动评论
		'tkstat.comment.scroll': function () {
			utils.stat('PL_Scroll', true);
		},

		//评论获取失败或者无评论
		'tkstat.comment.fail': function () {
			utils.stat('PL_NULL', true);
		},

		//无同款:显示
		'tkstat.nofound.show': function (e, type) {
			//今日促销信息
			if (type === 'text') {
				utils.stat('Text_Adshow', true);
			}
			//主站画报
			else if (type === 'pic') {
				utils.stat('Pic_Adshow', true);
			}
		},

		//无同款:点击
		'tkstat.nofound.click': function (e, type) {
			//今日促销信息
			if (type === 'text') {
				utils.stat('Text_Adclk', true);
			}
			//主站画报
			else if (type === 'pic') {
				utils.stat('Pic_Adclk', true);
			}
		},

		//搭配按钮:点击
		'tkstat.dapei.click': function () {
			utils.stat('DP_Clk', true);
		}
	});

	//Services logic
	body.on({
		'tkdebug.info': function (e, product) {
			window.console.dir({
				id: product.getID(),
				title: product.getTitle(),
				price: product.getPrice(),
				img: product.getImg(),
				cid: product.getCid(),
				href: product.getHref(),
				level: product.getLevel(),
				location: product.getLocation(),
				nick: product.getNick(),
				sex: product.getSex(),
				sum: product.getSum()
			});
		},

		'tkdebug.error': function (e, errorMessage) {
			window.console.error(errorMessage.stack);
		},

		'tkdebug.console': function () {
			if (_.isObject(window.console) === false ||
				_.isFunction(window.console.log) === false ||
				_.isFunction(window.console.dir) === false ||
				_.isFunction(window.console.error) === false) {

				$('body').append('<iframe id="TK-Console"></iframe>');
				window.console = $('#TK-Console')[0].contentWindow.console;
			}
		},

		'tk.global.init': function (e, target, callback) {
			disableB5M();

			try {
				Product.item = new Product(target);

				if (typeof callback === 'function') {
					callback();
				}

				if (host.isTMDetail || host.isTBDetail) {

					var proItme;
					var proArr = [];

					if ($('.J_TOffSale')[0] || $('#J_Sold-out-recommend')[0]) {
						proItme = {
							"pid": Product.item.getID(),
							"p": Product.item.getPrice(),
							"m": Product.item.getOriPrice(),
							"sale": 0,
							"cco": Product.item.getSum(),
							"sco": Product.item.getFeedBackCount(),
							"ty": "1"
						};
					} else {
						proItme = {
							"pid": Product.item.getID(),
							"p": Product.item.getPrice(),
							"m": Product.item.getOriPrice(),
							"sale": 1,
							"cco": Product.item.getSum(),
							"sco": Product.item.getFeedBackCount(),
							"ty": "1"
						};

					}
					proArr.push(proItme);
					utils.statLog({
						systemName: 'ttk_collect',
						v: encodeURIComponent(JSON.stringify(proArr))
					});
				}
				if (DEBUG) {
					$(this).trigger('tkdebug.info', Product.item);
				}
			}
				//前端监控异常的页面，记录页面地址，图片地址等信息
			catch (ex) {
				if (DEBUG) {
					$(this).trigger('tkdebug.error', ex);
				}

				//过滤不需要的错误信息
				if (!ex.message.match(/disable/) && !ex.message.match(/shop/)) {
					utils.monitor('message: ' + ex.message + ' img: ' + (target && target.src || ''));
				}
			}
		},

		'tknofound.dialog.open': function () {
			$('#' + prefix.app + '404-same-dialog').fadeIn();
		},

		'tknofound.dialog.remove': function () {
			$('#' + prefix.app + '404-same-dialog').fadeOut();
		}
	});

	module.exports = {
		list: require('./event.list').init
	};
});
