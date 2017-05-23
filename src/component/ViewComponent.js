/**
 * 显示组件，关于显示和动画这一块，以后还有很多要改的 2017.01.11
 */
ViewComponent = Component.extend({
	name : "view",
	animates : null,		//动画组件引用，二维数组，其他属性想到再加
	section : null,		//区段，用于标识动画的三个阶段：前摇、攻击、后摇
	
	start : function(viewProperty){
		for(var i in this.animates){
			this._animateStart(this.animates[i], viewProperty.framePropertys[i]);
		}
	},
	
	_animateStart : function(animate, frameProperty){
		frameProperty.index = 0;
		frameProperty.duration = 0;
		frameProperty.next = animate.frames[0].view;
		frameProperty.isEnd = false;		
	},
	
	update : function(dt, viewProperty){
		for(var i in this.animates){
			this._animateUpdate(dt, this.animates[i], viewProperty.framePropertys[i]);
		}
	},
	
	_animateUpdate : function(dt, animate, frameProperty){
		if(frameProperty.isEnd){
			return;
		}
		frameProperty.duration += dt;
		if(frameProperty.duration > animate.frames[frameProperty.index].duration){
			frameProperty.duration -= animate.frames[frameProperty.index].duration;
			frameProperty.index++;
			if(frameProperty.index >= animate.frames.length){
				if(animate.isLoop == NumericalConstant.BOOLEAN_TRUE){
					frameProperty.index = 0;
				}else{
					frameProperty.isEnd = true;
					return;
				}
			}
			frameProperty.next = animate.frames[frameProperty.index].view;
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