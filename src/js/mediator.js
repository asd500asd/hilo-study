/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/mediator", function(S, event){
    var mediator = S.mix({}, event.Target);
    return mediator;
},{
    requires:["event"]
});