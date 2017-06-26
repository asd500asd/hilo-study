/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/model", function(S, io, mediator, utils, config){
    var users = [];

    var model = {
        getAvatars:function(callback){
            var that = this;

            io({
                type:"get",
                dataType:"jsonp",
                data:{
                    num:config.peopleNum - 1,
                    ua:window.getUA && window.getUA()
                },
                url:config.url.info,
                complete:function(d){
                    //后端头像
                    if(d && d.data && d.data && d.data.length && d.data[0].status == 1){
                        users = d.data;
                        for(var i = 0, l = users.length; i < l;i ++){
                            users[i].src = users[i].avatar;
                        }
                    }

                    //默认头像
                    var avatars = spokesmanCfg.mvData.avatars;
                    for(var i = 0, l = avatars.length; i < l;i ++){
                        avatars[i] = {
                            src:avatars[i]
                        };
                    }

                    var deltaNum = config.peopleNum - users.length;
                    if(deltaNum > 0){
                        users = users.concat(getRandomArr(avatars, deltaNum));
                    }

                    S.each(users, function(avatar, index){
                        avatar.id = "head" + index;
                    });

                    callback(users);
                }
            });
        },
        getLoadResource:function(){
            var arr = [];
            for(var i = 0, l = users.length;i < l;i ++){
                var data = users[i];
                arr.push({
                    id:"avatar" + i,
                    src:data.avatar
                });
            }
            return arr;
        },
        getUserinfo:function(){
            return users;
        }
    };

    function getRandomArr(arr, num){
        var result = [];
        for(var i = 0;i < num;i ++){
            var avatar = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
            result.push(avatar);
        }
        // console.log("result", result)
        return result;
    }

    return model;
},{
    requires:["io", "mv/mediator", "mv/utils", "mv/config"]
});