/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	propertys : null,
	systems : null,
	actions : null,
	actionStacks : null,
	templates : null,
	team : null,
	
	init : function(){
		SystemManager.init();
		ActionManager.init();
		ActionStackManager.init();
		this.propertys = PropertyManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
		this.actionStacks = ActionStackManager;
		this.templates = {};
		this.teams = TeamManager;
	},

	getActionStackInfo : function(){
		return this.actionStacks.getStack();
	},
	recycleActionStackInfo : function(stackInfo){
		this.actionStacks.recycle(stackInfo);
	}
};

/**
 * 阵营管理
 */
TeamManager = {
	friends:null,
	enemyCamps:null,
	hurts:null,
	init : function(data){
		this.enemyCamps = {};
		for(var i in data.enemyCamps){
			this.enemyCamps[i] = data.enemyCamps[i];
		}
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
	
	_add : function(node, p){
		if(node.prep==null && node.next==null){
			if(p.head==null){
				p.tail = p.head = node;
			}else{
				p.tail.next = node;
				node.prep = p.tail;
				p.tail = node;
			}
		}
	},
	
	_remove : function(node, p){
		if(node.prep!=null||node.next!=null){
			if(p.head==node){
				p.head = node.next;
			}else if(p.tail==node){
				p.tail = node.prep;
				p.tail.next = null;
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
	actions : {
		head : null,
		tail : null
	},
	addActionsNode : function(node){
		this._add(node, this.actions);
	},
	removeActionsNode : function(node){
		this._remove(node, this.actions);
	},
	getFirstActionsNode : function(){
		return this.actions.head;
	},
	
	/**
	 * 显示组件链表系列操作
	 */
	view : {
		head : null,
		tail : null
	},
	addViewNode : function(node){
		this._add(node, this.view);
	},
	removeViewNode : function(node){
		this._remove(node, this.view);
	},
	getFirstViewNode : function(){
		return this.view.head;
	},
	
	/**
	 * 受击组件链表系列操作
	 */
	friendCamps:null,
	enemyCamps:{},
	hurt : {},
	initTeams : function(data){
		for(var i in data.enemyCamps){
			this.enemyCamps[i] = data.enemyCamps[i];
			this.hurt[i].head = null;
			this.hurt[i].tail = null;
		}
	},
	findEnemyCamps : function(teamNo){
		return this.enemyCamps[teamNo];
	}
	addHurtNode : function(node, teamNo){
		this._add(node, this.hurt[teamNo]);
	},
	removeHurtNode : function(node, teamNo){
		this._remove(node, this.hurt[teamNo]);
	},
	getFirstHurtNode : function(teamNo){
		return this.hurt[teamNo].head;
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