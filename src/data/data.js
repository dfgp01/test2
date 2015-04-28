/**
 *  entity
 */

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
		name : "normal_attack1",
		type : 1,
		key : 1,
		frames : ["deep_att_1.png","deep_att_2.png","deep_att_1.png"],
		keyFrame : 1,
		rect : [10,10,50,50],
		hit : {
			type : 1,
			damage : 12
		}
},

normal_att_state2 = {
		type : 1,
		name : "normal_attack2",
		key : 1,
		frames : ["deep_att_3.png","deep_att_4.png","deep_att_5.png"],
		keyFrame : 2,
		rect : [10,10,50,50],
		hit : {
			type : 1,		//击中类型
			damage : 14,
		}
},

normal_att_state3 = {
		type : 1,
		name : "normal_attack3",
		key : 1,
		frames : ["deep_att_4.png","deep_att_5.png","deep_att_6.png","deep_att_7.png"],
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
		name : "sword-round1",		//sword-round2类似
		frames : ["deep_sk_0.png","deep_sk_1.png","deep_sk_2.png","deep_sk_3.png"],
		rect : [50,50,150,30],
		target : 1,			//目标类型
		hit : {
			type : 1,		//击中类型
			damage : 20,
		}
}

skill_3 = {
		name : "sword-round3",
		frames : [],
		type : 3,		//fire sprite
		fire : "sword-shadow",
}

skill_group = {
		name : "sword-round",
		actions : ["sword-round1","sword-round2","sword-round3","sword-round-end"],
		occurType : 1,	//触发
		fireType : 1,		//施放
}

wind_cut1 = {
		name : "wind-cut1",
		frames : ["deep_sk_6.png","deep_sk_7.png","deep_sk_8.png","deep_sk_9.png"],
}

wind_cut1_1 = {
		name : "wind-cut1_1",
		frames : ["deep_sk_6.png","deep_sk_7.png","deep_sk_8.png","deep_sk_9.png"],
}

wind_cut1_2 = {
		name : "wind-cut1_2",
		frames : ["deep_sk_6.png","deep_sk_7.png","deep_sk_8.png","deep_sk_9.png"],
}

wind_cut1_1_1 = {
		name : "wind-cut1_1_1",
		frames : ["deep_sk_6.png","deep_sk_7.png","deep_sk_8.png","deep_sk_9.png"],
}

wind_cut2 = {
		name : "wind-cut2",
		frames : ["deep_sk_6.png","deep_sk_7.png","deep_sk_8.png","deep_sk_9.png"],
}

act_tree = {
		actionNodes : [{
			name : "wind_cut1",
			next : [{
				name : "wind_cut1_1",
				next[{
					name : "wind_cut1_1_1"
				},{
					name : "wind_cut2"
				}]
			},
			{
				name : "wind_cut1_2",
				next[{
					name : "wind_cut2"
				}]
			}]
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
