/**
 * 基类定义，接口定义
 */

Effect = cc.Class.extend({
	name : null,
	run : function(){}
});

EffectGroup = Effect.extend({
	effectList : null,
	run : function(){
		for(var i=0; i<effectList.length; i++){
			if(!effectList[i].run()){
				break;
			}
		}
	},
	addEffect : function(effect, pos){
		effectList.push(effect);
	},
	removeEffectByName : function(name){
		for(var i in effectList){
			if(effectList[i].name == name){
				//remove
				break;
			}
		}
	},
	ctor : function(){
		effectList = [];
	}
});