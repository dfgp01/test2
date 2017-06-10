/**
 * 并行运行的Action
 */
ParallelAction = Action.extend({
	actions : null,	//同时运行的逻辑组件
	
	//加载时
	start : function(unit){
		for(var i in this.actions){
			this.actions[i].start(unit);
		}
	},
	
	//运行时
	update : function(dt, unit){
		for(var i in this.actions){
			this.actions[i].update(dt, unit);
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.actions){
			this.actions[i].end(unit);
		}
	},
	
	addComponent : function(component){
		if(!Validator.assertNotNull(component,"ActionState.addComponent:component")){
			cc.log("ActionState.addComponent error.");
			return;
		}
		if(!DataUtil.checkArrayNotNull(this.components)){
			this.components = [];
		}
		for(var i in this.components){
			if(component.priority > this.components[i].priority){
				this.components.splice(i, 0, component);
				return;
			}
		}
		//上面的循环未return时，说明优先级是最小的，要补加到列表尾
		this.components.push(component);
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