/**
 * 动作组件工具类
 */
ActionComponentUtil = {

	/**
	 * 创建动画组件
	 */
	createAnimate : function(data){
		if(DataUtil.checkIsInt(data, "type")){
			cc.log("ComponentUtil.createAnimate error. animate.type error.");
			return null;
		}
		if(DataUtil.checkArrayNull(data,"frames")){
			cc.log("ComponentUtil.createAnimate error. animate.frames error.");
			return null;
		}
		var animate = new AnimateComponent();
		animate.type = data.type;
		var frameList = [];
		for(var i in animate.frames){
			var frame = cc.spriteFrameCache.getSpriteFrame(animate.frames[i]);
			if(frame){
				frameList.push(frame);
			}else{
				cc.log("action:" + action.name + " frame:" + animate.frames[i] + " not found");
				return null;
			}
		}
		animate.frames = frameList;

		//设置每帧延时
		if(!DataUtil.checkArrayNull(data,"delays")){
			if(data.delays.length != frameList.length){
				cc.log("animate.delays 数组和frame数量不对等.");
				return null;
			}
			for(var i=0; i<animate.delays.length; i++){
				animate.delays.push(data.delays[i]);
			}
		}else{
			animate.delays = [];
			for(var i=0; i<frameList.length; i++){
				//设置默认动画帧时长
				animate.delays.push(
						Service.GameSetting.frameTick);
			}
		}
	}
};