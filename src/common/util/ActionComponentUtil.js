/**
 * 动作组件工具类
 */
ActionComponentUtil = {

	/**
	 * 创建动画组件
	 */
	createAnimate : function(data){
		if(!DataUtil.checkIsInt(data, "type")){
			cc.log("ComponentUtil.createAnimate error. animate.type error.");
			return null;
		}
		if(DataUtil.checkArrayNull(data,"frames")){
			cc.log("ComponentUtil.createAnimate error. animate.frames error.");
			return null;
		}
		var animate = new AnimateComponent();
		animate.type = DataUtil.checkIsInt(data,"type") ? data.type : 0;
		animate.frames = [];
		for(var i in data.frames){
			var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
			if(frame){
				animate.frames.push(frame);
			}else{
				cc.log("action:" + action.name + " frame:" + animate.frames[i] + " not found");
				return null;
			}
		}

		//设置每帧延时
		if(animate.type != Constant.ANIMATE_STATIC){
			//interval或intervals属性必须有其中一个，否则用默认的间隔
			animate.intervals = [];
			if(DataUtil.checkIsNumber(data, "interval")){
				for(var i=0; i<data.frames.length; i++){
					animate.intervals.push(data.interval);
				}
			}
			else if(!DataUtil.checkArrayNull(data,"intervals")){
				if(data.intervals.length != data.frames.length){
					cc.log("animate.intervals 数组和frame数量不对等.");
					return null;
				}
				for(var i=0; i<data.frames.length; i++){
					animate.intervals.push(data.intervals[i]);
				}
			}else{
				for(var i=0; i<frameList.length; i++){
					//设置默认动画帧时长
					animate.delays.push(
							Service.Gobal.animateFrameTick);
				}
			}
		}
		return animate;
	},
	
	createSwitchable : function(data){
		var switchable = new SwitchableComponent();
		for(var cmd in data){
			switchable.keys[cmd] = data[cmd];
		}
		return switchable;
	}
};