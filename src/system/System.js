/**
 * 	定义其他系统接口
 */
System = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(){},
	update : function(dt){},
	end : function(){}
});

/**
 * 定义动作模块专用的系统组件接口
 */
ActionComponentSystem = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(dt, unit){},
	update : function(dt, unit){},
	end : function(dt, unit){}
});

/**
 * 系统管理器
 */
SystemManager = System.extend({
		sysList : null,
		init : function(){
			this.sysList = [];
		},
		addSystem : function(system){
			this.sysList.push(system);
		},
		update : function(dt){
			for(var i in this.sysList){
				this.sysList[i].update(dt);
			}
		}
});