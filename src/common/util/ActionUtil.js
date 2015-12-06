/**
 * 	动作类的工具类
 */

ActionUtil = {

	preparedToChange : function(obj, action){
		obj.actions.next = action;
		obj.actions.endFlag = true;
	},
	
	/**
	 * 添加一个子系统到action中，根据优先级决定插入的位置，越高越靠前
	 */
	addSystem :function(action, system){
		if(action){
			for(var i in action.systemList){
				if(system.priority > action.systemList[i].priority){
					action.systemList.splice(i, 0, system);
					return;
				}
			}
			//上面的循环未return时，说明system的优先级是最小的，要补加到列表尾
			action.systemList.push(system);
		}
	},
	
	/**
	 * 	新旧系统替换，指定要去除的旧系统名字和新系统对象
	 *  如找不到旧系统，则将新系统添加到列表中
	 * @param oldName		旧系统名称
	 * @param newSystem		新系统实例
	 */
	replaceSystem : function(action, oldName, newSystem){
		for(var i in this.systemList){
			if(this.systemList[i].name == oldName){
				this.systemList[i] = newSystem;
				return;
			}
		}
		//上面的循环未return时，说明没发生替换，要补加新系统到列表
		this.addSystem(action, newSystem);
	},
	
	/**
	 * 根据名称获得系统对象
	 */
	findSystemByName : function(action, name){
		for(var i in action.systemList){
			if(action.systemList[i].name == name){
				return action.systemList[i];
			}
		}
		cc.log("findSystemByName error~! action-name:["+action.name+"] system-name:["+name+"] not found.");
		return null;
	},
	
	/**
	 * 连接两个节点
	 * 两个参数都可以是数组或者实例
	 */
	linkNode : function(node1, node2){
		if(!node1 || !node2){
			return;
		}
		if(node1 instanceof Array){
			if(node2 instanceof Array){
				for(var i in node1){
					for(var j in node2){
						node1[i].addChild(node2[j]);
					}
				}
			}else{
				for(var i in node1){
					node1[i].addChild(node2);
				}
			}
		}else{
			if(node2 instanceof Array){
				for(var i in node2){
					node1.addChild(node2[i]);
				}
			}else{
				node1.addChild(node2);
			}
		}
	},
	
	/**
	 * 根据lamda表达式构建动作链，这个方法会递归运算。
	 * 记住表达式内不允许有空格，此方法也不会检查人工书写错误，请从启动日志中观察是否执行成功。
	 *  > 连接符号，这是最基本的符号，用于前后两个动作连接
	 *  	例子：act1>act2	--效果：act1.nodes[act2.key] = act2;
	 * [] 子表达式，用于有重复的群组动作，用逗号分隔左右表达式，左边填连接表达式，右边填重复次数，暂时不支持嵌套表达式。
	 * 		例子：act1>[act2>act3,2]>act4	--效果：act2>act3这一段会重复2次，然后进入act4
	 * {} 子表达式，用于分支动作，里面只能填入多个act，用逗号分隔，暂不支持嵌套。
	 * 		例子：act1>{act2,act3,act4}>act5 --效果 act1下有三个分支act2,act3,act4，而这三个分支都有act5作为后继节点
	 * @param strExpress
	 * @param actions
	 * @returns
	 */
	linkForExpress : function(strExpress, actions){

		var ssss = strExpress;		//debug.........
		var thisNode;
		var nextExp;						//下个递归中用到的后续表达式
		var result;							//下个递归中返回的结果
		
		if(!strExpress){
			return null;
		}
		
		// 1.	检查开头是否含有子表达式"[ ]"
		if(strExpress.charAt(0)=="["){
			var head,rear;
			var end = strExpress.indexOf("]");
			nextExp = strExpress.substring(end+2);		// "]>" 后的表达式，进行后续运算
			// 样例：[ x1>x2,n] ，获取 [ ] 内的子表达式，并将逗号左边子表达式和右边的重复标记拆开
			var arr = strExpress.substring(1, end).split(",");
			var actNames = arr[0].split(">");
			if(actNames){
				//根据表达式[]的规则，如果是数组，则依次从左往右逐个连接
				thisNode = this.findByNames(actNames, actions);
				for(var i=0; i<thisNode.length-1; i++){
					this.linkNode(thisNode[i], thisNode[i+1]);
				}
				head = thisNode[0];
				rear = thisNode[thisNode.length-1];
			}else{
				//arr[0]不是数组就是单个字符串
				head = rear = this.findByName(arr[0], actions);
			}
			
			//arr[1]	重复动作部分现在暂时不做
			this.linkNode(rear, this.linkForExpress(nextExp, actions));
			return head;
		}
		
		//	2.	检查开头是否含有子表达式"{ }"
		else if(strExpress.charAt(0)=="{"){
			var end = strExpress.indexOf("}");
			nextExp = strExpress.substring(end+2);		// {}> 后的表达式，进行后续运算
			
			var subExp = strExpress.substring(1, end);	// { } 内的子表达式，进行递归计算
			var actNames = subExp.split(",");	//将 {a1,a2,ax} 中的元素分开
			if(actNames){
				thisNode = this.findByNames(actNames, actions);
			}else{
				//不是数组，只有一个actName
				thisNode = this.findByName(subExp, actions);
			}
			//根据表达式{}的规则，所有action都要参与递归连接
			this.linkNode(thisNode, this.linkForExpress(nextExp, actions));
			return thisNode;
		}
		
		//	3.	剩下的一种情况就是action名了
		else{
			var index = strExpress.indexOf(">");
			if(index < 0){
				//表达式已到达末尾
				thisNode = this.findByName(strExpress, actions);
				nextExp = null;
			}else{
				//表达式末尾还有 ">"，表达式还没结束
				thisNode = this.findByName(strExpress.substring(0, index), actions);
				nextExp = strExpress.substring(index+1);			//> 后的表达式，进行后续运算
			}
			this.linkNode(thisNode, this.linkForExpress(nextExp, actions));
			return thisNode;
		}
	},
	
	/**
	 * 	根据名称查找action
	 * @param name
	 * @param actions
	 * @returns
	 */
	findByName : function(name, actions){
		var act = null;
		if(DataUtil.checkIsString(name)){
			var act = actions[name];
			if(act){
				return act;
			}else{
				cc.log(" action:"+name+" not found.");
			}
		}
		cc.log("ActionUtil.findByName error.");
		return null;
	},
	
	/**
	 * 根据names数组获取action列表，注意不要跟上面的方法搞混
	 * @param names	字符串数组
	 * @param actions
	 * @returns
	 */
	findByNames : function(names, actions){
		if(!DataUtil.checkArrayNull(names)){
			var arr = [];
			for(var i in names){
				var act = actions[names[i]];
				if(!act)
				{
					cc.log("action:"+names[i]+" not found.");
					break;
				}
				arr.push(act);
			}
			return arr;
		}else{
			cc.log("ActionUtil.findByNames error.");
			return null;
		}
	},
	
	/**
	 * ****目前这个方法还是做不到闭环的检测暂时停用
	 * 遍历树，检测闭环
	 * 原理：根据压栈不断将当前节点堆入，然后可以根据栈树快速查找已有的节点
	 * @param actions
	 */
	treeMap : function(stack, actions, msg){
		//已经遍历到底了
		if(!actions){
			cc.log(msg + "...已到末尾节点，此段表达式没有闭环。");
			return;
		}
		
		for(var i in actions){
			var exists = actions[i].name;
			var newMsg = msg + exists + " -> ";
			//这样搞个匿名函数不知道好不好，比如空间开销什么的。
			var flag = (function(arr, name, message){
								var s = true;
								for(var j in stack){
									if(stack[j] == exists){
										//栈中存在重复的节点，形成闭环，停止递归
										cc.log(message + "...检测到闭环。");
										s = false;
										break;
									}
								}
								return s;
							})(stack, exists, newMsg);
			//如果没有闭环就继续递归当前节点的子节点
			if(flag){
				//将当前节点入栈
				stack.push(exists);
				this.treeMap(stack, actions[i].children, newMsg);
				stack.pop();		//遍历完后要记得将列表末尾出栈
			}
		}
	}
};