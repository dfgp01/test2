/**
 *  单位组件和动作组件之间的交互工具类
 */

ComponentUtil = {
	
	setTime : function(obj, timerCom){
		var timer = obj.coms.timer;
		var com = timer[timerCom.name];
		if(!com){
			com = {};
			timer[timerCom.name] = com;
		}
		com.start = Service.gameTime;
		com.timeout = timerCom.timeout;
	},
	
	checkTimeout : function(obj, timerCom){
		var com = obj.coms.timer[timerCom.name];
		if(Service.gameTime - com.start > timerCom.timeout){
			return true;
		}else{
			return false;
		}
	},
	
	/**
	 * 移除此节点
	 * 	组件对应的主系统是一定有头尾指针的，所以不用担心component的前后指针为空的问题
	 */
	remove : function(component){
		component.prep.next = component.next;
		component.next.prep = component.prep;
	},
	
	/**
	 * JS特有的赋值方法
	 * 不递归，只保存引用，不深层赋值
	 */
	attr : function(elems, data){
		if(data){
			for(var key in data){
				if(elems[key]){
					/*if(data[key] && typeof data[key] === "object"){
						//递归
						this.attr(elems[key], data[key]);
					}else{
						elems[key] = data[key];
					}*/
					elems[key] = data[key];
				}else{
					cc.log(elems.name + "类没有" + key + "属性");
				}
			}
		}
	}
};

ComponentUtil.createAnimate = function(data){
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
};