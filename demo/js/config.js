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