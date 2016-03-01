characterData = {
	name : "deep",
	frame : "deep_stand_0.png",
	title : "玩家",
	res : [res.deep_0_plist,res.deep_1_plist,res.deep_2_plist],
	action : {
			stand : {
				animate : {
					frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"],
					inteval : 1
				},
			},
			walk : {
				animate : {
					frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"]
				},
				motion : {
					dx : 10,
					dy : 50
				}
			},
			hurt : {
				type : 1,
				frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png"]
			},
			hit : {
				strength : 23,
				speed : 16,
				actions : [{
					animate : {
						frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"],
						intevals : [1,1,1]
					},
					hit : {
						style : 0,	//利器、钝器、拳头等等
						type : Constant.HitType.MOTION,	//普通后退、倒地等
						damage : 10.2,
						rect : [10,10,100,100],
						frame : 1,
						direction : 1,
						num : 1
					}
				}]
			},
			custom : []
	}
}