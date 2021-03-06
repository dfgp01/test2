/**
 * 玩家控制器图层
 */
ControllerLayer = cc.Layer.extend({
	arrows : null,
	attButton : null,
	closeSprite : null,
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
        			selfPointer.playerSys.pressDirection(selfPointer.arrows.cmd);
        			return true;
        		}
        		else if(cc.rectContainsPoint(selfPointer.attButton.rect, location)){
        			Service.tt = Service.gameTime;
        			Service.begin = selfPointer.playerSys.target.viewCom.sprite.getPositionX();
        			Service.dis = selfPointer.playerSys.target.viewCom.sprite.getPositionX();
        			cc.log("开始：");
        			selfPointer.playerSys.pressKey(Constant.CMD.RIGHT);
        			return false;
        		}
        		return false;
        	},
        	//onTouchMoved: function (touch, event) {},
        	onTouchEnded: function (touch, event) {
        		selfPointer.arrows.release();
        		selfPointer.playerSys.releaseKey(Constant.CMD.ALL_DIRECTION);
        	}
        });
        cc.eventManager.addListener(listener, this);
	}
});