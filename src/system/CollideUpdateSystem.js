/**
 * 碰撞检测主系统
 */
CollideUpdateSystem = System.extend({
	name : "collide",
	_collideMap : {},
	
	start : function(){
		var ts = ObjectManager.collideTeams;
		for(var i in ts){
			this._collideMap[ts[i].type] = ts[i].mask;
		}
	},
	
	update : function(dt){
		this._curr = ObjectManager.propertys.getFirstCollideNode();
		this._super(dt);
	},
	
	execute : function(dt, unitCollideNode){
		if(unitCollideNode.total > unitCollide.max)
		//和后面的节点检测碰撞
		var nxt = unitCollideNode.next;
		while(nxt != null){
			this.check(dt, unitCollideNode, nxt);
			nxt = nxt.next;
		}
	},
	
	ckeck : function(dt, collide1, collide2){
		
	}
});