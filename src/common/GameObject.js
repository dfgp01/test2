/**
 * 抽象的游戏对象
 */
GameObject = cc.Class.extend({
	id : null,			//自增序列号
	name : null,		//名称
	state : 0,			//状态值，身处的状态区间
	actions : null,		//action组件是必须有的，不需要放在propertys中
	view : null,		//同上
	collide : null,		//同上
	owner : null,		//同上
	propertys : null,	//其他组件列表，map<name, com>型存储方式
	template : null		//每个单位都应该有一个模板的引用，因为里面存放了默认的数值
});