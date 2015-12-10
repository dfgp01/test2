/**
 * 队伍、阵营
 */
Group = cc.Class.extend({
	name : "group",
	list : null,
	index : -1,
	mask : -1,

	ctor : function(data){
		if(data){
			this.index = data.index;
			this.msk = data.mask;
		}
		this.list = [];
	},
	
	add : function(obj){
		this.list.push(obj);
		obj.group = this.index;
	},
	
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