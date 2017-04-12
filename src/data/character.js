characterData = {
	name : "deep",
	frame : "deep_stand_0.png",
	title : "玩家",

	stand : {
		view : {
			animates : [{
				frames : [{
					name : "deep_stand_0.png",
					time : 2
				},{
					name : "deep_stand_1.png",
					time : 2
				},{
					name : "deep_stand_2.png",
					time : 2
				},{
					name : "deep_stand_3.png",
					time : 2
				},]
			}]
		},
		command : {
			list:["hit","crossCutA","roundCutA"]
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
			list:["hit","crossCutA","roundCutA"]
		}
	},
	hit : {
		sequence : {
			actions:[{
				repeat:{
					action : "deep_attack_1",
					count : 3
				}
			},"deep_attack_2","deep_attack_3"],
			command : {
				list:["crossCutA","roundCutA"]
			}
		}
	},
	actions : [
		{
	    	name : "crossCutA", input : 661,
			view : {
				animate : {
					frames : ["deep_crossCutA_1.png","deep_crossCutA_2.png","deep_crossCutA_3.png","deep_crossCutA_4.png"],
					intervals : [0.5,0.5,0.5,1.3]
				}
			}
	    },
	    {
			name : "crossCutB",
			view : {
				animate : {
					frames : ["deep_crossCutB_1.png","deep_crossCutB_2.png","deep_crossCutB_3.png","deep_crossCutB_4.png"],
					intervals : [0.5,0.5,0.5,1.3]
				}
			}
		},
		{
			name : "crossCutC",
			view : {
				animate : {
					frames : ["deep_crossCutC_1.png","deep_crossCutC_2.png","deep_crossCutC_3.png","deep_crossCutC_4.png","deep_crossCutC_5.png"],
					intervals : [0.5,0.5,0.5,0.5,1.3]
				}
			}
		},
		{
			name : "roundCutA", input : 461,
			view : {
				animate : {
					frames : ["deep_roundCutA_1.png","deep_roundCutA_2.png","deep_roundCutA_3.png","deep_roundCutA_4.png","deep_roundCutA_5.png","deep_roundCutA_6.png"],
					intervals : [0.5,0.5,0.5,0.5,0.5,1.3]
				}
			}
		},
		{
			name : "roundCutB", input : 461,
			view : {
				animate : {
					frames : ["deep_roundCutB_1.png","deep_roundCutB_2.png","deep_roundCutB_3.png","deep_roundCutB_4.png","deep_roundCutB_5.png","deep_roundCutB_6.png"],
					intervals : [0.5,0.5,0.5,0.5,0.5,1.3]
				}
			}
		},
		{
			name : "deep_attack_1",
			view : {
				animate : {
					frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"],
					intervals : [1,1,1]
				}
			},
			hit : {
				type : 1,	//普通后退、倒地等		枚举HIT_TYPE_MOVE
				damage : 10.2,
				rect : [10,10,100,100],
				frameIndex : 1,
				num : 1
			}
		},
		{
			name : "deep_attack_2",
			view : {
				animate : {
					frames : ["deep_attack_2_1.png","deep_attack_2_2.png","deep_attack_2_3.png"],
					intervals : [1,1,1]
				}
			}
		},
		{
			name : "deep_attack_3",
			view : {
				animate : {
					frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"],
					intervals : [1,1,1,2]
				}
			}
		}]
	/*hurt : {
		type : 1,
		frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png"]
	},*/
};