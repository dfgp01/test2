/**
 * 显示组件，关于显示和动画这一块，以后还有很多要改的 2017.01.11
 */
ViewComponent = Component.extend({
	name : "view",
	animates : null,		//动画组件引用，二维数组，其他属性想到再加
	section : null,		//区段，用于标识动画的三个阶段：前摇、攻击、后摇
	
	start : function(viewProperty){
		this._addFramePro(viewProperty);
		for(var i in this.animates){
			this._animateStart(this.animates[i], viewProperty.frameStates[i]);
		}
	},
	
	/**
	 * 如果当前动画列表超出接收者的列表，接收者追加数量
	 */
	_addFramePro : function(viewProperty){
		if(this.animates.length > viewProperty.frameStates.length){
			var newAdds = this.animates.length - viewProperty.frameStates.length;
			GameObjectFactory.addFrameState(viewProperty, newAdds);
		}
	},
	
	_animateStart : function(animate, frameState){
		frameState.index = 0;
		frameState.duration = 0;
		frameState.next = animate.frames[0].view;
		frameState.isEnd = false;
	},
	
	update : function(dt, viewProperty){
		for(var i in this.animates){
			this._animateUpdate(dt, this.animates[i], viewProperty.frameStates[i]);
		}
	},
	
	_animateUpdate : function(dt, animate, frameStates){
		if(frameStates.isEnd){
			return;
		}
		frameStates.duration += dt;
		if(frameStates.duration > animate.frames[frameStates.index].duration){
			frameStates.duration -= animate.frames[frameStates.index].duration;
			frameStates.index++;
			if(frameStates.index >= animate.frames.length){
				if(animate.isLoop == NumericalConstant.BOOLEAN_TRUE){
					frameStates.index = 0;
				}else{
					frameStates.isEnd = true;
					return;
				}
			}
			frameStates.next = animate.frames[frameStates.index].view;
		}
	}
});

/**
 * 	普通动画组件
 */
AnimateComponent = Component.extend({
	name : "animate",
	frames : null,

	start : function(viewProperty){
		viewProperty._frame.index = 0;
		viewProperty._frame.interval = 0;
		viewProperty._frame.next = this.frames[0].spriteFrame;
	},
	
	update : function(dt, viewProperty){
		viewProperty._frame.interval += dt;
		if(viewProperty._frame.interval > this.frames[viewProperty._frame.index].time){
			viewProperty._frame.interval -= this.frames[viewProperty._frame.index].time;
			viewProperty._frame.index++;
			if(viewProperty._frame.index < this.frames.length){
				viewProperty._frame.next = this.frames[viewProperty._frame.index].spriteFrame;
				//ObjectManager.coms.addViewNode(viewCom);
			}
		}
	}
});

/**
 * 静态动画，只有一帧
 */
AnimateStaticComponent = AnimateComponent.extend({
	update : function(dt, viewCom){
		return;
	}
});

/**
 * 循环播放
 */
AnimateScrollComponent = AnimateComponent.extend({
	update : function(dt, viewCom){
		viewProperty._frame.interval += dt;
		if(viewProperty._frame.interval > this.frames[viewProperty._frame.index].time){
			viewProperty._frame.interval -= this.frames[viewProperty._frame.index].time;
			viewProperty._frame.index++;
			if(viewProperty._frame.index >= this.frames.length){
				viewProperty._frame.index = 0;
			}
			viewProperty._frame.next = this.frames[viewProperty._frame.index].spriteFrame;
			//ObjectManager.coms.addViewNode(viewCom);
		}
	}
});