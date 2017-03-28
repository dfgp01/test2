/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	nodes : null,
	systems : null,
	actions : null,
	actionStacks : null,
	templates : null,
	collideTeams : null,
	
	init : function(){
		SystemManager.init();
		ActionManager.init();
		ActionStackManager.init();
		this.nodes = NodeManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
		this.actionStacks = ActionStackManager;
		this.templates = {};
	},
	
	initTeams : function(teams){
		this.collideTeams = [];
		for(var i in teams){
			var collideTeam = new CollideTeam();
			collideTeam.type = teams[i].type;
			collideTeam.mask = teams[i].mask;
			this.collideTeams.push(collideTeam);
		}
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
 * 节点队列
 */
NodeManager = {
	
	_rmList : [],
	remove : function(node){
		this._rmList.push(node);
	},
	gc : function(){
		var _node = null;
		while(this._rmList.length > 0){
			_node = this._rmList.pop();
			if(_node.name=='actions'){
				removeActionsNode(_node);
			}else if(_node.name=='view'){
				removeViewNode(_node);
			}else if(_node.name=='collide'){
				removeCollideNode(_node);
			}
		}
	},
	
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
	 * 碰撞组件链表
	 */
	collide : {
		head : null,
		tail : null
	}
	addCollideNode : function(node){
		this._add(node, this.collide);
	},
	removeCollideNode : function(node){
		this._remove(node, this.collide);
	},
	getFirstCollideNode : function(){
		return this.collide.head;
	},
	
	/**
	 * 受击组件链表系列操作
	 */
	addHurtNode : function(node, teamNo){
		this._add(node, this.teams.hurt[teamNo]);
	},
	removeHurtNode : function(node, teamNo){
		this._remove(node, this.teams.hurt[teamNo]);
	},
	getFirstHurtNode : function(teamNo){
		return this.teams.hurt[teamNo].head;
	}
};

SystemManager = {
	main : null,
	move : null,
	action : null,
	view : null,
	collide : null,
	
	init : function(data){
		//初始化主系统
		this.main = new MainSystem();
		//this.move = new MotionUpdateSystem();
		this.action = new ActionUpdateSystem();
		this.view = new RenderUpdateSystem();
		this.collide = new CollideUpdateSystem();
	}
};

/**
 * 公共动作对象
 */
ActionManager = {
	
	//公共action缓存
	boot:[],

	init : function(){
		var action = new CharacterBootAction();
		action.init(null);
		//this.actions.start[Constant.GAMEOBJECT_TILE] = Factory.createAction(null, TileStartAction);
		this.boot[Constant.GAMEOBJECT_CHARACTER] = action;
	}
};