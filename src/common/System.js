/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : "system",
	priority : 0,
	tick : Constant.TICK_FPS60,			//不能少于这个数
	remainDt : 0,
	
	_curr : null,
	//_next : null,	//此引用是防止在execute()中有移除链表队列的操作，到时_curr.next就为null而异常，先备份好。
	
	/**
	 * 主函数，循环整个链表
	 */
	update : function(dt){
		while(this._curr != null){
			//this._next = this._curr.next;
			this.execute(dt, this._curr);
			this._curr = this._next;
		}
	},
	start : function(){},	//init links_head here
	end : function(){},
	/**
	 * 子类重写此方法，用于执行一次详细逻辑
	 */
	execute : function(dt, node){}
});

/**
 * 定义动作模块专用的系统组件接口
 * unitCom = unit.coms[comName]
 * actionCom = action.coms[comName]
 */
ActionSystem = cc.Class.extend({
	name : null,
	type : 0,		//因为每种逻辑的actionsystem都有多种类型，所以默认为0
	priority : 0,
	start : function(unitCom, actionCom){return;},
	update : function(dt, unitCom, actionCom){return;},
	end : function(unitCom, actionCom){return;},
	
	/**
	 * 将单位组件加入到主系统遍历链表内
	 */
	addToLink : function(node){
		if(node.prep==null && node.next==null){
			GameUtil.systems[this.name].addComponentNode(node);	
		}
	}
});