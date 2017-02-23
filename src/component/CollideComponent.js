/**
 * 矩形交互组件，如会阻碍通行、可拾取、可接触等
 */
CollideComponent = Component.extend({
	name : "collide",
	rect : null,	//原型矩形框
	max : 0,		//最大交叠数量
	callback : null,
	
	init : function(data){
		this.rect = data.rect;
		this.max = data.max;
	}
});