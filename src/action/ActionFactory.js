/**
 * 基础动作数据验证
 */
var _actVldt =  [Validator.create("name","string",true, 1, 150)];
Validator.addType("Action",function(val, label){
	return Validator.validateObject(val, _actVldt, label);
});

/**
 * 用于建造动作的工厂类
 */
ActionFactory = {
		
		//自增ID号
		idSeq : 0,
		
		/**
		 * 供外部调用的创建动作接口
		 */
		create : function(data, actionManager){
			if(!Validator.assertType(data, "Action", "action")){
				return;
			}
			var action = this._createAction(data, actionManager);
			actionManager.registered(action);
			return action;
		},
		
		/**
		 * 创建一个动作节点
		 */
		_createAction : function(data, actionManager){
			var action = null;
			if(data.frame){
				action = FrameAction.create(data.frame, actionManager);
			}else if(data.animate){
				action = AnimateAction.create(data.animate, actionManager);
			}else if(data.move){
				action = MoveAction.create(data.move, actionManager);
			}else if(data.repeat){
				action = RepeatAction.create(data.repeat, actionManager);
			}else if(data.sequence){
				action = SequenceAction.create(data.sequence, actionManager);
			}else if(data.parallel){
				action = this.createParallel(data.parallel, actionManager);
			}else{
				cc.log("ActionFactory._createAction error.");
				return null;
			}
			action.id = this.idSeq++;
			return action;
		},
		
		createParallel : function(data, actionManager){
			return ParallelActionTypeA.create(data, actionManager);
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