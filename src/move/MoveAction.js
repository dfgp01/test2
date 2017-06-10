/**
 * 匀速移动组件
 */
MoveAction = Action.extend({
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	
	start : function(unit){
		//初始化速度和向量
        var move = unit.properties.move;
        var view = unit.properties.view;
		move.dx = this.dx * view.vx;
		move.dy = this.dy;
		//ObjectManager.coms.addMoveNode(unitMoveCom);
	},
	
	update : function(dt, unit){
        var move = unit.properties.move;
        var view = unit.properties.view;
		move.dx += this.dx * dt * view.vx;
		move.dy += this.dy * dt;
	},
	
	end : function(unit){
		//ObjectManager.coms.removeMoveNode(unitMoveCom);
        var move = unit.properties.move;
		move.dx = 0;
		move.dy = 0;
	}
});

/**
 * 创建
 */
var mvVldt = null;
MoveAction.prototype.create = function(data){
	if(!mvVldt){
		//初始化，添加move组件的验证
		mvVldt = [Validator.create("dx", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND),
	    		  Validator.create("dy", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND),
	    		  Validator.create("dz", "number", false, -NumericalConstant.MAX_MOVE_VAL_PERSECOND, NumericalConstant.MAX_MOVE_VAL_PERSECOND)];
		this.addType("moveAction", function(val, label){
			//不能三条轴向量都为0
			return this.validateObject(val, mvVldt, label) && 
				(val.dx !=0 || val.dy !=0 || val.dz != 0);
		});
	}
	if(!Validator.assertType(data, "moveAction", "moveAction")){
		cc.log("MoveAction.create error.");
		return null;
	}
	var move = new MoveAction();
	//x,y,z的移动向量是以每秒移动xx为单位的，所以要换成以每毫秒移动xx，方便主系统循环运算。
	move.dx = data.dx ? data.dx / 1000 : 0;
	move.dy = data.dy ? data.dy / 1000 : 0;
	move.dz = data.dz ? data.dz / 1000 : 0;
	return move;
};