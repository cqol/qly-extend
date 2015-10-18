/**
 * Created with JetBrains PhpStorm.
 * User: cqol_77
 * Date: 13-12-4
 * Time: 下午3:32
 * To change this template use File | Settings | File Templates.
 */
(function (window) {
    var delay = null;
    delay = setInterval(function () {
        console.log(window.LiveKit);
        if (window.LiveKit) {
            window.LiveKit.login();
            window.LiveKit.once('session:refreshed', function () {
                location.reload();
            });
            window.LiveKit.once('session:error', function () {
                location.reload();
            });
            clearInterval(delay);
        }
    }, 200);
})(window);


