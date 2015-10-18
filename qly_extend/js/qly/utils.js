__tk__define(function (require, exports, module) {
	var utils,
		$ = require('./lib/jquery'),
		host = require('./host'),

	//### 渠道 ID ###
		DITCH_ID,

	// 是否是自主安装渠道
		isManualDId,

	//版本号
		VERSION,

		GUID,
	// JS实时消息推送功能开关 '0':表示关闭JS的实时消息推送功能
		MSGFLAG,
	//### 确保当前页面只发送一次前端监控 ###
		sendErrorMessageKey = false,

		tkLoad = document.getElementById('J---TK-load'),

	//### 埋点统计域名 ###
		API_LOG = '//log.taotaosou.com/';

	/**
	 * 从入口center获取：渠道ID与浏览器类型
	 */
	function getCenterData() {
		var dId = '',
			browser = '',
			guid = '',
			version = '',
			message = '';

		if (tkLoad) {
			if (tkLoad.getAttribute('data-id')) {
				dId = tkLoad.getAttribute('data-id');
			}
			if (tkLoad.getAttribute('data-btype')) {
				browser = tkLoad.getAttribute('data-btype');
			}
			if (tkLoad.getAttribute('data-guid')) {
				guid = tkLoad.getAttribute('data-guid');
			}
			if (tkLoad.getAttribute('data-message')) {
				message = tkLoad.getAttribute('data-message');
			}
			if (tkLoad.getAttribute('data-version')) {
				version = tkLoad.getAttribute('data-version');
			}
		} else {
			$('script').each(function (i, item) {
				if (item.src && item.src.match(/_tts_browser_center.*id/)) {
					dId = item.src.replace(/.*id[^id]?/, '').replace(/&.*/, '');
				}
			});
		}
		return {
			id: dId,
			browser: browser,
			guid: guid,
			message: message,
			version: version
		};
	}

	//新包guid
	GUID = getCenterData().guid;
	MSGFLAG = getCenterData().message;
	VERSION = getCenterData().version;
	//### 埋点 ###
	//埋点统计的构造函数，接收不同的埋点接口，和参数，来实例化各种埋点方法。
	//带有时间戳参数，防止缓存。
	//param {String} url 埋点接口
	//param {Object} data 埋点参数
	function Stat(url, data) {
		//时间戳
		data.t = new Date().getTime();
		data.z1_guid = GUID;
		data.ditch = DITCH_ID;
		data.v = VERSION;
		utils.postImg({
			url: url,
			data: data
		});
	}

	function Stat_img(url, data) {
		//时间戳
		data.t = new Date().getTime();
		data.z1_guid = GUID;
		data.ditch = DITCH_ID;
		data.v = VERSION;
		utils.postImg({
			url: url,
			data: data
		});
	}


	DITCH_ID = getCenterData().id;

	isManualDId = DITCH_ID.match(/^001104|^001100|^000100/);

	utils = {
		//### 渠道 ID ###
		//这里不直接使用 `getDitchId()` 赋值
		//是因为 `statUV()`, `monitor.net()` 两个方法
		//也要用到渠道 ID，所以使用一个中间变量
		DITCH_ID: DITCH_ID,
		isManualDId: isManualDId,
		GUID: GUID,

		MSGFLAG: MSGFLAG,
		//### 使用 `<script src="url"></script>` 加载文件 ###
		//封装了拼接 `GET` 请求，可以使用 key/value 的形式传入 `GET` 参数。
		//将所有的 `<script>` 标签存放于 `div#TK-log`。
		//param {String} url js路径
		//param {Object} data GET 请求参数
		//param {Function} callback 回函
		load: function (opt) {
			var container,
				script = document.createElement('script'),
				url = opt.url;

			if ($('#TK-log')[0]) {
				container = $('#TK-log')[0];
			} else {
				container = document.createElement('div');
				container.id = 'TK-log';
				document.body.appendChild(container);
			}

			if (opt.data) {
				for (var i in opt.data) {
					//给第一个参数加问号，后续的加上 &
					url += url.match(/\?/) ? '&' : '?';
					//累加参数
					url += i + '=' + opt.data[i];
				}
			}

			script.type = 'text/javascript';
			script.charset = 'utf-8';
			script.async = true;
			// 标准浏览器 加载状态判断
			script.onload = function () {
				if (opt.callback) {
					opt.callback(script);
				}
			};

			// IE 加载状态判断
			script.onreadystatechange = function () {
				if (script.readyState === 'loaded' || script.readyState === 'complete') {
					if (opt.callback) {
						opt.callback(script);
					}
				}
			};

			script.src = url;
			container.appendChild(script);
		},

		site: function () {
			var prefix = '';

			if (host.isTBList) {
				prefix = 'TB_List';
			} else if (host.isTBDetail) {
				prefix = 'TB_Detail';
			} else if (host.isTMList) {
				prefix = 'TM_List';
			} else if (host.isTMDetail) {
				prefix = 'TM_Detail';
			} else if (host.isTBFav) {
				prefix = 'TB_Favorite';
			} else if (host.isTBShop) {
				prefix = 'TB_SHOP';
			} else if (host.isTMShop) {
				prefix = 'TM_SHOP';
			} else if (host.isMLSList) {
				prefix = 'MLS_List';
			} else if (host.isMGJList) {
				prefix = 'MGJ_List';
			} else if (host.isMGJDetail) {
				prefix = 'MGJ_Detail';
			} else if (host.isMLSDetail) {
				prefix = 'MLS_Detail';
			} else if (host.isTrade) {
				prefix = 'TB_Trade';
			} else if (host.isTBCart) {
				prefix = 'TB_Cart';
			} else if (host.isVIPCart) {
				prefix = 'VIP_Cart';
			} else if (host.isJDCart) {
				prefix = 'JD_Cart';
			} else if (host.isMLSCart) {
				prefix = 'MLS_Cart';
			} else if (host.isMGJCart) {
				prefix = 'MGJ_Cart';
			} else if (host.isTMCart) {
				prefix = 'TM_Cart';
			} else if (host.isB2CList) {
				prefix = 'JD_List';
			} else if (host.isB2CDetail) {
				prefix = 'JD_Detail';
			} else if (host.isYHDList) {
				prefix = 'YHD_List';
			} else if (host.isYHDDetail) {
				prefix = 'YHD_Detail';
			} else if (host.isSuningDetail) {
				prefix = 'suning_Detail';
			} else if (host.isSuningList) {
				prefix = 'suning_List';
			} else if (host.isVjiaDetial) {
				prefix = 'vjia_Detail';
			} else if (host.isVjiaList) {
				prefix = 'vjia_List';
			} else if (host.isDDDetail) {
				prefix = 'dangdang_Detail';
			} else if (host.isDDList) {
				prefix = 'dangdang_List';
			} else if (host.isAMXList) {
				prefix = 'amazon_List';
			} else if (host.isAMXDetail) {
				prefix = 'amazon_Detail';
			} else if (host.isGMList) {
				prefix = 'gome_List';
			} else if (host.isGMDetail) {
				prefix = 'gome_Detail';
			} else if (host.isVipList) {
				prefix = 'vip_List';
			} else if (host.isVipDetail) {
				prefix = 'vip_Detail';
			} else if (host.isHomeTaobao) {
				prefix = 'TB_home';
			} else if (host.isHomeTmall) {
				prefix = 'TM_home';
			} else if (host.isHomeJD) {
				prefix = 'JD_home';
			} else if (host.isHomeMGJ) {
				prefix = 'MGJ_home';
			} else if (host.isHomeMLS) {
				prefix = 'MLS_home';
			} else if (host.isHomeVIP) {
				prefix = 'VIP_home';
			}
			else {
				prefix = 'ELSE';
			}

			return prefix;
		},

		//outer_code
		outer_code: function () {
			var outer_code = '';
			if (host.isMGJList || host.isMGJDetail) {
				outer_code = 'mgj001';
			} else if (host.isMLSList || host.isMLSDetail) {
				outer_code = 'mls001';
			}
			return outer_code;
		},

		//### 埋点统计 ###
		//通过在服务器记录日志，来了解用户行为。
		//param {String} item 埋点名称
		//param {Boolean} page 增加站点前缀
		stat: function (item, page) {
			var value = item;

			if (page) {
				value = this.site() + '_' + item;
			}

			new Stat_img(API_LOG + 'browser_statistics.do', {type: value});
		},

		//### 埋点统计 ###
		//通过在服务器记录 dclog 日志，来了解用户行为，
		//相比 stat()，dclog 多了点击率统计。
		//param {Object} data dclog 的参数
		statLog: function (data) {
			var DCLOG_API_POST = '//dclog.taotaosou.com/statistics.do';

			new Stat_img(DCLOG_API_POST, data);
		},

		statLog_one: function (data) {
			var DCLOG_API_POST = '//dclog.taotaosou.com/statistics.do';

			new Stat_img(DCLOG_API_POST, data);
		},

		statLog_img: function (data) {
			var DCLOG_API_POST = '//dclog.taotaosou.com/statistics.do';

			new Stat_img(DCLOG_API_POST, data);
		},

		//### 用户活跃日志统计 ###
		//param {String} type 区分应用
		statUV: function (type) {
			var UV_API_POST;

			if (typeof type === 'string') {
				UV_API_POST = API_LOG + 'uv.do';

				new Stat(UV_API_POST, {
					recType: type,
					ditch: DITCH_ID
				});
			}
		},

		//### 前端监控程序 ###
		//param {String} msg 错误信息
		//TODO: param {Number} type 错误类型
		monitor: function (msg) {
			var browser;

			//浏览器版本
			function appInfo() {
				var browser = {
						msie: false, firefox: false, opera: false, safari: false,
						chrome: false, netscape: false, appname: 'unknown', version: 0
					},
					userAgent = window.navigator.userAgent.toLowerCase();

				if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
					browser[RegExp.$1] = true;
					browser.appname = RegExp.$1;
					browser.version = RegExp.$2;
				} else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
					browser.safari = true;
					browser.appname = 'safari';
					browser.version = RegExp.$2;
				}
				return browser;
			}

			function net(data) {
				var FRONT_MONITOR_API_POST = API_LOG + 'frontmonitor.do';

				new Stat(FRONT_MONITOR_API_POST, data);
			}

			if (sendErrorMessageKey) {
				return true;
			}

			browser = appInfo();

			net({
				ditch: DITCH_ID,
				info: msg,
				url: 'url: ' + location.href,
				browser: browser.appname + ' ' + browser.version
			});

			sendErrorMessageKey = true;
		},

		//### 页面来源 url 统计 ###
		statReferrer: function () {
			var REFERRER_API_POST = API_LOG + 'url_stat.do',
				param = {
					refererUrl: encodeURIComponent(document.referrer)
				};

			new Stat(REFERRER_API_POST, param);
		},

		//### 切割 url 里的商品 id ###
		//param {String} str 商品URL
		sliceID: function (str) {
			if (!str) {
				return '';
			}
			var reg = /(\?|\&)id=[0-9]*/;

			//匹配 ?id= 或者 &id= 的字符串，再删除 .id=，取到商品ID
			if ((typeof str === 'string') &&
				(str.match(reg)) &&
				(str.match(reg)[0])) {
				return str.match(reg)[0].replace(/.*=/, '');
			} else if (str.match(/item.jd.com/)) {
				return str.match(/[0-9].*\./)[0].slice(0, -1);
			} else if (str.match(/www.meilishuo.com/)) {
				return str.match(/([0-9]+)/)[1];
			} else if (str.match(/shop.mogujie.com\/detail/)) {
				return str.match(/detail\/(\w+)\?/)[1];
			} else if (str.match(/www.vip.com\/detail/)) {
				return this.getUrlParam(str, 'mid');
			}

		},
		//### 商品类目 ID ###
		getCid: function () {
			var categoryID = '0';

			if ($('#J_itemViewed')[0] && $('#J_itemViewed').attr('catid')) {
				categoryID = $('#J_itemViewed').attr('catid');
			} else if (document.getElementById('tb-beacon-aplus')) {
				categoryID = document.getElementById('tb-beacon-aplus').getAttribute('exparams');
				if (categoryID.match(/^.*item%5f([0-9]{3,9})&.*$/)) {
					categoryID = categoryID.match(/^.*item%5f([0-9]{3,9})&.*$/)[1];
				}
			} else if (host.isB2CDetail) {
				categoryID = window.pageConfig.product.cat.toString();
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

		//### 监听图片加载事件 ###
		//param {Element} img 图片
		//param {Function} callback 图片加载完毕后的回函
		imgload: function (img, callback) {
			if (img && img.nodeName === 'IMG' && img.src) {
				var media = new Image(),
					url = img.src;

				media.onload = function () {
					callback();
				};

				//加时间戳，防止走缓存
				if (url.match(/\?/)) {
					url += '&t=';
				} else {
					url += '?t=';
				}

				media.src = url + new Date().getTime();
			} else {
				return false;
			}
		},

		postImg: function (opt) {
			var img = document.createElement('img'),
				logCon,
				url = opt.url;
			if (opt.data) {
				for (var i in opt.data) {
					//给第一个参数加问号，后续的加上 &
					url += url.match(/\?/) ? '&' : '?';
					//累加参数
					url += i + '=' + opt.data[i];
				}
			}
			img.setAttribute('src', url);
			img.setAttribute('width', 0);
			img.setAttribute('height', 0);
			img.style.display = 'none';
			img.onerror = null;
			if (document.getElementById('TK-log')) {
				logCon = document.getElementById('TK-log');
			} else {
				logCon = document.createElement('div');
				logCon.id = 'TK-log';
				document.body.appendChild(logCon);
			}
			logCon.appendChild(img);
		},

		//### 百度统计 ###
		baidu: function () {
			var prefix = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'hm.baidu.com/h.js?';//百度统计

			if (host.isTBList) {
				utils.load({url: prefix + '1508c6f288326a950463315458c1bc32'});
			}
			if (host.isTMList) {
				utils.load({url: prefix + '1508c6f288326a950463315458c1bc32'});
			}
			if (host.isDetail) {
				utils.load({url: prefix + 'bc82a27d708fd3a352f79e347989f026'});
			}
		},

		loadCSS: function (url) {
			//加载 css 文件，
			//IE6 下无法使用 `innerHTML` <link> 标签，
			//所以这里改用 `createElement`。
			var head = document.head || document.getElementsByTagName('head')[0],
				link = document.createElement('link');

			link.rel = 'stylesheet';
			link.type = 'text/css';

			//Add timestamp
			if (url.match(/\?t=/) || url.match(/&t=/)) {
				url = url;
			} else {
				url += '?t=@@timestamp';
			}

			link.href = url;

			head.appendChild(link);
		},

		loadJS: function (url, callback) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.charset = 'utf-8';

			// 标准浏览器 加载状态判断
			script.onload = function () {
				if (callback) {
					callback(script);
				}
			};

			// IE 加载状态判断
			script.onreadystatechange = function () {
				if (script.readyState === 'loaded' || script.readyState === 'complete') {
					if (callback) {
						callback(script);
					}
				}
			};

			script.src = url;
			document.body.appendChild(script);
		},

		//承接页
		getUndertakePage: function (data) {
			var url = 'http://www.taotaosou.com/tk.html?',
				wUrl = 'http://search.taotaosou.com/search/text?',
				outCode = '&outer_code=ttk001';
			if (typeof(data.id) === 'undefined' || data.id === '') {
				data.id = '';
			}

			if (data.img !== '' || data.href !== '') {
				return 'http://search.taotaosou.com/transfer.htm?' + url + 'sourceId=' + data.id + '&website=' + host.webSite +
					'&title=' + encodeURIComponent(data.title) + '&href=' + encodeURIComponent(data.href) +
					'&img=' + encodeURIComponent(data.img) +
					'&utm_medium=ttk';
			} else {
				return wUrl + 'keyword=' + encodeURIComponent(data.title) + '&from=ttk' + '&utm_source=' + this.site() +
					'&utm_medium=ttk&utm_campaign=TTKbutton' + outCode;
			}
		},
		//承接页
		getRecomPage: function (data) {
			//var url = 'http://www.taotaosou.com/recommend/list?',
			var url = 'http://www.taotaosou.com/tk.html?',
				_this = this;
			if (typeof(data.id) === 'undefined' || data.id === '') {
				data.id = '';
			}

			if (data.img !== '' || data.href !== '') {
				return 'http://search.taotaosou.com/transfer.htm?' + url + 'sourceId=' + data.id + '&website=' + host.webSite +
					'&title=' + encodeURIComponent(data.title) + '&href=' + encodeURIComponent(data.href) +
					'&img=' + encodeURIComponent(data.img) +
					'&utm_medium=ttk';
			} else {
				return 'http://www.taotaosou.com';
			}
		},
		//### 获取商品图片 ###
		getLevelImg: function (num, sorceLevel) {
			if (num === '') {
				return false;
			}
			var lvImg = 'http://pics.taobaocdn.com/newrank/',
				map;
			map = {
				0: 's_red_1.gif',
				1: 's_red_1.gif',
				2: 's_red_2.gif',
				3: 's_red_3.gif',
				4: 's_red_4.gif',
				5: 's_red_5.gif',
				6: 's_blue_1.gif',
				7: 's_blue_2.gif',
				8: 's_blue_3.gif',
				9: 's_blue_4.gif',
				10: 's_blue_5.gif',
				11: 's_cap_1.gif',
				12: 's_cap_2.gif',
				13: 's_cap_3.gif',
				14: 's_cap_4.gif',
				15: 's_cap_5.gif',
				16: 's_crown_1.gif',
				17: 's_crown_2.gif',
				18: 's_crown_3.gif',
				19: 's_crown_4.gif',
				20: 's_crown_5.gif',
				30: 'http://ext.taotaosou.com/tts-static-5/img/icon/tianmao.png'
			};
			if (num === '30' || sorceLevel === '30') {
				lvImg = 'http://ext.taotaosou.com/tts-static-5/img/icon/tianmao.png';
			}
			else if (num && map[num]) {
				lvImg += map[num];
			} else {
				lvImg += map[sorceLevel];
			}
			return lvImg;
		},
		getUrlParam: function (url, key) {
			var result = new RegExp(key + "=([^&]*)", "i").exec(url);
			return result && decodeURIComponent(result[1]) || "";
		},

		//### 取精品商品的url ###
		getRecomUrl: function (id, sourceId) {
			var itemUrl;
			if (id === 0) {
				itemUrl = 'http://search.taotaosou.com/transfer.htm?http://item.taobao.com/item.htm?id=' + sourceId;
			} else {
				itemUrl = 'http://bijia.taotaosou.com/product-' + id +
					'.html?utm_medium=ttk&utm_source=' + this.site() +
					'_bijia&isauto=1';
			}

			return itemUrl;
		},

		//搭配按钮的Url
		getDapeiUrl: function () {
			var daipaiUrl = 'http://bijia.taotaosou.com/exp_list.html?channel=23&ticket=%E6%98%8E%E5%A4%A9%E7%A9%BF%E4%BB%80%E4%B9%88';
			return daipaiUrl + '&utm_medium=ttk&utm_source=' + this.site();
		},

		userData: function () {
			var tkData = JSON.parse(localStorage.getItem('TK-user-data'));
			if (tkData) {
				return tkData;
			} else {
				return {
					status: 0,
					id: '',
					nick: ''
				};
			}
		},

		//0补位
		format: function (num) {
			if (num < 10) {
				num = '0' + num.toString();
			}
			return num;
		},

		chrome: function () {
			if (window.navigator.userAgent.match(/chrome/gi)) {
				return true;
			} else {
				return false;
			}
		},

		isLoadRemind: function () {
			//var _this = this;
			//if (this.chrome() && _this.DITCH_ID !== '') {
			if (this.chrome()) {
				return true;
				/*var mod = _this.DITCH_ID.slice(-1);
				 if (parseInt(mod, 10) === 6 || parseInt(mod, 10) === 8) {
				 return true;
				 } else {
				 return false;
				 }*/
			} else {
				return false;
			}
		},

		selectFrom: function (low, up) {
			var choice = up - low + 1;
			return Math.floor(Math.random() * choice + low);
		},
		//是否自主渠道
		isManualInstall: function () {
			if (!getCenterData().id || getCenterData().id.match(/^(0011|0001).*/)) {
				return true;
			}
			return false;
		},
		//原品点击 商品id数组
		listProductIdArr: [],

		//原品点击 商品id字符串
		listProductIds: '',
		getConfig: function () {
			var config = {
				media: {
					def: true
				},
				taobao: {
					def: true,
					model: {
						list: true,
						detail: true,
						lds: true,
						remind: true,
						qutu: true
					}
				},
				tmt: {
					def: true,
					model: {
						shopSite: true, //购物站
						paopao: true,
						insert: true, //插入广告
						href: true,
						qzone: true,
						cps: true,
						top: true
					}
				}
			};

			if (typeof window.TK_config !== 'undefined' && window.TK_config) {
				config = $.extend(config, window.TK_config);
			}

			return config;
		},
		ttkCollect: function (data) {
			var proArr = [],
				proItem;
			$.each(data, function (i, item) {
				if (item.webSite === 'taobao' || item.webSite === 'tmall') {
					proItem = {
						"pid": item.sourceId,
						"p": item.promoPrice,
						"m": item.price,
						"sale": 1,
						"cco": item.sales,
						"sco": item.commissionNum,
						"ty": "0"
					};
					proArr.push(proItem);
				}
			});
			utils.statLog({
				systemName: 'ttk_collect',
				v: encodeURIComponent(JSON.stringify(proArr))
			});
		},
		getUserLevel: function () {
			var level = '',
				map;

			map = {
				'0': 'v0',
				'1': 'v1',
				'2': 'v2',
				'3': 'v3',
				'4': 'v4',
				'5': 'v5',
				'6': 'v6',
				'7': 'v7',
				'8': 'v8'
			};

			if ($('.vip-icon')[0]) {
				if ($('.vip-icon')[0].className.match(/\d/)) {
					if (map[$('.vip-icon')[0].className.match(/\d/)[0]]) {
						level = map[$('.vip-icon')[0].className.match(/\d/)[0]];
					}
				}
			} else {
				level = '';
			}

			return level;
		},
		//ip取地区 return string;
		ipLocalCity: function () {
			if (typeof localStorage === 'undefined' || !localStorage) {
				return '';
			}
			else if (localStorage && !this.isHttps()) {
				if (localStorage.getItem('TK-city') || localStorage.getItem('TK-city') === '') {
					return localStorage.getItem('TK-city');
				} else {
					$.getJSON('//showkc.taotaosou.com/convert.do?guid=' + GUID +
						'&callback=?&p=http', function (data) {
						if (!data) {
							return '';
						}
						localStorage.setItem('TK-city', data.content.address_detail.city);
						return data.content.address_detail.city;
					});
					return '';
				}
			} else if (localStorage && this.isHttps()) {
				if (localStorage.getItem('TK-city') || localStorage.getItem('TK-city') === '') {
					return localStorage.getItem('TK-city');
				} else {
					$.getJSON('//showkc.taotaosou.com/convert.do?guid=' + GUID +
						'&callback=?', function (data) {
						if (!data) {
							return false;
						}
						localStorage.setItem('TK-city', data.content.address_detail.city);
						return data.content.address_detail.city;
					});
					return '';
				}
			} else {
				return '';
			}
		},
		getContainer: function () {
			var container = '';
			if (host.isTBDetail) {
				container = $('#detail');
			} else if (host.isTMDetail) {
				container = $('#J_DetailMeta');
			}
			return container;
		},

		isHttps: function () {
			var protocol = location.protocol;
			if (protocol === 'https:') {
				return true;
			}
			return false;
		},
		getCookie: function () {
			var cookie = {},
				all = document.cookie,
				list,
				i,
				len,
				item,
				index;

			if (all === '') {
				return cookie;
			}

			list = all.split('; ');

			for (i = 0, len = list.length; i < len; i++) {
				item = list[i];
				index = item.indexOf('=');
				var cookieNow;
				try {
					cookieNow = decodeURIComponent(item.substring(index + 1));
				} catch (e) {
					cookieNow = item.substring(index + 1);
				}
				cookie[item.substring(0, index)] = cookieNow;
			}

			return cookie;
		},
		//桔子浏览器的渠道号
		isJuzi: function () {
			return this.DITCH_ID.match(/B611040020150619/);
		},
		userNick: function () {
			return document.cookie.replace(/.*tracknick=/, '').replace(/;.*/, '');
		},
		cookie17: function () {
			return this.getCookie().cookie17;
		},
		tb_token: function () {
			return document.cookie.replace(/.*_tb_token_=/, '').replace(/;.*/, '');
		}
	}
	;

//暴露接口
	module.exports = utils;
})
;
