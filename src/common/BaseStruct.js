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

/**
 * 2D坐标类
 */
Position2D = cc.Class.extend({
	x : 0,
	y : 0
});

/**
 * 事件基类
 */
Event = cc.Class.extend({
	type : 0,
	source : null
});

/**
 * 监听器基类
 */
EventListener = cc.Class.extend({
	execute : function(event){}
});

/**
 * 状态转换参数
 */
StateSwitchParam = cc.Class.extend({
	currState : 0,	//状态转换前的当前状态
	actionId : 0,	//目标action
	type : 0,		//事件触发类型，控制器输入、指令输入等
	value : 0		//具体的输入指令值
});

/**
 * 单位的动作栈
 */
ActionStack = cc.Class.extend({
	id : 0,
	value : 0
});

/**
 * 动作状态消耗量
 */
ActionCost = cc.Class.extend({
	type : 0,	//二进制组合式枚举
	hp : 0,		//healthy_point
	en : 0,		//energy
	item : 0	//指定物品数量
});