/**
 * 矩形交互组件，如会阻碍通行、可拾取、可接触等
 */
CollideComponent = Component.extend({
	name : "collide",
	rect : null,	//矩形框
	maxNum : 0,		//最大碰撞数
	mask : 0		//目标
});