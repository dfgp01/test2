/**
 * 指令逻辑处理
 */
CommandSystem = ActionSystem.extend({

	name : "command",
	_attack : Constant.CMD_AI_ATTACK,
	_action : null,
	
	update : function(dt, unitCmdCom, actCmdCom){
		if(unitCmdCom.attack & this._attack){
			this._action = this._findByKey(actCmdCom.table, unitCmdCom.comboKey);
			if(this._action){
				//logic here...
				this._action = null;
			}
			unitCmdCom.comboKey = 0;
		}
	},
	
	//comboKey要先对称化才能使用
	_findByKey : function(table, comboKey){
		if(comboKey > 0){
			var key = this._symmetry(comboKey);
			return table[key] ? table[key] : this._findByKey(table, comboKey >> 3);
		}else{
			return null;
		}
	},
	
	//对称处理（这个有点玄）
	_symmetry : function(comboKey){
		var key = 0;
		var result = 0;
		var front = 0;
		while(comboKey>0){
			key = comboKey & 7;	//取最右边三位
			if(key==Constant.COMBO_KEY_FRONT||result==Constant.COMBO_KEY_BACK){
				front = front==0 ? key : front;
				result = result << 3 + (front==key ? Constant.COMBO_KEY_FRONT : Constant.COMBO_KEY_BACK);
			}
			comboKey = comboKey >> 3;
		}
		return result;
	}
});

StandCommandSystem = CommandSystem.extend({
	
	update : function(dt, unitCmdCom, actCmdCom){
		if(unitCmdCom.key ==0){
			return;
		}
		if(unitCmdCom.key & this._cmdAllDirection){
			//into walk
			return;
		}
		this._super(dt, unitCmdCom, actCmdCom);
	}
});

WalkCommandSystem = CommandSystem.extend({
	_cmdAllDirection : Constant.CMD_ALL_DIRECTION,
	_cmdRight : Constant.CMD_RIGHT,
	_cmdLeft : Constant.CMD_LEFT,
	_cmdUp : Constant.CMD_UP,
	_cmdDown : Constant.CMD_DOWN,

	start : function(unitCmdCom, actCmdCom){
		//左右方向不共存
		if(unitCmdCom.key & this._cmdRight){
			unitCmdCom.owner.view.vx = 1;
			unitCmdCom.vx = 1;
		}else if(unitCmdCom.key & this._cmdLeft){
			unitCmdCom.owner.view.vx = -1;
			unitCmdCom.vx = -1;
		}
		
		//上下方向也不共存
		if(unitCmdCom.key & Constant.CMD_UP){
			unitCmdCom.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(unitCmdCom.key & Constant.CMD_DOWN){
			unitCmdCom.vy = -1;	//同理，Y负轴是向下的
		}
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, unitCmdCom, actCmdCom){
		
		if(unitCmdCom.key & this._cmdAllDirection ==0){
			//这里应调用end，而不是直接钦定下个action
			//ActionUtil.next(gameObj, gameObj.template.actions.stand);
			return;
		}
		
		this._super(dt, unitCmdCom, actCmdCom);
		
		//每帧重新计算，感觉这一步可以优化的
		if(unitCmdCom.key & this._cmdRight){
			if(unitCmdCom.vx==-1){
				unitCmdCom.vx = 1;
				unitCmdCom.owner.coms.view.vx = 1;
			}
		}else if(unitCmdCom.key & this._cmdLeft){
			if(unitCmdCom.vx==1){
				unitCmdCom.vx = -1;
				unitCmdCom.owner.coms.view.vx = -1;
			}
		}
		if(unitCmdCom.key & this._cmdUp){
			if(unitCmdCom.vy==-1){
				unitCmdCom.vy = 1;
			}
		}else if(unitCmdCom.key & this._cmdDown){
			if(unitCmdCom.vy==1){
				unitCmdCom.vy = -1;
			}
		}
	}
});