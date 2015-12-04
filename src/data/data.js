playerData = {
	unit : "deep",
	name : "DFL",
};

//stand is first act for all unit
characterData = {
	name : "deep",
	res : "deep",
	type : 2,
	featureCode : 29,
	speedFactor : 1,
	actions : [
		{
			name : "stand",
			featureCode : 0,
			animate :{
				type : 1,
				speedFactor : 2,
				frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"]
			},
			availableAtt : ["attack","crossCutA","roundCutA"]
		},
		{
			name : "walk",
			featureCode : 1,
			animate : {
				type : 1,
				speedFactor : 1,
				frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"]
			},
			motion : {
				dx : 100,
				dy : 50
			}
		},
		{
			name : "hurt",
			featureCode : 32,
			animate : {
				frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png","deep_hurt_5.png","deep_hurt_4.png","deep_hurt_4.png"]
			}
		},
		{
			name : "attack",  key : "A", keyFrame : 1,
			featureCode : 4,
			animate : {
				frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"]
			},
			hit : {
				style : 0,	//利器、钝器、拳头等等
				type : 1,	//击退、击飞等
				hp : 100,
				rect : [10,10,100,100],
				frame : 1
			}
		},
		{
			name : "attack2", key : "A", keyFrame : 2,
			featureCode : 4,
			animate : {
				frames : ["deep_attack_2_1.png","deep_attack_2_2.png","deep_attack_2_3.png"]
			}
		},
		{
			name : "attack3", key : "A", keyFrame : 2,
			featureCode : 4,
			animate : {
				frames : ["deep_attack_3_1.png","deep_attack_3_2.png","deep_attack_3_3.png","deep_attack_3_4.png"]
			}
		},
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
	],
	/*actLamda : [	//lamda表达式：> + - [] () , 随便起的名字 -_-
	        "[attack>attack2,1]>attack3",
	        "crossCutA>crossCutB>crossCutC",
	        "roundCutA>{roundCutA,roundCutB}",
	        "roundCutB>{roundCutA,roundCutB}"
	],*/
	actLamda : [
	            "attack>{attack2,crossCutA}>{attack3,crossCutB}>crossCutC",
	],
	baseAct : ["attack"]
	//baseAct : ["roundCutA", "roundCutB"]
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
