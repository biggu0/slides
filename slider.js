(function($){
	if(!$) return false;
	var Slider = function(){
		//私有变量
		//元素
		this.el = false;
		this.ul = false;
		this.lis = false;
		//运动参数
		this.opts = {
			way : '',//slide scroll
			speed : 2000,
			delay : 3000,
			dots :false,
			arrows:true,
			fade : true,
			mouseOverStop:true,
			cb: function(){console.log('cb');}
		};
		var _ = this;
		this.init = function (el, options){
			//获取各个元素
			//获取运动参数
			this.el = el;
			this.ul = el.find('ul');
			this.lis = this.ul.children('li');
			this.opts = $.extend(this.opts, options); 
			//判断运动类型，根据运动类型充值样式，默认slide
			switch(this.opts.way){
				case '':
				case 'slide':
					this.setStyle();this.doSlide();break;
				case 'scroll':
					this.setStyle('scroll');!this.noScroll&&this.doScroll();break;
			}
		};
		this.setStyle = function(scroll){
			if(scroll&&scroll=='scroll'){
				//scroll滚动
				this.width0 = 0;
				this.widthUl = 0;
				this.lis.each(function(index){
					_.width0 += parseInt($(this).outerWidth());
				});
				//如果容器足够大，则不需要滚动
				if(this.el.width()==this.width0){
					this.noScroll = true;
				}
				else{
				//构造无缝效果的clone元素，并重置ul宽度以及初始left值
					this.cloneLi();
					this.ul.find('li').each(function(index){
						_.widthUl += parseInt($(this).outerWidth());
					}); 
					this.ul.css({
						'width':this.widthUl,
						'left' : -this.liFirst.outerWidth()
					});
				}
			}
			else{
				this.ul.css('width', (this.lis.length*100) +'%');
				this.lis.css('width', (100 / this.lis.length) + '%');
			}
			//通用设置
			this.el.css({
				'overflow':'hidden'
			});
			this.ul.css({
				'position' : 'relative'
			});
			this.lis.css({
				'float' :'left'
			});
		};
		this.doSlide = function(){
			//slide 
			this.current = 0;
			this.startSlide();
			if(this.opts.mouseOverStop){
				this.el.hover(function(){
					_.stop();
				},function(){
					_.startSlide();
				});
			}
			if(this.opts.arrows){
				this.prev = $('<div class="prev">prev</div>').appendTo('body');
				this.prev.click(function(){
					_.stop();
					_.current = _.current-1;
					_.opts.fade ? _.fadeTo(_.current) : _.moveTo(_current);
					_.startSlide();
				});
				this.prev = $('<div class="next">next</div>').appendTo('body');
				this.prev.click(function(){
					_.stop();
					_.current = _.current+1;
					_.opts.fade ? _.fadeTo(_.current) : _.moveTo(_current);
					_.startSlide();
				});
			
			}
		};
		this.startSlide = function(){
			if(this.opts.delay){
				if(this.opts.fade){
					this.interval = setInterval(function(){_.fadeTo(_.current+1);},_.opts.delay);
				}
				else{
					this.moveWidth = 0;
					this.interval = setInterval(function(){_.moveTo(_.current+1);},_.opts.delay);
				}
			}
		};
		this.fadeTo = function(index){
			this.lis.hide();
			(index >= this.lis.length-1) ? (this.current = -1): (this.current=index);
			this.lis.eq(this.current).fadeIn(this.opts.speed,this.opts.cb);
			
		};
		this.moveTo = function(index){
			//current li 动态效果
			if(this.current == -1){
				this.moveWidth = 0
			}
			else 
				this.moveWidth = this.moveWidth + parseInt($(this.lis[index]).outerWidth());
			$(this.ul).animate({
				left:-this.moveWidth
			},this.opts.speed,this.opts.cb);
			(index >= this.lis.length -1) ? (this.current = -1): (this.current=index);
			
		};
		this.doScroll = function(){
			if(this.opts.delay){
				this.timeout = setTimeout(function(){
					_.startScroll();
				}, this.opts.delay);
			}
			if(this.opts.mouseOverStop){
				this.el.hover(function(){
					_.stop();
				},function(){
					_.startScroll();
				});
			}
			if(this.opts.arrows){
				this.left = $('<div class="left">left</div>').appendTo('body');
				this.left.click(function(){
					_.stop();
					_.interval = setInterval(function(){_.scrollLeft();},_.opts.speed);
				});
				this.right = $('<div class="right">right</div>').appendTo('body');
				this.right.click(function(){
					_.stop();
					_.interval = setInterval(function(){_.scrollRight();},_.opts.speed);
				})
			}	
		};
		this.startScroll = function(){
			this.interval = setInterval(function(){_.scrollRight();},_.opts.speed);
		};
		this.stop = function(){
			clearInterval(this.interval);
		}
		this.scrollLeft = function(){
			//左滚动，滚动宽度达到原宽度width0，则置0
			if(-parseInt(this.ul.css('left')) == parseInt(this.width0)){
				this.ul.css('left',0)
			}
			this.ul.css('left',parseInt(this.ul.css('left'))-1);
		};
		this.scrollRight = function(){
			//右滚动，滚动宽度达到0，则置原宽度width0
			if(parseInt(this.ul.css('left')) == 0){
				this.ul.css('left',-parseInt(this.width0));
			}
			this.ul.css('left',parseInt(this.ul.css('left'))+1);
		};
		this.cloneLi = function(){
			//根据容器大小，构造无缝效果的元素
			var ul = this.ul;
			this.cloneNum =  Math.ceil(this.el.width()/this.lis.width())-1;
			this.liFirst = this.lis.eq(0);
			this.liLast = this.lis.eq(this.lis.length-1);
			while(this.cloneNum){
				this.liFirst = this.liFirst.add(this.lis.eq(--this.cloneNum));
			}
			this.liFirst.clone().appendTo(ul);
			this.liLast.clone().prependTo(ul);	
		}	
	}
	$.fn.slider = function(o) {
		var len = this.length;
		return this.each(function(index) {
			var $this = $(this);
			var silder = (new Slider).init($this, o );

		})
	}
})(window.jQuery)