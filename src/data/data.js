
lie_down_act = {
	name : "lieDown",		//被击倒后躺下的动作
	frames : ["deep_lieDown_x.png"],
	keep : 1,					//持续1秒
	playType : 2				//在最后一帧静止
};

shieldBuff_release = {
	name : "shieldBuff-release",			//无敌护盾
	action : "release",							//施放型的动作
	keep : 2										//过程持续2秒
	//etc: mp...
};

character_data = {
	characterName : "DFL",
	res : "deep",
	unitType : 1,
	firstFrame : "deep_stand_0.png",
	actions : [
		{
			name : "stand", animateType : 1, type : 1,
			frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"]
		},
		{
			name : "walk", animateType : 1, type : 2, dx : 5, dy : 3,
			frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"]
		},
		{
			name : "hurt", 
			frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png","deep_hurt_5.png","deep_hurt_4.png","deep_hurt_4.png"]
		},
		{
			name : "normalAtk1",  key : "x", keyFrame : 1,
			frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"]
		},
		{
			name : "normalAtk2", key : "x", keyFrame : 2, 
			frames : ["deep_attack_2_1.png","deep_attack_2_2.png","deep_attack_2_3.png"]
		},
		{
			name : "normalAtk3", key : "x", keyFrame : 2,
			frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"]
		},
		{
			name : "crossCutA", key : "z", 
			frames : ["deep_crossCutA_1.png","deep_crossCutA_2.png","deep_crossCutA_3.png","deep_crossCutA_4.png"]
		},
		{
			name : "crossCutB",
			frames : ["deep_crossCutB_1.png","deep_crossCutB_2.png","deep_crossCutB_3.png","deep_crossCutB_4.png"]
		},
		{
			name : "crossCutC",
			frames : ["deep_crossCutC_1.png","deep_crossCutC_2.png","deep_crossCutC_3.png","deep_crossCutC_4.png","deep_crossCutC_5.png"]
		},
		{
			name : "roundCutA", key : "c",
			frames : ["deep_roundCutA_1.png","deep_roundCutA_2.png","deep_roundCutA_3.png","deep_roundCutA_4.png","deep_roundCutA_5.png","deep_roundCutA_6.png"]
		},
		{
			name : "roundCutB", key : "v",
			frames : ["deep_roundCutB_1.png","deep_roundCutB_2.png","deep_roundCutB_3.png","deep_roundCutB_4.png","deep_roundCutB_5.png","deep_roundCutB_6.png"]
		}
	],
	actLamda : [	//lamda表达式：> + - [] () , 随便起的名字 -_-
	        "(normalAtk1>normalAtk2)[1]>normalAtk3",
	        "crossCutA>(crossCutB>crossCutC)",
	        "roundCutA>{roundCutA,roundCutB}",
	        "roundCutB>{roundCutA,roundCutB}"
	]
};

normal_att_state3 = {
		state : 1,
		type : 1,
		name : "normal_attack3",
		key : "x",
		frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"],
		keyFrame : 2,
		rect : [10,10,50,50],
		hit : {
			type : 2,		//击中类型
			damage : 14,
		}
}

/**
 * action-chain
 */
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
		key : "z",
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
		key : "c",
		frames : ["deep_roundCutA_1.png","deep_roundCutA_2.png","deep_roundCutA_3.png","deep_roundCutA_4.png","deep_roundCutA_5.png","deep_roundCutA_6.png"],
}

skill_5 = {
		state : 1,
		name : "roundCutB",
		key : "v",
		frames : ["deep_roundCutB_1.png","deep_roundCutB_2.png","deep_roundCutB_3.png","deep_roundCutB_4.png","deep_roundCutB_5.png","deep_roundCutB_6.png"]
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
unit_data = {
		name : "DFL",
		res : "deep",
		actions : {
			baseActions : ["idle", "normal_attack1", "crossCutA", "roundCutA"],
		},
		hurt : {
			hp : 200,
			defense : 20
		},
		hit : {
			strength : 23,
			attackSpeed : 16
		},
		move : {
			moveSpeed : 20
		}
};

character_conf = {
	res : "deep",
	baseActions : [],
}

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
