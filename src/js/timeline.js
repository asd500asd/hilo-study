/**
 * Created by wangJie on 2017/6/26.
 */
KISSY.add("mv/timeline", function(S, event){
    var timeline = S.mix({
        _index:0,
        _tasks:[],
        _time:0,
        _curTask:null,
        _nextTask:null,
        _isPlay:false,
        /**
         * @param {Number} delta 时间，单位毫秒
         */
        tick:function(delta){
            if(this._isPlay){
                this._time += delta * .001;
                if(this._nextTask && this._nextTask.time <= this._time){
                    this._runNextTask();
                }
            }
        },
        /**
         * 增加任务
         * @param {Array|Task} tasks, eg:{time:0, start:function(){}, stop:function(){}}
         */
        addTask:function(tasks){
            tasks = S.isArray(tasks)?tasks:[tasks];
            this._tasks = this._tasks.concat(tasks);
        },
        start:function(time){
            this.stop();
            this._time = time||0;
            this._isPlay = true;
            this.tick(0);
        },
        stop:function(){
            this._stopCurTask();
            this._isPlay = false;
            this._index = -1;
            this._time = 0;
            this._nextTask = this._tasks[0];
        },
        pause:function(){
            this._isPlay = false;
        },
        resume:function(){
            this._isPlay = true;
        },
        resetTask:function(){
            this._tasks = [];
            this.stop();
        },
        _runNextTask:function(){
            this._stopCurTask();

            this._index ++;
            this._curTask = this._tasks[this._index];
            this._nextTask = this._tasks[this._index + 1];
            if(this._curTask){
                if(this._curTask.start(this._time)){
                    this.stop();
                    this.fire("end");
                }
            }
        },
        _stopCurTask:function(){
            this._curTask && this._curTask.stop && this._curTask.stop();
        }
    }, event.Target);

    return timeline;
}, {
    requires:["event"]
});