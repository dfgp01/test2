/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	coms : null,
	systems : null,
	actions : null,
	
	init : function(){
		ComponentManager.init();
		SystemManager.init();
		ActionManager.init();
		ObjectQueneManager.init();
		this.coms = ComponentManager;
		this.systems = SystemManager;
		this.actions = ActionManager;
	}
};

/**
 * 组件管理器，提供快速筛选组件
 */
ComponentManager = {

	_viewHead : null,
	_viewTail : null,
	_moveHead : null,
	_moveTail : null,
	
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
		this.systems.animate[Constant.ANIMATE_NORMAL] = new AnimateNormal();
		this.systems.animate[Constant.ANIMATE_SCROLL] = new AnimateScroll();
		
		this.systems.move[Constant.MOVE_STABLE] = new MoveSystem();
		this.systems.move[Constant.MOVE_WALK] = new WalkSystem();
		this.systems.stand[Constant.GAMEOBJECT_CHARACTER] = new StandActionSystem();
	}
};