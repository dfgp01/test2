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
ActionSystem = cc.Class.extend({
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

/**
 * 核心系统-单位动作轮询处理
 */
MainActionSystem = System.extend({
	unitList : null,
	start : function(){
		this.unitList = Container.getUnitList();
	},
	update : function(dt){
		for(var i in  this.unitList){
			this.unitList[i].currAct.run(this.unitList[i], dt);
		}
	},
	end : function(){
		//remove from SysManager
	}
});

/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	//AnimateComponent
	animateCom : null,
	start : function(dt, unit){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){		//待定
		//播放动画
		if(unit.actions.frameIndex < this.animateCom.frames.length){
			unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
			unit.actions.frameIndex++;
		}
	},
	end : function(dt, unit){}
});