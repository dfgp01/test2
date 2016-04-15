/**
 *	player控制系统（暂定）
 */
PlayerSystem = System.extend({
	name : "player",
	tick : Constant.TICK_FPS30,
	key : 0,

	//用于计算连续按键的时间间隔的
	lastTime : 0,

	//连续按键的最大时间间隔(秒)
	maxInputInteval : 1.5,

	//被控制的目标，Unit类型,avatar
	target : null,
	
	_command : null,

	start : function(){
		this.target = Service.Container.player.unit;
		this._command = this.target.command;
	},

	/**
	 * 暂时废弃
	 */
	update : function(dt){
		this.target.cmd = 0;

		//如果按下了攻击键，从单击状态变为持续按住状态，以后可能加个缓冲计时
		//方向键暂时不用判断单击还是按住的状态
		if(this.key & Constant.CMD_ATTACK_ONCE){
			//把二进制最后两位变成10，暂时没想到更好的办法
			this.key = this.key & (~Constant.CMD_ATTACK_ONCE) | Constant.CMD_ATTACK_HOLD_ON;
		}
		//连按系统时间间隔叠加
		if(this.combo.length>0){
			this.comboTimeCount += dt;
		}

		if(this.key > 0){
			this.target.cmd = this.key;
		}
	},

	_maxFlag = 32768; //2^15, 1000-0000-0000-0000，可存放5个连续指令，每个方向指令是0~7，三位二进制数
	_rearFlag = 4095; //0000-111-111-111-111
	pressDirection : function(command){
		//计算间隔，加入到连续指令中
		if(this.key != 0 && Service.gameTime - this.lastTime < this.maxInputInteval){
			//如果连续指令存储满了，就把最前面的清掉，把新的加入到尾部
			if(this.key & this._maxFlag){
				this.key = this._maxFlag + (this.key & this._rearFlag)<<3) + command;
			}else{
				this.key = this.key<<3 + command;
			}
		}else{
			//初始化连续指令
			this.key = 1<<3 + command;
		}
		this.lastTime = Service.gameTime;
		this._command.key = this.key;
		this._command.curr = command | 8;
		this._command.last = this._command.curr;
	},
	
	releaseDirection : function(){
		//将方向指令位置0
		this._command.curr = this._command.curr>>4<<4;
	},
	
	directionUpdate : function(command){
		this._command.last = this._command.curr;
		this._command.curr = command;
	}
});