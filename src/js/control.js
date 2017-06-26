/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/control", function(S, dom, event, config){
    var CLASS_SHARE = "mv-shareBtn";
    var CLASS_PLAY = "mv-playBtn";
    var CLASS_STOP = "mv-stopBtn";
    var CLASS_FULL = "mv-fullscreenBtn";
    var CLASS_MINI = "mv-miniBtn";
    var CLASS_RETURN = "mv-returnBtn";
    var CLASS_BIG_PLAY = "mv-bigPlayBtn";

    var control = {
        init:function(main){
            this.uiElem = dom.get("#mv-ui");

            this.shareBtn = dom.get(".mv-shareBtn");
            this.playBtn = dom.get(".mv-playBtn");
            this.fullscreenBtn = dom.get(".mv-fullscreenBtn");
            this.returnBtn = dom.get(".mv-returnBtn");
            this.bigPlayBtn = dom.get(".mv-bigPlayBtn");
            this.mvContainer = dom.get("#mvContainer");
            this.parentNode = this.mvContainer.parentNode;

            if(config.mobile){
                dom.show(this.shareBtn);
                dom.show(this.fullscreenBtn);

                dom.addClass(this.uiElem, "mobile");
                this._miniContainer();
            }
            else{
                dom.css("#mvContainer", {
                    width:"990px",
                    height:"400px"
                });
            }

            dom.show(this.playBtn);
            dom.show(this.uiElem);

            this.main = main;
            this.stage = main.stage;
            this.ticker = main.ticker;

            if(config.fullscreen){
                this.setScreen(true);
                dom.hide(this.fullscreenBtn);
            }
        },
        setScreen:function(isFull){
            var that = this;
            if(!isFull){
                that.parentNode.appendChild(that.mvContainer);
                if(!S.UA.ios){
                    Ali.showTitle();
                }
                that._miniScreen();
            }
            else{
                document.body.appendChild(that.mvContainer);
                if(!S.UA.ios){
                    Ali.hideTitle();
                }
                window.onresize = function(){
                    if(that.isFullscreen){
                        that._fullScreen();
                    }
                };
                that._fullScreen();
            }

            that.setFullsreenBtn(!isFull);
        },
        _miniContainer:function(){
            var w = config.game.width * config.game.scale;
            var h = config.game.height * config.game.scale;
            dom.css("#gameContainer", {
                width:w,
                height:h
            });

            dom.css("#mvContainer", {
                width:w,
                height:h
            });
        },
        _miniScreen:function(){
            this.isFullscreen = false;

            this._miniContainer();

            this.stage.scaleX = this.stage.scaleY = config.game.scale;
            this.stage.y = this.stage.x = this.stage.pivotX = 0;

            dom.css(this.uiElem, {
                top:0 + "px",
                height:"100%"
            });

            dom.css("#mvContainer", {
                position:"relative",
                top:"0px",
                left:"0px",
                webkitTransform:"",
                webkitTransformOrigin:""
            });

            dom.css("#gameContainer", {
                "zIndex": 0
            });

            this.stage.tick(0);
        },
        _fullScreen:function(){
            this.isFullscreen = true;

            dom.css("#mvContainer", {
                position:"absolute",
                top:"0px",
                left:"100%",
                webkitTransform:"rotate(90deg)",
                webkitTransformOrigin:"top left"
            });

            dom.css("#gameContainer", {
                "zIndex": -1,
                "position":"absolute"
            });

            var viewportHeight = dom.viewportWidth() - 20;
            var viewportWidth = dom.viewportHeight();

            var scale = viewportHeight / config.game.height;
            this.stage.scaleX = this.stage.scaleY = scale;
            this.stage.pivotX = config.game.width * .5;
            this.stage.x = viewportWidth * .5;
            this.stage.y = -((config.game.height * scale) - dom.viewportWidth())*.5;

            dom.css("#gameContainer", {
                width:viewportHeight,
                height:viewportWidth
            });

            dom.css("#mvContainer", {
                width:dom.viewportHeight(),
                height:dom.viewportWidth()
            });

            dom.css(this.uiElem, {
                top:this.stage.y + "px",
                height:viewportHeight + "px"
            });

            // setTimeout(function(){
            // 	var left = dom.viewportHeight() - dom.viewportWidth();
            // 	document.body.scrollLeft = 10;
            // 	setTimeout(function(){
            // 		document.body.scrollLeft = left;
            // 	}, 0);
            // },0);

            this.stage.tick(0);
        },
        setFullsreenBtn:function(isFull){
            dom.removeClass(this.fullscreenBtn, CLASS_MINI, CLASS_FULL);
            dom.addClass(this.fullscreenBtn, isFull?CLASS_FULL:CLASS_MINI);

            if(isFull){
                dom.hide(this.returnBtn);
            }
            else{
                dom.show(this.returnBtn);
            }
        },
        setPlayBtn:function(isPlay){
            this.playBtn.className = "mv-btn";
            dom.addClass(this.playBtn, isPlay?CLASS_PLAY:CLASS_STOP);

            if(isPlay){
                dom.show(this.bigPlayBtn);
            }
            else{
                dom.hide(this.bigPlayBtn);
            }
        }
    };

    if(config.mobile){
        document.addEventListener("touchstart", function(e){
            if(control.isFullscreen){
                // e.preventDefault();
            }
        });
    }

    return control;
}, {
    requires:["dom", "event", "mv/config"]
});