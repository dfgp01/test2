/**
 * 基础连接节点
 */
LinkNode = cc.Class.extend({
	prep : null,
	next : null,
	value : null		//关联值对象，可以是任意类型
});

/**
 * 节点集合基类
 */
BaseLinkCollection = cc.Class.extend({
	availbleList : null,	//使用对象池，不用频繁创建
	head : null,
	tail : null,
	size : 0,
	
	/**
	 * 创建控的头尾节点，使之相接
	 */
	onCreated : function(){
		this.head = new LinkNode();
		this.tail = new LinkNode();
		this.head.next = this.tail;
		this.tail.prep = this.head;
	},
	
	getNewNode : function(){
		this.availbleList = this.availbleList || [];
		return this.availbleList.length > 0 ? this.availbleList.pop() : new Node();
	},
	
	/**
	 * 查找节点，由于无法由value定位到node，所以只能通过循环比对
	 */
	/*findNode : function(value){
		var curr = this.head;
		while(curr!=null){
			if(curr.value==value)
				return curr;
			curr = curr.next;
		}
	},*/
	
	removeNode : function(node){
		//修改前后连接
		node.prep.next = node.next;
		node.next.prep = node.prep;
		node.prep = null;
		node.next = null;
		
		//集合数量-1
		this.size--;

		//解除双向关联
		/*var value = node.value;
		value.node = null;
		node.value = null;*/
		//回到对象池中
		//this.availbleList.push(node);
	},
	
	insertNode : function(prep, newNode, next){
		//前后相接
		prep.next = newNode;
		newNode.prep = prep;
		next.prep = newNode;
		newNode.next = next;
		//集合数量+1
		this.size++;
	},
	
	insertFirst : function(node){
		this.insertNode(this.head, node, this.head.next);
	},
	
	insertLast : function(node){
		this.insertNode(this.tail.prep, node, this.tail);
	},
	
	/**
	 * 迭代接口
	 */
	iterator : function(callback){}
});
