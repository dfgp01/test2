GameSetting = {

	framerate : 60,				//cocos2d默认fps是60
	logicTick : Constant.Tick.FPS30,			//默认逻辑帧fps:30
	frameTick : Constant.Tick.FPS10,		//默认动画帧fps:24

	gravity : -2,				//一般重力，一些组件可设置自定义重力
	maxGravity : -10,			//最大引力
	
	hitBack : 15,					//硬直后退距离
	hitDownX : 135,			//倒地后退距离X
	hitDownY : 30,				//倒地后退距离Y
	stiffTime : 500,					//硬直时间(毫秒)
	knockDownTime : 800,	//倒地硬直时间(毫秒)
	
	attackDx : 5,		//普通攻击默认推进距离

	//单位移动时，Y轴与X轴的相对速度比
	unitSpeedFactor : {
		walkX : 1,
		walkY : 0.618,
		//runX : 2,
		//runY : 1.6,
		airX : 0.9,
		airY : 0.8
	}
};

//可以做成系统变量
commonActions = {
	list:[{
		name:"block",
		animate:{
			type: Constant.animate.TYPE_STATIC
		},
		rect:[10,10,10,10]
	},{
		name:"block-hurt",
		animate:{
			type: Constant.animate.TYPE_SHAKE
		}
	},{
		name:"animate-only",
		animate:{
			type: Constant.animate.TYPE_SCROLL
		}
	}]
}

deep = {
	name : "deep",
	disName : "玩家",
	res : [res.deep_0_plist,res.deep_1_plist,res.deep_2_plist],
	actions : actions
};

actions : {
	stand : {
		animate:{
			frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"]
		}
	},
	run : {
		animate : {
			frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"],
			//delays : [1, 2, 3, 4]
		},
		motion : {
			dx : 10,
			dz : 50
		}
	},
	hurt : {
		type : 1,
		animate : {
			frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png"]
		}
	},
	attack : {
		style : 1,
		list : [
		  {
			animate : {
				frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"]
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
		},{
			
		}]
	}
};

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
				type : Constant.ANIMATE_TYPE.LOOP,
				speedFactor : 2,
				frames : ["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"]
			},
			availableAtt : ["attack","crossCutA","roundCutA"]
		},
		{
			name : "walk",
			featureCode : 1,
			animate : {
				type : Constant.ANIMATE_TYPE.LOOP,
				speedFactor : 1,
				frames : ["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"],
				//delays : [1, 2, 3, 4]
			},
			motion : {
				dx : 10,
				dy : 50
			}
		},
		{
			name : "hurt",
			featureCode : 32,
			animate : {
				frames : ["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png"]
			}
		},
		{
			name : "attack",  key : "A",
			featureCode : 4,
			animate : {
				frames : ["deep_attack_1_1.png","deep_attack_1_2.png","deep_attack_1_3.png"]
			},
			hit : {
				style : 0,	//利器、钝器、拳头等等
				type : Constant.HitType.MOTION,	//普通后退、倒地等
				hp : 100,
				rect : [10,10,100,100],
				frame : 1,
				direction : 1,
				num : 1
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
