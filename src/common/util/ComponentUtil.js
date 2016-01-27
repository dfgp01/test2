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