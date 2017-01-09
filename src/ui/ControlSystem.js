/**
 *	玩家操作控制系统
 */
ControlSystem = {
	
	comboKey : 0,

	//用于计算连续按键的时间间隔的
	lastTime : 0,

	//连续按键的最大时间间隔(秒)
	maxInputInteval : 1.5,
	
	maxCombo : 2048,	// 4 * 3位二进制	111,111,111,111	2048是最高位的1
	
	rearCut : 511,		//	尾部切除	000,111,111,111

	//被控制的目标，Unit类型,avatar
	target : null,
	
	_command : null,

	init : function(){
		this.target = Service.Gobal.player.unit;
		this._command = this.target.command;
	},

	pressDirection : function(command){
		this._command.direction = command;
		
		//暂时只支持四方向
		if(command!=1&&command!=2&&command!=4&&command!=8){
			return;
		}
		
		//计算间隔，加入到连续指令中
		if(Service.gameTime - this.lastTime < this.maxInputInteval){
			//如果连续指令存储满了，就把最前面的清掉，把新的加入到尾部
			if(this.comboKey > this.maxCombo){
				this.comboKey = this.comboKey & this.rearCut;
			}
		}else{
			this.comboKey = 0;
		}
		//按右往左排放，是为了方便二进制运算
		this.comboKey = this._toComboKey(command) << 3 + this.comboKey;
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
	
	directionUpdate : function(command){
		this._command.last = this._command.curr;
		this._command.curr = command;
	},
	
	pressAttack : function(){
		this._command.comboKey = this.comboKey;
		this._command.attack = Constant.CMD_PLAYER_ATTACK;
		this.comboKey = 0;
	},
	
	releaseAttack : function(){
		this._command.attack = 0;
	}
};