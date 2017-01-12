/**
 * 显示组件，关于显示和动画这一块，以后还有很多要改的 2017.01.11
 */
ViewComponent = Component.extend({
	name : "view",
	animate : null,		//动画组件引用，其他属性想到再加
	section : null,		//区段，用于标识动画的三个阶段：前摇、攻击、后摇
	
	start : function(viewProperty){
		this.animate.start(viewProperty);
	},
	
	update : function(dt, viewProperty){
		this.animate.update(dt, viewProperty);
	}
});

/**
 * 	普通动画组件
 */
AnimateComponent = Component.extend({
	name : "animate",
	frames : null,
	intervals : null,
	
	start : function(viewCom){
		viewCom.frame = this.frames[0];
		viewCom.frameIndex = 0;
		viewCom.interval = 0;
	},
	
	update : function(dt, viewCom){
		viewCom.interval += dt;
		if(viewCom.interval >= this.intervals[viewCom.frameIndex]){
			viewCom.interval -= this.intervals[viewCom.frameIndex];
			viewCom.frameIndex++;
			if(viewCom.frameIndex < this.frames.length){
				viewCom.frame = this.frames[viewCom.frameIndex];
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
	update : function(dt, gameObj, animateCom){
		viewCom.interval += dt;
		if(viewCom.interval >= this.intervals[viewCom.frameIndex]){
			viewCom.interval -= this.intervals[viewCom.frameIndex];
			viewCom.frameIndex++;
			if(viewCom.frameIndex >= this.frames.length){
				viewCom.frameIndex = 0;
			}
			ObjectManager.coms.addViewNode(viewCom);
		}
	}
});