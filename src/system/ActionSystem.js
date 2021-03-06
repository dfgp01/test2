/**
 * 定义动作模块专用的系统组件接口
 */
ActionSystem = cc.Class.extend({
	name : null,
	comName : "none",
	priority : 0,
	start : function(gameObject, actionCom){return;},
	update : function(dt, gameObject, actionCom){return;},
	end : function(gameObject, actionCom){return;}
});

/**
* 一般单位站立时的动作主系统
*/
StandActionSystem = ActionSystem.extend({
	name : "stand",
	comName : "stand",
	update : function(dt, gameObj, actionCom){
		if(gameObj.cmd != 0){
			//检测是否按下方向键
			if(gameObj.cmd & Constant.CMD.ALL_DIRECTION){
				gameObj.actionsCom.nextAction = gameObj.actionsCom.actions["walk"];
				//这里return是保证代码不会跑到下面的if语句中，不然就乱套了
				return;
			}
			if(gameObj.cmd & Constant.CMD.ATTACK_ALL){
				gameObj.actionsCom.nextAction = gameObj.actionsCom.actions["attack"];
				//同上
				return;
			}
			if(gameObj.cmd & Constant.CMD.JUMP){
				return;
			}
		}
	}
});

/**
 * 通常移动逻辑系统
 */
MotionSystem = ActionSystem.extend({
	name : "motion",
	comName : "motion",
	motionCom : null,
	
	start : function(gameObj, actionCom){
	},
	
	// 每帧移动公式：
	// 单位的dx = action的dx * 帧延时，因为数据设定是每秒移动距离，所以这里要乘以dt
	// 例如帧延时为200ms时， dx = 30 * 0.2 = 6px
	update : function(dt, gameObj, actionCom){
		gameObj.coms.motion.dx = gameObj.coms.motion.vx * actionCom.dx * dt;
		gameObj.coms.motion.dy = gameObj.coms.motion.vy * actionCom.dy * dt;
		cc.log("dx= " + actionCom.dx + " * " + dt + " = " + gameObj.coms.motion.dx);
	},
	
	end : function(gameObj, actionCom){
		gameObj.coms.motion.vx = 0;
		gameObj.coms.motion.vy = 0;
		gameObj.coms.motion.dx = 0;
		gameObj.coms.motion.dy = 0;
	}
});

/**
 * 人物行走动作的操作系统，此系统要继承MotionSystem，实现自定义的运动逻辑
 */
WalkMotionSystem = MotionSystem.extend({
	name : "walk",
	start : function(gameObj, actionCom){
		//左右方向不共存
		if(gameObj.cmd & Constant.CMD.RIGHT){
			gameObj.coms.motion.vx = 1;
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);		//暂时用这个办法
		}
		else if(gameObj.cmd & Constant.CMD.LEFT){
			gameObj.coms.motion.vx = -1;
			//unit.viewCom.sprite.setFlippedX(true);
		}
		//上下方向也不共存
		if(gameObj.cmd & Constant.CMD.UP){
			gameObj.coms.motion.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(gameObj.cmd & Constant.CMD.DOWN){
			gameObj.coms.motion.vy = -1;	//同理，Y负轴是向下的
		}
	},

	//这一部分应该要更完善 2015.10.09
	update : function(dt, gameObj, actionCom){

		if(!(gameObj.cmd & Constant.CMD.ALL_DIRECTION)){
			gameObj.actionsCom.nextAction = gameObj.actionsCom.actions["stand"];
			return;
		}

		//行走中改变左右方向的，虽然现在不支持，但以后肯定会有的
		if(gameObj.coms.motion.vx = 1 && gameObj.cmd & Constant.CMD.LEFT){
			gameObj.coms.motion.vx = -1;
			gameObj.viewCom.sprite._scaleX = -1;
		}
		else if(gameObj.coms.motion.vx = -1 && gameObj.cmd & Constant.CMD.RIGHT){
			gameObj.coms.motion.vx = 1;
			gameObj.viewCom.sprite._scaleX = 1;
		}

		if(gameObj.coms.motion.vy = -1 && gameObj.cmd & Constant.CMD.UP){
			gameObj.coms.motion.vy = 1;
		}
		else if(gameObj.coms.motion.vy = 1 && gameObj.cmd & Constant.CMD.DOWN){
			gameObj.coms.motion.vy = -1;
		}
		
		//用父类的逻辑
		this._super(dt, gameObj, actionCom);
		
		//因为一般角色的步行速度是会受BUFF影响的
		gameObj.coms.motion.dx *= gameObj.coms.motion.speedFactor;
		gameObj.coms.motion.dy *= gameObj.coms.motion.speedFactor;
	},

});

/**
*	跳跃动作系统
*/
JumpActionSystem = ActionSystem.extend({
	name : "jump",
	comName : "jump",
	
	start : function(unit){
		unit.motionCom.dy = this.speedCom.factorH * this.motionCom.dh;
		unit.viewCom.groundY = unit.viewCom.sprite.getPositionY();
		unit.actionsCom.state = unit.actionsCom.state | Constant.ACTION_STATE.AIR;
	},
	
	update : function(dt, unit){
		
	},
	
	end : function(unit){
		unit.actionsCom.state = unit.actionsCom.state & ~(Constant.ACTION_STATE.AIR);
	}
});