/**
 * v1.6版
 *	StateNode用回以前那种结构
 *	有一个runList和一个actions
 *	state每次run默认都先将runList跑完再跑当前action
 *	目前暂未发现需要用到runList的地方
 *
 *	注意ctor的坑:
 *	我们之前在ctor函数里传入了参数data，但调试中发现data未定义，尽管我们在new的时候已传入正确的参数。
 *	问题的原因是当继承发生时，如StateNode继承Node，系统就会执行一次new Node()，此时并没有传入参数。
 *	因此，不建议在ctor中传入参数，除非你是直接从Class继承。
 *	已用init(data)函数进行初始化。
 */

/**
 * v1.7版
 * 	重新定义ActionState结构，Action实体层废除。
 */

/**
 * V1.8版
 * ActionState的主要方法都变为公用性质。但本体依然分为独立单位使用和群体单位使用
 * 		群体单位：指普通小兵，飞行道具等，它们的Action不可以动态变化，初始化后不能更改。
 * 		独立单位：指英雄、英雄的召唤物等，它们的Action是可以受技能、物品的逻辑影响结构的。
 * 		因此，ActionState可以拥有自己的属性：时间系数、基础数据、CD等。但run等方法必须被unit公用。
 * 
 * 一些特别的Action需要另外写逻辑，如：idle、jump等
 * 
 * Effect：这个是新版本引入的概念，正在研究中。。。
 */


/**
 * 		基础组件类
 */

EventData = cc.Class.extend({
	isActive : false,
	name : null,
	source : null,
	target : null
});

StateNode = cc.Class.extend({
	name : null,
	next : null,
	
	//构造器
	ctor : function(){},
	init : function(data){
		this.name = data.name;
	},
	
	//定义主接口
	start: function(){},
	run : function(dt){},
	end : function(){},
	
	//设置直接下一个节点
	setNext : function(node){
		this.next = node;
	}
});

/**
 * Frame
 */
Frame = cc.Class.extend({		//extend cc.SpriteFrame
	//spriteFrame : null,
	name : null,
	position : null,
	ctor : function(data){
		data && this.init(data);
	},
	init : function(data){
		this.name = data.source;
		this.position = data.position;
	}
});
