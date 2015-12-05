/**
 * 
 */
DataUtil = {
	
	collideMask : function(obj, mask){
		obj.coms.collide.mask  = 0;
		if(mask & Collide.Target.ENEMY){
			//利用与运算可标出敌对阵营
			var enemyMask = obj.group.mask & Constant.Group.ALL_FACTION_MASK;
			obj.coms.collide.mask  = obj.coms.collide.mask | enemyMask;
		}
	}
};