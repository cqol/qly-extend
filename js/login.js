/**
 * Created with JetBrains PhpStorm.
 * User: cqol_77
 * Date: 13-12-3
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */
(function (window, undefined) {
    //alert(location.href);
    function load(url, callback) {
        var script = document.createElement('script'),
            container;

        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = url;
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
    var jq = chrome.extension.getURL('js/jquery.js'),
        lf = chrome.extension.getURL('js/loginFrame.js');
    load(jq, function () {
        load('http://img.taotaosou.cn/tts-static-6/standalone/livekit.js', function () {
            load(lf);
        });
    });

})(window);