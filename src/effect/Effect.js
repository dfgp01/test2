/**
 * 基类定义，接口定义
 */
Effect = System.extend({
	name : "effect",
	start : function(obj){},
	update : function(dt, obj){},
	end : function(obj){}
});

/**
 * 加攻击力BUFF
 */
HitPowerUpEffect = Effect.extend({
	value : 0,
	name : "hitPowerUp",
	
	start : function(obj){
		obj.coms.hit.strangth += this.value;
	},
	end : function(obj){
		obj.coms.hit.strangth -= this.value;
	}
});