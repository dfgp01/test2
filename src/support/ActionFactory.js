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
		createAction : function(data, actions){
			if(!DataUtil.validateAction(data)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}
			//data.type = DataUtil.checkIsInt(data.type) ? data.type : Constant.ACTION_TYPE_DEFAULT;
			var actionState = null;
			cc.log("info: creating action:[" + data.name + "].");
			if(data.view){
				actionState = new GameAction();
				actionState.view = ComponentFactory.createView(data.view);
			}else if(data.repeat){
				if(!DataUtil.checkIsString(data.repeat.name)){
					data.repeat.name = data.name + "_repeat";
				}
				actionState = this.createRepeat(data.repeat, actions);
			}else if(data.sequence){
				if(!DataUtil.checkIsString(data.sequence.name)){
					data.sequence.name = data.name + "_sequence";
				}
				actionState = this.createSequence(data.sequence, actions);
			}
			actionState.name = data.name;
			actionState.components = [];
			this._bulid(data, actionState);
			return actionState;
		},
		
		/**
		 * 创建动作序列
		 */
		createSequence : function(baseName, sequence, actions){
			if(!DataUtil.validateSequence(sequence)){
				return null;
			}
			var action = new SequenceAction();
			action.actions = [];
			for(var i in sequence){
				var act = sequence[i];
				if(typeof act == 'string'){
					action.actions.push(this._findByName(actions, act));
				}
				else{
					// is a object/json
					if(!DataUtil.checkIsString(act.name)){
						act.name = baseName + "_action"+i;	//默认名
					}
					action.actions.push(this.createAction(act, actions));
				}
			}
			action.input = action.actions[0].input;
			return action;
		},
		
		/**
		 * 创建重复动作
		 */
		createRepeat : function(baseName, repeat, actions){
			if(!DataUtil.validateRepeat(repeat)){
				return null;
			}
			var action = new RepeatAction();
			if(typeof repeat.action == 'string'){
				action.action = this._findByName(actions, repeat.action);
			}else{
				if(!DataUtil.checkIsString(repeat.action.name)){
					repeat.action.name = baseName + "_action";	//默认名
				}
				action.action = this.createAction(repeat.action, actions);
			}
			action.count = data.count;
			action.input = action.action.input;
			return action;
		},
		
		_findByName : function(actions, name){
			var action = actions[name];
			if(!action){
				cc.log("ActionFactory.findByName error. actions["+name+"] not found");
				return null;
			}
			return action;
		},
		
		/**
		 * 组成动作的组件系统
		 */
		_bulid : function(data, action){
			if(!data){
				return;
			}
			//穷举组件检测
			if(DataUtil.checkNotNull(data.move)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createMove(data.move));
			}
			if(DataUtil.checkNotNull(data.command)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createCommand(data.command));
			}
			if(DataUtil.checkNotNull(data.hit)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createHit(data.hit));
			}
			return;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStandAction : function(data, actions){
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
		createWalkAction : function(data, actions){
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
		createHitAction : function(data, actions){
			data.name = "hit";
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_ATTACK;
			}
			var action = this.createAction(data, actions);
			action.input = Constant.CMD_AI_ATTACK;
			return action;
		}
};