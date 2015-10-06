/**
 * 系统管理器
 */
MainSystem = {
		actionRunSystem : null,
		animateRunSystem : null,
		systemList : [],						//其他子系统

		addSystem : function(system){
			for(var i in this.systemList){
				if(system.priority > this.systemList[i].priority){
					//this.sysList.slice(i, 1);	未经测试
					return;
				}
			}
			//上面的循环未return时，说明system的优先级是最小的，要补加到列表尾
			this.systemList.push(system);
		},
		
		/**
		 * 将一个新系统添加到指定系统的前面（通过系统名称指定）
		 * @param systemName
		 * @param newSystem
		 */
		addSystemBefore : function(systemName, newSystem){
			for(var i in this.systemList){
				if(systemName == this.systemList[i].name){
					newSystem.priority = this.systemList[i].priority + 1;
					//this.sysList.slice(i, 1);	未经测试
					break;
				}
			}
		},

		start : function(){
			actionRunSystem.start();
			animateRunSystem.start();
			for(var i in this.systemList){
				this.systemList[i].start();
			}
		},

		update : function(dt){
			Service.gameTimeAfter(dt);
			actionRunSystem.update(dt);
			animateRunSystem.update(dt);
			for(var i in this.systemList){
				this.systemList[i].update(dt);
			}
		},

		end : function(){
			actionRunSystem.end();
			animateRunSystem.end();
			for(var i in this.systemList){
				this.systemList[i].end();
			}
		}
};

/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : null,
	priority : 0,
	prep : null,
	next : null,
	start : function(){},
	update : function(dt){},
	end : function(){}
});

/**
 * 主循环中的动作系统
 */
ActionRunSystem = System.extend({
	name : "ActionRunSystem",
	objList : null,
	_currObj : null,
	start : function(){
		this.objList = Service.interactObjs();
	},
	update : function(dt){
		for(var i in this.objList){
			this._currObj = this.objList[i];
			this._currObj.coms.actions.currAction.run(this._currObj, dt);
			if(this._currObj.coms.actions.nextAction != null){
				this._currObj.changeAction(this._currUnit.actionsCom.nextAction);
				//还原为空状态，原因你懂
				this._currUnit.actionsCom.nextAction = null;
			}
		}
	},
	end : function(){
		//remove
	}
});

/**
 * 主循环中的动画系统
 */
AnimateRunSystem = System.extend({
	lastTime : 0,
	tick : 0,
	name : "animateRunSystem",
	objList : null,
	_currObj : null,
	
	start : function(){
		
	},
	update : function(dt){
		for(var i in this.objList){
			this._currObj = this.objList[i];
			this._currObj.actionsCom.currAction.animateSys.update(this._currObj, dt);
		}
	}
});

/**	暂时废弃 2015.10.04
 * 核心系统-单位动作轮询处理
 */
/*MainActionSystem = System.extend({
	name : "mainActionSystem",
	unitList : null,
	_currUnit : null,
	start : function(){
		this.unitList = Service.getAllUnits();
	},
	update : function(dt){
		for(var i in this.unitList){
			this._currUnit = this.unitList[i];
			this._currUnit.actionsCom.currAction.run(this._currUnit, dt);
			if(this._currUnit.actionsCom.nextAction != null){
				this._currUnit.changeAction(this._currUnit.actionsCom.nextAction);
				//还原为空状态，原因你懂
				this._currUnit.actionsCom.nextAction = null;
			}
		}
	},
	end : function(){
		//remove from SysManager
	}
});*/

/**	暂时废弃 2015.10.04
 * 单位动画轮询，目前用独立系统处理，如果性能不佳，可尝试加到动作处理系统中
 */
/*MainAnimateSystem = System.extend({
	name : "mainAnimateSystem",
	unitList : null,
	start : function(){
		this.unitList = Service.getAllUnits();
	},
	update : function(dt){
		for(var i in this.unitList){
			this.unitList[i].actionsCom.currAction.animateSys.update(this.unitList[i], dt);
		}
	},
	end : function(){
		//remove from SysManager
	}
});*/

/**
 * 更新坐标的系统，因为调用setPosition会发生重绘操作，影响性能，所以不要在其他地方频繁用setPosition
 */
MotionRunSystem = System.extend({
	name : "motionRunSystem",
	unitList : null,
	dx : 0,
	dy : 0,
	unit : null,
	sprite : null,
	start : function(){
		this.unitList = Service.getAllUnits();
	},
	update : function(dt){
		for(var i in this.unitList){

			this.unit = this.unitList[i];
			this.sprite = this.unit.viewCom.sprite;
			
			this.dx = this.unit.motionCom.dx;
			this.dy = this.unit.motionCom.dy;
			if(this.dx != 0 || this.dy != 0){
				//setPosition()里面有绘制命令
				//这里要使用getPositionX()而不是getPosition().x这种，因为翻查源码发现，getPosition()是会有new操作的。
				this.sprite.setPosition(
						this.sprite.getPositionX() + this.dx,
						this.sprite.getPositionY() + this.dy);
			}
		}
	}
});

/**
*	player控制系统（暂定）
*/
PlayerSystem = System.extend({
	name : "playerSystem",
	key : 0,
	combo : [],
	maxLength : 6,
	
	//用于计算连续按键的时间间隔的
	comboTimeCount : 0,
	
	//连续按键的最大时间间隔(秒)
	comboTimeInteval : 1.5,
	
	//X是默认值，代表目前还没有左右方向键被按下。
	//本来想设为null的，就怕频繁设为null，会引起垃圾回收器不满。
	fowardFlag : "X",
	
	//被控制的目标，Unit类型
	target : null,

	start : function(){
	},
	
	update : function(dt){
		
		this.target.cmd = 0;
		
		//如果按下了攻击键，从单击状态变为持续按住状态，以后可能加个缓冲计时
		//方向键暂时不用判断单击还是按住的状态
		if(this.key & Constant.CMD.ATTACK_ONCE){
			//把二进制最后两位变成10，暂时没想到更好的办法
			this.key = this.key & (~Constant.CMD.ATTACK_ONCE) | Constant.CMD.ATTACK_HOLD_ON;
		}
		//连按系统时间间隔叠加
		if(this.combo.length>0){
			this.comboTimeCount += dt;
		}
		
		if(this.key > 0){
			this.target.cmd = this.key;
		}
	},
	
	releaseKey : function(key){
		this.key = this.key & (~key);
	},
	
	pressKey : function(key){
		this.key = this.key | key;
		if(key==Constant.CMD.ATTACK_ONCE){
			this.addCombo("A");
		}
	},
	
	pressDirection : function(key){
		this.key = this.key | key;
		if(key==Constant.CMD.UP){
			this.addCombo("U");
		}
		else if(key==Constant.CMD.DOWN){
			this.addCombo("D");
		}
		else if(key==Constant.CMD.LEFT){
			this.addCombo("L");
		}else{
			this.addCombo("R");
		}
	},
	
	checkCombo : function(){
		if(this.comboTimeCount > this.comboTimeInteval){
			this.combo.length = 0;
			this.fowardFlag = "X";
			this.comboTimeCount = 0;
			return false;
		}
		return true;
	},
	
	addCombo : function(keyStr){
		if(this.checkCombo() && this.combo.length >= this.maxLength){
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
	
	getComboStr : function(){
		if(this.checkCombo()){
			return this.combo.join("");
		}
		return null;
	}
});