/**
 * 指令反馈组件
 */
CommandComponent = Component.extend({
	name : "command",
	type : 0,
	table : null,
	list : null,	//临时存放data数据
	
	init : function(data){
		this.table = {};
	},
	
	update : function(dt, unitCmd){
		if(unitCmd.input != 0){
			var action = this._findByKey(this.table, unitCmd.comboKey);
			if(action){
				ActionUtil.next(unitCmd.owner.actions, action);
				unitCmd.comboKey = 0;
			}
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

/**
 * 攻击动作时输入的指令
 */
AttackCommandComponent = CommandComponent.extend({
	frameIndex : 0,
	
	init : function(data){
		this._super(data);
		this.frameIndex = DateUtil.checkIsInt(data.frameIndex) ? data.frameIndex : 0;
	},
	
	update : function(dt, unitCmd){
		if((unitCmd.attack & Constant.CMD_AI_ATTACK) && unitCmd.owner.view.frameIndex > this.frameIndex){
			this._super(dt, unitCmd);
		}
	},
});

/**
 * 站立动作时的指令处理
 */
StandCommandComponent = CommandComponent.extend({
	update : function(dt, unitCmd){
		if(unitCmd.direction & Constant.CMD_ALL_DIRECTION){
			ActionUtil.next(unitCmd.owner.action, unitCmd.owner.template.actions['walk']);
			return;
		}
		this._super(dt, unitCmd);
	}
});

/**
 * 走动动作时的指令处理
 */
WalkCommandComponent = CommandComponent.extend({
	_reset : function(unitCmdCom){
		//左右方向不共存
		if(unitCmdCom.direction & Constant.CMD_RIGHT){
			unitCmdCom.owner.view.vx = 1;
			unitCmdCom.vx = 1;
		}else if(unitCmdCom.direction & Constant.CMD_LEFT){
			unitCmdCom.owner.view.vx = -1;
			unitCmdCom.vx = -1;
		}
		
		//上下方向也不共存
		if(unitCmdCom.direction & Constant.CMD_UP){
			unitCmdCom.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}else if(unitCmdCom.direction & Constant.CMD_DOWN){
			unitCmdCom.vy = -1;	//同理，Y负轴是向下的
		}
		unitCmdCom.direction = Constant.CMD_DIRECTION_CHARGE;	//转为一个持续指令，在输入新指令时可在update()中判断变化
	},

	start : function(unitCmdCom){
		this._reset(unitCmdCom);
	},

	update : function(dt, unitCmdCom){
		
		if(unitCmdCom.direction == 0){
			//这里应调用end，而不是直接钦定stand_action
			//ActionUtil.next(gameObj, gameObj.template.actions.stand);
			unitCmdCom.owner.action.endFlag = true;
			return;
		}
		
		if(unitCmdCom.direction > Constant.CMD_DIRECTION_CHARGE){
			//指令有变化，应重新设定
			this._reset(unitCmdCom);
			return;
		}
		
		this._super(dt, unitCmdCom);
	}
});