/**
 * 玩家控制器图层
 */
ControllerLayer = cc.Layer.extend({
	arrowsSprite : null,
	closeSprite : null,
	ctor : function(){
		this._super();
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
	        	x: this.winSize.width - 20,
	        	y: 20,
	        	anchorX: 0.5,
	        	anchorY: 0.5
	        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 9);
	        
        //arrows
        Arrows.init(100, 100);
        this.addChild(Arrows.sprite, 5);
        
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
        		if(cc.rectContainsPoint(,location)){
        			Arrows.press(touch);
        			return true;
        		}
        		return false;
        	},
        	//onTouchMoved: function (touch, event) {},
        	onTouchEnded: function (touch, event) {
        		Arrows.release();
        	}
        });
        cc.eventManager.addListener(listener, this);
	}
});