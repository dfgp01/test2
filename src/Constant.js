/**
 * 用于定义常量的
 */
Constant = {
	DIRECT_CHILDNODE : "-",
	
	/**
	 * 用于表示文本数据的逻辑
	 */
	BOOLEAN_TRUE : 1,
	BOOLEAN_FALSE : 0,
	
	/**
	 * 动画类型枚举
	 */
	ANIMATE_STATIC : 0,		//只有一帧
	ANIMATE_NORMAL : 1,		//只播放一次
	ANIMATE_SCROLL : 2,		//循环播放
	
	/**
	 * 组件名称
	 */
	COMPONENT_ANIMATE : 'animate',
	COMPONENT_MOTION : 'motion',
	COMPONENT_HURT : 'hurt',
	COMPONENT_HIT : 'hit',
	COMPONENT_TIMER : 'timer',
	
	/**
	 * 单位类型
	 */
	GAMEOBJECT_TILE : 0,
	GAMEOBJECT_CHARACTER : 1,
	
	/**
	 * 输入指令
	 */
	CMD_UP : 128, 
	CMD_DOWN : 64,
	CMD_LEFT : 32,
	CMD_RIGHT : 16,
	CMD_ALL_DIRECTION : 240,	//用于判断是否按下了任一方向键，不用每次判断都用 "|"运算
	CMD_ATTACK_ONCE : 1,		//按一下攻击
	CMD_ATTACK_HOLD_ON : 2,		//按住攻击（比如蓄力）
	CMD_ATTACK_ALL : 3,			//单击或按住
	CMD_JUMP : 4,
	
	/**
	 * 帧时间
	 */
	TICK_FPS60 : 0.0166,
	TICK_FPS48 : 0.02,
	TICK_FPS36 : 0.027,
	TICK_FPS30 : 0.0333,
	TICK_FPS24 : 0.041,
	TICK_FPS20 : 0.05,
	TICK_FPS12 : 0.083,
	TICK_FPS10 : 0.1,
	TICK_FPS05 : 0.2,
	
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
		Interact : {
			UNIT : 0,
			BLOCK : 1,
			PICKABLE : 2,
			TOUCHABLE : 3,
			ZONE : 4
		},
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
		REMOTE : 4,			//是否远程攻击
		PAUSE : 8,			//是否停顿
		SHAKE : 16			//是否震动
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
