__tk__define(function (require, exports, module) {
	var $ = require('../../lib/jquery'),
		_ = require('../../lib/underscore'),
		host = require('../../host'),
		utils = require('../../utils'),
		product = require('../../product'),
		body = $('body');

	var price = '';
	//商品当前价格；
	if (product.item.getPrice() !== '') {
		price = parseInt(product.item.getPrice(), 10);
	} else {
		return;
	}

	function format(num) {
		if (num < 10) {
			num = '0' + num.toString();
		}
		return num;
	}

	function arrMax(arr) {
		return Math.max.apply({}, arr);
	}

	function arrMin(arr) {
		return Math.min.apply({}, arr);
	}

	function parsePrice(price, ido) {
		var p = price;
		price = price.toString();
		if (!price.match(/\./)) {
			if (price === 0) {
				p = 0;
			} else {
				if (ido) {
					p = price.slice(0, -2) + '.' + price.slice(-2);

				} else {
					p = price.slice(0, -2);
				}
			}
		}
		return p;
	}

	function TkQutu(bigdata, obj) {
		this.wrap = obj;
		var data = [];
		if ('priceHistoryList' in bigdata) {
			data = bigdata.priceHistoryList;
		}
		//商品当前价格
		this.nPrice = price;
		//商品当前时间
		//this.nDay = new Date().getTime();
		this.nDay = new Date(bigdata.currentDate).getTime();
		var defalut = {
			beginXY: 5, //圆心点起始位置
			ySetpPx: 35, //y轴间距
			xSetpPx: 36.2 //x轴间距
		};
		this.color = '#ff3b30';

		//无数据 现实价格区间
		var tag = false;
		var wending = false;

		//采集无数据
		if (!data[0]) {
			this.color = '#ff9500';
			tag = true;
			wending = true;
		}
		this.tag = tag;

		this.fixs = $.extend({}, defalut);

		//y轴间隔数；
		this.warpNum = 6;

		var parseData = this.getPriceAndDate(data);

		//价格数组
		this.price = parseData.price;
		//console.log(this.price);
		if (this.price.length === 1 && this.price[0] === this.nPrice) {
			//只有2个相同点
			wending = true;
		}
		//平均价格
		this.avg = this.getAvg(this.price);

		this.lengthSecPrice = this.price[this.price.length - 1];
		if (this.price[this.price.length - 2]) {
			this.lengthThridPrice = this.price[this.price.length - 2];
		}

		this.date = parseData.date;
		if (this.nPrice !== '') {
			this.price.push(this.nPrice);
			//日期数组
			this.date.push(this.nDay);
		}

		this.max = arrMax(this.price);
		this.min = arrMin(this.price);

		//y轴间隔
		this.ySetp = this.pareSetp(this.min, this.max);

		if (this.warpNum === 2) {
			this.yAxisClass = '2';
			this.fixs.ySetpPx = 105;
		}
		if (tag || wending) {
			this.warpNum = 2;
			this.yAxisClass = '3';
			this.fixs.ySetpPx = 105;
		}

		this.downYAxi = this.parseDownYAxi(this.min, this.ySetp, wending);
		this.yAxis = this.getYaxisData(this.ySetp, this.warpNum);

		this.xAxis = this.getXaerx();
		this.upYAxi = this.yAxis[0];
		/*console.log(this.upYAxi);
		 console.log('步长',this.ySetp);
		 console.log('间隔',this.warpNum);
		 console.log(this.downYAxi);*/

		//每个像素对应的日期差值；
		this.matchY = this.fixs.ySetpPx / this.ySetp;
		//每个像素对应的价格差值；
		this.matchX = this.fixs.xSetpPx / 10;

		this.btn = this.wrap.find('.QLY-mind-sub-qutu');
		this.initBtn(this.btn, tag);
		//底部画布
		this.drawCanvasBase(this.color, wending);
		this.drawCanvasLayout(this.color, wending);
		//画y轴
		this.drawYaxi();
		this.drawXaxi();
	}

	TkQutu.prototype = {

		initBtn: function (obj, tag) {
			var timer = null,
				delay = false;
			this.msgBox = this.wrap.find('.QLY-qutu-sub-msg');
			var qutuBox = this.wrap.find('.QLY-qutu-sub-warp');
			//qutuBox.addClass('QLY-qutu-sub-wrap-hover');

			obj.on('mouseenter', function () {
				clearTimeout(timer);
				qutuBox.addClass('QLY-qutu-sub-wrap-hover');

				timer = null;
				delay = true;
			});
			obj.on('mouseleave', function () {
				timer = setTimeout(function () {
					qutuBox.removeClass('QLY-qutu-sub-wrap-hover');
					delay = false;
					timer = null;
				}, 300);
			});
			qutuBox.on({
				'mouseover': function () {
					clearTimeout(timer);
					qutuBox.addClass('QLY-qutu-sub-wrap-hover');
				},
				'mouseout': function () {
					timer = setTimeout(function () {
						qutuBox.removeClass('QLY-qutu-sub-wrap-hover');
						utils.stat('tool_curve_PV', true);
						tts_stat.trackLog("tool_curve_PV");

						delay = false;
						timer = null;
					}, 300);
				}
			});

		},
		getAvg: function (data) {
			var length = data.length,
				sum = 0;
			for (var i = 0; i < length; i++) {
				sum = sum + data[i];
			}
			return sum / length;
		},

		/**
		 * y轴每个步伐长， 单位px;
		 */
		//getYpx: function () {
		getYdata: function () {
			var _this = this;
			var a = [],
				b = [],
				item,
				oldData;
			var minY,
				maxY;
			for (var i = 0; i < this.price.length; i++) {
				item = Math.round((this.upYAxi - this.price[i]) * this.matchY) + (this.fixs.beginXY - 2);
				//item = Math.round((3000 - this.price[i]) * 52/500) + this.fixs.beginXY;
				oldData = this.price[i];
				if (!_this.tag) {
					if (i < this.price.length - 1) {
						a.push(item * 2);
						b.push(parsePrice(oldData, true));
					}
				}
				/**/

				a.push(item * 2);
				if (oldData === this.min) {
					minY = item;
				} else if (oldData === this.max) {
					maxY = item;
				}

				b.push(parsePrice(oldData, true));
			}
			//a = [75, 75, 116, 116, 180]
			//console.log(a);
			if (!_this.tag) {
				var aLength = a.length;
				//hack 最后一个点平行
				a.push(a[aLength - 1]);
			}

			return {
				Ypx: a,
				Yprice: b,
				minY: minY,
				maxY: maxY
			};
		},

		//getXpx: function () {
		getXdata: function () {
			var a = [],
				b = [],
				item,
				oldData,
				data,
				date;
			var minX, _this = this;
			for (var i = 0; i < this.date.length; i++) {
				date = Math.round(this.date[i] / 86400000);
				item = Math.round((date - this.minDay) * this.matchX);

				//格式日期
				data = new Date(this.date[i]);
				oldData = data.getFullYear() + '/' + format(data.getMonth() + 1) + '/' + format(data.getDate());
				/*if (i > 0) {
				 a.push((item + this.fixs.beginXY - 8) * 2);
				 b.push(oldData);
				 }*/
				if (!_this.tag) {
					if (i > 0) {
						a.push((item + this.fixs.beginXY - 8) * 2);
						b.push(oldData);
					}
				}

				a.push((item) * 2);
				if (this.price[i] === this.min) {
					minX = item + this.fixs.beginXY;
				}
				b.push(oldData);
			}
			if (!_this.tag) {
				var aLength = a.length;
				//hack 最后一个点平行
				a.push(a[aLength - 1] + 6);
			}

			return {
				Xpx: a,
				Xdate: b,
				minX: minX
			};
		},
		/**
		 * 取步长
		 * @param num
		 * @param type
		 * @returns {*}
		 */
		pareSetp: function (min, max, type) {
			var _this = this;
			var num = max - min;
			var setp = 100;
			var avgToup;
			if (type === 'floor') {
				avgToup = Math.floor(num / 3 / setp) * setp;
			} else if (type === 'ceil') {
				avgToup = Math.ceil(num / 3 / setp) * setp;
			} else {
				avgToup = Math.round(num / 3 / setp) * setp;
			}
			if (avgToup === 0) {
				avgToup = 100;
			}
			var jie = function (n) {
				var num = '1';
				for (var i = 1; i < n; i++) {
					num += '0';
				}
				return parseInt(num, 10);
			};
			var pLeng = avgToup.toString().length;
			var firstNum = avgToup / jie(pLeng);

			setp = Math.round(firstNum) * jie(pLeng);
			if (num === 0) {
				setp = 100;
			} else if (num < 100) {
				//num = 10;
				setp = 50;
				_this.warpNum = 2;
			}
			//setp = 200
			return setp;
		},
		/**
		 * 格式最低价格
		 * @param min
		 * @param setp
		 * @returns {number}
		 */
		parseDownYAxi: function (min, setp, wending) {
			/*if (wending) {
			 //min = Math.floor(min / setp) * setp - (2 * setp);
			 } else {
			 }*/
			min = Math.floor(min / setp) * setp;

			return min;
		},
		nextUniq: function (arr) {
			var oArr = arr;
			return _.uniq(oArr, function (item) {
				return item.price;
			});
		},
		/**
		 * 格式化接口数据
		 * @param data
		 * @returns {{price: Array, date: Array, parseData: Array}}
		 */
		getPriceAndDate: function (data) {
			var oData = this.nextUniq(data);
			var p = [],
				day = [],
				d = [],
				item;
			if (!oData[0]) {
				p = [this.nPrice];
				//day = [new Date().getTime() - 5011200000];
				day = [new Date().getTime() - 5011200000];
				d = [];
			} else {
				for (var i = 0; i < oData.length; i++) {
					item = {
						price: oData[i].price,
						time: new Date(oData[i].time).getTime()
					};
					p.push(item.price);
					day.push(item.time);
					d.push(item);
				}
			}

			return {
				price: p,
				date: day,
				parseData: d
			};
		},
		/**
		 * 取y轴数据
		 * @param yPriceArr
		 * @param ySetp
		 * @returns {Array}
		 */
		getYaxisData: function (Setp, wraoNum) {
			//格式后的y轴数据
			var parseYAxis = [],
				ySetp = Setp;
			//y轴的起始值
			var downYAxi = this.downYAxi;

			if (this.warpNum === 2 && !this.tag) {
				ySetp = 100;
			}
			for (var i = 0; i < this.warpNum; i++) {
				parseYAxis.unshift(downYAxi);
				downYAxi = downYAxi + ySetp;
			}
			return parseYAxis;
		},

		/**
		 * 获取x轴的时间
		 * @returns {Array} ["6/19", "6/29", "7/9", "7/19", "7/29"]
		 */
		getXaerx: function () {
			//当前时间：1407479196097
			//60天前；1402295205064
			//60天的偏移量：5184000000
			//10的的偏移量：864000000
			//2014/7/22
			//864000000 10天
			//86400000  1天
			//518400000 6天
			//345600000 3天
			//var maxDate = new Date().getTime() - (864000000 - 86400000),
			//	minDate = maxDate - 5184000000,
			//	step = 864000000;
			//this.minDay = Math.round(minDate / 86400000);
			//取Y轴日期数组
			//retrue:["6/19", "6/29", "7/9", "7/19", "7/29"]


			var oneDay = 86400000;
			var maxDate = new Date().getTime() - ((oneDay*15) - oneDay),
				minDate = maxDate - (oneDay*90),
				step = oneDay * 15 ;
			this.minDay = Math.round(minDate / oneDay);

			var xDate = [];
			var starDate;

			var monthObj = {
				0: '1',
				1: '2',
				2: '3',
				3: '4',
				4: '5',
				5: '6',
				6: '7',
				7: '8',
				8: '9',
				9: '10',
				10: '11',
				11: '12'
			};
			var xTip;
			var getNowTimes = new Date().getTime();
			for (var i = 0; i < 7; i++) {
				starDate = new Date(getNowTimes);
				xTip = format(monthObj[starDate.getMonth()]) + '/' + format(starDate.getDate());
				xDate.push(xTip);
				getNowTimes = getNowTimes - step;
			}
			xDate = xDate.reverse();
			return xDate;

		},

		/**
		 * 画虚线
		 * @param obj
		 * @param fromX
		 * @param fromY
		 * @param toX
		 * @param toY
		 * @param pattern
		 */
		dashedLineTo: function (obj, fromX, fromY, toX, toY, pattern) {
			// default interval distance -> 5px
			if (typeof pattern === "undefined") {
				pattern = 5;
			}
			// calculate the delta x and delta y
			var dx = (toX - fromX);
			var dy = (toY - fromY);
			var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
			var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
			var deltay = (dy / distance) * pattern;
			var deltax = (dx / distance) * pattern;

			// draw dash line
			obj.beginPath();
			for (var dl = 0; dl < dashlineInteveral; dl++) {
				if (dl % 2) {
					obj.lineTo(fromX + dl * deltax, fromY + dl * deltay);
				} else {
					obj.moveTo(fromX + dl * deltax, fromY + dl * deltay);
				}
			}
			obj.stroke();
		},

		/**
		 * 格式化后的数据，[｛日期，价格，x轴，y轴｝];
		 * @returns {Array}
		 */
		getObjXY: function () {
			var y = this.getYdata().Ypx;
			var x = this.getXdata().Xpx;
			var p = this.getYdata().Yprice;
			var d = this.getXdata().Xdate;
			var a = [],
				item;
			for (var i = 0; i < x.length; i++) {
				item = {
					x: x[i],
					y: y[i],
					p: p[i],
					d: d[i]
				};
				a.push(item);

			}
			return a;
		},
		/**
		 * 曲线图底图
		 */
		drawCanvasBase: function (color, wending) {
			var canvas = this.wrap.find('.QLY-canvas-sub-base')[0];
			var base = this.fixs.beginXY,
				_this = this;


			var baseH = (210 + base) * 2,
				baseW = 380 * 2;
			var num = this.warpNum,
				yTag = this.fixs.ySetpPx;

			//平行价格
			if (wending) {
				num = 3;
				yTag = 70;
			}
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				var ySetp = 54 * 2;
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#e6e6e6";
				//横线
				for (var i = 0; i <= num; i++) {
					ctx.beginPath();
					ctx.moveTo(base, i * yTag * 2 + base);
					ctx.lineTo(baseW, i * yTag * 2 + base);
					ctx.stroke();
				}
				ctx.beginPath();
				ctx.moveTo(base, base);
				ctx.lineTo(base, baseH);
				ctx.stroke();

				/*ctx.beginPath();
				 ctx.moveTo(ySetp, base);
				 ctx.lineTo(ySetp, baseH);
				 ctx.stroke();*/

				for (var k = 0; k <= 6; k++) {
					ctx.beginPath();
					ctx.moveTo(ySetp, base);
					ctx.lineTo(ySetp, baseH);
					ySetp = ySetp + (54.3 * 2);

					ctx.stroke();
				}
				/*ctx.beginPath();
				 ctx.moveTo(baseW, base);
				 ctx.lineTo(baseW, baseH);
				 ctx.stroke();*/

				ctx.save();

				var y = this.getYdata().Ypx;
				var x = this.getXdata().Xpx;
				var n;
				//无采集数据
				if (this.tag) {
					//虚线起点
					x[0] = 118;

					for (var j = 0; j < y.length; j++) {
						ctx.beginPath();
						ctx.arc(x[j], y[j], 5, 0, Math.PI * 2, false);
						ctx.fillStyle = color;
						ctx.fill();
					}
					ctx.strokeStyle = color;
					this.dashedLineTo(ctx, x[0], y[0], x[1], y[1], 4);
					ctx.font = "24px Arial";
					ctx.fillStyle = "#666";
					ctx.fillText('¥' + parsePrice(this.max, true), 760, 230);
				}
				else if (wending) {
					for (n = 0; n < y.length; n++) {
						ctx.beginPath();
						ctx.arc(x[n], y[n], 2, 0, Math.PI * 2, false);
						ctx.fillStyle = color;
						ctx.fill();

						ctx.lineWidth = 4;
						ctx.strokeStyle = color;
						ctx.beginPath();
						ctx.moveTo(x[n], y[n]);
						ctx.lineTo(x[n + 1], y[n + 1]);
						ctx.stroke();
					}

					this.dashedLineTo(ctx, 12, y[0], x[0], y[0], 4);

					ctx.strokeStyle = color;
					ctx.font = "24px Arial";
					ctx.fillStyle = "#666";
					ctx.fillText('¥' + parsePrice(this.max, true), 760, 230);
				}
				//有数据
				else {
					for (n = 0; n < y.length; n++) {
						ctx.beginPath();
						ctx.arc(x[n], y[n], 2, 0, Math.PI * 2, false);
						ctx.fillStyle = color;
						ctx.fill();

						ctx.lineWidth = 4;
						ctx.strokeStyle = color;
						ctx.beginPath();
						ctx.moveTo(x[n], y[n]);
						ctx.lineTo(x[n + 1], y[n + 1]);
						ctx.stroke();
					}

					this.dashedLineTo(ctx, 12, y[0], x[0], y[0], 4);

					ctx.font = "24px tahoma";
					ctx.fillStyle = "#666";

					/*ctx.fillText('最高价', 760, (this.getYdata().maxY + 2) * 2);
					ctx.fillText('¥' + parsePrice(this.max, true), 760, (this.getYdata().maxY + 14) * 2);

					ctx.fillText('最低价', 760, (this.getYdata().minY + 2) * 2);
					ctx.fillText('¥' + parsePrice(this.min, true), 760, (this.getYdata().minY + 14) * 2);*/

					this.wrap.find('.QLY-qutu-price-top span').text('¥' + parsePrice(this.min, true));
				}
			}
		},
		drawCanvasLayout: function (color) {
			var _this = this;
			var flag = false;
			/*_this.msgBox.on('mouseover', function () {
			 flag = true;
			 _this.msgBox.show();
			 });
			 _this.msgBox.on('mouseleave', function () {
			 setTimeout(function () {
			 _this.msgBox.fadeOut(200);
			 ctx.clearRect(0, 0, canvas.width, canvas.height);
			 bag = false;
			 flag = false;
			 }, 200);
			 });*/

			var canvas = this.wrap.find('.QLY-canvas-sub-layout')[0];
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
				var xx, yy;
				var bag = false;
				/*var yAxis = this.getYdata().Ypx;
				 var xAxis = this.getXdata().Xpx;
				 console.log(this.getXdata().Xdate);
				 console.log(this.getYdata().Ypx);
				 */
				var hightPointer = function () {
					//格式化后的数据，[｛日期，价格，x轴，y轴｝];
					var xyObj = _this.getObjXY();

					$(canvas).on('mousemove', function (e) {
						xx = e.pageX || e.clientX || 0;
						yy = e.pageY || e.clientY || 0;
						xx = (xx - $(canvas).offset().left);
						yy = (yy - $(canvas).offset().top);
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						_this.msgBox.hide();
						$(xyObj).each(function (i, item) {
							if (xx >= (item.x / 2 - 2) && xyObj[i + 1] && xx <= (xyObj[i + 1].x / 2 - 2)) {
								_this.msgBox.css({
									left: xx - 16,
									top: (item.y / 2 - 46)
								}).show();
								_this.msgBox.html('<div class="QLY-qutu-sub-msg-wrap"><p>日期：' + _this.pxTodata(xx) + '</p><p>价格：<span>&yen ' + item.p + '</span></p></div>');

								ctx.beginPath();
								ctx.arc(xx * 2, item.y, 8, 0, Math.PI * 2, false);
								ctx.fillStyle = color;
								ctx.fill();
							}
						});
					});
					/*$(xyObj).each(function (i, item) {
					 (function (item) {
					 $(canvas).on('mousemove', function (e) {
					 xx = e.pageX || e.clientX || 0;
					 yy = e.pageY || e.clientY || 0;
					 xx = (xx - $(canvas).offset().left);
					 yy = (yy - $(canvas).offset().top);
					 //hightPointer(xx, yy);
					 if (yy > (item.y / 2 - 4) && xx > (item.x / 2 - 4) && yy < (item.y / 2 + 4) && xx < (item.x / 2 + 4)) {
					 if (!bag) {
					 _this.msgBox.css({
					 left: (item.x / 2 - 17),
					 top: (item.y / 2 - 46)
					 }).show();
					 _this.msgBox.html('<div class="TK-qutu-sub-msg-wrap"><p>日期：' + item.d + '</p><p>价格：<span>&yen ' + item.p + '</span></p></div>');
					 ctx.beginPath();
					 ctx.arc(item.x, item.y, 8, 0, Math.PI * 2, false);
					 ctx.fillStyle = color;
					 ctx.fill();
					 }
					 bag = true;
					 } else {
					 if (flag) {
					 //console.log(bag);
					 _this.msgBox.fadeOut(200);
					 }

					 //ctx.clearRect(0, 0, canvas.width, canvas.height);
					 bag = false;
					 }
					 });

					 })(item);
					 });*/
				};
				hightPointer();
			}
		},
		pxTodata: function (o) {
			var day;
			var dataInt = (o / this.matchX + this.minDay) * 86400000;
			var monthObj = {
				0: '1',
				1: '2',
				2: '3',
				3: '4',
				4: '5',
				5: '6',
				6: '7',
				7: '8',
				8: '9',
				9: '10',
				10: '11',
				11: '12'
			};
			var starDate = new Date(dataInt);
			day = starDate.getFullYear() + '/' + format(monthObj[starDate.getMonth()]) + '/' + format(starDate.getDate());
			return day;
		},
		/**
		 * 添加y轴结构
		 */
		drawYaxi: function () {
			var yAxis = this.yAxis;
			var yStr = '';
			for (var i = 0; i < yAxis.length; i++) {
				yStr += '<span class="QLY-qutu-sub-price-item QLY-qutu-sub-price-item-' + this.yAxisClass + '">' + parsePrice(yAxis[i]) +
					'</span>';
			}
			$('.QLY-qutu-sub-price').html(yStr);
		},
		/**
		 * 添加x轴结构
		 */
		drawXaxi: function () {
			var xAxis = this.xAxis;
			var str = '';
			$.each(xAxis, function (i, item) {
				str += '<span class="QLY-qutu-sub-data-item">' + item + '</span>';
			});
			this.wrap.find('.QLY-qutu-sub-data').html(str);
		}
	};


	//暴露接口
	module.exports = {
		init: function (data, obj) {
			new TkQutu(data, obj);
		}
	};
});