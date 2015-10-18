__tk__define(function (require, exports, module) {var Handlebars = require('./lib/handlebars');

this["JST"] = this["JST"] || {};

this["JST"]["qly/detail.box"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"QLY-detail-box\">\n  <ul class=\"QLY-list-box\">\n    <li class=\"QLY-item\">\n      <span class=\"QLY-logo\"></span>\n    </li>\n    <li class=\"QLY-item\">\n      距离宝贝下架还有: 2天3时13分\n    </li>\n    <li class=\"QLY-item\">\n      收录时间: 2015-09-11\n    </li>\n    <li class=\"QLY-item\">\n      <ul class=\"QLY-word-list\">\n        <li>搜索词: </li>\n        <li>淘宝搜索(<i class=\"QLY-i\" id=\"QLY-taobaosearch\">234</i>)</li>\n        <li>直通车(<i class=\"QLY-i\" id=\"QLY-ztc\">12</i>)</li>\n        <li>无线搜索(<i class=\"QLY-i\" id=\"QLY-msearch\">123</i>)</li>\n        <li>无线直通车(<i class=\"QLY-i\" id=\"QLY-mztc\">0</i>)</li>\n        <li id=\"QLY-price\">价格调整</li>\n        <li id=\"QLY-taoword\">淘词</li>\n      </ul>\n    </li>\n  </ul>\n\n</div>";
  });

this["JST"]["qly/detail.msearch"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"QLY-table QLY-table-bordered\">\n  <colgroup>\n    <col class=\"QLY-table-word\">\n    <col class=\"QLY-table-value\">\n  </colgroup>\n  <thead>\n  <tr>\n    <th class=\"QLY-table-word\">搜索词</th>\n    <th class=\"QLY-table-value\">排名</th>\n  </tr>\n  </thead>\n  <tbody>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖</td>\n    <td class=\"QLY-table-value\">第10页 16位</td>\n  </tr>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖1</td>\n    <td class=\"QLY-table-value\">第11页 16位</td>\n  </tr>\n\n  </tbody>\n</table>\n\n<div class=\"QLY-table-footer\">\n  <span class=\"QLY-copy-right\">\n    数据更新于2015-09-15 Power by 千里眼\n  </span>\n  <a class=\"QLY-more\" href=\"#\" target=\"_blank\">\n    查看更多\n  </a>\n</div>";
  });

this["JST"]["qly/detail.taosearch"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"QLY-table QLY-table-bordered\">\n  <colgroup>\n    <col class=\"QLY-table-word\">\n    <col class=\"QLY-table-value\">\n  </colgroup>\n  <thead>\n  <tr>\n    <th class=\"QLY-table-word\">搜索词</th>\n    <th class=\"QLY-table-value\">排名</th>\n  </tr>\n  </thead>\n  <tbody>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖</td>\n    <td class=\"QLY-table-value\">第10页 16位</td>\n  </tr>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖1</td>\n    <td class=\"QLY-table-value\">第11页 16位</td>\n  </tr>\n\n  </tbody>\n</table>\n\n<div class=\"QLY-table-footer\">\n  <span class=\"QLY-copy-right\">\n    数据更新于2015-09-15 Power by 千里眼\n  </span>\n  <a class=\"QLY-more\" href=\"#\" target=\"_blank\">\n    查看更多\n  </a>\n</div>";
  });

this["JST"]["qly/detail.taoword"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"QLY-searchBar\">\n  <input class=\"QLY-input\" placeholder=\"输入淘词...\" type=\"text\" />\n  <button class=\"QLY-search\">搜索</button>\n</div>\n<table class=\"QLY-table QLY-table-bordered\">\n  <colgroup>\n    <col class=\"QLY-table-word\">\n    <col class=\"QLY-table-value\">\n  </colgroup>\n  <thead>\n  <tr>\n    <th class=\"QLY-table-word\">搜索词</th>\n    <th class=\"QLY-table-value\">排名</th>\n  </tr>\n  </thead>\n  <tbody>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖</td>\n    <td class=\"QLY-table-value\">第10页 16位</td>\n  </tr>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖1</td>\n    <td class=\"QLY-table-value\">第11页 16位</td>\n  </tr>\n\n  </tbody>\n</table>\n\n<div class=\"QLY-table-footer\">\n  <span class=\"QLY-copy-right\">\n    数据更新于2015-09-15 Power by 千里眼\n  </span>\n  <a class=\"QLY-more\" href=\"#\" target=\"_blank\">\n    查看更多\n  </a>\n</div>";
  });

this["JST"]["qly/detail.ztc"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<table class=\"QLY-table QLY-table-bordered\">\n  <colgroup>\n    <col class=\"QLY-table-word\">\n    <col class=\"QLY-table-value\">\n  </colgroup>\n  <thead>\n  <tr>\n    <th class=\"QLY-table-word\">搜索词</th>\n    <th class=\"QLY-table-value\">排名</th>\n  </tr>\n  </thead>\n  <tbody>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖</td>\n    <td class=\"QLY-table-value\">第10页 16位</td>\n  </tr>\n\n  <tr>\n    <td class=\"QLY-table-word\">欧美无袖1</td>\n    <td class=\"QLY-table-value\">第11页 16位</td>\n  </tr>\n\n  </tbody>\n</table>\n\n<div class=\"QLY-table-footer\">\n  <span class=\"QLY-copy-right\">\n    数据更新于2015-09-15 Power by 千里眼\n  </span>\n  <a class=\"QLY-more\" href=\"#\" target=\"_blank\">\n    查看更多\n  </a>\n</div>";
  });

return this["JST"];

});