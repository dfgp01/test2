/**
 * 单链表
 */
LinkList = NodeCollection.extend({
	
	/**
	 * 追加到尾部，并返回最新节点
	 */
	append : function(value){
		/*var node = this.getNewNode();
		node.value = value;		应该在创建value的时候就一并创建node了
		value.node = node;*/
		this.insertLast(value.node);
	},
	
	remove : function(value){
		this.removeNode(value.node);
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