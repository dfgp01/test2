/**
 * 单链表
 */
LinkList = NodeCollection.extend({
	
	/**
	 * 追加到尾部，并返回最新节点
	 */
	append : function(value){
		var node = this.getNewNode();
		node.value = value;
		if(this.size==0){
			this.head = this.tail = node;
		}else{
			this.tail.next = node;
			node.prep = this.tail;
			this.tail = node;
		}
		this.size++;
	},
	
	remove : function(value){
		var node = this.findNode(value);
		if(!node)return;
		if(node==this.head){
			this.head = node.next;
		}
		if(node==this.tail){
			this.tail = node.prep;
		}
		this.removeNode(node);
	},
	
	iterator : function(callback){
		if(this.size==0){
			return;
		}
		var _curr = this.head.next;
		while(_curr != this.tail){
			callback(_curr.value);
			_curr = _curr.next;
		}
	}
});