/**
 * 对象管理器，缓存游戏中所有系统对象（非游戏元素对象）
 */
ObjectManager = {
	
	//组件链表
	viewComList : new LinkList(),
	actComList : new LinkList(),
	
	//主系统
	mainSys : new MainSystem(),
	actionSys : new ActionUpdateSystem(),
	viewSys : new RenderUpdateSystem(),
	
	getViewComList : function(){
		return this.viewComList;
	},
	
	getActComList : function(){
		return this.actComList;
	},
	
	addViewCom : function(viewComponent){
		this.viewComList.append(viewComponent);
	},
	
	removeViewCom : function(viewComponent){
		this.viewComList.remove(viewComponent);
	},
	
	initCollides : function(data){
		var teams = data.teams;
		for(var i in teams){
			this.nodes.addTeam(teams[i]);
		}
		var masks = data.masks;
		for(var i in masks){
			for(var j in masks[i].mask){
				this.nodes.addMask(masks[i].type, masks[i].mask[j]);
			}
		}
	}
};

/**
 * 节点链表管理器，暂时不用
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
				this.removeActionsNode(_node);
			}else if(_node.name=='view'){
				this.removeViewNode(_node);
			}else if(_node.name=='collide'){
				this.removeCollideNode(_node);
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
	
	actions : null,
	view : null,
	collideTypes : {},
	init : function(){
		this.actions = new NodeLinks();
		this.view = new NodeLinks();
	},
	
	/**
	 * 动作组件链表系列操作
	 */
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
	addTeam : function(type){
		var team = new CollideTeam();
		team.type = type;
		this.collideTypes[type] = team;
	},
	
	addMask : function(type1, type2){
		this.collideTypes[type1].mask |= type2;
		this.collideTypes[type2].mask |= type1;
	},
	removeMask : function(type1, type2){
		this.collideTypes[type1].mask &= !(type2);
		this.collideTypes[type2].mask &= !(type1);
	},
	addCollideNode : function(node){
		this._add(node, this.collideTypes[node.type]);
	},
	removeCollideNode : function(node){
		this._remove(node, this.collideTypes[node.type]);
	},
	getFirstCollideNode : function(type){
		return this.collideTypes[type].head;
	}
};