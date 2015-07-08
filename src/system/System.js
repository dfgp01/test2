/**
 * 	定义其他系统接口
 */
System = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(){},
	update : function(dt){},
	end : function(){}
});

/**
 * 定义动作模块专用的系统组件接口
 */
ActionSystem = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(unit){},
	update : function(dt, unit){},
	end : function(unit){}
});

/**
 * 系统管理器
 */
SystemManager = {
		sysList : null,
		init : function(){
			this.sysList = [];
		},
		start : function(){
			for(var i in this.sysList){
				this.sysList[i].start();
			}
		},
		addSystem : function(system){
			this.sysList.push(system);
		},
		update : function(dt){
			for(var i in this.sysList){
				this.sysList[i].update(dt);
			}
		}
};

/**
 * 核心系统-单位动作轮询处理
 */
MainActionSystem = System.extend({
	unitList : null,
	start : function(){
		this.unitList = Container.unitList;
	},
	update : function(dt){
		for(var i in this.unitList){
			this.unitList[i].actionsCom.currAction.run(this.unitList[i], dt);
			//动画暂时放这
			this.unitList[i].actionsCom.currAction.animateSys.run(this.unitList[i], dt);
		}
	},
	end : function(){
		//remove from SysManager
	}
});

/**
 * 单位动画轮询
 */
MainAnimateSystem = System.extend({
	
});

/**
*	player控制系统（暂定）
*/
PlayerSystem = System.extend({
	key : [0, 0],
	combo : [],
	maxLength : 6,
	comboTimeCount : 0,
	comboTimeInteval : 1.5,
	fowardFlag : "X",				//X是默认值，代表目前还没有左右键被按下
	target : null,

	start : function(){
	},
	
	update : function(dt){
		if(this.key[0] != 0){
			
		}
		//连按系统时效判断
		if(this.combo.length>0){
			this.comboTimeCount += dt;
			if(this.comboTimeCount > this.comboTimeInteval){
				this.combo.length = 0;
				this.fowardFlag = "X";
			}
		}
	},
	
	pressKey : function(key){
		
	},
	
	pressDirection : function(key){
		this.key[0] = this.key[0] | key;
		if(key==8){
			this.addCombo("U");
		}
		else if(key==4){
			this.addCombo("D");
		}
		else if(key==2){
			this.addCombo("L");
		}else{
			this.addCombo("R");
		}
	},
	
	addCombo : function(keyStr){
		if(this.combo.length >= 6){
			this.combo.shift();
		}
		//像DNF那样，左右方向是可以反过来的
		if(keyStr=="L" || keyStr == "R"){
			if(this.fowardFlag == "X"){
				this.fowardFlag = keyStr;
			}
			keyStr = this.fowardFlag==keyStr ? "F" : "T";
		}
		
		//shift是删除第一个，pop是删除最后一个
		this.combo.push(keyStr);
		//重新计时
		this.comboTimeCount = 0;
	},
});