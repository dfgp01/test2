/**
 *  显示组件
 */
ViewComponent = Component.extend({
	name : "view",

	x : 0,					//本地世界的x坐标，非屏幕坐标
	y : 0,					//本地世界的Y坐标，非屏幕坐标
	z : 0,					//高度值，用于空中状态落地判断
	vx : 1,					//面向，1为右边，-1为左边
	nextVx : null,			//转向标记，用于渲染判断
	dx : 0,					//x偏移量，用于渲染判断
	dy : 0,					//同上
	dz : 0,					//同上
	
	index : 0,			//当前动画帧索引下标
	duration : 0,		//当前动画帧已经过时长
	sprite : null,		//cc.Sprite的引用
	frame : null		//cc.SpriteFrame的引用，用于渲染判断
});

ViewComponent.prototype.create = function(){
	var v = new ViewComponent();
	v.sprite = EngineUtil.getSprite();
	return v;
};