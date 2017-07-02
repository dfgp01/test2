/**
 * 帧逻辑
 */
FrameAction = Action.extend({
    frame : null,   //ccSpriteFrame类型
    duration : 0,   //持续时长
    
    action : null,	//额外的action

	start : function(unit){
		var view = unit.components.view;
		view.duration = 0;
		view.frame = this.frame;
		if(this.action){
			this.action.start(unit);
		}
	},

	update : function(dt, unit){
		var view = unit.components.view;
		view.duration += dt;
		if(this.action){
			this.action.update(dt, unit);
		}
	},
	
	checkEnd : function(unit){
		return unit.components.duration >= this.duration;
	}
});

var frVldts =  [Validator.create("frame","string",true, 1, 99)];
Validator.addType("FrameAction",function(val, label){
	return Validator.validateObject(val, frVldts, label)
});

FrameAction.prototype.create = function(data){
    var frameAction = new FrameAction();
    frameAction.frame = EngineUtil.getFrame(data.frame);
    return frameAction;
};