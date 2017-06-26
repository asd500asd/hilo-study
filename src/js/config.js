/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/config", function(S, dom, utils){
    var width = 990;
    var height = 400;
    var urlKey = utils.getUrlKey()||{};
    var scale = 1;

    var isMobile = (S.UA.mobile||/Android/i.test(navigator.userAgent)) && !S.UA.ipad;
    var isCanvas = isMobile?false:true;

    if(isMobile){
        scale = dom.width("#mvContainer")/width;
    }

    var preUrl;
    var isPhp = false;
    if(urlKey.daily == 1){
        preUrl = "http://latour.daily.tmall.net/avatar/"
    }
    else if(urlKey.mock == 1){
        isPhp = true;
        preUrl = "http://groups.demo.taobao.net/tm/spokesman/demo/data/mock/mv/";
    }
    else{
        preUrl = "http://latour.tmall.com/avatar/";
    }

    var config = {
        init:function(cfg){
            cfg = cfg||{};

            if(cfg.autoplay){
                this.autoplay = true;
            }

            if(cfg.fullscreen && this.mobile){
                this.fullscreen = true;
            }
        },
        url:{
            share:preUrl + "shareAvatar." + (isPhp?"php":"do"),
            info:preUrl + "getUsersInfo." + (isPhp?"php":"do")
        },
        path:spokesmanCfg.path,
        urlKey:urlKey,
        game:{
            isCanvas:isCanvas,
            width:width,
            height:height,
            scale:scale
        },
        mobile:isMobile,
        peopleNum:5,
        toBlob:false
    };

    if(config.mobile){
        if(urlKey.alertError){
            window.onerror = function(msg, url, line){
                alert(msg);
                alert(url);
                alert(line);
            }
        }

        window.Blob = window.Blob || window.webkitBlob;
        window.URL = window.URL || window.webkitURL;
        config.toBlob = window.URL && window.Blob && window.atob && window.Uint8Array && window.ArrayBuffer;
        config.peopleNum = 1;

        if(S.UA.ios){
            config.peopleNum = 3;
            if(S.UA.ios < 7){
                config.toBlob = false;
                config.peopleNum = 1;
            }

            if(Ali.appinfo.name == "taobao"){
                config.randomTag = true;
            }
        }
        else{
            // if((/ucbrowser/i).test(navigator.userAgent)){
            config.toBlob = false;
            // }
        }
    }
    else{
        if(S.UA.firefox || S.UA.ie){
            config.game.isCanvas = true;
        }
    }

    if(urlKey.canvas !== undefined){
        config.game.isCanvas = urlKey.canvas == 1;
    }

    if(urlKey.autoplay !== undefined){
        config.autoplay = urlKey.autoplay == 1;
    }

    if(urlKey.toBlob !== undefined){
        config.toBlob = urlKey.toBlob == 1;
    }

    if(urlKey.peopleNum !== undefined){
        config.peopleNum = parseInt(urlKey.peopleNum);
    }

    if(urlKey.fullscreen !== undefined && config.mobile){
        config.fullscreen = urlKey.fullscreen == 1;
    }

    if(urlKey.randomTag !== undefined){
        config.randomTag = urlKey.randomTag == 1;
    }

    return config;
},{
    requires:["dom", "mv/utils"]
});