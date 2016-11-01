
/**
* 一般单位站立时的动作主系统
*/
StandActionSystem = ActionSystem.extend({
	name : "stand",
	_command : null,
	update : function(dt, gameObj, actionCom){
		this._command = gameObj.command.curr;
		//检测是否按下方向键
		if(this._command & 8){
			ActionUtil.next(gameObj, gameObj.template.actions.walk);
			//这里return是保证代码不会跑到下面的if语句中，不然就乱套了
			return;
		}
	}
});

/**
 * 指令系统，默认为攻击指令触发
 */
CommandSystem = ActionSystem.extend({
	name : "command",
	_key : 0,
	
	update : function(gameObj, commandCom){
		//1.根据key查找table
		//2.跳转action
		//3.清除key
		if(gameObj.command.curr=='attack'){//暂时这么写
			this._key = gameObj.command.key;
			
			if(this._key == 0){
				ActionUtil.next(gameObj, commandCom.table["#1"]);
			}
			var flag = 0;
			//2^15=32768, 2^12=4096, 2^9=1024, 2^6=64, 2^3=8
			for(var i=15;i>1;i-=3){
				flag = 2^i;
				if(this._key & flag){
					flag -= 1;
					break;
				}
			}
			var next = null;
			while(this._key>1){
				next = commandCom.table["#"+this._key]
				if(next){ 
					break;
				}
				flag = flag>>3;
				this._key = flag + 1 + (this.key&flag);
			}
			if(next==null){
				next = commandCom.table["#1"];
			}
			ActionUtil.next(gameObj, next);
			return;
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