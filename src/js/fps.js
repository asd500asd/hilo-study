/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/fps", function(S, dom){
    var num;
    var interval;
    var elem;

    var fps = {
        num:0,
        tick:function(){
            num ++;
        },
        start:function(){
            num = 0;
            elem = elem||dom.create('<div style="position:absolute;z-index:99999999;top:20px;left:10px;height:24px;line-height:24px;color:#fff;background:#aaa;"></div>');
            document.body.appendChild(elem);

            interval = setInterval(function(){
                elem.innerHTML = "fps:" + num;
                num = 0;
            }, 1000);
        },
        stop:function(){
            clearInterval(interval);
        }
    };

    return fps;
}, {
    requires:["dom"]
})