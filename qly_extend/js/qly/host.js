__tk__define(function (require, exports, module) {
	var location = window.location,
		host = location.host,

		tbSearch1 = 'search1.taobao.com',
		tbListS = 's.taobao.com',
		tbList = 'list.taobao.com',
		isTBDetail = host === 'item.taobao.com' || host === 'item.beta.taobao.com',
		isTMDetail = host.match(/detail.tmall/) && !location.href.match(/noitem/);

	//暴露接口
	module.exports = {
		tbSearch1: tbSearch1,
		tbListS: tbListS,
		tbList: tbList,

		//淘宝 list
		isTBList: host === 'search.taobao.com' || host === tbSearch1 || host === tbListS || host === 's8.taobao.com' || host === tbList,

		//天猫 list
		isTMList: host === 'list.tmall.com' || host === 'list.mei.tmall.com',

		isTBDetail: isTBDetail,
		//天猫详情页
		isTMDetail: isTMDetail,

		//淘宝和天猫详情页
		isDetail: isTBDetail || isTMDetail,

	};
});
