/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/loading", function(S, mediator, dom, config){
    var ele = dom.get(".mv-loading");
    var numEle = dom.get(".num", ele);
    dom.css(ele, "top", config.mobile?"50%":"320px");

    if(!config.mobile){
        dom.css(ele, "marginLeft", "-10%");
        dom.css(ele, "width", "20%");
    }


    // margin-left: -$w/2;
    // width:$w;

    var startNum = 0.01;
    var autoAddNum = 0.001;
    var maxAutoNum = 0.8;
    var endStayTime = 50;

    var loading = window.ll = {
        bindEvent:function(){
            var that = this;

            mediator.on("gameLoadStart", function(){
                that.start();
            });

            mediator.on("gameLoaded", function(d){
                that.loaded(d.num);
            });

            mediator.on("gameLoadComplete", function(){
                that.end();
            });
        },
        start:function(){
            var that = this;
            clearInterval(that.interval);
            that.interval = setInterval(function(){
                that.loaded(that.num + autoAddNum);

                if(that.num > maxAutoNum){
                    clearInterval(that.interval);
                }
            }, 100);

            dom.show(ele);
            that.num = 0;
            that.loaded(startNum);
        },
        loaded:function(num){
            num = num||0;

            if(num >= 1){
                this.end();
                return;
            }

            if(num < this.num){
                num = this.num;
            }

            this.setNum(num);
        },
        end:function(){
            var that = this;

            that.setNum(1);
            clearInterval(that.interval);
            clearTimeout(that.timeout);

            that.timeout = setTimeout(function(){
                dom.hide(ele);
            }, endStayTime);
        },
        setNum:function(num){
            if(this.num != num){
                this.num = num;
                numEle.style.width = (this.num * 100) + "%";
            }
        }

    };

    loading.bindEvent();

    return loading;
}, {
    requires:["mv/mediator", "dom", "mv/config"]
})