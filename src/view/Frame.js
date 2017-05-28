/**
 * 帧
 */
Frame = cc.Class.extend({
	name : null,
	position : null,	//相对sprite的位置,Position2D类型
	duration : 0.1,		//持续时间
	body : null,		//身体碰撞矩形，非必填
	view : null			//ccSpriteFrame类型
});

var frVldts = null;
Frame.prototype.create = function(data){
	if(!frVldts){
		frVldts = [
	    		   Validator.create("name", "string", true, 1, 50),
	    		   Validator.create("duration", "number", true, NumericalConstant.MIN_FPS_TICK, 99),
	    		   Validator.create("position", "position2D", true),
	    		   Validator.create("body", "rect", false)
	    		];
		Validator.addType("frame",function(val, label){
			return Validator.validateObject(val, frVldts, label);
		});
	}
	var sf = EngineUtil.getFrame(data.name)
	if(!sf){
		cc.log("frame:" + data.name + " not found");
		return null;
	}
	var frame = new Frame();
	frame.name = data.name;
	frame.duration = data.duration;
	frame.spriteFrame = sf;
	frame.rect = data.rect;
	frame.position = position2D.create(data.position[0], data.position[1]);
	return frame;
};