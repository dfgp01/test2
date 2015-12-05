/**
 * 抽象的游戏对象
 */
GameObject = cc.Class.extend({
	id : 0,
	name : null,
	type : 0,
	featureCode : 0,
	group : 0,
	cmd : 0,
	actions : null,		//action组件是必须有的，不需要放在coms中
	//viewCom : null,			//这个要放在coms中
	active : false,		//判断对象是否在场景中
	coms : null,				//其他组件列表，map<name, com>型存储方式
	
	template : null,	//每个单位都应该有一个模板的引用，因为里面存放了默认的数值
	
	changeAction : function(action){
		this.actionsCom.currAction.end(this);
		action.start(this);
		return;
	}
});