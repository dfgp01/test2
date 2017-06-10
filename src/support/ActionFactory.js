/**
 * 用于建造动作的工厂类
 */
ActionFactory = {
		
		/**
		 * 创建一个动作节点
		 * param
		 * 	data 	 数据DNA
		 * 	actions	 动作集合{}，创建某些action时需要引用其他action
		 */
		createAction : function(data, actionManager){
			if(!Validator.assertNotNull(data, "data")){
				cc.log("createAction error.");
				return null;
			}
			if(data.repeat){
				return RepeatAction.create(data.repeat, actionManager);
			}else if(data.sequence){
				return SequenceAction.create(data.sequence, actionManager);
			}else{
				return ParallelAction.create(data);
			}
			
			/*if(!action){
				cc.log("create ActionState exception, see the log!");
				return null;
			}
			actionState.name = data.name;
			if(this._bulid(data, actionState)){
				cc.log("info: action:[" + data.name + "] has been created.");
			}
			return actionState;*/
		},
		
		/**
		 * 创建角色动作
		 */
		_createUnitAction : function(data){
			var view = ComponentFactory.createView(data.view);
			if(!view){
				return null;
			}
			var action = new GameAction();
			actionState.view = view;
			return action;
		},
		
		/**
		 * 创建动作序列
		 */
		_createSequence : function(baseName, sequence){
			if(!Validator.assertType(data, "sequenceAction", data.name)){
				cc.log("createSequenceAction error.");
				return null;
			}
			var action = new SequenceAction();
			action.actions = [];
			for(var i in sequence){
				var actId = sequence[i];
				action.actions.push(actId);
			}
			action.input = action.actions[0].input;
			return action;
		},
		
		/**
		 * 创建重复动作
		 */
		_createRepeat : function(baseName, repeat){
			if(!Validator.assertType(data, "repeatAction", data.name)){
				cc.log("createRepeatAction error.");
				return null;
			}
			var action = new RepeatAction();
			action.action = repeat.action;
			action.count = data.count;
			action.input = action.action.input;
			return action;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStand : function(data, actions){
			data.name = "stand";
			data.view.animate.type = data.view.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_STAND;
			}
			return this.createAction(data, actions);
		},
		
		/**
		 * 创建走路/奔跑动作节点
		 */
		createWalk : function(data, actions){
			data.name = "walk";
			data.view.animate.type = data.view.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_WALK;
			}
			return this.createAction(data, actions);
		},
		
		/**
		 * 创建普通攻击动作节点
		 */
		createHit : function(data, actions){
			data.name = "hit";
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_ATTACK;
			}
			var action = this.createAction(data, actions);
			action.input = Constant.CMD_AI_ATTACK;
			return action;
		}
};