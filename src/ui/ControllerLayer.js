/**
 * 玩家控制器图层
 */
ControllerLayer = cc.Layer.extend({
	arrowsRect : null,
	arrowsSprite : null,
	closeSprite : null,
	attSpRect : null,
	playerSys : null,
	ctor : function(){
		for(var i in Service.mainSystem.systemList){
			var sys = Service.mainSystem.systemList[i];
			if(sys.name == "player"){
				this.playerSys = sys;
				break;
			}
		}
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
        arrowsSprite = new cc.Sprite(res.arrows);
        Arrows.init(arrowsSprite, 100, 100);
        this.addChild(arrowsSprite, 5);
        
        //因为sprite的注册点在中间，但矩形的起始点从左下角开始算，被这个坑得很惨
        this.arrowsRect = cc.rect(
        		arrowsSprite.getPositionX() - arrowsSprite.width * 0.5,
        		arrowsSprite.getPositionY() - arrowsSprite.height * 0.5,
        		arrowsSprite.width, arrowsSprite.height);
        
        var attButton = new cc.Sprite(res.button);
        attButton.attr({
        	x: winSize.width - 100,
        	y: 100
        });
        this.addChild(attButton, 5);
        this.attSpRect = cc.rect(
        		attButton.getPositionX() - attButton.width * 0.5,
        		attButton.getPositionY() - attButton.height * 0.5,
        		attButton.width, attButton.height);
        
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
        		if(cc.rectContainsPoint(selfPointer.arrowsRect, location)){
        			Arrows.press(selfPointer.arrowsSprite.convertToNodeSpace(location));
        			this.playerSys.pressDirection(this.cmd);
        			return true;
        		}
        		else if(cc.rectContainsPoint(selfPointer.attSpRect, location)){
        			return true;
        		}
        		return false;
        	},
        	//onTouchMoved: function (touch, event) {},
        	onTouchEnded: function (touch, event) {
        		Arrows.release();
        		this.playerSys.releaseKey(Constant.CMD.ALL_DIRECTION);
        	}
        });
        cc.eventManager.addListener(listener, this);
	}
});