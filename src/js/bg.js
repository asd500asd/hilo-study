/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/bg", function(S, mediator, config, resource){
    var Container = Hilo.Container;
    var Bitmap = Hilo.Bitmap;
    var Graphics = Hilo.Graphics;
    var Tween = Hilo.Tween;
    var View = Hilo.View;

    var YELLOW_BOARD = "1";
    var BLUE_BOARD = "0";

    var bg = {
        isElevenOver:false,
        _elevensObjs:[],
        reset:function(){
            this.isElevenOver = false;
            for(var i = 0, l = this._elevensObjs.length;i < l;i ++){
                this._elevensObjs[i].background = this._elevensObjs[i].endColor;
            }
        },
        init:function(stage){
            this.stage = stage;

            var container = this.container = new Container({
                id:"bg"
            });
            this.stage.addChildAt(container, 0);

            var bgContainer = this.bgContainer = new Container({
                width:config.game.width,
                height:config.game.height
            }).addTo(container);

            this.board = new Bitmap({
                image:resource.get("borad_1"),
                pivotX:resource.get("borad_1").width * .5,
                x:config.game.width * .5,
                y:config.game.height - resource.get("borad_1").height
            });
            container.addChild(this.board);

            this.kv = this.cv = new Bitmap({
                image:resource.get("kv"),
                pivotX:resource.get("kv").width * .5,
                x:config.game.width * .5,
                y:2,
                scaleX:.8,
                scaleY:.8
            });
            container.addChild(this.kv);
        },

        setBoard:function(num){
            this.board.setImage(resource.get("borad_" + num));
        },

        createCircle:function(){
            this._destory();
            this.setBoard(BLUE_BOARD);
            var container = this.bgContainer;
            container.background = "#271E4C";
            var circleY = 300;

            if(config.mobile){
                var circle = window.cccc=new Bitmap({
                    pivotX:resource.get("bg0").width * .5,
                    image:resource.get("bg0"),
                    x:config.game.width * .5,
                    y:circleY - 430
                });
                container.addChild(circle);
            }
            else{

                var v0 = .2;
                var v1 = .1;
                var v2 = .025;

                var circle = new Bitmap({
                    image:resource.get("bg-circle0"),
                    pivotX:resource.get("bg-circle0").width * .5,
                    pivotY:resource.get("bg-circle0").height * .5,
                    x:config.game.width * .5,
                    y:circleY
                });
                container.addChildAt(circle, 0);
                circle.onUpdate = function(){
                    this.rotation += v0;
                }

                var circle = new Bitmap({
                    image:resource.get("bg-circle1"),
                    pivotX:resource.get("bg-circle1").width * .5,
                    pivotY:resource.get("bg-circle1").height * .5,
                    x:config.game.width * .5,
                    y:circleY
                });
                container.addChildAt(circle, 0);
                circle.onUpdate = function(){
                    this.rotation += v1;
                }

                var circle = new Bitmap({
                    image:resource.get("bg-circle2"),
                    pivotX:resource.get("bg-circle2").width * .5,
                    pivotY:resource.get("bg-circle2").height * .5,
                    x:config.game.width * .5,
                    y:circleY
                });
                container.addChildAt(circle, 0);
                circle.onUpdate = function(){
                    this.rotation += v2;
                }

                for(var i = 0; i < 4; i++){
                    var r = 10;
                    var scale = 0.4;

                    var v = new Bitmap({
                        pivotX:resource.get("bg-circle3").width*.5,
                        pivotY:resource.get("bg-circle3").height*.5,
                        x:circle.x,
                        y:circle.y,
                        scaleX:scale,
                        scaleY:scale,
                        alpha:1,
                        image:resource.get("bg-circle3")
                    });
                    container.addChild(v);

                    this._moveObject(v, {
                        scaleX:1,
                        scaleY:1,
                        rotation:10,
                        alpha:0
                    }, {
                        duration:1000,
                        delay:i * 200,
                        onUpdate:function(){
                            this.rotation_old ++;
                            this.rotation ++;
                        }
                    });
                }
            }
        },

        createEleven:function(){
            var that = this;
            this._destory();
            this.setBoard(YELLOW_BOARD);
            var container = this.bgContainer;

            var bgColor = "#e13e53"
            var redColor = "#ff3e8d";
            var yellowColor = "#ffed43";

            container.background = bgColor;

            var col = 24;
            var row = 9;

            var w = 40;
            var h = 40;
            var offset = 4;

            function getColor(){
                return Math.random()>.8?redColor:Math.random()>.4?yellowColor:bgColor
            }

            var eleven = [
                [0,0], [1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6],[0,6],[2,6]
            ];

            var elevens = [];
            var startX = 3;
            for(var i = 0, l = eleven.length;i < l;i ++){
                var p = eleven[i];
                elevens.push([p[0] + 0 + startX, p[1] + 1]);
                elevens.push([p[0] + 4 + startX , p[1] + 1]);
                elevens.push([p[0] + 11 + startX , p[1] + 1]);
                elevens.push([p[0] + 15 + startX , p[1] + 1]);
            }

            // elevens.push([eleven[9][0] + 7 + 2, eleven[9][1]]);
            // elevens.push([eleven[9][0] + 7 + 3, eleven[9][1]]);
            // elevens.push([eleven[9][0] + 7 + 2, eleven[9][1] - 1]);
            elevens.push([eleven[9][0] + 7 + 3, eleven[9][1] - 1]);

            this._elevensObjs = [];
            for(var i = 0, l = col * row;i < l;i ++){
                var v = new View({
                    background:getColor(),
                    x:15 + w * (i%col),
                    y:h * Math.floor(i/col),
                    width:w - offset,
                    height:h - offset
                });
                this._elevensObjs.push(v);

                v.t = 0;
                v.onUpdate = function(){
                    v.t ++;
                    if(v.t > 10){
                        v.t = 0;
                        this.background = getColor();
                        if(that.isElevenOver){
                            if(this.background == this.endColor){
                                this.onUpdate = null;
                            }
                        }
                    }
                }
                container.addChild(v);

                var isEleven = false;
                for(var j = 0;j < elevens.length;j ++){
                    var p = elevens[j];
                    if(p[0] == i%col && p[1] == Math.floor(i/col)){
                        isEleven = true;
                        v.endColor = yellowColor;
                        break;
                    }
                }
                v.endColor = isEleven?yellowColor:bgColor;
            }

        },

        createRects:function(){
            this._destory();
            this.setBoard(BLUE_BOARD);

            this._createRect({
                noClear:true,
                y:200,
                w:60,
                h:60,
                bgColor:"#4C919E",
                fontColor:"#382F66",
                bg:"#4C919E"
            });

            this._createRect({
                noClear:true,
                x:300,
                y:350,
                w:30,
                h:30,
                fontColor:"#F73C60",
                bgColor:"rgba(96, 214, 215, 1)"
            });

            this._createRect({
                noClear:true,
                x:670,
                y:350,
                fontColor:"#F84D71",
                bgColor:"rgba(96, 214, 215, 1)",
                w:20,
                h:20
            });
        },


        createRect2:function(){
            this._destory();
            this.setBoard(YELLOW_BOARD);

            var container = this.bgContainer;
            container.background = "#FFCE00"
            for(var i = 0; i < 5; i++){
                var w = 99;
                var h = 40;
                var scale = 1;
                var v = new View({
                    pivotX:w * .5,
                    pivotY:h * .5,
                    width:w,
                    height:h,
                    x:config.game.width*.5,
                    y:config.game.height*.5,
                    scaleX:scale,
                    scaleY:scale,
                    background:"#FFF"
                });
                container.addChildAt(v, 0);

                this._moveObject(v, {
                    scaleX:11,
                    scaleY:11,
                    alpha:0
                }, {
                    duration:2000,
                    delay:i * 400
                });
            }
        },
        _createRect:function(cfg){
            cfg = cfg||{};
            !cfg.noClear && this._destory();

            var w = cfg.w||40;
            var h = cfg.h||40;
            var x = cfg.x||config.game.width * .5;
            var y = cfg.y||config.game.height * .5;
            var scale = 1;

            var container = this.bgContainer;
            if(cfg.bg){
                container.background = cfg.bg;
            }

            var rectW = w * 15;
            var rectH = h * 15;
            var startRotation = 45;
            var rectContainer = new Container({
                width:rectW ,
                height:rectH,
                pivotX:rectW * .5,
                pivotY:rectH * .5,
                x:x,
                y:y,
                // background:cfg.bgColor||"#FFCE00",
                rotation:startRotation
            });
            container.addChild(rectContainer);

            for(var i = 0; i < 6; i++){
                var v = new View({
                    pivotX:w * .5,
                    pivotY:h * .5,
                    width:w,
                    height:h,
                    scaleX:scale,
                    scaleY:scale,
                    background:cfg.fontColor||"#FFF",
                    alpha:1,
                    x:rectW * .5,
                    y:rectH * .5,
                    rotation:startRotation
                });
                rectContainer.addChildAt(v, 1);

                this._moveObject(v, {
                    scaleX:15,
                    scaleY:15,
                    rotation:0,
                    alpha:0
                }, {
                    duration:2000,
                    delay:i * 400,
                    onUpdate:function(){
                        // this.rotation_old ++;
                        // this.rotation ++;
                    }
                });
            }
        },
        _moveObject:function(obj, props, params){
            params = params || {};
            obj._t = 0;
            obj._delay = params.delay||0;
            obj._duration = params.duration||1000;
            obj._onComplete = params.onComplete||null;
            obj._onUpdate = params.onUpdate||null;

            obj._props = props;
            obj._moveStart = false;

            var t = 1/obj._duration;
            for(var i in props){
                obj[i + "_v"] = (props[i] - obj[i])*t;
                obj[i + "_old"] = obj[i];
            }

            obj.onUpdate = function(dt){
                dt = dt > 100?0:dt;
                this._t += dt;

                if(this._moveStart){
                    for(var i in this._props){
                        this[i] += this[i + "_v"] * dt;
                    }
                    this._onUpdate && this._onUpdate(dt);

                    if(this._t >= this._duration){
                        this._onComplete && this._onComplete();
                        this._t = this._t - this._duration;
                        for(var i in this._props){
                            this[i] = this[i + "_old"];
                        }
                    }
                }
                else if(this._t >= this._delay){
                    this._moveStart = true;
                    this._t -= this._delay + dt;
                    this.onUpdate(dt);
                }
            }

            var num = 30;
            while(num --){
                obj.onUpdate(33);
            }
        },
        _destory:function(){
            this.bgContainer.removeAllChildren();
        }
    };

    return bg;
},{
    requires:["mv/mediator", "mv/config", "mv/resource"]
})