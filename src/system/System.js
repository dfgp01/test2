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
	start : function(unit){},
	update : function(dt, unit){},
	end : function(unit){}
});

/**
 * 系统管理器
 */
SystemManager = {
		sysList : null,
		init : function(){
			this.sysList = [];
		},
		start : function(){
			for(var i in this.sysList){
				this.sysList[i].start();
			}
		},
		addSystem : function(system){
			this.sysList.push(system);
		},
		update : function(dt){
			for(var i in this.sysList){
				this.sysList[i].update(dt);
			}
		}
};

/**
 * 核心系统-单位动作轮询处理
 */
MainActionSystem = System.extend({
	unitList : null,
	start : function(){
		this.unitList = Container.unitList;
	},
	update : function(dt){
		for(var i in this.unitList){
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
	start : function(unit, dt){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){		//待定
		//播放动画
		if(unit.actions.frameIndex < this.animateCom.frames.length){
			unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
			unit.actions.frameIndex++;
		}
	}
});

/**
* 核心系统-动画循环播放
*/
LoopAnimateSystem = ActionSystem.extend({
	animateCom : null,
	start : function(unit, dt){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){
		//播放动画
		if(unit.actions.frameIndex >= this.animateCom.frames.length){
			unit.actions.frameIndex = 0;
		}
		unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
		unit.actions.frameIndex++;
	}
});