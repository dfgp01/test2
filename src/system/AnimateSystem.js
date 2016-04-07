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

/**
 * 主循环中的动画系统（新版）
 */
AnimateUpdateSystem = System.extend({
	tick : Constant.TICK_FPS05,
	name : "animate",
	_dt : 0,
	
	/**
	 * 加入到链表中，并初始化第一帧
	 */
	addComponent : function(viewCom){
		this._super(viewCom);
		viewCom.frameIndex = 0;
		viewCom.interval = 0;
		EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[0]);
	},

	execute : function(dt, viewCom){
		
		if(viewCom.frameIndex > viewCom.animate.frames.length-1){
			if(viewCom.animate.type == Constant.ANIMATE_SCROLL){
				viewCom.frameIndex = 0;
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[0]);
			}else{
				this.removeComponent(viewCom);
				return;
			}
		}
		
		viewCom.interval += dt;
		if(viewCom.frameIndex < viewCom.animate.frames.length-1){
			if(viewCom.interval >= viewCom.animate.intervals[viewCom.frameIndex]){
				viewCom.interval = viewCom.interval - viewCom.animate.intervals[viewCom.frameIndex];
				viewCom.frameIndex++;
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
			}
		}else if(viewCom.frameIndex == viewCom.animate.frames.length-1){
			if(viewCom.interval >= viewCom.animate.intervals[viewCom.frameIndex]){
				viewCom.frameIndex++;
			}
		}
		
	}
});

RenderUpdateSystem = System.extend({
	name : "view",
	execute : function(dt, viewCom){
		if(viewCom.frameIndex != viewCom.lastFrameIndex){
			EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
			viewCom.lastFrameIndex = viewCom.frameIndex;
		}
	}
});