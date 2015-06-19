/**
 * 
 */

//运行动作系统
ActionRunSystem = System.extend({
	unitList : null,
	start : function(){
		this.unitList = Container.getUnitList();
	},
	update : function(dt){
		for(var i in  this.unitList){
			this.unitList[i].currAct.run(this.unitList[i], dt);
		}
	},
	end : function(){
		//remove from SysManager
	}
});