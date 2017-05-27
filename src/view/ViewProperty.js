/**
 *  可视属性
 */
ViewProperty = Property.extend({
	name : "view",
	title : "unname",		//显示的名字
	frameStates : null,		//FrameState数组，因为一个单位可以由多个图层的sprite组成
	x : 0,					//本地世界的x坐标，非屏幕坐标
	y : 0,					//本地世界的Y坐标，非屏幕坐标
	z : 0,					//高度值，用于空中状态落地判断
	vx : 1,					//面向，1为右边，-1为左边
	nextVx : null,			//转向标记，用于渲染判断
	dx : 0,					//x偏移量，用于渲染判断
	dy : 0,					//同上
	dz : 0					//同上
});

ViewProperty.prototype.create = function(){
	var v = new ViewProperty();
	ViewProperty.addFrameState(viewProperty, 1);
	return v;
};

ViewProperty.prototype.addFrameState = function(viewProperty, num){
	if(!Validator.assertNumberRange(num, 1, 15, "frameStates-num")){
		return;
	}
	if(!DataUtil.checkArrayNotNull(viewProperty.frameStates)){
		viewProperty.frameStates = [];
	}
	var fs = viewProperty.frameStates;
	for(var i=0; i<num; i++){
		var f = new FrameProperty();
		//f.owner = owner ? owner : viewProperty.owner;
		f.sprite = EngineUtil.newSprite();
		fs.push(f);
	}
},

/**
 * 帧数据储存器，供view管理
 */
FrameState = Property.extend({
	name : "frame",
	index : 0,			//当前动画帧索引下标
	duration : 0,		//当前动画帧已经过时长
	sprite : null,		//cc.Sprite的引用
	next : null			//cc.SpriteFrame的引用，用于渲染判断
});