/**
*	左侧方向控制器
*/
Button = cc.Class.extend({
	rect : null,
	cmd : 0
});

Arrows = {
	sprite : null,
	buttons : [],
	cmd : 0,
	
	init : function(layer, posX, posY){

		this.sprite = new cc.Sprite(res.arrows);
		this.sprite.attr({
			x: posX,
			y: posY
		});
		layer.addChild(this.sprite, 5);
		
		this.initButtons_1(this.sprite.getContentSize().width, this.sprite.getContentSize().height);
		
		var selfPointer = this;
		var listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				var locationInNode = selfPointer.sprite.convertToNodeSpace(touch.getLocation());
				for(var i in selfPointer.buttons){
					if(cc.rectContainsPoint(selfPointer.buttons[i].rect, locationInNode)){
						selfPointer.cmd = selfPointer.cmd | selfPointer.buttons[i].cmd;
					}
				}
				return true;
			},
			onTouchMoved: function (touch, event) {
				//cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
			},
			onTouchEnded: function (touch, event) {
				selfPointer.cmd = 0;
			}
		});
		cc.eventManager.addListener(listener, this.sprite);
	},
	
	//别忘了这里是gl坐标系
	initButtons_1 : function(width, height){
		
		var bt = new Button();
		//左边矩形
		bt.rect = cc.rect(0, 0, width / 3, height);
		bt.cmd = Constant.CMD.LEFT;
		this.buttons.push(bt);
		
		//上边矩形
		bt = new Button();
		bt.rect = cc.rect(0, height * 2 / 3, width, height / 3);
		bt.cmd = Constant.CMD.UP;
		this.buttons.push(bt);
		
		//右边矩形
		bt = new Button();
		bt.rect = cc.rect(width * 2 / 3, 0, width / 3, height);
		bt.cmd = Constant.CMD.RIGHT;
		this.buttons.push(bt);
		
		//下边矩形
		bt = new Button();
		bt.rect = cc.rect(0, 0, width, height / 3);
		bt.cmd = Constant.CMD.DOWN;
		this.buttons.push(bt);
		
	}
};