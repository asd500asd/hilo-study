/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/task", function(S, resource, config) {
    var Tween = Hilo.Tween;
    var Bitmap = Hilo.Bitmap;
    var Ease = Hilo.Ease;

    var players;
    var scene;
    var main;
    var bg;


    var task = {
        /*
         *
         **/
        getTasks: function() {

            var startTask = [{
                time:-111,
                start:function(){
                    bg.createRect2();

                    plays([0, 1, 2], function(role){
                        role.display.addTo(scene);
                    })

                    scene.x = scene.startX;
                    scene.scaleX = scene.scaleY = 1;
                    scene.y = scene.startY;

                    plays([0, 1, 2, 3, 4], function(role, index) {
                        role.x = role.startX;
                        role.y = role.startY;
                        role.setHead(resource.get("head" + index));
                        role.animation.stop();
                    });
                }
            }];

            var mainTask = [{
                time:.6,
                start:function(){
                    resource.get("audio").play();
                }
            },
                {
                    time:.65,
                    start:function(){
                        plays([0, 1, 2, 3, 4], "C");
                    }
                },
                {
                    time: 2.5,
                    start: function() {
                        scene.scaleX = scene.scaleY = 4;
                        scene.x = scene.startX - 80;
                        Tween.to(scene, {
                            scaleX: 3,
                            scaleY: 3
                        }, {
                            duration: 300,
                            ease: Ease.Quart.EaseOut
                        });
                    }
                }, {
                    time: 4.5,
                    start: function() {
                        //跳起来
                        scene.x = scene.startX;
                        scene.scaleX = scene.scaleY = 2;
                        Tween.to(scene, {
                            scaleX: 1,
                            scaleY: 1
                        }, {
                            duration: 300,
                            ease: Ease.Quart.EaseOut
                        });

                        plays([3, 4], function(role){
                            role.display.addTo(scene);
                        })

                        plays([0, 1, 2, 3, 4], function(p) {
                            p.display.x -= 39;
                            p.play("F");
                        });
                    }
                },

                {
                    time: 5.5,
                    start: function() {

                        bg.kv.visible = false;

                        scene.scaleX = scene.scaleY = 4;
                    }
                }, {
                    time: 5.7,
                    start: function() {
                        bg.createCircle();
                        scene.scaleX = scene.scaleY = 4;
                        Tween.to(scene, {
                            scaleX: 1.5,
                            scaleY: 1.5,
                            y: scene.startY - 100
                        }, {
                            duration: 300,
                            ease: Ease.Quart.EaseOut
                        });
                    }
                    // scene.scaleX = scene.scaleY = 1.5;
                    // scene.y=scene.startY - 100;

                }, {
                    time: 6.4,
                    start: function() {
                        plays([0, 1, 2, 3, 4], "H");
                    }
                }, {
                    time: 14,
                    start: function() {

                        plays([0, 1, 2, 3, 4], "G");
                        Tween.to(scene, {
                            scaleX: 1,
                            scaleY: 1,
                            y: scene.startY
                        }, {
                            duration: 5000
                        });
                    }

                }, {
                    time: 22,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1.5;
                        scene.y = scene.startY - 100;
                        scene.x = scene.startX + 50;
                        plays([0, 1, 2, 3, 4], "L");
                        bg.createRects();
                    }
                },
                //节奏起
                {
                    time: 24,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                        scene.y = scene.startY;
                        scene.x = scene.startX;
                    }
                }, {
                    time: 24.2,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 24.4,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 24.6,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 24.8,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 25,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 25.2,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                },
                //节奏
                {
                    time: 28.2,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 28.4,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 28.6,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 28.8,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 29,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 29.2,
                    start: function() {
                        bg.createRect2();
                        plays([0, 1, 2, 3, 4], function(role){
                            role.play("M", 0);
                        });
                        scene.scaleX = scene.scaleY = 1;
                    }
                },

                //节奏2
                {
                    time: 32,
                    start: function() {
                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 32.2,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 32.4,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 32.6,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                }, {
                    time: 32.8,
                    start: function() {

                        scene.scaleX = scene.scaleY = 3;
                    }
                }, {
                    time: 33,
                    start: function() {

                        scene.scaleX = scene.scaleY = 1;
                    }
                    //1111
                }, {
                    time: 34,
                    start: function() {
                        bg.createEleven();
                        // plays([0, 1, 2, 3, 4], "L");
                        plays([0, 1, 2, 3, 4], function(p) {
                            p.display.x += 39;
                            p.play("L");
                        });

                        // plays([0, 1, 2, 3, 4], "Mzhuan");
                        scene.scaleX = scene.scaleY = 2;
                        Tween.to(scene, {
                            scaleX: 1,
                            scaleY: 1
                        }, {
                            duration: 300,
                            ease: Ease.Quart.EaseOut
                        });
                    }
                }, {
                    time: 40.5,
                    start: function() {
                        scene.scaleX = scene.scaleY = 1.5;
                        scene.y = scene.startY - 100;
                    }
                }, {
                    time: 40.7,
                    start: function() {

                        scene.x = scene.startX + 100;
                    }
                }, {
                    time: 40.9,
                    start: function() {
                        scene.x = scene.startX - 100;
                    }
                }, {
                    time: 41.1,
                    start: function() {
                        scene.x = scene.startX + 100;
                    }
                }, {
                    time: 41.3,
                    start: function() {
                        scene.x = scene.startX - 100;
                    }
                }, {
                    time: 41.5,
                    start: function() {
                        scene.x = scene.startX;
                        scene.scaleX = scene.scaleY = 1;
                        scene.y = scene.startY;
                    }
                }, {
                    time: 42,
                    start: function() {
                        bg.isElevenOver = true;
                    }
                }, {
                    time: 45,
                    start: function() {
                        plays([0, 1, 2, 3, 4], "Mzhuan");
                    }
                }, {
                    time: 50,
                    start: function() {
                        bg.reset();
                        return true;
                    }
                }
            ];

            return startTask.concat(mainTask);
        },
        init: function(data) {
            main = data;
            scene = main.scene;
            players = main.players;
            bg = main.bg;
        },
        reset: function() {
            scene && Tween.remove(scene);
            bg.kv.visible = true;
            players[3] && players[3].display.removeFromParent();
            players[4] && players[4].display.removeFromParent();
        }
    };

    function plays(arr, func, time) {
        for (var i = 0, l = arr.length; i < l; i++) {
            var num = arr[i];
            if (num >= config.peopleNum) {
                continue;
            }
            if (S.isFunction(func)) {
                func(players[num], i);
            } else {
                players[num].play(func || "C", time || 0.3);
            }
        }
    }

    function setHead(p, isSet) {
        p.setHead(isSet ? resource.get("head") : null);
    }

    return task;
}, {
    requires: ["mv/resource", "mv/config"]
});