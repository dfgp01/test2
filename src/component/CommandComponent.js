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
	
	_attack : Constant.CMD_AI_ATTACK,
	_action : null,
	
	update : function(dt, unitCmdCom){
		if(unitCmdCom.attack & this._attack){
			this._action = this._findByKey(this.table, unitCmdCom.comboKey);
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

StandCommandComponent = CommandComponent.extend({
	_cmdAllDirection : Constant.CMD_ALL_DIRECTION,
	update : function(dt, unitCmdCom){
		if(unitCmdCom.direction & this._cmdAllDirection){
			ActionUtil.next(unitCmdCom.owner.action, unitCmdCom.owner.template.actions['walk']);
			return;
		}
		this._super(dt, unitCmdCom);
	}
});

WalkCommandComponent = CommandComponent.extend({
	_init : function(unitCmdCom){
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
	}

	start : function(unitCmdCom){
		this._init(unitCmdCom);
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, unitCmdCom){
		
		if(unitCmdCom.direction == 0){
			//这里应调用end，而不是直接钦定stand_action
			//ActionUtil.next(gameObj, gameObj.template.actions.stand);
			unitCmdCom.owner.action.isEnd = true;
			return;
		}
		
		if(unitCmdCom.direction > Constant.CMD_DIRECTION_CHARGE){
			//指令有变化，应重新设定
			this._init(unitCmdCom);
		}
		
		this._super(dt, unitCmdCom);
	}
});