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
		TYPE_NONE : 0,
		TYPE_CHARACTER : 1,
		TYPE_BULLET	: 2,
		TYPE_BLOCK : 3,
		TYPE_ITEM : 4,

		Team1 : { TYPE : 1, NAME : "team1"},	//阵营1，单机中是玩家阵营
		Team2 : { TYPE : 1, NAME : "team2"},	//阵营2，单机中是敌人阵营
		BLOCK : { TYPE : 3, NAME : "block"},	//可破坏的场景物品，所有攻击单位均可对其破坏
		ITEM :	{ TYPE : 4, NAME : "item"},		//可获得的道具（拾取、接触），通常只有玩家能获得
		ETC : 	{ TYPE : 0, NAME : "etc"},		//中立阵营，不参与碰撞检测，可能只是播放动画什么的
		
		TEAM1_INDEX : 0
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
		System : {
			TYPE : "system"
		}
	},
	HitType : {
		NONE : 0,			//无任何受击动作影响
		MOTION : 1,			//是否位移
		KNOCK_DOWN : 2,		//是否倒地攻击
		REMOTE : 4			//是否远程攻击
	},
	Collide : {
		TARGET_NODE : 0,
		TARGET_BLOCK : 1,
		TARGET_ENEMY : 2,
		TARGET_FRIEND : 4,
		TARGET_SELF : 8,
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
