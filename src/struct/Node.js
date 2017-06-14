/**
 * 基础连接节点
 */
Node = cc.Class.extend({
	prep : null,
	next : null,
	value : null		//值对象，可以是任意类型
});

/**
 * 节点集合基类
 */
NodeCollection = cc.Class.extend({
	availbleList : null,	//使用对象池，不用频繁创建
	head : null,
	tail : null,
	size : 0,
	
	getNewNode : function(){
		this.availbleList = this.availbleList || [];
		return this.availbleList.length > 0 ? this.availbleList.pop() : new Node();
	},
	
	_recycle : function(node){
		node.value = null;
		this.availbleList.push(node);
	},
	
	/**
	 * 查找节点，由于无法由value定位到node，所以只能通过循环比对
	 */
	findNode : function(value){
		var curr = this.head;
		while(curr!=null){
			if(curr.value==value)
				return curr;
			curr = curr.next;
		}
	},
	
	removeNode : function(node){
		/*if(node==this.head){
			this.head = node.next;
		}
		if(node==this.tail){
			this.tail = node.prep;
		}*/
		node.prep = null;
		node.next = null;
		this._recycle(node);
		this.size--;
	},
	
	/**
	 * 迭代接口
	 */
	iterator : function(callback){}
});
