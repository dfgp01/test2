/**
 * 用于建造组件的工厂类
 */
ComponentFactory = {
	
	addComponent : function(action, component){
		for(var i in action.components){
			if(component.priority > action.components[i].priority){
				this.systemList.splice(i, 0, system);
				return;
			}
		}
		//上面的循环未return时，说明优先级是最小的，要补加到列表尾
		action.components.push(component);
	},

	/**
	 * 移动组件
	 */
	createMove : function(data){
		if(!DataUtil.checkNotNull(data)){
			cc.log("createMove error. lack of necessary data!");
			return null;
		}
		if(!DataUtil.checkIsNumber(data.dx) || !DataUtil.checkIsNumber(data.dy)){
			cc.log("createMove error. dx or dy must be number.");
			return null;
		}
		data.type = DataUtil.checkIsInt(data.type) ? data.type : Constant.MOVE_NORMAL;
		
		var move = null;
		switch(data.type){
		case Constant.MOVE_NORMAL:
			move = new MoveComponent();
			break;
		}
		
		move.dx = data.dx * Service.Gobal.logicTick;
		move.dy = data.dy * Service.Gobal.logicTick;
		return move;
	},
	
	/**
	 * 动作指令组件
	 */
	createCommand : function(data){
		var type = DataUtil.checkIsInt(data.type) ? data.type : 0;
		if(!DataUtil.checkArrayNotNullForLog(data.list,"data.list")){
			cc.log("createCommand error. list error.");
			return null;
		}
		var command = new ActionCommandComponent();
		command.type = type;
		command.list = [];
		for(var name in data.list){
			if(!DataUtil.checkIsStringForLog(name,"data.list.name")){
				cc.log("createCommand error. list error.");
				return null;
			}
			command.list.push(name);
		}
		return command;
	},
	
	/**
	 * 显示组件
	 */
	createView : function(data){
		var view = new ViewComponent();
		view.animate = this.createAnimate(data.animate);
		return view;
	},
	
	/**
	 * 创建动画组件
	 */
	createAnimate : function(data){
		if(!DataUtil.checkNotNull(data)){
			cc.log("createAnimate error. lack of necessary data!");
			return null;
		}
		if(!DataUtil.checkArrayNotNullForLog(data.frames,"data.frames")){
			cc.log("createAnimate error. animate.frames error.");
			return null;
		}
		data.type = DataUtil.checkIsInt(data.type) ? data.type : ANIMATE_ONCE;
		
		var animate = null;
		switch(data.type){
		case Constant.ANIMATE_STATIC:
			animate = new AnimateStaticComponent();
			break;
		case Constant.ANIMATE_ONCE:
			animate = new AnimateComponent();
			break;
		case Constant.ANIMATE_SCROLL:
			animate = new AnimateScrollComponent();
			break;
		}
		
		animate.frames = [];
		for(var i in data.frames){
			var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
			if(frame){
				animate.frames.push(frame);
			}else{
				cc.log("frame:" + animate.frames[i] + " not found");
				return null;
			}
		}

		//设置每帧延时
		//interval或intervals属性必须有其中一个，否则用默认的间隔
		animate.intervals = [];
		if(DataUtil.checkIsNumber(data.interval)){
			for(var i=0; i<data.frames.length; i++){
				animate.intervals.push(data.interval);
			}
		}
		else if(DataUtil.checkArrayNotNullForLog(data.intervals,"data.intervals")){
			if(data.intervals.length != data.frames.length){
				cc.log("animate.intervals 数组和frame数量不对等.");
				return null;
			}
			for(var i=0; i<data.frames.length; i++){
				animate.intervals.push(data.intervals[i]);
			}
		}else{
			for(var i=0; i<data.frames.length; i++){
				//设置默认动画帧时长
				animate.intervals.push(
						GameSetting.Default.animateFrameTick);
			}
		}
		return animate;
	},
}