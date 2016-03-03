/**
 * 简易工厂接口，用于建造游戏组件。
 */
SimpleFactory = {
		
		/**
		 * 创建地图元素，中立组
		 *  tile,block,animate等
		 */
		createTile : function(data){
			var template = this.createGameObjectTemplate(data);
			var action = ActionUtil.getCommonAction("tileStart");
			template.actions.start = action;
			if(DataUtil.checkIsInt(data,"block") && data.block==Constant.BOOLEAN_TRUE){
				//判断有没有rect，。没有就用自身sprite的包围盒，这个暂时不做，默认用sprite的
			}
			return template;
		},
		
		/**
		 * 创建人物
		 */
		createCharacter : function(data){
			//人物必须要有stand动作
			if(!data.stand){
				cc.log("Factory.createCharacter error. stand action is necessary.");
				return null;
			}
			var template = Factory.createGameObjectTemplate(data);
			template.actions.start = ActionUtil.actions[Constant.GAMEOBJECT_CHARACTER];
			template.actions.stand = this.createStandAction(data.stand, template);
			return template;
		},
		
		createStandAction : function(data, template){
			data.name = "stand";
			var action = Factory.createAction(data);
			var component = ComponentUtil.createCommand(data.command);
			var system = ActionSystemUtil.actions.getCommand(component);
			ActionUtil.build(action, component, system);
			return action;
		}
		
};