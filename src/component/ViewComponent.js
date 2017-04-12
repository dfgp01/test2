/**
 * 显示组件，关于显示和动画这一块，以后还有很多要改的 2017.01.11
 */
ViewComponent = Component.extend({
	name : "view",
	animates : null,		//动画组件引用，二维数组，其他属性想到再加
	section : null,		//区段，用于标识动画的三个阶段：前摇、攻击、后摇
	
	start : function(viewProperty){
		for(var i in this.animates){
			viewProperty._frame = viewProperty.frames[i];
			this.animates[i].start(viewProperty);
		}
	},
	
	update : function(dt, viewProperty){
		for(var i in this.animates){
			viewProperty._frame = viewProperty.frames[i];
			this.animates[i].update(dt, viewProperty);
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