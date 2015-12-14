/**
 * 用于定义常量的
 */
Constant = {
	DIRECT_CHILDNODE : "-",
	ANIMATE_TYPE : {
		NORMAL : 0,
		LOOP : 1
	},
	
	Action : {
		Feature : {
			MOTION : 1,
			TIME : 2,
			HIT : 4,
			SUMMON : 8,			//会放出其他单位的，如子弹、召唤物、魔法阵等
			CONSUME : 16,			//消耗MP、HP之类的，或组合式，用二进制就对了
			ETC : 32
		},
		Type : {
			CUSTOM : 0,
			STAND : 1,
			WALK : 2,
			ATTACK : 8
		},
		Status : {
			STAND : 0,
			WALK : 1,
			AIR : 2,
			LIE_DOWN : 3,
			HITTED : 4,
			BUSY : 5,
			DEAD : 6,
			RELEASE : 7,
			ATTACK : 8
		},
		System : {
			STAND : "stand",
			WALK : "walk",
			MOTION : "motion"
		}
	},

	CMD : {
		UP : 128,
		DOWN : 64,
		LEFT : 32,
		RIGHT : 16,
		ALL_DIRECTION : 240,	//用于判断是否按下了任一方向键，不用每次判断都用 "|"运算
		ATTACK_ONCE : 1,		//按一下攻击
		ATTACK_HOLD_ON : 2,	//按住攻击（比如蓄力）
		ATTACK_ALL : 3,			//单击或按住
		JUMP : 4
	},
	
	Group : {
		
		//这个只是用来作与运算，标出阵营的
		ALL_TEAM_MASK : 15,		//8+4+2+1，四个阵营的groupMask
			
		//PLAYER :	{ index : 0, mask : 1},			//这个用来存放玩家的，当然，在所属阵营组中也要存放
		TEAM1 : { index : 0, mask : 1},		//阵营1，单机中是玩家阵营
		TEAM2 : { index : 1, mask : 2},		//阵营2，单机中是敌人阵营
		TEAM3 : { index : 2, mask : 4},		//阵营3，单机中是中立阵营，很少会用到
		TEAM4 : { index : 3, mask : 8},		//留待扩展
		BLOCK : 	{ index : 4, mask : 16},		//可破坏的场景物品，所有攻击单位均可对其破坏
		ITEM :		{ index : 5, mask : 32},		//可获得的道具（拾取、接触），通常只有玩家能获得
		NEUTRAL : 	{ index : 6, mask : 64}	//中立阵营，不参与碰撞检测，可能只是播放动画什么的
	},
	
	GameObject : {
		Type : {
			NONE : 0,				//无
			MONSTER : 1,		//一般杂兵
			HERO : 2,				//大人物
			SUMMON : 3,		//召唤兽
			BULLET : 4,			//子弹、飞行道具
			ITEM : 5,				//可拾取物
			OBJECT : 6,			//障碍物、可破坏物、特效等其他物体对象
			AREA : 7				//区域
		},
		Feature : {				//对象特征码，用二进制表示
			ANIMATE : 1,
			LIVETIME : 2,
			HIT : 4,
			HURT : 8,
			MOTION : 16,
		}
	},

	Tick : {
		FPS60 : 0.0166,
		FPS48 : 0.02,
		FPS36 : 0.027,
		FPS30 : 0.0333,
		FPS24 : 0.041,
		FPS20 : 0.05,
		FPS12 : 0.083,
		FPS10 : 0.1,
		FPS05 : 0.2
	},
	MsgType : {
		Unit : {
			TYPE : "unit",
			BORN : "born",
			START_ACTION : "start_action",
			ATTACK : "attack",
			HIT : "hit",
			HURT : "hurt",
			DEAD : "dead"
		},
		UNIT_BORN : "unit_born",
		UNIT_START_ACTION : "unit_start_action",
		UNIT_ATTACK : "unit_attack",
		UNIT_HIT : "unit_hit",
		UNIT_HURT : "unit_hurt",
		UNIT_DEAD : "unit_dead",
		Sys : {
			TYPE : "sys"
		}
	},
	HitType : {
		NONE : 0,
		NORMAL : 1,
		KNOCK_DOWN : 2
	},
	Collide : {
		Target : {
			NONE : 0,
			BLOCK : 1,
			ENEMY : 2,
			FRIEND : 4,
			SELF : 8
		},
		Amount : {
			ONE : 1,
			MULTI : 99
		}
	},
	eventPriority : {
		HIGHEST_PRIORITY : 0,
		LOWEST_PRIORITY : 99
	}
};
