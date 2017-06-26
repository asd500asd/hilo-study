KISSY.add("mv/main", function(S, event, dom, event, bg, mediator, model, fps, resource, config, timeline, Role, task, loading, control, utils){
    var Stage = Hilo.Stage;
    var Container = Hilo.Container;
    var Bitmap = Hilo.Bitmap;
    var Ticker = Hilo.Ticker;
    var Tween = Hilo.Tween;
    var LoadQueue = Hilo.LoadQueue;

    var main = window.main = {
        timeline:timeline,
        task:task,
        isLoaded:false,
        isLoading:false,
        /**
         * @param {Object} cfg
         * @param {Boolean} cfg.autoplay
         * @param {Boolean} cfg.fullscreen
         */
        init:function(cfg){
            var that = this;
            config.init(cfg);

            model.getAvatars(function(d){
                S.each(d, function(img){
                    img.noPrePath = true;
                });

                resource.setTextures(d[0].clothing);
                resource.add(d.slice(0, config.peopleNum));
                that._init();
            });
        },

        _init:function(){
            var stageCfg = {
                width:config.game.width,
                height:config.game.height,
                scaleX:config.game.scale,
                scaleY:config.game.scale
            };
            this.elem = dom.get("#gameContainer");

            if(config.game.isCanvas){
                stageCfg.container = this.elem;
            }
            else{
                stageCfg.canvas = this.elem;
            }

            var stage = this.stage = new Stage(stageCfg);
            var ticker = this.ticker = new Ticker(config.urlKey.fps||30);
            ticker.addTick(stage);
            ticker.addTick(Tween);
            ticker.addTick(timeline);

            if(config.urlKey.showFps){
                ticker.addTick(fps);
                fps.start();
            }

            ticker.start(false);

            this.bindEvent();

            control.init(this);

            if(config.mobile){
                dom.css("#mvContainer", "background", "center center no-repeat");
                dom.css("#mvContainer", "backgroundImage", "url(" + config.path + "img/mv/bg.jpg)");
                dom.css("#mvContainer", "backgroundSize", "auto 100%");
                dom.css("#mvContainer", "backgroundColor", "#000");
            }
            else{
                dom.css("#mvContainer", "backgroundColor", "#000");
            }

            this.isUserinfoLoaded = true;

            if(config.autoplay){
                this.play();
            }
        },

        load:function(){
            if(!this.isLoading){
                this.isLoading = true;
                resource.load();
            }
        },

        bindEvent:function(){
            var that = this;
            mediator.on("gameLoadComplete", function(){
                that.initGame();
            });

            if(config.mobile){
                if(Ali.appinfo.name.indexOf("tmal") > -1 && TMM && TMM.APP && TMM.APP.call){
                    TMM.APP.call("PageVisibility.watchVisibilitychange", [1], function(d){
                        if(d && d.data){
                            if(!d.data.visible && that.isPlay){
                                that.stop();
                            }
                        }
                    });
                }
                else if(Ali.appinfo.name.indexOf("taobao") > -1){
                    document.addEventListener('WV.Event.APP.Background', function(e) {
                        that.stop();
                    }, false);
                }
            }
            else{


            }

            event.on("#mvContainer", "click", function(){
                if(that.isPlay){
                    that.stop();
                }
                else{
                    that.play();
                }
            });

            event.delegate("#mv-ui", "click", ".mv-btn", function(e){
                e.halt();
                var target = e.currentTarget;
                switch(dom.attr(target, "data-event")){
                    case "play":
                        if(that.isPlay){
                            that.stop();
                        }
                        else{
                            that.play();
                        }
                        break;
                    case "fullscreen":
                        if(config.fullscreen){
                            Ali.showTitle();
                            history.back();
                        }
                        else{
                            control.setScreen(!control.isFullscreen);
                        }
                        break;
                    case "share":
                        utils.share();
                        break;
                }
            });

            //绑定按钮事件
            if(S.UA.ie && S.UA.ie <= 8){
                document.body.onclick = function(){
                    if(that.isPlay){
                        that.stop();
                    }
                    else{
                        that.play();
                    }
                    return false;
                }
            }
        },
        initGame:function(){
            var players = this.players = [];

            var num = 0;
            var textures = ["p0", "p1", "p2", "p3", "p4"];
            function createPlayer(x, y, scale){
                scale *= 1;
                var player = new Role();
                player.createArmature(textures[num]);
                player.setArmature(textures[num]);
                player.setDisplayProps({
                    scaleX:scale,
                    scaleY:scale,
                    x:x + config.game.width * .5 + 30,
                    y:y + 6
                });
                players.push(player);
                player.startX = x;
                player.startY = y;
                player.play("C");

                if(resource.getNeedZ(textures[num])){
                    player.armature.getSlot("torso down.png").setZOrder(20);
                }

                num ++;
                return player;
            }

            var playerCfgArr = [
                //x, y, scale
                [0, 360, .55],
                [-120, 350, .5],
                [135, 350, .5],
                [-240, 340, .45],
                [250, 340, .45]
            ];

            S.each(playerCfgArr, function(cfg, index){
                if(index < config.peopleNum){
                    createPlayer.apply(this, cfg);
                }
            });

            var scene = this.scene = new Container({
                pivotX:config.game.width * .5,
                pivotY:config.game.height - 200,
                x:config.game.width * .5,
                y:config.game.height - 200
            });
            scene.startX = scene.x;
            scene.startY = scene.y;
            this.stage.addChild(scene);

            this.bg = bg;
            bg.init(this.scene);

            task.init(main);
            this.isLoaded = true;
            this._play();

            if(config.mobile){
                dom.css("#mvContainer", "background", "#000");
            }
        },

        stop:function(notStopAudio){
            if(this.isPlay){
                this.isPlay = false;
                control.setPlayBtn(true);
                if(!notStopAudio){
                    resource.get("audio").pause();
                }
                this.ticker._tick(1);
                this.ticker.stop();
            }
        },

        resume:function(){
            if(!this.isEnd){
                this.play();
            }
        },

        play:function(){
            if(!this.isUserinfoLoaded){
                config.autoplay = S.UA.ipad?false:true;
            }
            else if(this.isEnd){
                control.setPlayBtn(false);
                this.replay();
            }
            else if(!this.isPlay){
                control.setPlayBtn(false);
                this.isPlay = true;
                if(!this.isLoaded){
                    this.load(true);
                }
                else{
                    resource.get("audio").resume();
                    this.ticker.start();
                }
            }
        },

        _play:function(){
            var that = this;
            timeline.resetTask();
            timeline.addTask(task.getTasks());
            timeline.start(-.5);
            timeline.on("end", function(){
                that.isEnd = true;
                that.stop(true);
            });
        },
        replay:function(){
            this.isEnd = false;
            this.isPlay = true;
            task.reset();
            timeline.start(.65);
            this.ticker.start();
            //fix android bug
            resource.get("audio").play();
        }
    };

    return main;
}, {
    requires:["event", "dom", "event", "mv/bg", "mv/mediator", "mv/model", "mv/fps", "mv/resource", "mv/config", "mv/timeline", "mv/role", "mv/task", "mv/loading", "mv/control", "mv/utils"]
});