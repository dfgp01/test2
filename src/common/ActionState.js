/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = cc.Class.extend({
	name : null,
	components : null,
	
	_input : null,		//存储转出状态的输入指令<int, StateSwitchParam>
	
	/**
	 * 因目前暂时搞不清楚JS的反射创建实例相关的技术，所以无法用工厂形式统一创建ActionState及其子类然后统一调用init()
	 * @param data
	 * @param template
	 */
	init : function(data){
		//cc.log("info: creating action:[" + this.name + "].");
	},
	
	//加载时
	start : function(unit){
		unit.actions.endFlag = false;
		if(this.components.length > 0){
			for(var i in this.components){
				this.components[i].start(
					unit.propertys[this.components[i].name]);
			}
		}
	},
	
	//运行时
	update : function(dt, unit){
		if(this.components.length > 0){
			for(var i in this.components){
				this.components[i].update(dt,
					unit.propertys[this.components[i].name]);
			}
		}
	},

	//结束时
	end : function(unit){
		if(this.components.length > 0){
			for(var i in this.components){
				this.components[i].end(
					unit.propertys[this.components[i].name]);
			}
		}
	},
	
	handleInput : function(input, type, unit){
		
	},
	
	getStackInfo : function(unit){
		var stackInfo = unit.actions.stacks[this.name];
		if(!stackInfo){
			stackInfo = ObjectManager.getActionStackInfo();
			unit.actions.stacks[this.name] = stackInfo;
		}
		return stackInfo;
	},
	
	findComponent : function(name){
		if(!DataUtil.checkIsString(name)){
			return null;
		}
		var com = null;
		if(DataUtil.checkArrayNotNull(this.components)){
			for(var i in this.components){
				if(this.components[i].name == name){
					com = this.components[i];
					break;
				}
			}
		}
		return com;
	}
});