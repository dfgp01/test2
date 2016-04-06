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
				cc.log("SimpleFactory.createCharacter error. stand action is necessary.");
				return null;
			}
			var template = Factory.createGameObjectTemplate(data);
			template.actions.start = ActionUtil.actions.start[Constant.GAMEOBJECT_CHARACTER];
			template.actions.stand = this.createStandAction(data.stand);
			template.actions.walk = this.createWalkAction(data.walk);
			
			/**
			 * 统一构建template的组件
			 */
			var keys = {};
			var action = null;
			for(var i in template.actions){
				action = template.actions[i];
				for(var kName in action.coms){
					if(!keys[kName]){
						keys[kName] = kName;
					}
				}
				//顺便初始化切换组件
				if(action.coms.switchable){
					var k = action.coms.switchable.keys;
					var name = null;
					for(var cmd in k){
						name = k[cmd];
						if(template.actions[name]){
							k[cmd] = template.actions[name];
							//未完。。。
						}else{
							cc.log("build switchable error. action:"+name+" not found.");
							return;
						}
					}
				}
			}
			if(keys.motion){
				template.coms.motion = ComponentUtil.createMotion(data.motion);
			}
			if(keys.hit){
				template.coms.hit = ComponentUtil.createHit(data.hit);
			}
			return template;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStandAction : function(data){
			data.name = "stand";
			if(data.animate && !DataUtil.checkArrayNull(data.animate,"frames")){
				if(data.animate.frames.length>1){
					data.animate.type = Constant.ANIMATE_SCROLL;
				}else{
					data.animate.type = Constant.ANIMATE_STATIC;
				}
			}else{
				cc.log("SimpleFactory.createStandAction error. animte & animate.frames is necessary.");
				return null;
			}
			var action = Factory.createAction(data);
			return action;
		},
		
		createWalkAction : function(data){
			data.name = "walk";
			data.move.type = Constant.MOVE_BY_CMD;
			data.animate.type = Constant.ANIMATE_SCROLL;
			var action = Factory.createAction(data);
			return action;
		}
		
};