/**
 * 移动逻辑系统
 */
MoveSystem = ActionSystem.extend({
	name : "move",
	
	start : function(gameObj, actionCom){
		//初始化速度和向量
		gameObj.coms.move.dx = actionCom.dx * gameObj.coms.view.vx;
		gameObj.coms.move.dy = actionCom.dy;
	},
	
	// 每帧移动公式：
	// 单位的dx = action的dx * 帧延时，因为数据设定是每秒移动距离，所以这里要乘以dt
	// 例如帧延时为200ms时， dx = 30 * 0.2 = 6px
	update : function(dt, gameObj, actionCom){
		//gameObj.coms.motion.dx = gameObj.coms.motion.vx * actionCom.dx * dt;
	},
	
	end : function(gameObj, actionCom){
		gameObj.coms.motion.dx = 0;
		gameObj.coms.motion.dy = 0;
	}
});

MoveCommandSystem = MoveSystem.extend({
	
	_command : null,
	
	start : function(gameObj, moveCom){
		this._command = gameObj.command;
		//左右方向不共存
		if(this._command.curr & Constant.CMD_RIGHT){
			gameObj.coms.move.dx = moveCom.dx;
			gameObj.coms.view.vx = 1;
		}else if(this._command.curr & Constant.CMD_LEFT){
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
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, gameObj, actionCom){
		this._command = gameObj.command;
		
		if(this._command.curr==0){
			ActionUtil.next(gameObj, gameObj.template.actions.stand);
			return;
		}
		
		//指令有变化，重新设定方向
		if(this._command.curr != this._command.last){
			this.start(gameObj, actionCom);
		}
		//每帧重新计算速度，感觉这一步可以优化的
		//gameObj.coms.move.dx = actionCom.dx * gameObj.coms.view.vx;
		//gameObj.coms.move.dy = actionCom.dy;
	}
});

/**
 * 更新坐标的系统（新版，暂不使用）
 * 因为调用setPosition会发生重绘操作，影响性能，所以不要在其他地方频繁用setPosition
 */
MotionUpdateSystem = System.extend({
	name : "move",
	execute : function(dt, component){
		if(component.dx !=0 || component.dy != 0){
			EngineUtil.setPosition(component.owner.coms.view.sprite, component);
		}
	}
});

/**
 * 根据输入指令移动
 */
MoveCommandSystemOld = MoveSystem.extend({
	
	_command : null,
	
	start : function(gameObj, moveCom){
		this._command = gameObj.command;
		//左右方向不共存
		if(this._command.curr & Constant.CMD_RIGHT){
			gameObj.coms.move.vx = 1;
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);		//暂时用这个办法
		}
		else if(this._command.curr & Constant.CMD_LEFT){
			gameObj.coms.move.vx = -1;
			//unit.viewCom.sprite.setFlippedX(true);
		}
		
		//上下方向也不共存
		if(this._command.curr & Constant.CMD_UP){
			gameObj.coms.move.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(this._command.curr & Constant.CMD_DOWN){
			gameObj.coms.move.vy = -1;	//同理，Y负轴是向下的
		}
	},

	//这一部分应该要更完善 2016.03.25
	update : function(dt, gameObj, actionCom){
		this._command = gameObj.command;
		
		if(this._command.curr==0){
			gameObj.actions.endFlag = true;
			//ActionUtil.preparedToChange(gameObj, gameObj.actions.names["stand"]);
			return;
		}
		
		//指令有变化，重新设定方向
		if(GameUtil.isChangeDirection(this._command)){
			//左右不共存
			if(this._command.curr & Constant.CMD_LEFT){
				gameObj.coms.motion.vx = -1;
				gameObj.coms.view.sprite._scaleX = -1;
			}
			else if(this._command.curr & Constant.CMD_RIGHT){
				gameObj.coms.motion.vx = 1;
				gameObj.coms.view.sprite._scaleX = 1;
			}
			//上下不共存
			if(this._command.curr & Constant.CMD_UP){
				gameObj.coms.motion.vy = 1;
			}
			else if(this._command.curr & Constant.CMD_DOWN){
				gameObj.coms.motion.vy = -1;
			}
		}
		//每帧重新计算速度，感觉这一步可以优化的
		gameObj.coms.move.dx = actionCom.dx * gameObj.coms.move.vx;
		gameObj.coms.move.dy = actionCom.dy * gameObj.coms.move.vy;
	}
});