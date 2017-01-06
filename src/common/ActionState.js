/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = cc.Class.extend({
	name : null,
	key : null,					//用于存放在父节点children属性中的key
	next : null,				//改用直接后驱节点（未实行）
	//systemList : null,				//系统列表
	state : 0,
	type : 0,
	components : null,
	
	/**
	 * 因目前暂时搞不清楚JS的反射创建实例相关的技术，所以，ActionState的子类统一用 new 创建 然后调用init()
	 * @param data
	 * @param template
	 */
	init : function(data){
		//cc.log("info: creating action:[" + this.name + "].");
		this.components = [];
	},
	
	//加载时
	start : function(unit){
		unit.actions.endFlag = false;
		if(this.components.length > 0){
			for(var i in this.systemList){
				this.components[i].start(
					unit.propertys[this.components[i].name]);
			}
		}
	},
	
	//运行时
	update : function(dt, unit){
		if(this.components.length > 0){
			for(var i in this.systemList){
				this.components[i].update(dt,
					unit.propertys[this.components[i].name]);
			}
		}
	},

	//结束时
	end : function(unit){
		if(this.components.length > 0){
			for(var i in this.systemList){
				this.components[i].end(
					unit.propertys[this.components[i].name]);
			}
		}
	},
	
	getStackInfo : function(unit){
		var stackInfo = unit.actions.stacks[this.name];
		if(!stackInfo){
			stackInfo = ObjectManager.getActionStackInfo();
			unit.actions.stacks[this.name] = stackInfo;
		}
		return stackInfo;
	}
});