/**
 * 抽象的游戏对象
 */
GameObject = cc.Class.extend({
	id : null,			//自增序列号
	state : 0,			//状态值，身处的状态区间
	action : null,		//action组件是必须有的，不需要放在propertys中
	view : null,		//同上
	collide : null,		//同上
	owner : null,		//从属关系，由哪一个单位召唤出来的，适用于子弹等对象
	property : null,	//其他组件列表，map<name, com>型存储方式
	template : null		//每个单位都应该有一个模板的引用，因为里面存放了默认的数值
});

GameObject.prototype.create = function(template){
	var unit = new GameObject();
	//unit.id = template.nextId++
	unit.name = template.name;
	unit.template = template;
	unit.view = ViewProperty.create();
	unit.view.owner = unit;
	unit.action = ActionProperty.create();
	unit.action.owner = unit;
	unit.propertys = {};
	for(var i in template.propertys){
		var property = template.propertys[i].clone();
		property.owner = unit;
		unit.propertys[property.name] = property;
	}
	return unit;
};