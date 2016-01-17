/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个单位模板
		 */
		createUnitTemplate : function(data){

			//必要性检查
			// !DataUtil.checkIsString(data, "res") 这个检查不应该写在这里，应该有个统一的资源表要填
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name")){
				cc.log("create Unit error, lack of necessary data! data is null or noname.");
				return null;
			}
			if(!DataUtil.checkIsInt(data, "type")){
				cc.log("create UnitTemplate error, field:type must int.");
				return null;
			}
			if(!DataUtil.checkNotNull(data, "actions")){
				cc.log("create UnitTemplate error, must has actions.");
				return null;
			}

			var unitTemplate = new UnitTemplate();
			
			//其他初始化操作，通常是子类实现
			unitTemplate.init(data);

			return unitTemplate;
		},

		/**
		 * 创建一个动作节点
		 */
		createActionState : function(data, template){
			
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}

			if(!DataUtil.checkNotNull(data, "animate") && DataUtil.checkArrayNull(data.animate, "frames")){
				cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
				return null;
			}
			
			cc.log("info: creating action:[" + data.name + "].");
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.init(data);
			
			//设置key
			actionState.key = DataUtil.checkIsString(data,"key") == true ? data.key : Constant.DIRECT_CHILDNODE;
			//设置状态
			actionState.state = DataUtil.checkIsInt(data,"state") == true ? data.state : 0;
			//初始化动作组件系统
			GameUtil.buildActionSys(data, actionState);
			
			return actionState;
		},
		
		/**
		 * 创建自定义的Action类
		 */
		createCustomAction : function(data, actClass){
			var actionState = new actClass();
			//自定义的Action类需要自行指定name
			actionState.init(data);
			return actionState;
		}
		
};