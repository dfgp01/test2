/**
 * 动作节点系统，也是重要的逻辑系统之一
 */
ActionUpdateSystem = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,
	_currObj : null,
	_currAct : null,

	execute : function(dt, actionCom){
		if(actionCom.endFlag){
			actionCom.current.end(actionCom.owner);
			if(actionCom.next != null){
				actionCom.current = actionCom.next;
				actionCom.next = null;//还原为空状态，原因你懂，不信的话把这句注释看看。
				actionCom.current.start(actionCom.owner);
			}else{
				//还有重置逻辑以后补上
			}
			actionCom.endFlag = false;
		}else{
			actionCom.current.update(dt, actionCom.owner);
		}
	},
	
	end : function(){
		//remove
	}
});

/**
* 一般单位站立时的动作主系统
*/
StandActionSystem = ActionSystem.extend({
	name : "stand",
	_command : null,
	update : function(dt, gameObj, actionCom){
		this._command = gameObj.command.curr;
		if(this._command != 0){
			//检测是否按下方向键
			if(this._command & Constant.CMD.ALL_DIRECTION){
				ActionUtil.next(gameObj, gameObj.template.actions.walk);
				//这里return是保证代码不会跑到下面的if语句中，不然就乱套了
				return;
			}
		}
	}
});

/**
 * 移动逻辑系统
 */
MotionSystem = ActionSystem.extend({
	name : "motion",
	
	start : function(gameObj, actionCom){
	},
	
	// 每帧移动公式：
	// 单位的dx = action的dx * 帧延时，因为数据设定是每秒移动距离，所以这里要乘以dt
	// 例如帧延时为200ms时， dx = 30 * 0.2 = 6px
	update : function(dt, gameObj, actionCom){
		gameObj.coms.motion.dx = gameObj.coms.motion.vx * actionCom.dx * dt;
		gameObj.coms.motion.dy = gameObj.coms.motion.vy * actionCom.dy * dt;
	},
	
	end : function(gameObj, actionCom){
		gameObj.coms.motion.vx = 0;
		gameObj.coms.motion.vy = 0;
		gameObj.coms.motion.dx = 0;
		gameObj.coms.motion.dy = 0;
	}
});

/**
 * 人物行走动作的操作系统，此系统要继承MotionSystem，实现自定义的运动逻辑
 */
WalkMotionSystem = MotionSystem.extend({
	start : function(gameObj, actionCom){
		//左右方向不共存
		if(gameObj.cmd & Constant.CMD.RIGHT){
			gameObj.coms.motion.vx = 1;
			//unit.viewCom.sprite._scaleX = 1;
			//unit.viewCom.sprite.setFlippedX(false);		//暂时用这个办法
		}
		else if(gameObj.cmd & Constant.CMD.LEFT){
			gameObj.coms.motion.vx = -1;
			//unit.viewCom.sprite.setFlippedX(true);
		}
		//上下方向也不共存
		if(gameObj.cmd & Constant.CMD.UP){
			gameObj.coms.motion.vy = 1;	//注意，在openGL坐标系中，起点在屏幕左下角，Y正轴是向上的
		}
		else if(gameObj.cmd & Constant.CMD.DOWN){
			gameObj.coms.motion.vy = -1;	//同理，Y负轴是向下的
		}
	},

	//这一部分应该要更完善 2015.10.09
	update : function(dt, gameObj, actionCom){
		if(!(gameObj.cmd & Constant.CMD.ALL_DIRECTION)){
			ActionUtil.preparedToChange(gameObj, gameObj.actions.names["stand"]);
			return;
		}

		//行走中改变左右方向的，虽然现在不支持，但以后肯定会有的
		if(gameObj.coms.motion.vx = 1 && gameObj.cmd & Constant.CMD.LEFT){
			gameObj.coms.motion.vx = -1;
			gameObj.coms.view.sprite._scaleX = -1;
		}
		else if(gameObj.coms.motion.vx = -1 && gameObj.cmd & Constant.CMD.RIGHT){
			gameObj.coms.motion.vx = 1;
			gameObj.coms.view.sprite._scaleX = 1;
		}

		if(gameObj.coms.motion.vy = -1 && gameObj.cmd & Constant.CMD.UP){
			gameObj.coms.motion.vy = 1;
		}
		else if(gameObj.coms.motion.vy = 1 && gameObj.cmd & Constant.CMD.DOWN){
			gameObj.coms.motion.vy = -1;
		}
		
		//用父类的逻辑
		this._super(dt, gameObj, actionCom);
		
		//因为一般角色的步行速度是会受BUFF影响的
		gameObj.coms.motion.dx *= gameObj.coms.motion.speedFactor;
		gameObj.coms.motion.dy *= gameObj.coms.motion.speedFactor;
	},

});

/**
*	跳跃动作系统
*/
JumpActionSystem = ActionSystem.extend({
	name : "jump",
	
	start : function(unit){
		unit.motionCom.dy = this.speedCom.factorH * this.motionCom.dh;
		unit.viewCom.groundY = unit.viewCom.sprite.getPositionY();
		unit.actionsCom.state = unit.actionsCom.state | Constant.ACTION_STATE.AIR;
	},
	
	update : function(dt, unit){
		
	},
	
	end : function(unit){
		unit.actionsCom.state = unit.actionsCom.state & ~(Constant.ACTION_STATE.AIR);
	}
});

/**
 * 最初的碰撞系统，只检测指定帧，有效碰撞1次
 */
CollideSystem = ActionSystem.extend({
	name : "collide",
	
	start : function(gameObj, collideCom){
		gameObj.coms.collide.cost = {};
		gameObj.coms.collide.targets.length = 0;
		gameObj.coms.collide.mask = 0;
		var mask = 0;
		if(collideCom.mask & Constant.Collide.Type.FRIEND){
			mask = mask | (Constant.Group.ALL_TEAM_MASK & Service.findGroup(gameObj.group).mask);
		}
		if(collideCom.mask & Constant.Collide.Type.ENEMY){
			mask = mask | ~(Constant.Group.ALL_TEAM_MASK & Service.findGroup(gameObj.group).mask);
		}
		if(collideCom.mask & Constant.Collide.Type.BLOCK){
			mask = mask | Constant.Group.BLOCK.mask;
		}
		gameObj.coms.collide.mask = mask;
		
		//根据gameObj获取rect的真实位置
		gameObj.coms.collide.rect = EngineUtil.getRectWithNode(gameObj.coms.view.sprite, collideCom.rect);
	},
	
	update : function(dt, gameObj, collideCom){
		//到达指定帧
		if(gameObj.coms.view.frameIndex == collideCom.frameIndex){
			//循环所有队列所有单位
			//标注"中奖"的人，gameObj.coms.collide.cost，可用于下次重复检验
			var mask = gameObj.coms.collide.mask;
			var groups = Service.Container.groups;
			gameObj.coms.collide.flag = false;
			gameObj.coms.collide.targets.length = 0;
			for(var i in groups){
				if(mask & groups[i].mask){
					var list = groups[i].list;
					for(var j in list){
						if(!gameObj.coms.collide.cost[list[j].id] && EngineUtil.checkCollide(rect, list[j].coms.view)){
							gameObj.coms.collide.targets.push(list[j]);
							//标注"中奖"的人，用于下次重复检验
							gameObj.coms.collide.cost[list[j].id] = 1;
						}
					}
				}
			}
			gameObj.coms.collide.flag == gameObj.coms.collide.targets.length > 0 ? true : false;
		}
	}
});

HitSystem = ActionSystem.extend({
	name : "hit",
	
	start : function(gameObj, hitCom){
		gameObj.coms.hit.flag = false;
	},
	
	update : function(dt, gameObj, hitCom){
		//只有碰撞成功了才执行，而且碰撞系统必须在此系统前运行
		if(gameObj.coms.collide.flag){
			var evt = EvtTemplate.hit(gameObj, hitCom, gameObj.coms.collide.targets);
			Service.dispatchEvent(evt);
		}
	}
});

/**
 * 阶段性动作系统，动作组形式
 */
ActionPhaseSystem = ActionSystem.extend({
	name : "phase",
	list : null,		//ActionSystem子类对象
	
	ctor : function(){
		this.list = [];
	},
	
	start : function(gameObj, phaseCom){
		var phase = gameObj.actions.phase;
		this.list[phase].start(gameObj, phaseCom.list[phase]);
	},
	
	add : function(system){
		this.list.push(system);
	}
});

