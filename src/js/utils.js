/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/utils", function(S, io, dom){
    var tbToken = '';
    if (window.TB && TB.Global && TB.Global.loginStatusReady) {
        TB.Global.loginStatusReady(function(userInfo) {
            tbToken = userInfo && userInfo.tbToken;
        });
    }

    var utils = {
        getToken: function (callback) {
            if (tbToken) {
                callback(tbToken);
                return;
            }
            return new io({
                timeout:7,
                type: 'get',
                url: 'http://tmm.taobao.com/cookies.do?keys=_tb_token_',
                dataType: 'jsonp'
            }).then(function (result) {
                result = result[0];
                tbToken = (result && result['_tb_token_']) || '';
                callback(tbToken);
            }, function () {
                callback('');
            });
        },
        /**
         * login 登录
         * @param {Object} option
         * @param {Boolean} option.isCheck 是否检测未登录
         * @param {Boolean} option.needRedirect 登录后是否刷新
         * @param {Function}success 登录成功回调
         * @param {Function} error 登录失败回调
         */
        login:function(option, success, error){
            option = option ||{};

            if(S.UA.mobile){
                S.use("mui/login-m", function(S, login){
                    login.show({
                        success:function(){
                            success && success();
                        },
                        failure:function(){
                            error && error();
                        },
                        isCheck:option.isCheck,
                        needRedirect:option.needRedirect
                    });
                });
            }
            else{
                S.use("mui/minilogin", function(S, login){
                    login.show(function(){
                        success && success();
                    }, {
                        check:option.isCheck,
                        needRedirect:option.needRedirect,
                        closeCallback:function(){
                            error && error();
                        }
                    });
                });
            }
        },
        /**
         * 获取网址值
         * @param {String} key
         * @return {String|Object} 没有key时返回对象
         */
        getUrlKey:function(key){
            if(!key){
                return S.unparam(location.search.substring(1));
            }
            return S.unparam(location.search.substring(1))[key];
        },
        /**
         * 获取图片blob url
         */
        getBlobUrl:function(img){
            if(!this.canvas){
                this.canvas = document.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
            }
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);

            var base64 = this.canvas.toDataURL();
            base64 = base64.split(',');
            var binary = atob(base64[1]);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            var blob = new Blob([view], {
                type: base64[0].split(':')[1].split(';')[0]
            });
            return URL.createObjectURL(blob);
        },
        share:function(){
            var that = this;

            if(this.hasShareM){
                getShareImage();
            }
            else{
                S.getScript(spokesmanCfg.path + "/lib/share-m.js", getShareImage);
            }

            function getShareImage(){
                callShare(spokesmanCfg.mvData.share.img);
            }

            function callShare(img){
                S.use("mui/share-m",function(S,Share){
                    if(!that._mShare){
                        that._mShare = new Share({
                            comment: spokesmanCfg.mvData.share.text,
                            picList:[img],
                            url:spokesmanCfg.mvData.share.link,
                            title:spokesmanCfg.mvData.share.title
                        });
                    }
                    that._mShare.popup();
                });
            }

            // 分享日志
            utils.sendLog('hyj.19.10');
        },
        sendLog: function (name) {
            var img = new Image();
            var imgId = '_logimg_' + Math.random();
            window[imgId] = img;
            img.onload = img.onerror = function () {
                window[imgId] = null;
            };
            var url = 'http://gm.mmstat.com/' + name + '?uv=1&ts=' + new Date().getTime();
            img.src = url;
            img = null;
            return url;
        }
    };

    utils.merge = function () {
        var result = {};
        var objs = [].slice.call(arguments);
        for (var i = 0, obj; (obj = objs[i]); i += 1) {
            for (var key in obj) {
                var value = obj[key];
                if (obj.hasOwnProperty(key) && value !== null && value !== undefined && value !== '') {
                    if (S.isObject(value) && S.isObject(result[key])) {
                        result[key] = utils.merge(result[key], value);
                    } else {
                        result[key] = value;
                    }
                }
            }
        }
        return result;
    };

    utils.randomSort = function (arr) {
        var len = arr.length;
        var middle = Math.ceil(len / 2);
        for (var i = 0; i <= middle; i += 1) {
            var k = Math.floor(Math.random() * len);
            if (k !== i) {
                var t = arr[k];
                arr[k] = arr[i];
                arr[i] = t;
            }
        }
        return arr;
    };

    var loadingEle = null;
    utils.loading = {
        init: function () {
            if (loadingEle) {
                return;
            }
            loadingEle = dom.get('#tmall-avatar-loading');
        },
        show: function () {
            utils.loading.init();
            dom.show(loadingEle);
        },
        hide: function () {
            dom.hide(loadingEle);
        }
    };

    return utils;
}, {
    requires: ["io", "dom"]
});