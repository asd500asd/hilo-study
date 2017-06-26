/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/resource", function(S, io, mediator, model, config, utils){
    var LoadQueue = Hilo.LoadQueue;
    var ImageLoader = Hilo.ImageLoader;

    //for image blob url
    var canvas, ctx, URL;

    var res = [
        {id:"textureData", src:"/img/mv/man/texture.js"},
        {id:"skeletonData", src:"/img/mv/man/skeleton.js"},
        {id:"borad_0", src:"/img/mv/borad_0.png"},
        {id:"borad_1", src:"/img/mv/borad_1.png"},
        {id:"kv", src:"/img/mv/kv.png"}
    ];

    var texturesDict = {
        // "1":"/img/mv/man/texture.png",
        1:{
            src:"/img/mv/jiake.png"
        },
        2:{
            src:"/img/mv/weijin.png"
        },
        3:{
            src:"/img/mv/pengke.png"
        },
        4:{
            src:"/img/mv/jihewen.png",
            needZ:false
        },
        5:{
            src:"/img/mv/denglongxiu.png",
            needZ:true
        },
        6:{
            src:"/img/mv/bodian.png",
            needZ:true
        }
    };

    var peopleRes = {
        "p0":null,
        "p1":null,
        "p2":null,
        "p3":null,
        "p4":null,
        "p5":null
    };

    var pcRes = [
        {id:"bg-circle0", src:"/img/mv/bg-circle0.png"},
        {id:"bg-circle1", src:"/img/mv/bg-circle1.png"},
        {id:"bg-circle2", src:"/img/mv/bg-circle2.png"},
        {id:"bg-circle3", src:"/img/mv/bg-circle3.png"}
    ];

    var mobileRes = [
        {id:"bg0", src:"/img/mv/bg0.jpg"}
    ];

    if(config.mobile){
        res = res.concat(mobileRes);
    }
    else{
        res = res.concat(pcRes);
    }

    var loadedRes = {};
    var needBlobDict = {
        "borad_0":true,
        "bg0":true,
        "p0":true,
        "p1":true,
        "p2":true,
        "p3":true,
        "p4":true,
        "p5":true
    };

    var audioUrl = config.path + "/sound/"

    var resource = window.res = {
        isAudioLoaded:false,
        isImgLoaded:false,
        _isInit:false,
        init:function(){
            this._isInit = true;
            for(var i = 0;i < config.peopleNum;i++){
                var id = "p" + i;
                res.push({
                    id:id,
                    src:peopleRes[id].src
                });
            }

            if(config.toBlob){
                canvas = document.createElement("canvas");
                ctx = canvas.getContext("2d");
                URL = window.URL||window.webkitURL;
            }

            for(var i = 0, l = res.length;i < l;i ++){
                if(!res[i].noPrePath){
                    res[i].src = config.path + res[i].src;
                    if(config.randomTag){
                        res[i].src += "?t=" + new Date().getTime();
                    }
                }

                if(needBlobDict[res[i].id]){
                    res[i].crossOrigin = true;
                }
            }
        },
        loadAudio:function(){
            var that = this;
            var audio = this.audio = Hilo.WebSound.getAudio({
                src: audioUrl + "song2.mp3",
                loop:false,
                autoPlay:false
            }, !Hilo.isFlash);

            loadedRes.audio = audio;

            audio.on("load", function(){
                if(!that.isAudioLoaded){
                    that.isAudioLoaded = true;
                    that.onLoadComplete();
                }
            });
            audio.load();
        },
        setTextures:function(id){
            id = parseInt(id) || 0;
            var arr = [1, 2, 3, 4, 5, 6];

            var index = arr.indexOf(id);
            if(index > -1){
                arr.splice(index, 1);
                arr.unshift(id);
            }

            var needSetZ = {

            };

            for(var i = 0;i < 5;i++){
                peopleRes["p" + i] = texturesDict[arr[i]];
            }
        },
        load:function(){
            if(!this._isInit){
                this.init();
            }

            mediator.fire("gameLoadStart");

            var that = this;
            that.loadAudio();

            var queue = this.queue = new LoadQueue;
            queue.add(res);

            queue.on("complete", function(){
                var imgs = [];
                for(var i = 0;i < res.length;i ++){
                    var id = res[i].id;
                    loadedRes[id] = queue.getContent(id);
                    if(config.toBlob && needBlobDict[id] && !config.isCanvas){
                        loadedRes[id].src = utils.getBlobUrl(loadedRes[id]);
                    }
                }

                loadedRes.textureData = mvTexture;
                loadedRes.skeletonData = mvSkeleton;

                var textures = ["p0", "p1", "p2", "p3", "p4"];
                S.each(textures, function(textureName, index){
                    if(index < config.peopleNum){
                        var factory = loadedRes.factory = new dragonBones.factorys.HiloFactory();
                        factory.addSkeletonData(dragonBones.objects.DataParser.parseSkeletonData(mvSkeleton));
                        factory.addTextureAtlas(new dragonBones.textures.HiloTextureAtlas(that.get(textureName), mvTexture));
                        loadedRes["factory" + textureName] = factory;
                    };
                });

                that.isImgLoaded = true;
                that.onLoadComplete();

                //fix audio cannot fire load
                setTimeout(function(){
                    that.audio.fire("load");
                }, 1000);
            });

            queue.on("load", function(d){
                mediator.fire("gameLoaded", {
                    num:queue._loaded/(queue._source.length + 1)
                });
            });

            queue.start();
        },
        onLoadComplete:function(){
            if(this.isAudioLoaded && this.isImgLoaded){
                setTimeout(function(){
                    mediator.fire("gameLoaded", {
                        num:1
                    });
                }, 1000);

                setTimeout(function(){
                    mediator.fire("gameLoadComplete");
                }, 1500);
            }
        },
        get:function(id){
            return loadedRes[id];
        },
        add:function(r){
            res = res.concat(r);
        },
        getNeedZ:function(id){
            return peopleRes[id].needZ;
        }
    };

    return resource;
}, {
    requires:["io", "mv/mediator", "mv/model", "mv/config", "mv/utils"]
});


