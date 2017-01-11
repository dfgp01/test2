/**
 * 游戏单位动作，带动画的那种
 */
GameAction = ActionState.extend({
	state : 0,
	type : 0,
	view : null,
	
	init : function(data){
		this._super(data);
	},
	
	//加载时
	start : function(unit){
		this._super(unit);
		this.view.start(unit.view);
	},
	
	//运行时
	update : function(dt, unit){
		this._super(dt, unit);
		this.view.update(dt, unit.view);
	}
});