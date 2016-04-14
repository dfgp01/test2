/**
 * 玩家控制器图层
 */
ControllerLayer = cc.Layer.extend({
	arrows : null,
	attButton : null,
	closeSprite : null,
	playerSys : null,
	
	ctor : function(){
		this._super();
		this.playerSys = SystemUtil.systems.player;
		this.playerSys.start();
		var winSize = cc.winSize;
		
		//close button
		 var closeItem = new cc.MenuItemImage(
	        		res.CloseNormal_png,
	        		res.CloseSelected_png,
	        		function () {
	        			cc.log("closeItem is clicked!");
	        			cc.director.popScene();
	        		}, this);
	        closeItem.attr({
	        	x: winSize.width - 20,
	        	y: 20,
	        	anchorX: 0.5,
	        	anchorY: 0.5
	        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 9);
	        
        //arrows
        var arrowsSprite = new cc.Sprite(res.arrows);
        this.arrows = new Arrows();
        this.arrows.init(arrowsSprite, 100, 100);
        this.addChild(arrowsSprite, 5);
        
        //attack button
        var attBtSp = new cc.Sprite(res.button);
        this.attButton = new Button();
        this.attButton.init(attBtSp, winSize.width - 100, 100);
        this.addChild(attBtSp, 5);
        
        this.initListener();
	},
	
	initListener : function(){
		var selfPointer = this;
        var listener = cc.EventListener.create({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	//event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		var location = touch.getLocation();
        		if(cc.rectContainsPoint(selfPointer.arrows.rect, location)){
        			selfPointer.arrows.press(selfPointer.arrows.sprite.convertToNodeSpace(location));
        			selfPointer.playerSys.pressDirection(selfPointer.arrows.command);
        			return true;
        		}
        		else if(cc.rectContainsPoint(selfPointer.attButton.rect, location)){
        			return false;
        		}
        		return false;
        	},
        	onTouchMoved: function (touch, event) {},
        	onTouchEnded: function (touch, event) {
        		selfPointer.arrows.release();
        		selfPointer.playerSys.directionEnd();
        	}
        });
        cc.eventManager.addListener(listener, this);
	}
});