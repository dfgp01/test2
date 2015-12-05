/**
 * 基类定义，接口定义
 */
Effect = cc.Class.extend({
	name : "effect",
	update : function(content){	/**return int**/}
});

EffectGroup = Effect.extend({
	list : null,
	
	update : function(content){
		for(var i in list){
			list[i].update(content);
		}
	},
	
	add : function(effect){
		list.push(effect);
	},
	
	removeByName : function(name){
		for(var i in list){
			if(effectList[i].name == name){
				//remove
				break;
			}
		}
	}
});

/**
 * 受击后的动作
 */
HurtActEffect = Effect.extend({
	name : "hurtAct",
	
	update : function(content){
		var target = content.target;
		var type = content.type;
		switch(type){
		case Constant.HitType.NORMAL:
			break;
		case Constant.HitType.KNOCK_DOWN:
			break;
		}
	}
});