/**
 * 移动逻辑系统
 */
MoveSystem = ActionSystem.extend({
	name : "move",
	
	start : function(unitCom, actionCom){
		//初始化速度和向量
		unitCom.dx = actionCom.dx * unitCom.vx;
		unitCom.dy = actionCom.dy;
		ObjectManager.coms.addMoveNode(unitCom);
	},
	
	// 每帧移动公式：
	// 单位的dx = action的dx * 帧延时，因为数据设定是每秒移动距离，所以这里要乘以dt
	// 例如帧延时为200ms时， dx = 30 * 0.2 = 6px
	// 2016.10.21 现在我用另一种机制解决这个问题了。
	update : function(dt, unitCom, actionCom){
		//gameObj.coms.motion.dx = gameObj.coms.motion.vx * actionCom.dx * dt;
		unitCom.dx += actionCom.dx * unitCom.vx;
		unitCom.dy += actionCom.dy;
	},
	
	end : function(unitCom, actionCom){
		ObjectManager.coms.removeMoveNode(unitCom);
		unitCom.dx = 0;
		unitCom.dy = 0;
	}
});

/*WalkSystem = MoveSystem.extend({

	_command : null,
	_cmdRight : Constant.CMD_RIGHT,
	_cmdLeft : Constant.CMD_LEFT,
	_cmdUp : Constant.CMD_UP,
	_cmdDown : Constant.CMD_DOWN,

	start : function(unitCom, actionCom){
		this._command = unitCom.owner.command;
		//左右方向不共存
		if(this._command.curr & this._cmdRight){
			gameObj.coms.move.dx = moveCom.dx;
			gameObj.coms.view.vx = 1;
		}else if(this._command.curr & this._cmdLeft){
			gameObj.coms.move.dx = moveCom.dx * -1;
			gameObj.coms.view.vx = -1;
		}
		
		//上下方向也不共存
		if(this._command.curr & Constant.CMD_UP){
			gameObj.coms.move.dy = moveCom.dy;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(this._command.curr & Constant.CMD_DOWN){
			gameObj.coms.move.dy = moveCom.dy * -1;	//同理，Y负轴是向下的
		}
		
		ComponentManager.addMoveNode(unitCom);
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, gameObj, actionCom){
		this._command = gameObj.command;
		
		//这里应调用end，而不是直接钦定下个action
		if(this._command.curr==0){
			//ActionUtil.next(gameObj, gameObj.template.actions.stand);
			return;
		}
		
		//指令有变化，重新设定方向
		if(this._command.curr != this._command.last){
			this.start(gameObj, actionCom);
		}
		
		//每帧重新计算，感觉这一步可以优化的
		if(this._command & this._cmdRight){
			if(unitCom.vx==-1){
				unitCom.vx = 1;
				unitCom.owner.coms.view.vx = 1;
			}
			unitCom.dx += actionCom.dx;
		}else if(this._command & this._cmdLeft){
			if(unitCom.vx==1){
				unitCom.vx = -1;
				unitCom.owner.coms.view.vx = -1;
			}
			unitCom.dx -= actionCom.dx;
		}
		if(this._command & this._cmdUp){
			if(unitCom.vy==-1){
				unitCom.vy = 1;
			}
			unitCom.dy += actionCom.dy;
		}else if(this._command & this._cmdDown){
			if(unitCom.vy==1){
				unitCom.vy = -1;
			}
			unitCom.dy -= actionCom.dy;
		}
	}
});*/