/**
 * 队列
 */
Quene = BaseLinkCollection.extend({
	
	push : function(value){
		this.inserLast(value.node);
	},
	
	pop : function(){
		var node = this.head.next;
		if(node==this.tail)return null;
		this.removeNode(node);
		return node.value;
	},
	
	iterator : function(callback){
		var value = null;
		while((value=this.pop()) != null){
			callback(value);
		}
	}
});