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
		this.setRect(collideProperty.rect, collideProperty.owner.view);
		ObjectManager.nodes.addCollideNode(collideProperty);
	},

	update : function(dt, collideProperty){
		this.setRect(collideProperty.rect, collideProperty.owner.view);
	},
	
	setRect : function(rect, view){
		rect.x = view.vx < 0 ? view.x - this.rect.x - this.rect.width : view.x + this.rect.x;
		rect.y = (view.y + this.rect.y);
		rect.x2 = rect.x + rect.width;
		rect.y2 = rect.y + rect.height;
	}
});