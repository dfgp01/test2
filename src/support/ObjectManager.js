/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	propertys : null,
	systems : null,
	actions : null,
	actionStacks : null,
	
	init : function(){
		ComponentManager.init();
		SystemManager.init();
		ActionManager.init();
		ActionStackManager.init();
		this.propertys = PropertyManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
		this.actionStacks = ActionStackManager;
	},

	getActionStackInfo : function(){
		return this.actionStacks.getStack();
	},
	recycleActionStackInfo : function(stackInfo){
		this.actionStacks.recycle(stackInfo);
	}
};

/**
 * 动作栈对象缓存队列
 */
ActionStackManager = {
	quene : null,
	init : function(){
		this.quene = [];
	},
	getStack : function(){
		var stack = this.quene.pop();
		if(!stack){
			stack = new Object();
		}
		stack.index = 0;
		stack.repeat = 0;
		stack.status = 0;
		return stack;
	},
	recycle : function(stackInfo){
		this.quene.push(stackInfo);
	}
}

/**
 * 单位属性队列
 */
PropertyManager = {

	_viewHead : null,
	_viewTail : null,
	_moveHead : null,
	_moveTail : null,
	
	init :function(){},
	
	_add : function(node, head, tail){
		if(node.prep==null && node.next==null){
			if(head==null){
				tail = head = node;
			}else{
				tail.next = node;
				node.prep = tail;
				tail = node;
			}
		}
	},
	
	_remove : function(node, head, tail){
		if(node.prep!=null||node.next!=null){
			if(head==node){
				head = node.next;
			}else if(tail==node){
				tail = node.prep;
				tail.next = null;
			}else{
				node.prep.next = node.next;
				node.next.prep = node.prep;
			}
			node.prep = null;
			node.next = null;
		}
	},
	
	/**
	 * 移动组件链表系列操作
	 */
	addMoveNode : function(moveCom){
		_add(moveCom, this._moveHead, this._moveTail);
	},
	removeMoveNode : function(moveCom){
		_remove(moveCom, this._moveHead, this._moveTail);
	},
	getFirstMoveNode : function(){
		return this._moveHead;
	},
	
	/**
	 * 显示组件链表系列操作
	 */
	addViewNode : function(viewCom){
		_add(viewCom, this._viewHead, this._viewTail);
	},
	removeViewNode : function(viewCom){
		_reView(viewCom, this._viewHead, this._viewTail);
	},
	getFirstViewNode : function(){
		return this._viewHead;
	}
	
};

SystemManager = {
	main : null,
	move : null,
	action : null,
	view : null,
	
	init : function(){
		//初始化主系统
		this.main = new MainSystem();
		//this.move = new MotionUpdateSystem();
		this.action = new ActionUpdateSystem();
		this.view = new RenderUpdateSystem();
		//this.systems.EvtMsg = new EventMessageSystem();
		//var mainSystem = this.systems.main;
		//mainSystem.addSystem(this.systems.player);
		//mainSystem.addSystem(this.systems.move);
		//mainSystem.addSystem(this.systems.action);
		//mainSystem.addSystem(this.systems.EvtMsg);
		//mainSystem.addSystem(this.systems.animate);
	}
};

/**
 * 公共动作对象
 */
ActionManager = {
	
	//公共action缓存
	start:[],
	
	//action-system缓存
	systems:{
		animate:[],
		move:[],
		stand:[],
		command:[]
	},

	init : function(){
		var action = new CharacterStartAction();
		action.init(null);
		//this.actions.start[Constant.GAMEOBJECT_TILE] = Factory.createAction(null, TileStartAction);
		this.start[Constant.GAMEOBJECT_CHARACTER] = action;
		//this.systems.animate[0] = new SimpleAnimateSystem();
		
		/*this.systems.animate[Constant.ANIMATE_STATIC] = new AnimateOneFrame();
		this.systems.animate[Constant.ANIMATE_NORMAL] = new AnimateNormal();
		this.systems.animate[Constant.ANIMATE_SCROLL] = new AnimateScroll();
		
		this.systems.move[Constant.MOVE_NORMAL] = new MoveSystem();
		
		this.systems.command[Constant.COMMAND_NORMAL] = new CommandSystem();
		this.systems.command[Constant.COMMAND_CHARACTER_STAND] = new StandCommandSystem();
		this.systems.command[Constant.COMMAND_CHARACTER_WALK] = new WalkCommandSystem();*/
	}
};