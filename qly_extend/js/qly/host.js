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

	if (module.exports.isTBList || module.exports.isHomeTaobao) {
		pageType = 1;
		webSite = 'taobao';
	} else if (module.exports.isTBFav) {
		pageType = 11;
		webSite = 'taobao';
	} else if (module.exports.isTBCart) {
		pageType = 12;
		webSite = 'taobao';
	} else if (module.exports.isTMList) {
		pageType = 2;
		webSite = 'tmall';
	} else if (module.exports.isTMCart) {
		pageType = 22;
		webSite = 'tmall';
	} else if (module.exports.isTBDetail || module.exports.isJuDetail) {
		pageType = 3;
		webSite = 'taobao';
	} else if (module.exports.isTMDetail || module.exports.isHomeTmall) {
		pageType = 4;
		webSite = 'tmall';
	} else if (module.exports.isShop) {
		pageType = 5;
		webSite = 'taobao';
	} else if (module.exports.isTrade) {
		pageType = 8;
		webSite = 'taobao';
	} else if (module.exports.isMGJList || module.exports.isHomeMGJ) {
		pageType = 61;
		webSite = 'mogujie';
	} else if (module.exports.isMGJDetail || module.exports.isMGJCart) {
		pageType = 62;
		webSite = 'mogujie';
	} else if (module.exports.isMLSList || module.exports.isHomeMLS) {
		pageType = 71;
		webSite = 'meilishuo';
	} else if (module.exports.isMLSDetail || module.exports.isMLSCart) {
		pageType = 72;
		webSite = 'meilishuo';
	} else if (module.exports.isB2CList || module.exports.isHomeJD) {
		pageType = 'B11';
		webSite = 'jd.com';
	} else if (module.exports.isB2CDetail || module.exports.isJDCart) {
		pageType = 'B12';
		webSite = 'jd.com';
	} else if (module.exports.isYHDList) {
		pageType = 'B21';
		webSite = 'yihaodian';
	} else if (module.exports.isYHDDetail) {
		pageType = 'B22';
		webSite = 'yihaodian';
	} else if (module.exports.isDDList) {
		pageType = 'B31';
		webSite = 'dangdang';
	} else if (module.exports.isDDDetail) {
		pageType = 'B32';
		webSite = 'dangdang';
	} else if (module.exports.isSuningList) {
		pageType = 'B51';
		webSite = 'suning';
	} else if (module.exports.isSuningDetail) {
		pageType = 'B52';
		webSite = 'suning';
	} else if (module.exports.isVjiaList) {
		pageType = 'B91';
		webSite = 'vjia';
	} else if (module.exports.isVjiaDetial) {
		pageType = 'B92';
		webSite = 'vjia';
	} else if (module.exports.isAMXList) {
		pageType = 'B71';
		webSite = 'amazon';
	} else if (module.exports.isAMXDetail) {
		pageType = 'B72';
		webSite = 'amazon';
	} else if (module.exports.isGMList) {
		pageType = 'B41';
		webSite = 'gome';
	} else if (module.exports.isGMDetail) {
		pageType = 'B42';
		webSite = 'gome';
	} else if (module.exports.isVipList || module.exports.isVIPCart) {
		pageType = 'B61';
		webSite = 'vip';
	} else if (module.exports.isVipDetail) {
		pageType = 'B62';
		webSite = 'vip';
	} else if (module.exports.isVanclDetail) {
		pageType = 'B82';
		webSite = 'vancl';
	} else if (module.exports.isYixunDetail) {
		webSite = 'yixun';
	} else if (module.exports.isPaipaiDetail || module.exports.isPaipaiList) {
		pageType = 'B82';
		webSite = 'paipai';
	}
	else {
		pageType = '999';
		webSite = 'else';
	}

	module.exports.pageType = pageType;
	module.exports.webSite = webSite;
});
