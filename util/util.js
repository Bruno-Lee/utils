define(function(require, exports, module) {
    var $ = require('jquery');
    var util = {
        setLocal: function(key, value) {
            //写入localStorage缓存，如果是JSON对象则转化为JSON字符串，如果是字符串则直接存储
            var localStorage = window.localStorage;
            if (typeof value == 'string') {
                localStorage.setItem(key, value);
                return true;
            } else if (typeof value == 'object') {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } else {
                return false;
            }
        },

        getLocal: function(key) {
            //从localStorage获取数据，如果是JSON字符串则直接转化为对象返回，否则返回字符串
            var localStorage = window.localStorage.getItem(key);

            if (str) {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    return str;
                }
            } else {
                return;
            }
        },

        clearLocal: function() {  //清空本地缓存 
            window.localStorage.clear();
        },

        removeLocal: function(key) {   //从loaclStorage中删除某一对键值对
            window.localStorage.removeItem(key);
        },

        unique: function(base, flag) { //数组去重,base为原始数组,flag为去重标志(如果是对象则为对象中的某一个key的名称)
            var u = [],
                obj = {};

            for (var i = 0; i < base.length; i++) {
                var prop = typeof flag != 'undefined' ? base[i][flag] : base[i];
                if (obj[prop] != true) {
                    obj[prop] = true;
                    u.push(base[i]);
                }
            }

            return u;
        },

        dateFormat: function(d, fmt) { //日期时间格式化
            if (d && fmt) {
                var year = d.getFullYear(),
                    month = d.getMonth() < 9 ? '0' + parseInt(d.getMonth() + 1) : d.getMonth() + 1,
                    day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
                    hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
                    minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
                    second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
                
                switch (fmt) {
                    case 'yy-mm-dd h:m:s':
                        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                        break;

                    case 'yy-mm-dd h:m':
                        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
                        break;

                    case 'yy-mm-dd':
                        return year + '-' + month + '-' + day;
                        break;

                    case 'mm-dd h:m':
                        return month + '-' + day + ' ' + hour + ':' + minute;
                        break;

                    case 'mm-dd':
                        return month + '-' + day;
                        break;

                    case 'h:m':
                        return hour + ':' + minute;
                        break;

                    default:
                        break;
                }
            }
        },

        sizeFormat: function(value) { //文件大小格式化，传入比特数
            var i = -1,
                size = !isNaN(value) ? parseInt(value) : 0,
                unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

            if (size > 0) {
                while (size >= 1) {
                    size /= 1024;
                    i++;
                }
                if (i < unit.length) {
                    return (size * 1024).toFixed(2) + unit[i];
                }
                return false;
            }

            return 0 + 'B';
        },

        getRequest: function() { //获取url参数值中的键值包装成对象
            var url = window.location.search,
                obj = {};

            if (url.indexOf("?") != -1) {
                var str = url.substr(1),
                    params = str.split("&");
                for (var i = 0; i < params.length; i++) {
                    obj[params[i].split("=")[0]] = decodeURIComponent(params[i].split("=")[1]);
                }
            }
            return obj;
        },

        isImage: function(str) { //判断是否为图片
            var picArr = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

            if (picArr.indexOf($.trim(str)) > -1) {
                return true;
            }

            return false;
        },

        toBase64: function(file) { //将图片文件转为base64
            var deferred = $.Deferred(),
                fileReader = new FileReader();

            fileReader.onloadend = function(e) { //转为BASE64
                var base64 = e.target.result;
                deferred.resolve(base64);
            }
            fileReader.readAsDataURL(file);
            return deferred.promise();
        },

        convertBase64UrlToBlob: function(urlData) { //base64图片转化为blob对象
            var bytes = window.atob(urlData.replace(/\s/g, '')); //去掉base64URL的头，并转换为byte
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);

            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: 'image/png'
            });
        },

        getFileExt: function(name) { //获取文件后缀名
            if (typeof name === 'string') {
                var pos = name.lastIndexOf('.');
                return ext = pos != -1 ? name.substring(pos + 1) : '';
            }
            return;
        },

        objSerialize: function(obj) { //将obj属性转化为序列化字符串a=1&b=2返回
            var str = '';
            for (key in obj) {
                str += '&' + key + '=' + obj[key];
            };

            if (str != '') {
                return '?' + str.substring(1);
            }
            return str;
        },

        genId: function() { //生成一个唯一标识的ID
            return 'id' + (+new Date());
        },

        htmlFormat: function(str) {  //将html标签中的'&,<,>'分别转化为实体
            var entity = ['&amp;' , '&lt;' , '&gt;'],
                html = ['&' , '<' , '>'],
                len = entity.length,
                reg;
            
            if($.trim(str) == '') {
                return '';
            }
            for (var i = 0; i < len; i++) {
                reg = new RegExp(html[i], 'g');
                str = str.replace(reg, entity[i]);
            }
            return str;
        }
    };

    module.exports = util;
})