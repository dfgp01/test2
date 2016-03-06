/**
*		UI组件相关逻辑的类
*/

/**
 *	按钮
 */
Button = cc.Class.extend({
	sprite : null,
	rect : null,
	cmd : 0,
	
	init : function(sprite, posX, posY){
		sprite.attr({
			x: posX,
			y: posY
		});
		this.sprite = sprite;
		
		//因为sprite的注册点在中间，但矩形的起始点从左下角开始算，被这个坑得很惨
		this.rect = cc.rect(
				sprite.getPositionX() - sprite.width * 0.5,
				sprite.getPositionY() - sprite.height * 0.5,
				sprite.width, sprite.height);
	},
	
	press : function(locationInNode){
		return;
	}
});


/**
 * 方向键
 */
Arrows = Button.extend({
	buttons : [],

	init : function(sprite, posX, posY){
		this._super(sprite, posX, posY);
		this.initButtons_1(sprite.getContentSize().width, sprite.getContentSize().height);
		//this.initButtons_2(this.sprite.getContentSize().width, this.sprite.getContentSize().height);
	},

	/**
	 * 按下任一方向键
	 */
	press : function(locationInNode){
		for(var i in this.buttons){
			if(cc.rectContainsPoint(this.buttons[i].rect, locationInNode)){
				this.cmd = this.cmd | this.buttons[i].cmd;
			}
		}
	},

	/**
	 * 放开按键
	 */
	release : function(){
		this.cmd = 0;
	},

	/**
	 * 暂时不用这个方法
	 */
	/*initListener : function(){
			var selfPointer = this;
			var listener = cc.EventListener.create({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan: function (touch, event) {
					var locationInNode = selfPointer.sprite.convertToNodeSpace(touch.getLocation());
					//四矩形模式
					for(var i in selfPointer.buttons){
						if(cc.rectContainsPoint(selfPointer.buttons[i].rect, locationInNode)){
							selfPointer.cmd = selfPointer.cmd | selfPointer.buttons[i].cmd;
						}
					}
					selfPointer.playerSys.pressDirection(selfPointer.cmd);
					return true;
				},
				onTouchMoved: function (touch, event) {
					//cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
				},
				onTouchEnded: function (touch, event) {
					selfPointer.cmd = 0;
					selfPointer.playerSys.releaseKey(Constant.CMD.ALL_DIRECTION);
				}
			});
			cc.eventManager.addListener(listener, this.sprite);
		},*/

	/**
	 * 四矩形模式
	 */
	initButtons_1 : function(width, height){
		//别忘了这里是gl坐标系
		var bt = new Button();
		//左边矩形
		bt.rect = cc.rect(0, 0, width / 3, height);
		bt.cmd = Constant.CMD_LEFT;
		this.buttons.push(bt);

		//上边矩形
		bt = new Button();
		bt.rect = cc.rect(0, height * 2 / 3, width, height / 3);
		bt.cmd = Constant.CMD_UP;
		this.buttons.push(bt);

		//右边矩形
		bt = new Button();
		bt.rect = cc.rect(width * 2 / 3, 0, width / 3, height);
		bt.cmd = Constant.CMD_RIGHT;
		this.buttons.push(bt);

		//下边矩形
		bt = new Button();
		bt.rect = cc.rect(0, 0, width, height / 3);
		bt.cmd = Constant.CMD_DOWN;
		this.buttons.push(bt);

	},

	/**
	 * 八矩形模式
	 */
	initButtons_2 : function(width, height){
		//别忘了这里是gl坐标系
		var bt = new Button();
		//左上矩形
		bt.rect = cc.rect(0, height *2 / 3, width / 3, height / 3);
		bt.cmd = Constant.CMD_LEFT | Constant.CMD_UP;
		this.buttons.push(bt);

		//左中矩形
		bt = new Button();
		bt.rect = cc.rect(0, height / 3, width / 3, height / 3);
		bt.cmd = Constant.CMD_LEFT;
		this.buttons.push(bt);

		//左下矩形
		bt = new Button();
		bt.rect = cc.rect(0, 0, width / 3, height / 3);
		bt.cmd = Constant.CMD_LEFT | Constant.CMD_DOWN;
		this.buttons.push(bt);

		//中上矩形
		bt = new Button();
		bt.rect = cc.rect(width / 3, height *2 / 3, width / 3, height / 3);
		bt.cmd = Constant.CMD_UP;
		this.buttons.push(bt);

		//中下矩形
		bt = new Button();
		bt.rect = cc.rect(width / 3, 0, width / 3, height / 3);
		bt.cmd = Constant.CMD_DOWN;
		this.buttons.push(bt);

		//右上矩形
		bt = new Button();
		bt.rect = cc.rect(width *2 / 3, height *2 / 3, width / 3, height / 3);
		bt.cmd = Constant.CMD_RIGHT | Constant.CMD_UP;
		this.buttons.push(bt);

		//右中矩形
		bt = new Button();
		bt.rect = cc.rect(width *2 / 3, height / 3, width / 3, height / 3);
		bt.cmd = Constant.CMD_RIGHT;
		this.buttons.push(bt);

		//右下矩形
		bt = new Button();
		bt.rect = cc.rect(width *2 / 3, 0, width / 3, height / 3);
		bt.cmd = Constant.CMD_RIGHT | Constant.CMD_DOWN;
		this.buttons.push(bt);
	}
});