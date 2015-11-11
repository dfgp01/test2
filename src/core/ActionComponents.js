/**
 * 		用于Action中的组件
 * 		Hugo-Fu 2015.11.11	
 **/

/**
 * 可蓄力动作组件
 */
ChargeComponent = Component.extend({
	rate : 1,
	currRate : 0,
	maxAddition : 1
});

/**
 * 	碰撞数据组件
 */
CollideComponent = Component.extend({
	rect : null,
	maxNum : 0,
	//list : [],		//本次中招的人记录在这里 -_-0
	//history : [],	//之前中招的人记录在这里 -_-0
	//flag : false,	//是否已碰撞成功，撞到一个也算
	target : 0
});

HitComponent = Component.extend({
	damage : 0,
	type : 0
});

/**
 * 击中后的效果组件
 */
HittedComponent = Component.extend({
	effectList : null
});