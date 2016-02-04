/**
 *  动作逻辑系统工具
 */
ActionSystemUtil = {
	//系统类缓存
	system:{
		animate:null,
		animateOneFrame:null
	},
	
	init : function(){
		//this.system.animate = new AnimateSystemNew();
		this.system.animate = new SimpleAnimateSystem();
		this.system.animateOneFrame = new AnimateOneFrame();
	},
	
	getAnimate : function(animateCom){
		if(animateCom.type == Constant.animate.TYPE_STATIC){
			return this.system.animateOneFrame;
		}else{
			return this.system.animate;
		}
	}
}