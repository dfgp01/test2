/**
* 一般单位站立时的动作主系统
*/
StandActionSystem = ActionSystem.extend({
	name : "standActionSystem",
	update : function(unit, dt){
		if(unit.cmd != 0){
			//检测是否按下方向键
			if(unit.cmd & Constant.CMD.ALL_DIRECTION){
				unit.preparedChangeAction("walk");
				//这里return是保证代码不会跑到下面的if语句中，不然就乱套了
				return;
			}
			if(unit.cmd & Constant.CMD.ATTACK_ALL){
				unit.preparedChangeAction("normalAtk1");
				//同上
				return;
			}
			if(unit.cmd & Constant.CMD.JUMP){
				return;
			}
		}
	}
});

/**
 * 行走时的动作主系统
 */
WalkActionSystem = ActionSystem.extend({
	name : "walkActionSystem",
	motionCom : null,
	start : function(unit){
		//左右方向不共存
		if(unit.cmd & Constant.CMD.RIGHT){
			unit.motionCom.vx = 1;
			//unit.viewCom.sprite._scaleX = 1;
			unit.viewCom.sprite.setFlippedX(false);		//暂时用这个办法
		}
		else if(unit.cmd & Constant.CMD.LEFT){
			unit.motionCom.vx = -1;
			unit.viewCom.sprite.setFlippedX(true);
		}
		//上下方向也不共存
		if(unit.cmd & Constant.CMD.UP){
			unit.motionCom.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(unit.cmd & Constant.CMD.DOWN){
			unit.motionCom.vy = -1;	//同理，Y负轴是向下的
		}
		//行走速度公式：单位速率 x 动作具体增量 x 方向向量
		unit.motionCom.dx = unit.speedCom.factorX * unit.motionCom.dx * unit.motionCom.vx;
		unit.motionCom.dy = unit.speedCom.factory * unit.motionCom.dy * unit.motionCom.vy;
	},
	
	//这一部分应该要更完善 2015.07.02
	update : function(unit, dt){
		
		if(!(unit.cmd & Constant.CMD.ALL_DIRECTION)){
			unit.preparedChangeAction("stand");
			return;
		}
		
		//行走中改变左右方向的，虽然现在不支持，但以后肯定会有的
		if(unit.motionCom.vx = 1 && unit.cmd & Constant.CMD.LEFT){
			unit.motionCom.vx = -1;
			unit.viewCom.sprite._scaleX = -1;
		}
		else if(unit.motionCom.vx = -1 && unit.cmd & Constant.CMD.RIGHT){
			unit.motionCom.vx = 1;
			unit.viewCom.sprite._scaleX = 1;
		}
		
		if(unit.motionCom.vy = -1 && unit.cmd & Constant.CMD.UP){
			unit.motionCom.vy = 1;
		}
		else if(unit.motionCom.vy = 1 && unit.cmd & Constant.CMD.DOWN){
			unit.motionCom.vy = -1;
		}
	},
	
	end : function(unit){
		unit.motionCom.dx = 0;
		unit.motionCom.dy = 0;
		unit.motionCom.vx = 0;
		unit.motionCom.vy = 0;
	}
});

/**
*	跳跃动作系统
*/
JumpActionSystem = ActionSystem.extend({
	name : "jumpActionSystem",
	motionCom : null,
	
	start : function(unit){
		unit.motionCom.dy = this.speedCom.factorH * this.motionCom.dh;
		unit.viewCom.groundY = unit.viewCom.sprite.getPositionY();
		unit.actionsCom.state = unit.actionsCom.state | Constant.ACTION_STATE.AIR;
	},
	
	update : function(unit, dt){
		
	},
	
	end : function(unit){
		unit.actionsCom.state = unit.actionsCom.state & ~(Constant.ACTION_STATE.AIR);
	}
});