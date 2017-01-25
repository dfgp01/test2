/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	propertys : null,
	systems : null,
	actions : null,
	actionStacks : null,
	templates : null,
	
	init : function(){
		SystemManager.init();
		ActionManager.init();
		ActionStackManager.init();
		this.propertys = PropertyManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
		this.actionStacks = ActionStackManager;
		this.templates = {};
	},

	getActionStackInfo : function(){
		return this.actionStacks.getStack();
	},
	recycleActionStackInfo : function(stackInfo){
		this.actionStacks.recycle(stackInfo);
	},
	
	//这一块以后要优化
	_cmdStack : [],
	addCommandStack : function(commandComponent, table){
		this._cmdStack.push({c:commandComponent, t:table});
	},
	dealCommandStack : function(actions){
		for(var i in this._cmdStack){
			var cmd = this._cmdStack[i].c;
			var table = this._cmdStack[i].t;
			for(var j in table){
				var actionName = table[j];
				if(!DataUtil.checkIsString(actionName)){
					cc.log("ObjectManager.dealCommandStack error. not a string.");
					return;
				}
				var action = actions[actionName];
				if(!action){
					cc.log("ObjectManager.dealCommandStack error. action:["+actionName+"] not found");
				}
				//cmd.table[actionName] = action; 不是这样的
			}
		}
		this._cmdStack = [];
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
	_actionsHead : null,
	_actionsTail : null,
	
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
	 * 动作组件链表系列操作
	 */
	addActionsNode : function(node){
		//this._add(actionsPropertyNode, this._actionsHead, this._actionsTail); 这不是C++，指针不能传进去
		if(node.prep==null && node.next==null){
			if(this._actionsHead==null){
				this._actionsTail = this._actionsHead = node;
			}else{
				this._actionsTail.next = node;
				node.prep = this._actionsTail;
				this._actionsTail = node;
			}
		}
	},
	removeActionsNode : function(actionsPropertyNode){
		//this._remove(actionsPropertyNode, this._actionsHead, this._actionsTail);
		if(actionsPropertyNode.prep !=null || actionsPropertyNode.next != null){
			if(this._actionsHead==actionsPropertyNode){
				this._actionsHead = actionsPropertyNode.next;
			}else if(this._actionsTail==node){
				this._actionsTail = actionsPropertyNode.prep;
				this._actionsTail.next = null;
			}else{
				actionsPropertyNode.prep.next = actionsPropertyNode.next;
				actionsPropertyNode.next.prep = actionsPropertyNode.prep;
			}
			node.prep = null;
			node.next = null;
		}
	},
	getFirstActionsNode : function(){
		return this._actionsHead;
	},
	
	/**
	 * 显示组件链表系列操作
	 */
	addViewNode : function(viewCom){
		//this._add(viewCom, this._viewHead, this._viewTail);
		if(viewCom.prep==null && viewCom.next==null){
			if(this._viewHead==null){
				this._viewTail = this._viewHead = viewCom;
			}else{
				this._viewTail.next = viewCom;
				viewCom.prep = this._viewTail;
				this._viewTail = viewCom;
			}
		}
	},
	removeViewNode : function(viewCom){
		//this._reView(viewCom, this._viewHead, this._viewTail);
		if(viewCom.prep !=null || viewCom.next != null){
			if(this._viewHead==viewCom){
				this._viewHead = viewCom.next;
			}else if(this._viewTail==viewCom){
				this._viewTail = viewCom.prep;
				this._viewTail.next = null;
			}else{
				viewCom.prep.next = viewCom.next;
				viewCom.next.prep = viewCom.prep;
			}
			viewCom.prep = null;
			viewCom.next = null;
		}
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
	boot:[],
	
	//action-system缓存
	systems:{
		animate:[],
		move:[],
		stand:[],
		command:[]
	},

	init : function(){
		var action = new CharacterBootAction();
		action.init(null);
		//this.actions.start[Constant.GAMEOBJECT_TILE] = Factory.createAction(null, TileStartAction);
		this.boot[Constant.GAMEOBJECT_CHARACTER] = action;
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