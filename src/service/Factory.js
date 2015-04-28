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

		//创建一个Action
		createAction : function(data){

			if(!Util.checkNotNull(data,"data") && !Util.checkIsString(data.name, "name")){
				cc.log("Factory.createAction error");
				return;
			}
			var action = Container.getAction(data.name);
			if(action){
				cc.log("Factory.createAction error. action:"+data.name + " has exists!");
				return;
			}
			if(Util.checkIsNum(data.type, "type") && !Util.checkArrayNull(data.frames, "frames")){
				var list = [];
				for(var i in data.frames){
					var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
					if(frame){
						list.push(frame);
					}else{
						cc.log("action:" + data.name + " frame:" + data.frames[i] + " not found");
					}
				}
				//action数据实体的frames列表直接存储cc.SpriteFrame
				data.frames = list;
				Container.actions[data.name] = data;
				cc.log("Container add action:" + data.name);
				return;
			}
		},

		//创建一个动作节点
		createActionState : function(data){
			var actionState = null;
			if(!Util.checkNotNull(data, true) || !Util.checkIsString(data.name, true) || Util.checkIsNum(data.state, true)){
				cc.log("createActionState error, lack of necessary data!");
				return null;
			}
			actionState = new ActionState();
			actionState.init(data);
			if(Util.checkIsString(data.action, "action:")){
				var oldAct = Container.getAction(data.action);
				if(oldAct){
					actionState.frames = Container.getAction(data.action).frames;
				}else{
					cc.log("createActionState error, action:[" + data.action + "] not found!");
					return null;
				}
			}else{
				if(Util.checkArrayNull(data.frames, true)){
					cc.log("createActionState error, frames is null~!");
					return null;
				}
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

			if(data.repeat != undefined && data.repeat != 0){
				if(data.repeat == -1){
					//state.actions.push(new RepeatForeverFunc());
				}else{
					//state.actions.push(repeatFunc);
				}
			}

			return actionState;
		},

		//创建一个Unit
		createUnit : function(data){
			
			if(!Util.checkNotNull(data, "data")){
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