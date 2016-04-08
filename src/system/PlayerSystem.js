/**
 *	player控制系统（暂定）
 */
PlayerSystem = System.extend({
	name : "player",
	tick : Constant.TICK_FPS30,
	key : 0,
	combo : [],
	maxLength : 6,

	//用于计算连续按键的时间间隔的
	comboTimeCount : 0,

	//连续按键的最大时间间隔(秒)
	comboTimeInteval : 1.5,

	//被控制的目标，Unit类型
	target : null,
	
	_command : null,

	start : function(){
		this.target = Service.Container.player.unit;
		this._command = this.target.command;
	},

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

	releaseKey : function(key){
		this.key = this.key & (~key);
	},

	pressKey : function(key){
		this.key = this.key | key;
		if(key==Constant.CMD_ATTACK_ONCE){
			this.addCombo("A");
		}
	},

	directionStart : function(command){
		//this.key = this.key | key;
		this._command.curr = this._command.curr | command;
		this._command.last = this._command.curr;
		/*if(key==Constant.CMD_UP){
			this.addCombo("U");
		}
		else if(key==Constant.CMD_DOWN){
			this.addCombo("D");
		}
		else if(key==Constant.CMD_LEFT){
			this.addCombo("L");
		}else{
			this.addCombo("R");
		}*/
	},
	
	directionUpdate : function(command){
		this._command.last = this._command.curr;
		this._command.curr = command;
	},
	
	directionEnd : function(){
		this._command.curr = 0;
	},

	checkCombo : function(){
		if(this.comboTimeCount > this.comboTimeInteval){
			this.combo.length = 0;
			this.fowardFlag = "X";
			this.comboTimeCount = 0;
			return false;
		}
		return true;
	},

	addCombo : function(keyStr){
		if(this.checkCombo() && this.combo.length >= this.maxLength){
			this.combo.shift();
		}
		//像DNF那样，左右方向就算反过来也可以执行的
		if(keyStr=="L" || keyStr == "R"){
			if(this.fowardFlag == "X"){
				this.fowardFlag = keyStr;
			}
			keyStr = this.fowardFlag==keyStr ? "F" : "B";
		}

		//shift是删除第一个，pop是删除最后一个
		this.combo.push(keyStr);
		//重新计时
		this.comboTimeCount = 0;
	},

	getComboStr : function(){
		if(this.checkCombo()){
			return this.combo.join("");
		}
		return null;
	}
});