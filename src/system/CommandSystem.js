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
				ActionUtil.next(unitCmdCom.owner.action, this._action);
				this._action = null;
			}
			unitCmdCom.attack = 0;
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
	type : 1,
	_cmdAllDirection : Constant.CMD_ALL_DIRECTION,
	update : function(dt, unitCmdCom, actCmdCom){
		if(unitCmdCom.key ==0){
			return;
		}
		if(unitCmdCom.key & this._cmdAllDirection){
			ActionUtil.next(unitCmdCom.owner.action, unitCmdCom.owner.template.actions['walk']);
			return;
		}
		this._super(dt, unitCmdCom, actCmdCom);
	}
});

WalkCommandSystem = CommandSystem.extend({
	type : 2,
	_cmdDirectionFlag : Constant.CMD_DIRECTION_CHARGE,
	_cmdRight : Constant.CMD_RIGHT,
	_cmdLeft : Constant.CMD_LEFT,
	_cmdUp : Constant.CMD_UP,
	_cmdDown : Constant.CMD_DOWN,
	
	_init : function(unitCmdCom){
		//左右方向不共存
		if(unitCmdCom.direction & this._cmdRight){
			unitCmdCom.owner.view.vx = 1;
			unitCmdCom.vx = 1;
		}else if(unitCmdCom.direction & this._cmdLeft){
			unitCmdCom.owner.view.vx = -1;
			unitCmdCom.vx = -1;
		}
		
		//上下方向也不共存
		if(unitCmdCom.direction & Constant.CMD_UP){
			unitCmdCom.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(unitCmdCom.direction & Constant.CMD_DOWN){
			unitCmdCom.vy = -1;	//同理，Y负轴是向下的
		}
	}

	start : function(unitCmdCom, actCmdCom){
		this._init(unitCmdCom);
		unitCmdCom.direction = unitCmdCom.direction & this._cmdDirectionFlag;	//吞噬指令
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, unitCmdCom, actCmdCom){
		
		if(unitCmdCom.direction == 0){
			//这里应调用end，而不是直接钦定下个action
			//ActionUtil.next(gameObj, gameObj.template.actions.stand);
			unitCmdCom.owner.action.isEnd = true;
			return;
		}
		
		if(unitCmdCom.direction > this._cmdDirectionFlag){
			//指令有变化，应重新设定
			this._init(unitCmdCom);
		}
		
		this._super(dt, unitCmdCom, actCmdCom);
	}
});