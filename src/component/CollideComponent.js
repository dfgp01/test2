/**
 * 矩形交互组件，如会阻碍通行、可拾取、可接触等
 */
CollideComponent = Component.extend({
	name : "collide",
	rect : null,	//原型矩形框
	maxNum : 0,		//最大交叠数量
	check : null,	// func return true
	
	init : function(data){
		this.rect = data.rect;
		this.maxNum = data.maxNum;
	},
	
	start : function(collideProperty){
		
	},

	update : function(dt, collideProperty){
		
	}
});