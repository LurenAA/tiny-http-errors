读了http-errors源码后的一个简单实现

⚪ 最近在阅读koa的源码，koa虽然代码量不大，但是依赖了很多的模块，
http-errors就是其中一个。所以读了下源码，简单实现一下。

🐕 http-errors依赖5个模块，
<br/>toidentifier功能是“把字符串转化为驼峰命名”，整个模块就是一个简单的函数。
<br/>depd、inherits、setprototypeof是兼容性的模块，
<br/>statuses是一个错误码的模块，这个模块提供了所有的错误码及其表示信息，实现不难，
难度在编程之外的部分。

🐶 http-errors有趣的地方：
作者在httpError这个类里有这样一行代码：
<br/>throw new TypeError('cannot construct abstract class')<br/>
实现了一个类似于c++中基类的效果。

在inherits这个模块中，继承的一个实现方式是：
 <br/>module.exports = function inherits(ctor, superCtor) {
 <br/>  ctor.super_ = superCtor
 <br/>  var TempCtor = function () {}
  <br/> TempCtor.prototype = superCtor.prototype
  <br/> ctor.prototype = new TempCtor()
  <br/> ctor.prototype.constructor = ctor
<br/>}<br/>
这里引入了TempCtor这个临时的构造函数。这样做可以避免在ctor.prototype中
引入superCtor构造函数中构造的函数

用到了Error.captureStackTrace，然后更改name和message来控制
报错信息的首行。
