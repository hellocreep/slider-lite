// TODO
// 点击前进后退按钮时，必须等这次动画结束之后才能再次点击
var Slide = (function() {
    function Slide(conf, target) {
        var $target = $(target);
        this.defaults = {
            speed: 0.8,
            delay: 3,
            direction: 'left',
            easing: 'swing',
            start: 0, 
            next: 1,
            autoplay: true,
            items_length: $target.find('.item').length,
            i_width: $target.find('.item').width(),
            i_height: $target.find('.item').height()
        }

        this.init(conf, $target);
    }
    Slide.prototype = {
        init: function(conf, target) {
            var self = this,
                prop_done = {},
                prop_active = {},
                prop_ready = {},
                prop_neg_done = {},
                prop_neg_ready = {},
                prop_neg_active = {};

            self.conf = $.extend({}, self.defaults, conf);
            self.target = target;

            var direction = self.conf.direction,
                neg_direction,
                offset;

            // 判断图片播放的方向
            // neg_direction为反方向
            switch(direction) {
                case 'left':
                    neg_direction = 'right';
                    offset = self.conf.i_width;
                    break;
                case 'right':
                    neg_direction = 'left';
                    offset = self.conf.i_width;
                    break;
                case 'top':
                    neg_direction = 'bottom';
                    offset = self.conf.i_height;
                    break;
                case 'bottom':
                    neg_direction = 'top';
                    offset = self.conf.i_height;
                    break;
            }
            
            prop_neg_done[neg_direction] = '-' + offset
            prop_neg_ready[neg_direction] = offset;
            prop_neg_active[neg_direction] = 0;
            self.conf.prop_neg_done = prop_neg_done;
            self.conf.prop_neg_ready = prop_neg_ready;
            self.conf.prop_neg_active = prop_neg_active;

            prop_done[direction] = '-' + offset;//'-100%';
            prop_ready[direction] = offset;//'100%';
            prop_active[direction] = 0;
            self.conf.prop_done = prop_done;
            self.conf.prop_ready = prop_ready;
            self.conf.prop_active = prop_active;

            self.target.hover(function() {
                self.stop();
            }, function() {
                self.autoplay();
            });

            self.autoplay(); 
            self.nav();
            return self;
        },
        autoplay: function() {
            var self = this,
                conf = self.conf,
                $target = self.target;

            if(!conf.autoplay) return false;

            self.timer = setInterval(function() {

                self.next();
               
            }, conf.delay*1000);
        },
        next: function() {
            var self = this,
                conf = self.conf,
                start = conf.start,
                $target = self.target;

                if(start >= conf.items_length-1) {
                    var current = conf.items_length-1,
                        next = 0;
                    conf.start = 0;
                } else {
                    var current = conf.start,
                        next = current + 1;
                    conf.start += 1;
                }
                
                self.move(current, next, 'next');
            
        },
        prev: function() {
            var self = this,
                conf = self.conf,
                start = conf.start,
                $target = self.target;

            if(start == 0) {
                    var current = 0,
                        next = conf.items_length - 1;
                    conf.start = next;
                } else {
                    var current = conf.start,
                        next = current - 1;
                    conf.start -= 1;
                }
            self.move(current, next, 'prev');

        },
        move: function(current, next, type) {
            var self = this,
                conf = self.conf,
                $target = self.target;

            if(type == 'prev') {
                var prop_done = conf.prop_neg_done,
                    prop_active = conf.prop_neg_active,
                    prop_ready = conf.prop_neg_ready;
            } else {
                var prop_done = conf.prop_done,
                    prop_active = conf.prop_active,
                    prop_ready = conf.prop_ready;
            }
            // 重置style中的 left|right|top|bottom，否则动画效果无法实现
            $target.find('.item').eq(current)
                .css({left:'', right:'',top: '', bottom: ''})
                .animate(prop_done, {
                    easing: conf.easing,
                    duration: conf.speed*1000,
                    complete: function() {
                    }
                });

            $target.find('.item').eq(next)
                .css({left:'', right:'',top: '', bottom: ''})
                .css(prop_ready).show()
                .animate(prop_active, {
                    duration: conf.speed*1000,
                    easing: conf.easing,
                    complete: function() {
                        $(this).addClass('active')
                            .siblings().removeClass('active');
                    }
                });
        },
        nav: function() {
            var self = this,
                conf = self.conf,
                $target = self.target;

            $target.find('.slide-nav').on('click', function(e) {
                e.preventDefault();
                var $this = $(this);
                if($this.hasClass('prev')) {
                    self.prev();
                } else {
                    self.next();
                }
            });
        },
        stop: function() {
            var self = this;
            clearInterval(self.timer);
        }

    }
    return Slide;
})();

$.fn.slide = function(conf) {
    return new Slide(conf, this);
}