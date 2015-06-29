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