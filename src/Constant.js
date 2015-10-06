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
		PLAYER : 1,
		FRIEND : 2,
		ENEMY : 3
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
		animate : 1,
		livetime : 2,
		hit : 4,
		hurt : 8,
		motion : 16,
	},
	ActionFeature : {
		motion : 1,
		time : 2,
		attack : 4,
		summon : 8,			//会放出其他单位的，如子弹、召唤物、魔法阵等
		consume : 16,		//消耗MP、HP之类的，或组合式，用二进制就对了
		etc : 32
	}
};


Constant.nodeType = {
	ACTION : "action",
	FUNC : "func",
	STATE : "state"
};

Constant.eventType = {
	ATTACK : "attack",
	HIT : "hit",
	HURT : "hurt",
	RELEASE_SKILL : "release_skill",
	DEAD : "dead"
};

Constant.eventPriority = {
		HIGHEST_PRIORITY : 0,
		LOWEST_PRIORITY : 99
};