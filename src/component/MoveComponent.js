/**
 * 匀速移动组件
 */
MoveComponent = Component.extend({
	name : "move",
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	
	init : function(data){
		
	},
	
	clone : function(){
		var com = new MoveComponent();
		com.dx = this.dx;
		com.dy = this.dy;
		com.dz = this.dz;
		return com;
	},
	
	start : function(unitMoveCom){
		//初始化速度和向量
		unitMoveCom.dx = this.dx * unitMoveCom.vx;
		unitMoveCom.dy = this.dy;
		ObjectManager.coms.addMoveNode(unitMoveCom);
	},
	
	update : function(dt, unitMoveCom){
		unitMoveCom.dx += this.dx * unitMoveCom.vx;
		unitMoveCom.dy += this.dy;
	},
	
	end : function(unitMoveCom){
		ObjectManager.coms.removeMoveNode(unitMoveCom);
		unitMoveCom.dx = 0;
		unitMoveCom.dy = 0;
	}
});

/**
 * 缓动类型的移动组件
 */
TweenMoveComponent = MoveComponent.extend({
	maxDx : 0,			//这三个代表最高速度
	maxDy : 0,
	maxDz : 0,
	clone : function(){
		var com = new TweenMoveComponent();
		com.dx = this.dx;
		com.dy = this.dy;
		com.dz = this.dz;
		com.maxDx = this.maxDx;
		com.maxDy = this.maxDy;
		com.maxDz = this.maxDz;
		return com;
	}
});