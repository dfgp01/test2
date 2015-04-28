/**
 *  控制器
 */

Controller = {

	key : 0,					//当前指令
	interval : 1000,		//有效间隔
	comboKey : 0,		//组合键
	_keyArr : [],
	_maxLength : 6,		//最大组合数
	_lastTime : 0,
	_currTime : 0,
	
	pressKey : function(key){
		this.key | key;
	},
	releaseKey : function(key){
		this.key & (~key);
	},
	getKey : function(){
		return this.key;
	},
	getCombo : function(){
		return this._keyArr.join("");
	},
	addCombo : function(key){
		if(this._currTime - this._lastTime < this.interval){
			if(this._keyArr.length >= this._maxLength){
				this._keyArr.shift();
			}
			this._keyArr.push(key);
		}else{
			this._keyArr.length = 0;
			this._currTime = 0;
		}
		this._lastTime = this._currTime;
	}
};

var onTouchBegin = function(touch, event){
	//加上if event.getSource 判断
	Controller.pressKey(8);
	Controller.addCombo(8);
}

var onTouchEnd = function(touch, event){
	
}