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
			var template = this.createGameObjectTemplate(data);
			var action = ActionUtil.getCommonAction("characterStart");
			template.actions.start = action;
			
			//人物必须要有运动组件
			var motionCom = new UnitMotionComponent();
			template.coms[motionCom.name] = motionCom;
			
			//伤害组件
			if(DataUtil.checkNotNull(data,"hurt")){
				action = ActionUtil.actions.characterHurt();
				action.init(data, template);
			}
		}
};