/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = cc.Class.extend({
	name : null,
	key : null,					//用于存放在父节点children属性中的key
	next : null,				//改用直接后驱节点（未实行）
	systemList : null,				//系统列表
	state : 0,
	type : 0,
	coms : null,
	
	/**
	 * 因目前暂时搞不清楚JS的反射创建实例相关的技术，所以，ActionState的子类统一用 new 创建 然后调用init()
	 * @param data
	 * @param template
	 */
	init : function(data){
		cc.log("info: creating action:[" + this.name + "].");
		this.coms = {};
		this.systemList = [];
		//初始化动作组件系统
		ActionUtil.bulid(data, this);
	},
	
	//加载时
	start : function(unit){
		for(var i in this.systemList){
			this.systemList[i].start(unit, this.coms[this.systemList[i].name]);
		}
	},
	
	//运行时
	update : function(dt, unit){
		for(var i in this.systemList){
			this.systemList[i].update(dt, unit, this.coms[this.systemList[i].name]);
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.systemList){
			this.systemList[i].end(unit);
		}
	}
});