###这个lib使用AMD方式加载，基于Jquery开发。

Demo: <http://www.xzfblog.com/demo/smooth-mousewheel/demo/index.html>

	requirejs.config({
		baseUrl: "../dev",
		paths: {
			'jquery' : 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
			"smooth_mousewheel": "smooth_mousewheel"
		},
		shim: {
		    "smooth_mousewheel" : ["jquery"]
		}
	});

	require(['jquery',"smooth_mousewheel"], function($, SmoothMousewheel) {
		$(function (){
			SmoothMousewheel.enable();

			// SmoothMousewheel.scrollTo(1000); //top, [duration, easing]
			// SmoothMousewheel.lock(); 
			// SmoothMousewheel.unlock();
			// SmoothMousewheel.disable();
			// SmoothMousewheel.distroy();

			$(".box").on("click",function (){
				 SmoothMousewheel.scrollTo(0, 400);
			});
		});
	});


####API:
##### SmoothMousewheel.enable([options]); 
> 启用SmoothMousewheel

	defaultOptions = {
		spring : .4,
        duration : 900,
        maxDetail : 40
	}
	
	//Example
	SmoothMousewheel.enable({
		spring : .5,
        duration : 400
	});
	

##### SmoothMousewheel.disable();
> 禁用SmoothMousewheel

##### SmoothMousewheel.lock();
> 锁住SmoothMousewheel，让mosuewheel不可用

##### SmoothMousewheel.unlock();
> 解锁

##### SmoothMousewheel.distroy();
> 销毁SmoothMousewheel

##### SmoothMousewheel.scrollTo(top, [duration, easing]);
> top: to Top value
> 
> duration : animate time, default is 900
> 
> easing: jquery easing, default is "linear"

##### Window event
	$(window).on("SmoothScroll",function(e){
		console.log(e.scrollTop)
	});