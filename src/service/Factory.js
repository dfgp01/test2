/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		//创建一个Frame，这个方法暂时不用
		createFrame : function(dataName){
			var data = Container.getProperty(dataName);
			if(data == null){
				log += "createFrame() frame: " + dataName + "not found~! \n";
				return null;
			}
			var frame = Container.frames[data.source];	//Container.getFrame(data.source); 使用这种方法会产生日志
			if(frame){
				log += "frame: " + frame.name + " has already create since before~! \n";
				return frame;
			}
			if(Container.checkNull(data.position) && Container.checkNull(data.position.length) && data.position.length==4){
				log += data.source + " position undefined or not be [x,y,width,height] format";
				return null;
			}

			frame = new Frame();
			frame.init(data);
			//加入到缓存容器中
			Container.frames[frame.name] = frame;
			return frame;
		},

		/**
		 * 创建一个动作节点
		 */
		createActionState : function(data, characterName){
			if(!checkActionRight(data)){
				return null;
			}
			var actionState = new ActionState();
			//actionState.init(data);
			actionState.name = data.name;

			if(Util.checkIsString(data,"action")){
				//寄存器里面的actions结构举例：DFL_stand, DFL_attack1, 由 角色名_动作名 组成
				var actRef = Container.actions[characterName + "_" + data.action];
				if(actRef){
					actionState.frames = actRef.frames;
				}else{
					cc.log("createActionState error, action:[" + characterName + "_" + data.action + "] not found!");
					return null;
				}
			}

			if(!Util.checkArrayNull(data, "frames")){
				//cc.log("createActionState error, frames is null~!");
				var list = [];
				for(var i in data.frames){
					var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
					if(frame){
						list.push(frame);
					}else{
						cc.log("action:" + data.name + " frame:" + data.frames[i] + " not found");
						return null;
					}
				}
				actionState.frames = list;
			}
			Container.actions[actionState.name] = actionState;
			return actionState;
		},

		/**
		 * 创建一个Unit
		 */
		createUnit : function(data){
			
			if(!this.checkUnitRight(data)){
				return null;
			}

			var unit = new Unit();
			//unit.init(data);
			unit.name = data.name;
			unit.res = data.res;

			unit.viewCom :  = new ViewComponent();
			unit.hitCom : new HitPropertiesComponent();
			unit.hurtCom : new HurtPropertiesComponent();
			unit.speedCom : new SpeedComponent();
			unit.actionsCom : new ActionsComponent();	

			return unit;
		}
};

/**
 * 检查action是否满足可构建必要条件
 */
Factory.checkActionRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name") || !Util.checkIsInt(data, "state")){
		cc.log("create ActionState error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkIsString(data,"action") && Util.checkArrayNull(data, "frames")){
		cc.log("createActionState:" + data.name + " error, action or frames has one at lease!");
		return false;
	}
}

/**
 * 检查unit是否满足可构建必要条件
 */
Factory.checkUnitRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name")){
		cc.log("create Unit error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create Unit error, must has actions.");
		return false;
	}
}