/**
* 站立时的动作
*/
StandActionSystem = ActionSystem.extend({
	update : function(unit, dt){
		if(unit.cmd != 0){
			//检测是否按下方向键
			if(unit.cmd & Constant.CMD.ALL_DIRECTION){
				unit.changeAct("walk");
				return;
			}
			if(unit.cmd & Constant.CMD.ATTACK){
				return;
			}
		}
	}
});

WalkActionSystem = ActionSystem.extend({
	motionCom : null,
	start : function(unit, dt){
		//左右方向不共存
		if(unit.cmd & Constant.CMD.RIGHT){
			unit.motionCom.vx = 1;
			unit.viewCom.sprite._scaleX = 1;
		}
		else if(unit.cmd & Constant.CMD.LEFT){
			unit.motionCom.vx = -1;
			unit.viewCom.sprite._scaleX = -1;
		}
		//上下方向也不共存
		if(unit.cmd & Constant.CMD.UP){
			unit.motionCom.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(unit.cmd & Constant.CMD.DOWN){
			unit.motionCom.vx = -1;	//同理，Y负轴是向下的
		}
		//行走速度公式：单位速率 x 动作具体增量 x 方向向量
		unit.motionCom.dx = unit.walkSpeedCom.currSpeed * this.motionCom.dx * unit.motionCom.vx;
		unit.motionCom.dy = unit.walkSpeedCom.currSpeed * this.motionCom.dy * unit.motionCom.vy;
	},
	
	//这一部分应该要更完善 2015.07.02
	update : function(unit, dt){
		
		if(!(unit.cmd & Constant.CMD.ALL_DIRECTION)){
			unit.changeAct("stand");
			return;
		}
		//行走中改变左右方向的(逻辑可能是错的)
		if((unit.motionCom.vx = 1 && unit.cmd & Constant.CMD.LEFT) || (unit.motionCom.vx = -1 && unit.cmd & Constant.CMD.RIGHT)){
			unit.motionCom.vx *= -1;
			unit.viewCom.sprite._scaleX *= -1;
		}
		if(unit.cmd & Constant.CMD.UP){
			unit.motionCom.vy = 1;
		}
		if(unit.cmd & Constant.CMD.DOWN){
			unit.motionCom.vy = -1;
		}
		
		unit.viewCom.sprite.x += unit.motionCom.dx * unit.motionCom.vx;
		unit.viewCom.sprite.y += unit.motionCom.dy * unit.motionCom.vy;
	}
});