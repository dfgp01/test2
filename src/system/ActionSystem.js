/**
 * 
 */

//动作系统
ActionSystem = System.extend({
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

//动画系统
AnimateSystem = System.extend({
	start : function(){},
	update : function(dt){
		//unitList.currAct.play.update(dt);
	},
	end : function(){}
});