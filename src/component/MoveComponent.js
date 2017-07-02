/**
 * 匀速移动组件
 */
MoveComponent = Component.extend({
	name : "move",
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	
	start : function(unitMoveCom){
		//初始化速度和向量
		unitMoveCom.dx = this.dx * unitMoveCom.vx;
		unitMoveCom.dy = this.dy;
		//ObjectManager.coms.addMoveNode(unitMoveCom);
	},
	
	update : function(dt, unitMoveCom){
		unitMoveCom.dx += this.dx * dt * unitMoveCom.vx;
		unitMoveCom.dy += this.dy * dt;
	},
	
	end : function(unitMoveCom){
		//ObjectManager.coms.removeMoveNode(unitMoveCom);
		unitMoveCom.dx = 0;
		unitMoveCom.dy = 0;
	}
});

/**
 * 创建
 */
var mvVldt = null;
MoveComponent.prototype.create = function(data){
	if(!mvVldt){
		//初始化，添加move组件的验证
		mvVldt = [Validator.create("dx", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND),
	    		  Validator.create("dy", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND),
	    		  Validator.create("dz", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND)];
		this.addType("moveComponent", function(val, label){
			//不能三条轴向量都为0
			return this.validateObject(val, mvVldt, label) && 
				(val.dx !=0 || val.dy !=0 || val.dz != 0);
		});
	}
	if(!Validator.assertType(data, "moveComponent", "moveComponent")){
		cc.log("MoveMonponent.create error.");
		return null;
	}
	var move = new MoveComponent();
	//x,y,z的移动向量是以每秒移动xx为单位的，所以要换成以每毫秒移动xx，方便主系统循环运算。
	move.dx = data.dx ? data.dx / 1000 : 0;
	move.dy = data.dy ? data.dy / 1000 : 0;
	move.dz = data.dz ? data.dz / 1000 : 0;
	return move;
};

/**
 * 克隆
 */
MoveComponent.prototype.clone = function(moveComponent){
	var com = new MoveComponent();
	com.dx = moveComponent.dx;
	com.dy = moveComponent.dy;
	com.dz = moveComponent.dz;
	return com;
};


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