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
		createActionState : function(data, owner){
			if(!checkActionRight(data)){
				return null;
			}
			var actionState = new ActionState();
			actionState.init(data);
			if(Util.checkIsString(data,"action") && Container.actions[data.action]){
				actionState.frames = Container.actions[data.action].frames;
			}else{
				cc.log("createActionState error, action:[" + data.action + "] not found!");
				return null;
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
			
			if(!Util.checkNotNull(data)){
				cc.log("Factory createUnit error. data is null or undefined.");
				return null;
			}

			var unit = new Unit();
			unit.init(data);
			
			unit.actions = {};
			unit.actionStates = {};

			return unit;
		}
};

/**
 * 检查action是否满足可构建条件
 */
Factory.checkActionRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name") || !Util.checkIsInt(data, "state")){
		cc.log("createActionState error, lack of necessary data!");
		return false;
	}
}