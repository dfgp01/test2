/**
 * 基础数据结构体
 */
Node = cc.Class.extend({
	prep : null,
	next : null
});

/**
 * 对象链表
 */
NodeLinks = cc.Class.extend({
	head : null,
	tail : null
});

/**
 * 碰撞组
 */
CollideTeam = NodeLinks.extend({
	type : 0,
	mask : 0
});

/**
 * 碰撞记录信息，用于计算重复判断
 */
CollideInfo = Node.extend({
	time : 0,	//上次计算时间
	target : null	//unit
});

/**
 * 碰撞区域计算对象(2D仿3D模拟)
 */
Rect = cc.Class.extend({
	x : 0,		//世界坐标中的x
	y : 0,		//世界坐标中的y
	z : 0,		//世界坐标中的z
	xMax : 0,	//世界坐标中的x + width
	yMax : 0,	//世界坐标中的y + range
	zMax : 0,	//世界坐标中的z + height
	width : 0,	//X轴的宽度
	height : 0,	//Z轴的高度
	range : 0	//Y轴的上下半径范围
});

Position2D = {
	x : 0,
	y : 0
};

/**
 * 事件基类
 */
Event = cc.Class.extend({
	type : 0,
	subType : 0,
	sender : null,
	args : null		//事件参数表,map<string,object>类型
});

/**
 * 监听器基类
 */
EventListener = cc.Class.extend({
	execute : function(event){}
});