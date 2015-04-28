/**
 * 基础动作状态
 */

WalkAction = ActionState.extend({
	face : 1,		//1为向右，-1为向左
	start : function(){
		//改变面向等
		this.owner.scaleX *= this.face;
		this._super();
	},
	run : function(dt, key){
		if(!key){
			this.owner.updateState();
		}else if(key & 15){
			//1111 二进制运算
			if(key & 8){
				this.owner.y += this.owner.dy;
			}
			if(key & 4){
				this.owner.y -= this.owner.dy;
			}
			if(key & 3){
				this.owner.x += this.owner.speed * this.face;
			}
		}else{
			//find action
			
		}
		
		this._super();
	}
});