characterData = {
	name : "deep",
	frame : "deep_stand_0.png",
	title : "玩家",

	stand : {
		view : {
			animate : {
				frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"],
				intervals : [0.2,0.2,0.2,0.2]
			}
		}
	},
	walk : {
		view : {
			animate : {
				frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"],
				intervals : [0.1,0.1,0.1,0.3]
			}
		},
		move : {
			dx : 100,
			dy : 50
		},
		command : {
			type : 2,
			list : []
		}
	}
	/*hurt : {
		type : 1,
		frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png"]
	},*/
	/*hit : {
		actions : [
		  {
			  animate : {
				  frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"],
				  intervals : [1,1,1]
			  },
			  hit : {
				  type : 1,	//普通后退、倒地等		枚举HIT_TYPE_MOVE
				  damage : 10.2,
				  rect : [10,10,100,100],
				  frame : 1,
				  num : 1
			  }
		  },
		  {
			  animate : {
				  frames : ["deep_attack_2_1.png","deep_attack_2_2.png","deep_attack_2_3.png"],
				  intervals : [1,1,1]
			  }
		  },
		  {
			  animate : {
				frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"],
				intervals : [1,1,1]
			  }
		  }
		],
		command : {
			type : 3,
			list : [
			    {key:1, action:"crossCutA"},
			    {key:2, action:"roundCutA"}
			]
		}
	}*/
};

extendActions = [
    {
    	name : "crossCutA", key : "FTA",
		featureCode : 4,
		animate : {
			frames : ["deep_crossCutA_1.png","deep_crossCutA_2.png","deep_crossCutA_3.png","deep_crossCutA_4.png"]
		}
    },
    {
		name : "crossCutB",
		featureCode : 4,
		animate : {
			frames : ["deep_crossCutB_1.png","deep_crossCutB_2.png","deep_crossCutB_3.png","deep_crossCutB_4.png"]
		}
	},
	{
		name : "crossCutC",
		featureCode : 4,
		animate : {
			frames : ["deep_crossCutC_1.png","deep_crossCutC_2.png","deep_crossCutC_3.png","deep_crossCutC_4.png","deep_crossCutC_5.png"]
		}
	},
	{
		name : "roundCutA", key : "DUA",
		featureCode : 4,
		animate : {
			frames : ["deep_roundCutA_1.png","deep_roundCutA_2.png","deep_roundCutA_3.png","deep_roundCutA_4.png","deep_roundCutA_5.png","deep_roundCutA_6.png"]
		}
	},
	{
		name : "roundCutB", key : "FFA",
		featureCode : 4,
		animate : {
			frames : ["deep_roundCutB_1.png","deep_roundCutB_2.png","deep_roundCutB_3.png","deep_roundCutB_4.png","deep_roundCutB_5.png","deep_roundCutB_6.png"]
		}
	}
];