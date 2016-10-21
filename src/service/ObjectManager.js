/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	comLinks : null,
	systems : null,
	actions : null,
	
	init : function(){
		ComponentManager.init();
		SystemManager.init();
		ActionManager.init();
		this.comLinks = ComponentManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
	}
};

/**
 * 组件管理器，提供快速筛选组件
 */
ComponentManager = {

	viewHead : null,
	moveHead : null,	//头结点是个空心节点，只保留前后指针，后指针指向第一个元素，前指针指向最后一个元素
	
	_pushTolinks : function(head, node){
		if(node.prep==null && node.next==null){
			node.prep = head.prep;
			node.next = head;
			head.prep.next = node;
			head.prep = node;
		}
	},
	
	_newHead : function(head){
		var head = new Compoment();
		head.prep = head.next = head;
		return head;
	},
	
	deleteNode : function(node){
		if(node.prep==null&&node.next==null){
			node.prep.next = node.next;
			node.next.prep = node.prep;
			node.prep = null;
			node.next = null;
		}
	},

	init : function(){
		this.moveHead = this._newHead();
		this.viewHead = this._newHead();
	},
	
	addMoveNode : function(moveCom){
		_pushTolinks(moveHead, moveCom.node);
	},
	
	getViewFirstNode : function(){
		return this.viewHead.next;
	},
	
	getMoveFirstNode : function(){
		return this.moveHead.next;
	}
};

SystemManager = {
	main : null,
	player : null,
	move : null,
	action : null,
	EvtMsg : null,
	animate : null,
	view : null
	
	init : function(){
		//初始化主系统
		//this.main = new MainSystem();
		this.player = new PlayerSystem();
		//this.animate = new AnimateUpdateSystem();
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

ActionManager = {
	
	//公共action缓存
	start:[],
	
	//action-system缓存
	systems:{
		animate:[],
		move:[],
		stand:[]
	},

	init : function(){
		var action = new CharacterStartAction();
		action.init(null);
		//this.actions.start[Constant.GAMEOBJECT_TILE] = Factory.createAction(null, TileStartAction);
		this.start[Constant.GAMEOBJECT_CHARACTER] = action;
		//this.systems.animate[0] = new SimpleAnimateSystem();
		this.systems.animate[Constant.ANIMATE_STATIC] = new AnimateOneFrame();
		this.systems.animate[Constant.ANIMATE_NORMAL] = new AnimateSystem();
		this.systems.animate[Constant.ANIMATE_SCROLL] = new AnimateScroll();
		
		this.systems.move[Constant.MOVE_STABLE] = new MoveSystem();
		this.systems.move[Constant.MOVE_WALK] = new WalkSystem();
		this.systems.stand[Constant.GAMEOBJECT_CHARACTER] = new StandActionSystem();
	}
};