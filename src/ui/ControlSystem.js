/**
 *	玩家操作控制系统
 */
ControlSystem = {
	
	comboKey : 0,

	//用于计算连续按键的时间间隔的
	lastTime : 0,

	//连续按键的最大时间间隔(秒)
	maxInputInteval : 1.5,
	
	maxFlag : 8888,	//这里表示最多只能连续存储四次方向键
	
	_command : null,
	
	_unit : null,	//被控制的目标
	
	score : 0,

	init : function(){
		var _self = this;
		EventDispatcher.addEventListener(Constant.EVT_PLAYER_INITIALIZED, function(evt){
			_self._unit = evt.unit;
			_self._command = _self._unit.propertys.command;
		});
		EventDispatcher.addEventListener(Constant.EVT_PLAYER_INPUT, function(evt){
			switch(evt.type){
			case Constant.INPUT_TYPE_DIRECTION :
				_self.pressDirection(evt.value);
				break;
			default:
				return;
			}
		});
	},

	pressDirection : function(command){
		this._command.direction = command;
		
		//计算间隔，加入到连续指令中
		if(Service.gameTime - this.lastTime < this.maxInputInteval){
			if(this.comboKey >= this.maxFlag){
				this.comboKey = this.comboKey - this.comboKey/1000*1000;
			}
		}else{
			this.comboKey = 0;
		}
		//这是一条很复杂的运算公式
		//this.comboKey = this.comboKey << this.step + this._toComboKey(command) + (1<<(this.index*this.step));
		this.comboKey = this.combokey * 10 + this._toComboKey(command);
		this.lastTime = Service.gameTime;
	},
	
	releaseDirection : function(){
		this._command.direction = 0;
	},
	
	_toComboKey : function(command){
		switch(command){
		case Constant.CMD_RIGHT:
			return Constant.COMBO_KEY_FRONT;
		case Constant.CMD_LEFT:
			return Constant.COMBO_KEY_BACK;
		case Constant.CMD_UP:
			return Constant.COMBO_KEY_UP;
		case Constant.CMD_DOWN:
			return Constant.COMBO_KEY_DOWN;
		default:
			return 0;
		}
	},
	
	pressAttack : function(){
		this._command.input = this.comboKey;//this._toUnitInput();
		this._command.attack = Constant.CMD_PLAYER_ATTACK;
		this.comboKey = 0;
		this.index = 0;
	},
	
	releaseAttack : function(){
		this._command.attack = 0;
	},
	
	_toUnitInput : function(){
		var input = 0;
		var first = -1;
		if(this.index > 0){
			for(var i=this.index; i>0; i--){
				var seg = (this.cutFlag << i*this.step) & this.comboKey;
				if(seg == Constant.COMBO_KEY_FRONT || seg == Constant.COMBO_KEY_BACK){
					if(first < 0){
						first = seg;
					}
					if(first == Constant.COMBO_KEY_BACK){
						seg = !seg;
					}
				}
				input += seg << (this.step*i);
			}
		}
		return input;
	}
};