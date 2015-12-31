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
	}
};