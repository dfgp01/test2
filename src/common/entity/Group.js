/**
 * 队伍、阵营
 */
Group = cc.Class.extend({
	name : "group",
	list : null,
	index : -1,
	mask : -1,
	type : 0,

	ctor : function(){
		this.list = [];
	},
	
	attr : function(data){
		this.type = data.type;
		this.name = data.name;
		this.index = data.index;
	},
	
	add : function(obj){
		this.list.push(obj);
		obj.group = this.index;
	},
	
	//以后可能会用链表实现这个
	remove : function(obj){
		if(this.list.length > 0){
			for(var i in this.list){
				if(this.list[i].id == obj.id){
					this.list.splice(i, 1);		//删除该位置上的对象
					break;
				}
			}
		}
	}
});