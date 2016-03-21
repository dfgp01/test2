/**
 * 核心系统-动画播放，以下是新的
 */
AnimateSystem = ActionSystem.extend({
	name : "animate",
	
	//局部变量
	_view : null,
	
	start : function(gameObj,animateCom){
		this._view = gameObj.coms.view;
		this._view.frameIndex = 0;
		this._view.interval = 0;
	},
	
	update : function(dt, gameObj, animateCom){
		/*this._view = gameObj.coms.view;
		if(this._view.frameIndex < animateCom.frames.length){
			this._view.interval += dt;
			if(this._view.interval >= animateCom.intervals[this._view.frameIndex]){
				this._view.frameIndex++;
				this._view.interval = 0;
				if(this._view.frameIndex < animateCom.frames.length){
					EngineUtil.setFrame(this._view.sprite, animateCom.frames[this._view.frameIndex]);
				}
			}
		}*/
		
		if(gameObj.actions.endFlag){
			return;
		}
		
		this._view = gameObj.coms.view;
		this._view.interval += dt;
		if(this._view.interval >= animateCom.intervals[this._view.frameIndex]){
			this._view.interval -= animateCom.intervals[this._view.frameIndex];
			this._view.frameIndex++;
			if(this._view.frameIndex < animateCom.frames.length){
				EngineUtil.setFrame(this._view.sprite, animateCom.frames[this._view.frameIndex]);
			}else{
				gameObj.actions.endFlag = true;
				return;
			}
		}
	}
});

AnimateLoop = AnimateSystem.extend({
	
	update : function(dt, gameObj, animateCom){
		/*this._super(dt, gameObj, animateCom);
		if(this._view.frameIndex >= animateCom.frames.length){
			this._view.frameIndex = 0;
			EngineUtil.setFrame(this._view.sprite, animateCom.frames[0]);
		}*/
		
		this._view = gameObj.coms.view;
		this._view.interval += dt;
		if(this._view.interval >= animateCom.intervals[this._view.frameIndex]){
			this._view.interval -= animateCom.intervals[this._view.frameIndex];
			this._view.frameIndex++;
			if(this._view.frameIndex > animateCom.frames.length-2){
				this._view.frameIndex = 0;
			}
			EngineUtil.setFrame(this._view.sprite, animateCom.frames[this._view.frameIndex]);
		}
	}
});

/**
 * 只有一帧的
 */
AnimateOneFrame = ActionSystem.extend({
	name : "animate",
	start : function(gameObj,animateCom){
		EngineUtil.setFrame(gameObj.coms.view.sprite, animateCom.frames[0]);
	}
});

/**
 * 简易版，把逻辑交给主系统去做
 */
SimpleAnimateSystem = ActionSystem.extend({
	name : "animate",
	system : null,
	ctor : function(){
		this.system = SystemUtil.systems.animate;
	},
	start : function(gameObj,animateCom){
		gameObj.coms.view.animate = animateCom;
		this.system.addComponent(gameObj.coms.view);
	},
	update : function(dt, gameObj, animateCom){
		return;
	}
});