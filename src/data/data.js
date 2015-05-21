/**
 *  entity
 */

lie_down_act = {
	name : "lieDown",		//被击倒后躺下的动作
	frames : ["deep_lieDown_x.png"],
	keep : 1,					//持续1秒
	playType : 2				//在最后一帧静止
};

shieldBuff_release = {
	name : "shieldBuff-release",			//无敌护盾
	action : "release",							//施放型的动作，用引用完成
	keep : 2										//过程持续2秒
	//etc: mp...
};

shieldBuff_obj = {			//this is a unit
	name : "shieldBuff",
	keep : 7,										//此单位存活7秒
	value : {}//hp,defence....
};

data_standAction = {
		name : "standAction",
		frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"],
		type : 0
};

data_walkAction = {
		name : "walkAction",
		frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"],
		type : 1
};

data_hurtAction = {
		name : "hurtAction",
		frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png","deep_hurt_5.png","deep_hurt_4.png","deep_hurt_4.png"],
		type : 0
};

data_standState = {
		name : "standState",
		state : 0,
		key : 0,
		action : "standAction",
		repeat : -1
		// 如果要在stand一段时间后播放另一段action，加个funcNode就行了
		//		[data_standAction,funcNode,data_standAction2]
};


normal_att_state1 = {
		state : 1,
		name : "normal_attack1",
		type : 1,
		key : 1,
		frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"],
		keyFrame : 1,
		rect : [10,10,50,50],
		hit : {
			type : 1,
			damage : 12
		}
},

normal_att_state2 = {
		state : 1,
		type : 1,
		name : "normal_attack2",
		key : 1,
		frames : ["deep_attack_2_1.png","deep_attack_2_2.png","deep_attack_2_3.png"],
		keyFrame : 2,
		rect : [10,10,50,50],
		hit : {
			type : 1,		//击中类型
			damage : 14,
		}
},

normal_att_state3 = {
		state : 1,
		type : 1,
		name : "normal_attack3",
		key : 1,
		frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"],
		keyFrame : 2,
		rect : [10,10,50,50],
		hit : {
			type : 2,		//击中类型
			damage : 14,
		}
}

normal_att_state_group = {
		name : "normal_attack_group",
		actions : ["normal_attack1","normal_attack2","normal_attack3"],
		repeat : {
			start : 0,
			end : 0,
			count : 2		//att1三下，att2一下
		}
}

skill_1 = {
		state : 1,
		name : "crossCutA",		//sword-round2类似
		frames : ["deep_crossCutA_1.png","deep_crossCutA_2.png","deep_crossCutA_3.png","deep_crossCutA_4.png"],
		rect : [50,50,150,30],
		target : 1,			//目标类型
		hit : {
			type : 1,		//击中类型
			damage : 20,
		}
}

skill_2 = {
		state : 1,
		name : "crossCutB",
		frames : ["deep_crossCutB_1.png","deep_crossCutB_2.png","deep_crossCutB_3.png","deep_crossCutB_4.png"],
		rect : [50,50,150,30],
		target : 1,			//目标类型
		hit : {
			type : 1,		//击中类型
			damage : 20,
		}
}

skill_3 = {
		state : 1,
		name : "crossCutC",
		frames : ["deep_crossCutC_1.png","deep_crossCutC_2.png","deep_crossCutC_3.png","deep_crossCutC_4.png","deep_crossCutC_5.png"],
		type : 3,		//fire sprite
		fire : "sword-shadow",
}

skill_group = {
		name : "crossCut",
		actions : ["crossCutA","crossCutB","crossCutC"],
		occurType : 1,	//触发
		fireType : 1,		//施放
}

skill_4 = {
		state : 1,
		name : "roundCutA",
		frames : ["deep_roundCutA_1.png","deep_roundCutA_2.png","deep_roundCutA_3.png","deep_roundCutA_4.png","deep_roundCutA_5.png","deep_roundCutA_6.png"],
		key : 1
}

skill_5 = {
		state : 1,
		name : "roundCutB",
		frames : ["deep_roundCutB_1.png","deep_roundCutB_2.png","deep_roundCutB_3.png","deep_roundCutB_4.png","deep_roundCutB_5.png","deep_roundCutB_6.png"],
		key : 2
}

act_tree = {
		actionNodes : [{
			name : "roundCutA",
			next : [{
				name : "roundCutA"
			},
			{
				name : "roundCutB"
			}
			]
		},
		{
			name : "roundCutB",
			next : [{
				name : "roundCutB"
			},
			{
				name : "roundCutA"
			}
			]
		}]
}

data_AttackState = {
		name : "attackState",
		state : 1,
		key : 1,
		actions : ["attackAction1","attackAction2"]
};

data_walkState = {
		name : "walkState",
		state : 2,
		key : 2,
		action : "walkAction"
};

//a character
character = {
		name : "DFL",
		res : "deep",
		states : [	//init states_tree
		   {
			   name : "standState",
			   next : [
			      {
			    	  name : "attackState"
			      }
			   ]
		   },
		   {
			   name : "walkState",
			   next : [
			      {
			    	  name : "attackState"
			      }
			   ]
		   }
		],
		property : {
			life : 1,
			hp : 200,
			strength : 23,
			defense : 20,
			speed : 16
		}
};

	//以下是 temp data

var skillTemp = {
	name : "sk",
	type : 1,				//主动瞬发、主动施放、被动等
	targetType : 1,
	collideType : 1,
	releaseTime : 3,
	releaseAction : "re-act",
	mainAction : "main-act"
}

var actBase = {
	id : "1",
	name : "act1",
	frames : ["1","2","3"],
	type : 0,
	factor : 1.0				//速度系数，默认为1，主数定义在unit中
};
var stand = {};
var walk = {};
var jump = {};

var att3 = {
	id : "12",
	name : "att3",
	frames : ["9"],
	type : 12,
	key : -1,
	interval : 0.2,
	rect : [0,0,35,15],
	handler : "object2"
};
