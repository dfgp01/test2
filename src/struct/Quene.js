/**
 * 队列
 */
Quene = NodeCollection.extend({
	
	push : function(value){
		var node = this.getNewNode();
		node.value = value;
		if(this.size==0){
			this.head = this.tail = node;
		}else{
			this.tail.next = node;
			this.tail = node;
		}
		this.size++;
	},
	
	pop : function(){
		var node = this.head;
		if(node==null)return null;
		var value = node.value;
		this.head = node.next;
		this.removeNode(node);
		return value;
	},
	
	iterator : function(callback){
		var value = null;
		while((value=this.pop()) != null){
			callback(value);
		}
	}
});