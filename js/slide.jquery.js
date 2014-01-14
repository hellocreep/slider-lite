(function(factory) {
    if(typeof define === 'function') {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }  
})(function($) {
    var Slide = function (target, conf) {
        this.init(conf, $(target));
    }

    Slide.prototype = {
        constructor: Slide,

        init: function(conf, target) {
            var self = this,
                items = target.find(conf.itemClass),
                prop = {},
                neg_prop = {};

            self.conf = $.extend({
                items_length: items.length,
                i_width: items.width(),
                i_height: items.height(),
                ani_prop: [],
                ani_neg_prop: [] 
            }, conf);

            self.target = target;

            var conf = self.conf,
                direction = conf.direction,
                neg_direction,
                offset;

            // 判断图片播放的方向
            // neg_direction为反方向
            switch(direction) {
                case 'left':
                    neg_direction = 'right';
                    offset = conf.i_width;
                    break;
                case 'right':
                    neg_direction = 'left';
                    offset = conf.i_width;
                    break;
                case 'top':
                    neg_direction = 'bottom';
                    offset = conf.i_height;
                    break;
                case 'bottom':
                    neg_direction = 'top';
                    offset = conf.i_height;
                    break;
            }
            
            var prop_list = ['-'+offset, offset, 0];
            for(var i = 0, len = prop_list.length; i < len; i++) {
                prop[direction] = prop_list[i];
                neg_prop[neg_direction] = prop_list[i];
                self.conf.ani_prop.push(prop);
                self.conf.ani_neg_prop.push(neg_prop);
                prop = {};
                neg_prop = {};
            }

            target.hover(function() {
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

            if(!conf.autoplay || conf.items_length < 2) return false;

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

            if(type === 'prev') {
                var prop_done = conf.ani_neg_prop[0],
                    prop_ready = conf.ani_neg_prop[1],
                    prop_active = conf.ani_neg_prop[2];
            } else {
                var prop_done = conf.ani_prop[0],
                    prop_ready = conf.ani_prop[1],
                    prop_active = conf.ani_prop[2];
            }
            // 重置style中的 left|right|top|bottom，否则动画效果无法实现
            $target.find(conf.itemClass).eq(current)
                .css({left:'', right:'',top: '', bottom: ''})
                .animate(prop_done, {
                    easing: conf.easing,
                    duration: conf.speed*1000,
                    complete: function() {
                    }
                });

            $target.find(conf.itemClass).eq(next)
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

            $target.find(conf.navClass).on('click', function(e) {
                e.preventDefault();
                if($target.find(conf.itemClass + ':animated').length > 0) return false;
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

    $.fn.slide = function(conf) {
        return this.each(function() {
            var $this = $(this), 
                data = $(this).data('slide'),
                conf = $.extend({}, $.fn.slide.defaults, $(this).data(), typeof conf == 'object' && conf);
            if(!data) $this.data('slide', (data = new Slide(this, conf)));
        });
    }

    $.fn.slide.defaults = {
        speed: 0.8,
        delay: 3,
        direction: 'left',
        easing: 'swing',
        start: 0, 
        next: 1,
        autoplay: true,
        itemClass: '.item',
        navClass: '.slide-nav'
    }
});