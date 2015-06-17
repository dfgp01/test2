/**
 * 
 */

System = cc.Class.extend({
	name : null,
	priority : 0,
	start : function(){},
	update : function(dt){},
	end : function(){}
});

SystemManager = {
		sysList : null,
		init : function(){
			this.sysList = [];
		},
		addSystem : function(system){
			this.sysList.push(system);
		},
		update : function(dt){
			for(var i in this.sysList){
				this.sysList[i].update(dt);
			}
		}
}