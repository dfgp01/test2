/**
 * 
 */

function Class(name){
	this.name = name;
	this.mFunc = function(){
		alert(this.name);
	}
}
Class.prototype.sFunc = function(newVal){
	alert(this.name + " " + newVal);
}

function SubClass(name,age){
	Class.call(this,name);
	this.age = age;
}

function typeCheck1(){
	var c1 = new Class("A");
	var c2 = new Class("B");
	alert(c1 == c2);									//false，是两个对象
	alert(c1.mFunc === c2.mFunc);		//false，是两个函数对象
	alert(c1.sFunc === c2.sFunc);			//true，是一个对象
}

function typeCheck2(){
	var c1 = new Class("A");
	var s1 = new SubClass("B",25);
	alert(c1 == s1);							//false
	s1.sFunc(5);								//有下面那句就不会出错
}

SubClass.prototype = Class.prototype;		//这样SubClass对象就可以使用sFunc函数

SubClass.prototype.gFunc = function(val){	//这样父类Class的实例也可以使用这个函数
	alert(this.age + " " + val);
}
function typeCheck3(){
	var c1 = new Class("A");
	var s1 = new SubClass("B",25);
	c1.age = 333;
	c1.gFunc(2);					//可以执行
	s1.gFunc(33);					//可以执行
}

SubClass.prototype = {
		getName : function(){
			return this.name;
		}
};
function typeCheck4(){
	var s1 = new SubClass("B",25);
	alert(s1.name);
	alert(s1.getName());						//可以执行
	var o = SubClass.prototype;
	o.name = "pro";
	alert(o.getName());						//可以执行
	alert(s1.getName == o.getName);		//true  就算换成 === 结果也是true
}