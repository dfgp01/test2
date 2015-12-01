/**
 * 用于定义常量的
 */

Constant = {
	DIRECT_CHILDNODE : "-",
	ANIMATE_TYPE : {
		NORMAL : 0,
		LOOP : 1
	},
	ACTION_TYPE : {
		CUSTOM : 0,
		STAND : 1,
		WALK : 2,
		ATTACK : 8
	},
	ACTION_STATE : {
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
	ACTION_SYSTEM : {
		STAND : "stand",
		WALK : "walk",
		MOTION : "motion"
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
	UnitGroup : {
		NONE : 0,
		BLOCK : 1,		//可破坏的场景物品，所有攻击单位均可对其破坏
		ITEM : 2,		//可获得的道具（拾取、接触），通常只有玩家能获得
		FACTION1 : 4,	//阵营1，单机中是玩家阵营
		FACTION2 : 8,	//阵营2，单机中是敌人阵营
		FACTION3 : 16,	//阵营3，单机中是中立阵营，很少会用到
	},
	GameObjectType : {
		NONE : 0,				//无
		MONSTER : 1,		//一般杂兵
		HERO : 2,				//大人物
		SUMMON : 3,		//召唤兽
		BULLET : 4,			//子弹、飞行道具
		ITEM : 5,				//可拾取物
		OBJECT : 6,			//障碍物、可破坏物、特效等其他物体对象
		AREA : 7				//区域
	},
	GameObjectFeature : {		//对象特征码，用二进制表示
		ANIMATE : 1,
		LIVETIME : 2,
		HIT : 4,
		HURT : 8,
		MOTION : 16,
	},
	ActionFeature : {
		MOTION : 1,
		TIME : 2,
		HIT : 4,
		SUMMON : 8,			//会放出其他单位的，如子弹、召唤物、魔法阵等
		CONSUME : 16,			//消耗MP、HP之类的，或组合式，用二进制就对了
		ETC : 32
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
			BORN : 1,
			START_ACTION : 2,
			ATTACK : 3,
			HIT : 4,
			HURT : 5,
			DEAD : 6
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
	eventPriority = {
		HIGHEST_PRIORITY : 0,
		LOWEST_PRIORITY : 99
	}
};
