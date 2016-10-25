/**
 * 抽象的游戏对象
 */
GameObject = cc.Class.extend({
	id : null,			// id = template.name + id序列号
	actions : null,		//action组件是必须有的，不需要放在coms中
	active : false,		//判断对象是否在场景中
	coms : null,		//其他组件列表，map<name, com>型存储方式
	template : null,	//每个单位都应该有一个模板的引用，因为里面存放了默认的数值
	next : null			//用于对象池队列中的指针引用
});