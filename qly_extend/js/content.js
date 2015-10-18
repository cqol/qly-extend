(function (win) {

	function contentJs() {

		var isFrame = function () {
			if (win.self !== top) {
				return true;
			}
			return false;
		};
		if (typeof win.TTSBrowserPlugin !== 'undefined' || isFrame()) {
			return false;
		}
		/*
		 * 图媒体和淘同款同时覆盖的页面，只走淘同款的流程，屏蔽图媒体
		 */
		win.TTSBrowserPlugin = true;

		var ua = win.navigator.userAgent,
			host = win.document.location.host,
			tkLoad = document.getElementById('J---QLY-load');

		var seaJS = chrome.extension.getURL('js/qly/sea.js');
		// sea.js 的异步载入代码：
		function loadSeajs(seaJS, callback) {
			;
			(function (m, o, d, u, l, a, r) {
				if (m[o]) {
					win.__tk__define = win.define;
					return;
				}
				function f(n) {
					return function () {
						r.push(n, arguments);
						return a;
					};
				}

				m[o] = a = {args: (r = []), config: f(1), use: f(2), on: f(3)};
				m.TKdefine = f(0);
				u = d.createElement('script');
				u.id = o + 'node';
				u.charset = 'utf-8';
				u.async = true;
				u.src = seaJS;
				u.onload = u.onreadystatechange = function () {
					if (!u.isLoad && (!u.readyState || u.readyState === 'loaded' || u.readyState === 'complete')) {
						u.isLoad = true;
						if (typeof callback === 'function') {
							callback(u);
						}
						u.onload = u.onreadystatechange = null;
					}
				};
				if (d.getElementById('site-nav')) {
					l = d.getElementById('site-nav');
				} else {
					l = d.getElementsByTagName('head')[0];
				}
				l.appendChild(u);
			})(window, '__tk__seajs', document);
		}

		function loadCSS(url) {
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
				url += '?t=150811';
			}

			link.href = url;

			head.appendChild(link);
		}

		/**
		 * 使用 <script> 加载资源
		 * 用来加载 .js 文件和记录埋点
		 */
		function load(url, callback) {
			var script = document.createElement('script'),
				container;

			script.type = 'text/javascript';
			script.charset = 'utf-8';
			script.src = url;
			script.async = true;


			script.onload = script.onreadystatechange = function () {
				if (!script.isLoad && (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete')) {
					script.isLoad = true;
					if (typeof callback === 'function') {
						callback(script);
					}
					script.onload = script.onreadystatechange = null;
					script.parentNode.removeChild(script);
				}
			};

			if (document.getElementById('site-nav')) {
				container = document.getElementById('site-nav');
			} else {
				container = document.body;
			}

			container.appendChild(script);
		}

		/**
		 * 已图片形式发送一个HTTP请求
		 * @param url
		 */
		function postImg(url) {
			var img = document.createElement('img'),
				logCon;
			if (typeof url === 'string') {
				//加时间戳，防止走缓存
				if (url.match(/\?/)) {
					url += '&t=';
				} else {
					url += '?t=';
				}
				url += new Date().getTime();
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
		}

		/**
		 * qly辅助工具入口
		 */
		function qly() {
			try {
				if (host.match(/tmall|taobao/)) {
					var loadTTK = chrome.extension.getURL('js/qly/qly.js');
					var taobaoCSS = chrome.extension.getURL('css/main.css');
					loadSeajs(seaJS, function () {
						loadCSS(taobaoCSS);
						load(loadTTK);
					});
				}

			} catch (e) {
				postImg('//log.taotaosou.com/browser_statistics.do?type=center_err');
			}
		}

		/**
		 * 对 DOMReady 的封装
		 * IE插件必须在 DOMReady 后载入JS，否则会出现不执行的情况
		 * 其余浏览器正常载入
		 */
		function ready(callback) {
			var ttsDomReady = function (success) {
				if (document.readyState === 'complete') {
					success();
				} else if (document.addEventListener) {
					document.addEventListener('DOMContentLoaded', success, false);
					win.addEventListener('load', success, false);
				} else {
					document.attachEvent('onreadystatechange', success);
				}
			};

			if (!callback) {
				return false;
			}

			if (ua.match(/MSIE/)) {
				ttsDomReady(function () {
					callback();
				});
			} else {
				callback();
			}
		}

		ready(function () {
			qly();
		});

	}

	(function () {
		if (document.getElementById('J---QLY-load') == null) {
			try {
				contentJs();
			} catch (err) {
				console.log(err);
			}
		}
	})();

})(window);
