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
	actionsCom : null,		//action组件是必须有的
	viewCom : null,			//同理
	active : false,		//判断对象是否在场景中
	coms : null,				//其他组件列表，map<name, com>型存储方式
	
	changeAction : function(action){
		this.actionsCom.currAction.end(this);
		action.start(this);
		return;
	}
});