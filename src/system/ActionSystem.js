/**
*
*/
IdleActionSystem = ActionSystem.extend({
	update : function(unit, dt){
		if(unit.cmd != 0){
			if(this.moveCheck(unit.cmd)){
				return;
			}
			if(this.attCheck(unit.cmd)){
				return;
			}
		}
	},
	
	moveCheck : function(unit, cmd){
		if(cmd == 1){
			unit.motionCom.vx = 1;
		}
		//未完
	}
});

WalkActionSystem = ActionSystem.extend({
	start : function(unit, dt){
		if(unit.motionCom.dx < 1){
			unit.viewCom.sprite._scaleX = -1;
		}else{
			unit.viewCom.sprite._scaleX = 1;
		}
	},
	
	update : function(unit, dt){
		unit.viewCom.sprite.x += unit.motionCom.dx;
		unit.viewCom.sprite.y += unit.motionCom.dy;
	}
});