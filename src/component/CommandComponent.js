/**
 * 指令反馈组件
 */
CommandComponent = Component.extend({
	name : "command",
	type : 0,
	table : null,
	list : null,	//临时存放data数据
	
	_max : 8888,	//存储四个方向位的最大值（8,4,2,6）或者8方向(加上7,9,1,3)
	_front : 6,
	_back : 4,
	
	init : function(data){
		this.table = {};
		if(DataUtil.checkArrayNotNull(data.list)){
			this.list = data.list;
		}
	},
	
	build : function(actionList){
		for(var i in actionList){
			var action = actionList[i];
			if(this._isAvailable(action.input)){
				this.table[action.input] = action;
				this.table[this._symmetry(action.input)] = action;	//对称处理
			}
		}
	},
	
	_isAvailable : function(input){
		if(input <= 0 || input >= this._max){
			cc.log("CommandComponent.build error. input is wrong number.");
			return false;
		}
		if(this.table[input]){
			cc.log("CommandComponent.build error. duplicate input:" + input);
			return false;
		}
		return true;
	},
	
	update : function(dt, unitCmd){
		if(unitCmd.attack & Constant.CMD_AI_ATTACK){
			var action = this._find(unitCmd.input);
			if(action){
				ActionUtil.next(unitCmd.owner.actions, action);
				unitCmd.comboKey = 0;
			}
		}
	},
	
	_find : function(comboKey){
		var key = comboKey;
		var index = 1;
		//求一共几位数
		while(key/=10){
			index*=10;
		}
		do{
			if(this.table[comboKey])return this.table[comboKey];
			index/=10;
		}while(comboKey -= comboKey/index*index);
		return null;
	},
	
	//生成对称指令，主要是4-6相反
	_symmetry : function(input){
		var seg = 0;
		var result = 0;
		var index = 0;
		do{
			seg = input % 10;
			if(seg == this._front){
				seg = this._back;
			}else if(seg == this._back){
				seg = this._front;
			}
			result += seg * index;
			index *= 10;
		}while(input/=10);
		return result;
	}
	
	//对称处理（这个有点玄）
	/*_symmetry : function(comboKey){
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
	}*/
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