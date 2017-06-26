/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/role", function(S, resource){
    var Bitmap = Hilo.Bitmap;

    var Role = S.augment(function(){
        this.armature = null;
        this.display = null;
        this.animation = null;
        this.head = null;

        this.armatureDict = {};
    }, {
        /**
         * @param {String} armatureName
         * @param {String} data
         * @return {Armature}
         */
        createArmature:function(textureName, data){
            var factory = resource.get("factory" + textureName);
            var armature = factory.buildArmature("man");
            armature.getDisplay().onUpdate = function(dt){
                dt *= .001;
                armature.advanceTime(dt);
            };

            this.armatureDict[textureName] = armature;
            return armature;
        },
        /**
         * @param {String} armatureName 骨架名
         */
        getArmature:function(armatureName){
            return this.armatureDict[armatureName];
        },
        /**
         * @param {String} armatureName 骨架名
         */
        setArmature:function(armatureName){
            if(this.armatureName != armatureName){
                var lastDisplay = this.display;

                this.armatureName = armatureName;
                this.armature = this.getArmature(armatureName);
                this.display = this.armature.getDisplay();
                this.animation = this.armature.animation;

                if(lastDisplay){
                    this.cloneDisplayProps(this.display, lastDisplay);
                }
            }
        },
        play:function(animationName, fadeInTime, duration, loop, layer, group, fadeOutMode, displayControl, pauseFadeOut, pauseFadeIn){
            this.animation.gotoAndPlay(animationName, fadeInTime, duration, loop, layer, group, fadeOutMode, displayControl, pauseFadeOut, pauseFadeIn);
        },
        /**
         * 设置头像
         * @param {Image} image 头像图片，不传代表头像隐藏
         * @param {Array} rect
         */
        setHead:function(image, rect){
            if(image){
                rect = rect||[0, 0, image.width, image.height];

                if(!this.head){
                    var s = this.armature.getSlot("head.png");
                    var headBmp = s.getDisplay();
                    headBmp.x = 0;
                    headBmp.y = 0;
                    headBmp.rotation = 0;

                    var c = new Hilo.Container();
                    s.setDisplay(c);
                    this.head = new Bitmap({
                        image:image,
                        rect:rect
                    });
                    this.cloneDisplayProps(this.head, headBmp);
                    this.head.scaleX = this.head.scaleY = .45;
                    this.head.x = -21;
                    this.head.y = -40;
                    c.addChild(this.head);
                    c.addChild(headBmp);
                }
                else{
                    this.head.visible = true;
                    this.head.setImage(image, rect);
                }
            }
            else if(this.head){
                this.head.visible = false;
            }
        },
        /**
         * 设置显示对象属性
         * @param {Object} obj
         */
        setDisplayProps:function(obj){
            S.mix(this.display, obj);
        },
        cloneDisplayProps:function(display, fromDisplay){
            S.mix(display, fromDisplay, true, ["x", "y", "scaleX", "scaleY", "rotation", "alpha", "visible", "pivotX", "pivotY"]);
        }
    });

    return Role;
}, {
    requires:["mv/resource"]
});