/**
 * 	一般的固体tile，没有特殊逻辑，只有固体属性和动画属性，不会加入action节点
 */
TileStartAction = ActionState.extend({
	name : "start",
	
	start : function(unit){
		if(this.coms.animate){
			// add node
			//以后这一块都想用gif代替了
		}
		//add collideCom
		if(this.coms.block){
			// add node
		}
	},
	
	end : function(unit){
		//remove all coms
	},

	init : function(data){
		this.coms = {};
		if(DataUtil.checkNotNull(data,"animate")){
			//以后这一块都想用gif代替了
			this.createAnimate(data.animate, template);
		}
		if(DataUtil.checkNotNull(data,"block")){
			this.createCollide(data.rect, template);
		}
	}
});