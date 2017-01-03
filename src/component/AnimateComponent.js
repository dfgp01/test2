/**
 * 	普通动画组件，关于显示和动画这一块，以后还有很多要改的。。。2017.01.03
 */
AnimateComponent = Component.extend({
	name : "animate",
	frames : null,
	intervals : null,
	
	init : function(data){
		
	},
	
	start : function(viewCom){
		//viewCom.animate = animateCom;
		viewCom.frameIndex = 0;
		viewCom.interval = 0;
		ObjectManager.coms.addViewNode(viewCom);
	},
	
	update : function(dt, viewCom){
		viewCom.interval += dt;
		if(viewCom.interval >= this.intervals[viewCom.frameIndex]){
			viewCom.interval -= this.intervals[viewCom.frameIndex];
			viewCom.frameIndex++;
			if(viewCom.frameIndex < this.frames.length){
				ObjectManager.coms.addViewNode(viewCom);
			}else{
				//end
			}
		}
	}
});

AnimateStaticComponent = AnimateComponent.extend({
	update : function(dt, viewCom){
		return;
	}
});

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