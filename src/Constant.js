/**
 * 用于定义常量的
 */
Constant = {
	DIRECT_CHILDNODE : "-",
	
	/**
	 * 动作状态（暂定）
	 */
	ACTION_STATE_DEFAULT : 0,	//默认或前摇
	ACTION_STATE_ATTACK : 1,	//触发攻击
	ACTION_STATE_ENDING : 2,	//后摇，收尾
	
	/**
	 * 用于表示文本数据的逻辑
	 */
	BOOLEAN_TRUE : 1,
	BOOLEAN_FALSE : 0,
	
	/**
	 * 动画组件系统类型枚举
	 */
	ANIMATE_STATIC : 0,		//播放完之后会停在最后一帧，不会结束动作
	ANIMATE_ONCE : 1,		//播放完之后会结束动作
	ANIMATE_SCROLL : 2,		//循环播放
	
	/**
	 * 运动组件系统类型枚举
	 */
	MOVE_NORMAL : 0,	//固定直线匀速移动方式
	
	/**
	 * 指令组件系统类型枚举
	 */
	COMMAND_DEFAULT : 0,
	COMMAND_CHARACTER_STAND : 1,
	COMMAND_CHARACTER_WALK : 2,
	COMMAND_CHARACTER_ATTACK : 3,
	
	
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
	CMD_RIGHT : 1,
	CMD_LEFT : 2,
	CMD_UP : 4,
	CMD_DOWN : 8,
	CMD_DIRECTION_CHARGE : 16,
	CMD_PLAYER_ATTACK : 11,
	CMD_AI_ATTACK : 1,
	CMD_ATTACK_CHARGE : 10,
	CMD_JUMP_ONCE : 11,
	CMD_JUMP_CHARGE : 10,
	
	/**
	 * 连续指令
	 */
	COMBO_KEY_FRONT : 6,
	COMBO_KEY_BACK : 4,
	COMBO_KEY_UP : 8,
	COMBO_KEY_DOWN : 2,
	COMBO_KEY_ATTACK : 1,
	
	/**
	 **** 以下是旧版，打算用二进制方式开发的
	 * 技能摇键组合，懒得计算，RL可表示右左，也可以是前后，有些版本是不分左右，只有前后的
	 * 如果只是兼容四方向（上下左右），那么两位二进制就够了，00右，01左 10上 11下
	 * 现在使用三位二进制是为了以后兼容八方向。 如000右上，100右下，001左上，101左下
	 */
	KEY_RIGHT_RIGHT			: 64,	//1000000
	KEY_RIGHT_LEFT 			: 65,	//1000001
	KEY_UP_UP 				: 82,	//1010010
	KEY_UP_DOWN 			: 83,	//1010011
	KEY_DOWN_UP 			: 90,	//1011010
	KEY_DOWN_DOWN 			: 91,	//1011011

	KEY_RIGHT_RIGHT_RIGHT	: 512,	//1000000000
	KEY_RIGHT_RIGHT_LEFT	: 513,	//1000000001
	KEY_RIGHT_LEFT_LEFT 	: 521,	//1000001001
	KEY_RIGHT_DOWN_LEFT 	: 537,	//1000011001
	KEY_UP_DOWN_RIGHT 		: 664,	//1010011000
	KEY_DOWN_UP_RIGHT 		: 720,	//1011010000
	KEY_DOWN_UP_UP 			: 722,	//1011010010
	KEY_DOWN_DOWN_UP 		: 730,	//1011011010
	
	/**
	 * 帧时间
	 */
	TICK_FPS60 : 0.0166,
	TICK_FPS48 : 0.02,
	TICK_FPS36 : 0.027,
	TICK_FPS30 : 0.0333,
	TICK_FPS25 : 0.04,
	TICK_FPS24 : 0.041,
	TICK_FPS20 : 0.05,
	TICK_FPS12 : 0.083,
	TICK_FPS10 : 0.1,
	TICK_FPS05 : 0.2,
	
	/**
	 * 攻击类型
	 */
	HIT_TYPE_NONE : 0,			//无任何受击动作影响
	HIT_TYPE_MOVE : 1,		//是否位移
	HIT_TYPE_KNOCK_DOWN : 2,	//是否倒地攻击
	HIT_TYPE_REMOTE : 4,		//是否远程攻击
	HIT_TYPE_PAUSE : 8,			//是否停顿
	HIT_TYPE_SHAKE : 16,		//是否震动
	
	/**
	 * 事件类型
	 */
	EVT_PLAYER_INPUT : 0,		//玩家输入指令
	EVT_UNIT_CHANGE_PLACE : 0,	//单位改变位置
	EVT_UNIT_ATTACK : 0,		//单位发起攻击
	EVT_UNIT_HIT : 0,			//单位击中目标
	EVT_UNIT_HURT : 0,			//单位受到攻击
	EVT_UNIT_START_ACTION : 0,	//单位开始执行新动作
	EVT_UNIT_ENTER : 0,			//单位进入场景
	EVT_UNIT_CLEAR : 0,			//单位被系统清除
	EVT_UNIT_DIE : 0,			//单位死亡
	EVT_UNIT_CHANGE_STATE : 0,	//单位改变状态（Buff）
	EVT_UNIT_CHANGE_HP : 0,		//单位体力值发生变化
	EVT_UNIT_TAKE_ITEM : 0,		//单位拾取物品
	EVT_SYS_SCENE_SWITCH : 0,	//场景开始切换
	EVT_SYS_SCENE_LOADED : 0,	//场景加载完毕
	
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
