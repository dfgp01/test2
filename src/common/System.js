/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : "system",
	priority : 0,
	tick : Constant.TICK_FPS60,			//不能少于这个数
	remainDt : 0,
	
	//这三个以后要
	_head : null,
	_curr : null,
	_end : null,
	
	/**
	 * 主函数，循环整个链表
	 */
	update : function(dt){
		if(this._head != null){
			this._curr = this._head;
			do{
				this.execute(dt, this._curr);
				this._curr = this._curr.next;
			}while(this._curr != null);
		}
	},
	start : function(){},
	end : function(){},
	/**
	 * 子类重写此方法，用于执行一次详细逻辑
	 */
	execute : function(dt, node){},
	
	/**
	 * 将组件添加进链表
	 */
	addComponent : function(node){
		if(node.prep!=null || node.next!=null || node==this._head || node==this._end){
			//已经在链表里面了
			return;
		}
		if(this._head == null){
			this._head = node;
			this._end = node;
		}else{
			this._end.next = node;
			node.prep = this._end;
			this._end = node;	//新加入的一定是放在链尾
		}
	},
	
	removeComponent : function(node){
		//如果已经不在链表里，就直接退出
		if(node.prep == null && node.next == null){
			return;
		}
		if(this._head == node && this._end == node){
			this._head = null;
			this._end = null;
		}
		else if(this._head == node){
			this._head = node.next;
		}
		else if(this._end == node){
			this._end = node.prep;
		}
		else{
			node.prep.next = node.next;
			node.next.prep = node.prep;
		}
		node.prep = null;
		node.next = null;
	}
});

/**
 * 定义动作模块专用的系统组件接口
 */
ActionSystem = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(gameObject, actionCom){return;},
	update : function(dt, gameObject, actionCom){return;},
	end : function(gameObject, actionCom){return;},
	
	/**
	 * 将单位组件加入到主系统遍历链表内
	 */
	addToLink : function(node){
		if(node.prep==null && node.next==null){
			GameUtil.systems[this.name].addComponentNode(node);	
		}
	}
});

/**
 * 事件消息分发系统
 */
EventMessageSystem = System.extend({
	name : "EvtMsg",
	_currEvt : null,
	_quene : null,
	_unitEvt : null,
	
	ctor : function(){
		this._quene = [];
		this._unitEvt = new UnitEventScheduler();
	},
	
	/*update : function(dt){
		while(this._currEvt = this._quene.shift()){
			switch(_currEvt.name){
			case Constant.MsgType.Unit.Type:
				this._unitEvt.callback(this._currEvt);
			case Constant.MsgType.System.TYPE:
			default :
				EngineUtil.dispatch(this._currEvt);
				break;
			}
			
		}
	},*/
	
	addListener : function(name, callback){
		EngineUtil.addListener(name, callback);
	},
	
	addEvent : function(evt){
		this._quene.push(evt);
	}
});
