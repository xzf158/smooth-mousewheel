/**
 * @author Terry
 * @date 2014/2/6
 */
define(["jquery"], function() {
    var defaultsOption = {
        spring: .4,
        duration: 900,
        maxDetail: 40
    }
    var SmoothMousewheel = function(options) {
        this.$e = $(document);
        this.$e[0]._inst = this;
        // this.options = options;
        this._init();
    }, $window = $(window);
    SmoothMousewheel.prototype = {
        constructor: SmoothMousewheel,
        options: undefined,
        targetTop: 0,
        currentTop: 0,
        scrollHeight: 0,
        tmpScroll: null,
        intervalId: 0,
        isLock: false,
        inAnimate: false,
        _init: function() {
            var scope = this;
            this.scrollHeight = document.documentElement.scrollHeight - $window.height();
            scope.targetTop = scope.currentTop = this.$e.scrollTop();
            this.tmpScroll = $("<div/>");
            $window.on("resize", function() {
                scope.scrollHeight = document.documentElement.scrollHeight - $window.height();
                scope._forceUpdate();
            });
            $(document).on("scroll", function(e) {
                if (!scope.inAnimate) {
                    scope._forceUpdate();
                }
            });
        },
        _mousewheelEvent: function(e) {
            e.preventDefault();
            if (this._inst.isLock) {
                return;
            }
            var evt = e.originalEvent,
                detail = evt.detail ? evt.detail * 30 : -evt.wheelDelta / 3;
            if (Math.abs(detail) > this._inst.options.maxDetail) {
                detail = detail > 0 ? this._inst.options.maxDetail : -this._inst.options.maxDetail;
            }
            this._inst.targetTop += detail;
            if (this._inst.targetTop < 0) {
                this._inst.targetTop = 0;
            } else if (this._inst.targetTop > this._inst.scrollHeight) {
                this._inst.targetTop = this._inst.scrollHeight;
            }
        },
        _animationLoop: function() {
            var st = new Date(),
                et, dt, spring, scope = this;
            scrollAnimation();

            function scrollAnimation() {
                if (Math.abs(scope.currentTop - scope.targetTop) > 0) {
                    et = new Date();
                    dt = et - st;
                    st = et;
                    spring = scope.options.spring * dt / 17;
                    spring = spring > .4 ? .4 : spring;
                    scope.currentTop += (scope.targetTop - scope.currentTop) * spring;
                    scope.currentTop = Math.round(scope.currentTop * 100) / 100;
                    if (scope.currentTop < 0) {
                        scope.currentTop = 0;
                    }
                    if (Math.abs(scope.currentTop - scope.targetTop) <= 1) {
                        scope.currentTop = scope.targetTop;
                    }
                    if (scope.currentTop >= 0) {
                        scope.$e.scrollTop(scope.currentTop);
                        scope._triggerEvent();
                    }
                    scope.inAnimate = true;
                } else {
                    scope.currentTop = scope.targetTop;
                    scope.inAnimate = false;
                }
                window.cancelAnimationFrame(scope.intervalId);
                scope.intervalId = window.requestAnimationFrame(scrollAnimation);
            }
        },
        _forceUpdate: function() {
            this.scrollHeight = document.documentElement.scrollHeight - $window.height();
            this.currentTop = this.targetTop = this.$e.scrollTop();
            this._triggerEvent();
        },
        _triggerEvent: function() {
            $window.trigger($.Event("SmoothScroll", {
                scrollTop: this.currentTop
            }));
        },
        scrollTo: function(top, duration, easing) {
            var scope = this,
                lockState = this.isLock;
            this.lock();
            this.tmpScroll.css("top", this.currentTop);
            this.tmpScroll.animate({
                top: top,
            }, {
                duration: duration ? duration : scope.options.duration,
                step: function(now, fx) {
                    scope.targetTop = parseInt(now);
                },
                easing: easing ? easing : "linear",
                complete: function() {
                    if (!lockState) {
                        scope.unlock();
                    }
                }
            });
        },
        enable: function(options) {
            this._forceUpdate();
            if (!this.options || options) {
                this.options = $.extend({}, defaultsOption, typeof options == 'object' && options);
            }
            this.$e.on("mousewheel DOMMouseScroll", this._mousewheelEvent);
            this._animationLoop();
            this._triggerEvent();
        },
        disable: function() {
            this.$e.off("mousewheel DOMMouseScroll", this._mousewheelEvent);
            window.cancelAnimationFrame(this.intervalId);
        },
        lock: function() {
            this.isLock = true;
        },
        unlock: function() {
            this._forceUpdate();
            this.isLock = false;
        },
        distroy: function() {
            this.disable();
            delete this.$e._inst;
            delete this.$e;
            for (var i in this) {
                delete this[i];
            }
        }
    };
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    return new SmoothMousewheel();
});