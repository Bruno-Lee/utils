define(function(require, exports, module) {
    /*
        作用：通过schema在HTML页面中启动本地app，如果未安装则跳转下载页
    */
    var config = { //配置
        package: 'com.kdweibo.client', //app用到的包名
        iosAppUrl: 'http://itunes.apple.com/cn/app/yun-zhi-jia-qi-ye-ban/id595672427?l=en&mt=8', //APP Store的应用下载页地址
        androidAppUrl: 'http://gdown.baidu.com/data/wisegame/cd63c61ffd22b0ad/yunzhijia_285.apk', //android的apk下载地址 
        iosSchema: 'appSchema://start?from=h5',
        androidSchema: 'appSchema://start?from=h5'
        /*  Schema 'appSchema://start'是启动应用的Schema协议头,如果Android和IOS相同则可以合并为一个
            ?后面可以携带键值对信息传递给客户端,用来解析进行跳转或打开特定界面等操作，这里的from=h5只是一个示例  
        */
    };

    var boot = {
        init: function() {
            this.bootApp();
        },

        _nativeUrl: '',
        _downloadUrl: '',
        _openTime: '',

        getOSInfo: function() { //获取操作系统是ios还是android
            return navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 'ios' : userAgent.match(/Android/i) ? 'android' : '';
        },

        bootApp: function() { //启动本地app，如果没有安装则下载app
            var me = this,
                reg = /Chrome/i,
                sys = me.getOSInfo(),
                isChrome = reg.test(navigator.userAgent);

            if (sys == 'ios') {
                //ios系统启动软件较快，这里设定为600ms
                me._nativeUrl = config.iosSchema;
                me._downloadUrl = config.iosAppUrl;
                me._openTime = 600;
            } else if (sys == 'android') {
                //android系统机器配置差异大，设定启动时间为2S，保证大部分手机可以正常唤起APP
                me._nativeUrl = config.androidSchema;
                me._downloadUrl = config.androidAppUrl;
                me._openTime = 2000;
            }

            if (sys != 'ios' && isChrome) { //chrome浏览器
                me.chromeBoot();
            } else { //iframe方式启动
                me.nativeBoot();
            }
        },

        chromeBoot: function() { //chrome浏览器启动
            /*
                android系统chrome 25+以后需要使用intent协议来唤醒本地APP(iframe方式无效)
                参见：https://developer.chrome.com/multidevice/android/intents(需科学上网)
            */
            var me = this,
                startTime = +new Date(),
                paramUrlArr = me._nativeUrl.split('://'),
                schemeHeader = paramUrlArr[0],
                schemeUrl = paramUrlArr[1];

            window.location.href = 'intent://' + schemeUrl + '#Intent;scheme=' + schemeHeader + ';package=' + config.package + ';end';

            setTimeout(function() {
                me.gotoDownload(startTime);
            }, me._openTime);
        },

        nativeBoot: function() { //iframe方式启动本地app
            var me = this,
                startTime = +new Date(),
                tc;

            var iframe = document.createElement('iframe');
            iframe.addEventListener('load', function() {
                clearTimeout(tc);  //app唤醒后中止跳转操作
            }, false);

            iframe.id = 'redirect-native-iframe';
            iframe.src = me._nativeUrl;  //iframe去加载app的Schema尝试启动
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            tc = setTimeout(function() {  //如果启动超时(未安装)，则跳转app store或下载
                document.body.removeChild(iframe);
                iframe = null;
                me.gotoDownload(startTime);
            }, me._openTime);
        },

        gotoDownload: function(startTime) {
            /*
                如果未安装app，则超过启动时间后跳转到app的下载连接
                注意：在微信中下载apk或者跳转app stroe是被禁止的，可以通过"在浏览器打开"处理或者跳转TX的"应用宝"
            */
            var me = this,
                endTime = +new Date();

            if (endTime - startTime < me._openTime + 500) {
                if (me._downloadUrl) {
                    window.location.href = me._downloadUrl;
                }
            }
        }
    };

    module.exports = boot;
})