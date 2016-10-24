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
		 * 创建站立动作节点
		 */
		createStandAction : function(data){
			data.name = "stand";
			if(DataUtil.checkArrayNull(data.animate.frames)){
				cc.log("SimpleFactory.createStandAction error. frames is null.");
				return null;
			}
			if(!DataUtil.checkIsInt(data.animate.type)){
				data.animate.type = this._defaultAnimateType(data.animate.frames);
			}
			var action = Factory.createAction(data);
			ActionUtil.addSystem(action, ActionUtil.systems.stand[Constant.GAMEOBJECT_CHARACTER]);
			return action;
		},
		
		createWalkAction : function(data){
			data.name = "walk";
			if(DataUtil.checkArrayNull(data.animate.frames)){
				cc.log("SimpleFactory.createWalkAction error. frames is null.");
				return null;
			}
			if(!DataUtil.checkIsInt(data.animate.type)){
				data.animate.type = this._defaultAnimateType(data.animate.frames);
			}
			data.move.type = Constant.MOVE_BY_CMD;
			var action = Factory.createAction(data);
			return action;
		},
		
		/**
		 * 默认动画类型
		 * frames: 字符串数组
		 * 专为 stand,walk这样的action来提供默认动画类型
		 */
		_defaultAnimateType : function(frames){
			if(frames.length > 1){
				return Constant.ANIMATE_SCROLL;
			}
			return Constant.ANIMATE_STATIC;
		}
};