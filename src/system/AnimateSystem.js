/**
 * 核心系统-动画播放
 */
/*AnimateSystemOld = ActionSystem.extend({
	name : "animate",
	
	//局部变量
	_view : null,
	
	start : function(gameObj,animateCom){
		this._view = gameObj.coms.view;
		this._view.frameIndex = 0;
		this._view.interval = 0;
	},
	
	update : function(dt, gameObj, animateCom){
		this._view = gameObj.coms.view;
		if(this._view.frameIndex < animateCom.frames.length){
			this._view.interval += dt;
			if(this._view.interval >= animateCom.intervals[this._view.frameIndex]){
				this._view.frameIndex++;
				this._view.interval = 0;
				if(this._view.frameIndex < animateCom.frames.length){
					EngineUtil.setFrame(this._view.sprite, animateCom.frames[this._view.frameIndex]);
				}
			}
		}
		
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

AnimateScrollOld = AnimateSystemOld.extend({
	
	update : function(dt, gameObj, animateCom){
		this._super(dt, gameObj, animateCom);
		if(this._view.frameIndex >= animateCom.frames.length){
			this._view.frameIndex = 0;
			EngineUtil.setFrame(this._view.sprite, animateCom.frames[0]);
		}
		
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
});*/

/**
 * 主循环中的动画系统（新版）
 */
/*AnimateUpdateSystem = System.extend({
	tick : Constant.TICK_FPS05,
	name : "animate",
	_dt : 0,
	
	*//**
	 * 加入到链表中，并初始化第一帧
	 *//*
	addComponent : function(viewCom){
		this._super(viewCom);
		viewCom.frameIndex = 0;
		viewCom.lastFrameIndex = -1;
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
});*/

AnimateSystem = ActionSystem.extend({
	name : "animate",
	
	start : function(viewCom, animateCom){
		viewCom.animate = animateCom;
		viewCom.frameIndex = 0;
		viewCom.interval = 0;
		ObjectManager.coms.addViewNode(viewCom);
	},
	
	update : function(dt, viewCom, animateCom){
		viewCom.interval += dt;
		if(viewCom.interval >= animateCom.intervals[viewCom.frameIndex]){
			viewCom.interval -= animateCom.intervals[viewCom.frameIndex];
			viewCom.frameIndex++;
			if(viewCom.frameIndex < animateCom.frames.length){
				ObjectManager.coms.addViewNode(viewCom);
			}
		}
	}
});

/**
 * 只有一帧的
 */
AnimateOneFrame = AnimateSystem.extend({
	update : function(dt, viewCom, animateCom){
		return;
	}
});

/**
 * 核心系统-动画播放，以下是新的
 */
AnimateNormal = AnimateSystem.extend({
	
	update : function(dt, viewCom, animateCom){
		if(viewCom.frameIndex == animateCom.frames.length){
			viewCom.owner.actions.endFlag = true;
			ObjectManager.coms.removeViewNode(viewCom);
			return;
		}
		this._super(dt, viewCom, animateCom);
	}
});

AnimateScroll = AnimateSystem.extend({
	
	update : function(dt, gameObj, animateCom){
		if(viewCom.frameIndex == animateCom.frames.length){
			viewCom.frameIndex = 0;
			ObjectManager.coms.addViewNode(viewCom);
		}
		this._super(dt, viewCom, animateCom);
	}
});