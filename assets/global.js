/*Slick slide*/
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports!=="undefined"){module.exports=factory(require("jquery"))}else{factory(jQuery)}})(function($){"use strict";var Slick=window.Slick||{};Slick=function(){var instanceUid=0;function Slick(element,settings){var _=this,dataSettings;_.defaults={accessibility:true,adaptiveHeight:false,appendArrows:$(element),appendDots:$(element),arrows:true,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:false,autoplaySpeed:3e3,centerMode:false,centerPadding:"50px",cssEase:"ease",customPaging:function(slider,i){return $('<button type="button" />').text(i+1)},dots:false,dotsClass:"slick-dots",draggable:true,easing:"linear",edgeFriction:.35,fade:false,focusOnSelect:false,focusOnChange:false,infinite:true,initialSlide:0,lazyLoad:"ondemand",mobileFirst:false,pauseOnHover:true,pauseOnFocus:true,pauseOnDotsHover:false,respondTo:"window",responsive:null,rows:1,rtl:false,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:true,swipeToSlide:false,touchMove:true,touchThreshold:5,useCSS:true,useTransform:true,variableWidth:false,vertical:false,verticalSwiping:false,waitForAnimate:true,zIndex:1e3};_.initials={animating:false,dragging:false,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:false,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:false,slideOffset:0,swipeLeft:null,swiping:false,$list:null,touchObject:{},transformsEnabled:false,unslicked:false};$.extend(_,_.initials);_.activeBreakpoint=null;_.animType=null;_.animProp=null;_.breakpoints=[];_.breakpointSettings=[];_.cssTransitions=false;_.focussed=false;_.interrupted=false;_.hidden="hidden";_.paused=true;_.positionProp=null;_.respondTo=null;_.rowCount=1;_.shouldClick=true;_.$slider=$(element);_.$slidesCache=null;_.transformType=null;_.transitionType=null;_.visibilityChange="visibilitychange";_.windowWidth=0;_.windowTimer=null;dataSettings=$(element).data("slick")||{};_.options=$.extend({},_.defaults,settings,dataSettings);_.currentSlide=_.options.initialSlide;_.originalSettings=_.options;if(typeof document.mozHidden!=="undefined"){_.hidden="mozHidden";_.visibilityChange="mozvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){_.hidden="webkitHidden";_.visibilityChange="webkitvisibilitychange"}_.autoPlay=$.proxy(_.autoPlay,_);_.autoPlayClear=$.proxy(_.autoPlayClear,_);_.autoPlayIterator=$.proxy(_.autoPlayIterator,_);_.changeSlide=$.proxy(_.changeSlide,_);_.clickHandler=$.proxy(_.clickHandler,_);_.selectHandler=$.proxy(_.selectHandler,_);_.setPosition=$.proxy(_.setPosition,_);_.swipeHandler=$.proxy(_.swipeHandler,_);_.dragHandler=$.proxy(_.dragHandler,_);_.keyHandler=$.proxy(_.keyHandler,_);_.instanceUid=instanceUid++;_.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/;_.registerBreakpoints();_.init(true)}return Slick}();Slick.prototype.activateADA=function(){var _=this;_.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})};Slick.prototype.addSlide=Slick.prototype.slickAdd=function(markup,index,addBefore){var _=this;if(typeof index==="boolean"){addBefore=index;index=null}else if(index<0||index>=_.slideCount){return false}_.unload();if(typeof index==="number"){if(index===0&&_.$slides.length===0){$(markup).appendTo(_.$slideTrack)}else if(addBefore){$(markup).insertBefore(_.$slides.eq(index))}else{$(markup).insertAfter(_.$slides.eq(index))}}else{if(addBefore===true){$(markup).prependTo(_.$slideTrack)}else{$(markup).appendTo(_.$slideTrack)}}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slides.each(function(index,element){$(element).attr("data-slick-index",index)});_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.animateHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.animate({height:targetHeight},_.options.speed)}};Slick.prototype.animateSlide=function(targetLeft,callback){var animProps={},_=this;_.animateHeight();if(_.options.rtl===true&&_.options.vertical===false){targetLeft=-targetLeft}if(_.transformsEnabled===false){if(_.options.vertical===false){_.$slideTrack.animate({left:targetLeft},_.options.speed,_.options.easing,callback)}else{_.$slideTrack.animate({top:targetLeft},_.options.speed,_.options.easing,callback)}}else{if(_.cssTransitions===false){if(_.options.rtl===true){_.currentLeft=-_.currentLeft}$({animStart:_.currentLeft}).animate({animStart:targetLeft},{duration:_.options.speed,easing:_.options.easing,step:function(now){now=Math.ceil(now);if(_.options.vertical===false){animProps[_.animType]="translate("+now+"px, 0px)";_.$slideTrack.css(animProps)}else{animProps[_.animType]="translate(0px,"+now+"px)";_.$slideTrack.css(animProps)}},complete:function(){if(callback){callback.call()}}})}else{_.applyTransition();targetLeft=Math.ceil(targetLeft);if(_.options.vertical===false){animProps[_.animType]="translate3d("+targetLeft+"px, 0px, 0px)"}else{animProps[_.animType]="translate3d(0px,"+targetLeft+"px, 0px)"}_.$slideTrack.css(animProps);if(callback){setTimeout(function(){_.disableTransition();callback.call()},_.options.speed)}}}};Slick.prototype.getNavTarget=function(){var _=this,asNavFor=_.options.asNavFor;if(asNavFor&&asNavFor!==null){asNavFor=$(asNavFor).not(_.$slider)}return asNavFor};Slick.prototype.asNavFor=function(index){var _=this,asNavFor=_.getNavTarget();if(asNavFor!==null&&typeof asNavFor==="object"){asNavFor.each(function(){var target=$(this).slick("getSlick");if(!target.unslicked){target.slideHandler(index,true)}})}};Slick.prototype.applyTransition=function(slide){var _=this,transition={};if(_.options.fade===false){transition[_.transitionType]=_.transformType+" "+_.options.speed+"ms "+_.options.cssEase}else{transition[_.transitionType]="opacity "+_.options.speed+"ms "+_.options.cssEase}if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.autoPlay=function(){var _=this;_.autoPlayClear();if(_.slideCount>_.options.slidesToShow){_.autoPlayTimer=setInterval(_.autoPlayIterator,_.options.autoplaySpeed)}};Slick.prototype.autoPlayClear=function(){var _=this;if(_.autoPlayTimer){clearInterval(_.autoPlayTimer)}};Slick.prototype.autoPlayIterator=function(){var _=this,slideTo=_.currentSlide+_.options.slidesToScroll;if(!_.paused&&!_.interrupted&&!_.focussed){if(_.options.infinite===false){if(_.direction===1&&_.currentSlide+1===_.slideCount-1){_.direction=0}else if(_.direction===0){slideTo=_.currentSlide-_.options.slidesToScroll;if(_.currentSlide-1===0){_.direction=1}}}_.slideHandler(slideTo)}};Slick.prototype.buildArrows=function(){var _=this;if(_.options.arrows===true){_.$prevArrow=$(_.options.prevArrow).addClass("slick-arrow");_.$nextArrow=$(_.options.nextArrow).addClass("slick-arrow");if(_.slideCount>_.options.slidesToShow){_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");_.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.prependTo(_.options.appendArrows)}if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.appendTo(_.options.appendArrows)}if(_.options.infinite!==true){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")}}else{_.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"})}}};Slick.prototype.buildDots=function(){var _=this,i,dot;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$slider.addClass("slick-dotted");dot=$("<ul />").addClass(_.options.dotsClass);for(i=0;i<=_.getDotCount();i+=1){dot.append($("<li />").append(_.options.customPaging.call(this,_,i)))}_.$dots=dot.appendTo(_.options.appendDots);_.$dots.find("li").first().addClass("slick-active")}};Slick.prototype.buildOut=function(){var _=this;_.$slides=_.$slider.children(_.options.slide+":not(.slick-cloned)").addClass("slick-slide");_.slideCount=_.$slides.length;_.$slides.each(function(index,element){$(element).attr("data-slick-index",index).data("originalStyling",$(element).attr("style")||"")});_.$slider.addClass("slick-slider");_.$slideTrack=_.slideCount===0?$('<div class="slick-track"/>').appendTo(_.$slider):_.$slides.wrapAll('<div class="slick-track"/>').parent();_.$list=_.$slideTrack.wrap('<div class="slick-list"/>').parent();_.$slideTrack.css("opacity",0);if(_.options.centerMode===true||_.options.swipeToSlide===true){_.options.slidesToScroll=1}$("img[data-lazy]",_.$slider).not("[src]").addClass("slick-loading");_.setupInfinite();_.buildArrows();_.buildDots();_.updateDots();_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);if(_.options.draggable===true){_.$list.addClass("draggable")}};Slick.prototype.buildRows=function(){var _=this,a,b,c,newSlides,numOfSlides,originalSlides,slidesPerSection;newSlides=document.createDocumentFragment();originalSlides=_.$slider.children();if(_.options.rows>0){slidesPerSection=_.options.slidesPerRow*_.options.rows;numOfSlides=Math.ceil(originalSlides.length/slidesPerSection);for(a=0;a<numOfSlides;a++){var slide=document.createElement("div");for(b=0;b<_.options.rows;b++){var row=document.createElement("div");for(c=0;c<_.options.slidesPerRow;c++){var target=a*slidesPerSection+(b*_.options.slidesPerRow+c);if(originalSlides.get(target)){row.appendChild(originalSlides.get(target))}}slide.appendChild(row)}newSlides.appendChild(slide)}_.$slider.empty().append(newSlides);_.$slider.children().children().children().css({width:100/_.options.slidesPerRow+"%",display:"inline-block"})}};Slick.prototype.checkResponsive=function(initial,forceUpdate){var _=this,breakpoint,targetBreakpoint,respondToWidth,triggerBreakpoint=false;var sliderWidth=_.$slider.width();var windowWidth=window.innerWidth||$(window).width();if(_.respondTo==="window"){respondToWidth=windowWidth}else if(_.respondTo==="slider"){respondToWidth=sliderWidth}else if(_.respondTo==="min"){respondToWidth=Math.min(windowWidth,sliderWidth)}if(_.options.responsive&&_.options.responsive.length&&_.options.responsive!==null){targetBreakpoint=null;for(breakpoint in _.breakpoints){if(_.breakpoints.hasOwnProperty(breakpoint)){if(_.originalSettings.mobileFirst===false){if(respondToWidth<_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}else{if(respondToWidth>_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}}}if(targetBreakpoint!==null){if(_.activeBreakpoint!==null){if(targetBreakpoint!==_.activeBreakpoint||forceUpdate){_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{if(_.activeBreakpoint!==null){_.activeBreakpoint=null;_.options=_.originalSettings;if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial);triggerBreakpoint=targetBreakpoint}}if(!initial&&triggerBreakpoint!==false){_.$slider.trigger("breakpoint",[_,triggerBreakpoint])}}};Slick.prototype.changeSlide=function(event,dontAnimate){var _=this,$target=$(event.currentTarget),indexOffset,slideOffset,unevenOffset;if($target.is("a")){event.preventDefault()}if(!$target.is("li")){$target=$target.closest("li")}unevenOffset=_.slideCount%_.options.slidesToScroll!==0;indexOffset=unevenOffset?0:(_.slideCount-_.currentSlide)%_.options.slidesToScroll;switch(event.data.message){case"previous":slideOffset=indexOffset===0?_.options.slidesToScroll:_.options.slidesToShow-indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide-slideOffset,false,dontAnimate)}break;case"next":slideOffset=indexOffset===0?_.options.slidesToScroll:indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide+slideOffset,false,dontAnimate)}break;case"index":var index=event.data.index===0?0:event.data.index||$target.index()*_.options.slidesToScroll;_.slideHandler(_.checkNavigable(index),false,dontAnimate);$target.children().trigger("focus");break;default:return}};Slick.prototype.checkNavigable=function(index){var _=this,navigables,prevNavigable;navigables=_.getNavigableIndexes();prevNavigable=0;if(index>navigables[navigables.length-1]){index=navigables[navigables.length-1]}else{for(var n in navigables){if(index<navigables[n]){index=prevNavigable;break}prevNavigable=navigables[n]}}return index};Slick.prototype.cleanUpEvents=function(){var _=this;if(_.options.dots&&_.$dots!==null){$("li",_.$dots).off("click.slick",_.changeSlide).off("mouseenter.slick",$.proxy(_.interrupt,_,true)).off("mouseleave.slick",$.proxy(_.interrupt,_,false));if(_.options.accessibility===true){_.$dots.off("keydown.slick",_.keyHandler)}}_.$slider.off("focus.slick blur.slick");if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow&&_.$prevArrow.off("click.slick",_.changeSlide);_.$nextArrow&&_.$nextArrow.off("click.slick",_.changeSlide);if(_.options.accessibility===true){_.$prevArrow&&_.$prevArrow.off("keydown.slick",_.keyHandler);_.$nextArrow&&_.$nextArrow.off("keydown.slick",_.keyHandler)}}_.$list.off("touchstart.slick mousedown.slick",_.swipeHandler);_.$list.off("touchmove.slick mousemove.slick",_.swipeHandler);_.$list.off("touchend.slick mouseup.slick",_.swipeHandler);_.$list.off("touchcancel.slick mouseleave.slick",_.swipeHandler);_.$list.off("click.slick",_.clickHandler);$(document).off(_.visibilityChange,_.visibility);_.cleanUpSlideEvents();if(_.options.accessibility===true){_.$list.off("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().off("click.slick",_.selectHandler)}$(window).off("orientationchange.slick.slick-"+_.instanceUid,_.orientationChange);$(window).off("resize.slick.slick-"+_.instanceUid,_.resize);$("[draggable!=true]",_.$slideTrack).off("dragstart",_.preventDefault);$(window).off("load.slick.slick-"+_.instanceUid,_.setPosition)};Slick.prototype.cleanUpSlideEvents=function(){var _=this;_.$list.off("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.off("mouseleave.slick",$.proxy(_.interrupt,_,false))};Slick.prototype.cleanUpRows=function(){var _=this,originalSlides;if(_.options.rows>0){originalSlides=_.$slides.children().children();originalSlides.removeAttr("style");_.$slider.empty().append(originalSlides)}};Slick.prototype.clickHandler=function(event){var _=this;if(_.shouldClick===false){event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()}};Slick.prototype.destroy=function(refresh){var _=this;_.autoPlayClear();_.touchObject={};_.cleanUpEvents();$(".slick-cloned",_.$slider).detach();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.$prevArrow.length){_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}}if(_.$nextArrow&&_.$nextArrow.length){_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}}if(_.$slides){_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){$(this).attr("style",$(this).data("originalStyling"))});_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.detach();_.$list.detach();_.$slider.append(_.$slides)}_.cleanUpRows();_.$slider.removeClass("slick-slider");_.$slider.removeClass("slick-initialized");_.$slider.removeClass("slick-dotted");_.unslicked=true;if(!refresh){_.$slider.trigger("destroy",[_])}};Slick.prototype.disableTransition=function(slide){var _=this,transition={};transition[_.transitionType]="";if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.fadeSlide=function(slideIndex,callback){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).css({zIndex:_.options.zIndex});_.$slides.eq(slideIndex).animate({opacity:1},_.options.speed,_.options.easing,callback)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:1,zIndex:_.options.zIndex});if(callback){setTimeout(function(){_.disableTransition(slideIndex);callback.call()},_.options.speed)}}};Slick.prototype.fadeSlideOut=function(slideIndex){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).animate({opacity:0,zIndex:_.options.zIndex-2},_.options.speed,_.options.easing)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:0,zIndex:_.options.zIndex-2})}};Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(filter){var _=this;if(filter!==null){_.$slidesCache=_.$slides;_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.filter(filter).appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.focusHandler=function(){var _=this;_.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(event){var $sf=$(this);setTimeout(function(){if(_.options.pauseOnFocus){if($sf.is(":focus")){_.focussed=true;_.autoPlay()}}},0)}).on("blur.slick","*",function(event){var $sf=$(this);if(_.options.pauseOnFocus){_.focussed=false;_.autoPlay()}})};Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){var _=this;return _.currentSlide};Slick.prototype.getDotCount=function(){var _=this;var breakPoint=0;var counter=0;var pagerQty=0;if(_.options.infinite===true){if(_.slideCount<=_.options.slidesToShow){++pagerQty}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}}else if(_.options.centerMode===true){pagerQty=_.slideCount}else if(!_.options.asNavFor){pagerQty=1+Math.ceil((_.slideCount-_.options.slidesToShow)/_.options.slidesToScroll)}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}return pagerQty-1};Slick.prototype.getLeft=function(slideIndex){var _=this,targetLeft,verticalHeight,verticalOffset=0,targetSlide,coef;_.slideOffset=0;verticalHeight=_.$slides.first().outerHeight(true);if(_.options.infinite===true){if(_.slideCount>_.options.slidesToShow){_.slideOffset=_.slideWidth*_.options.slidesToShow*-1;coef=-1;if(_.options.vertical===true&&_.options.centerMode===true){if(_.options.slidesToShow===2){coef=-1.5}else if(_.options.slidesToShow===1){coef=-2}}verticalOffset=verticalHeight*_.options.slidesToShow*coef}if(_.slideCount%_.options.slidesToScroll!==0){if(slideIndex+_.options.slidesToScroll>_.slideCount&&_.slideCount>_.options.slidesToShow){if(slideIndex>_.slideCount){_.slideOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*_.slideWidth*-1;verticalOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*verticalHeight*-1}else{_.slideOffset=_.slideCount%_.options.slidesToScroll*_.slideWidth*-1;verticalOffset=_.slideCount%_.options.slidesToScroll*verticalHeight*-1}}}}else{if(slideIndex+_.options.slidesToShow>_.slideCount){_.slideOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*_.slideWidth;verticalOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*verticalHeight}}if(_.slideCount<=_.options.slidesToShow){_.slideOffset=0;verticalOffset=0}if(_.options.centerMode===true&&_.slideCount<=_.options.slidesToShow){_.slideOffset=_.slideWidth*Math.floor(_.options.slidesToShow)/2-_.slideWidth*_.slideCount/2}else if(_.options.centerMode===true&&_.options.infinite===true){_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)-_.slideWidth}else if(_.options.centerMode===true){_.slideOffset=0;_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)}if(_.options.vertical===false){targetLeft=slideIndex*_.slideWidth*-1+_.slideOffset}else{targetLeft=slideIndex*verticalHeight*-1+verticalOffset}if(_.options.variableWidth===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}if(_.options.centerMode===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow+1)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}targetLeft+=(_.$list.width()-targetSlide.outerWidth())/2}}return targetLeft};Slick.prototype.getOption=Slick.prototype.slickGetOption=function(option){var _=this;return _.options[option]};Slick.prototype.getNavigableIndexes=function(){var _=this,breakPoint=0,counter=0,indexes=[],max;if(_.options.infinite===false){max=_.slideCount}else{breakPoint=_.options.slidesToScroll*-1;counter=_.options.slidesToScroll*-1;max=_.slideCount*2}while(breakPoint<max){indexes.push(breakPoint);breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}return indexes};Slick.prototype.getSlick=function(){return this};Slick.prototype.getSlideCount=function(){var _=this,slidesTraversed,swipedSlide,swipeTarget,centerOffset;centerOffset=_.options.centerMode===true?Math.floor(_.$list.width()/2):0;swipeTarget=_.swipeLeft*-1+centerOffset;if(_.options.swipeToSlide===true){_.$slideTrack.find(".slick-slide").each(function(index,slide){var slideOuterWidth,slideOffset,slideRightBoundary;slideOuterWidth=$(slide).outerWidth();slideOffset=slide.offsetLeft;if(_.options.centerMode!==true){slideOffset+=slideOuterWidth/2}slideRightBoundary=slideOffset+slideOuterWidth;if(swipeTarget<slideRightBoundary){swipedSlide=slide;return false}});slidesTraversed=Math.abs($(swipedSlide).attr("data-slick-index")-_.currentSlide)||1;return slidesTraversed}else{return _.options.slidesToScroll}};Slick.prototype.goTo=Slick.prototype.slickGoTo=function(slide,dontAnimate){var _=this;_.changeSlide({data:{message:"index",index:parseInt(slide)}},dontAnimate)};Slick.prototype.init=function(creation){var _=this;if(!$(_.$slider).hasClass("slick-initialized")){$(_.$slider).addClass("slick-initialized");_.buildRows();_.buildOut();_.setProps();_.startLoad();_.loadSlider();_.initializeEvents();_.updateArrows();_.updateDots();_.checkResponsive(true);_.focusHandler()}if(creation){_.$slider.trigger("init",[_])}if(_.options.accessibility===true){_.initADA()}if(_.options.autoplay){_.paused=false;_.autoPlay()}};Slick.prototype.initADA=function(){var _=this,numDotGroups=Math.ceil(_.slideCount/_.options.slidesToShow),tabControlIndexes=_.getNavigableIndexes().filter(function(val){return val>=0&&val<_.slideCount});_.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"});if(_.$dots!==null){_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function(i){var slideControlIndex=tabControlIndexes.indexOf(i);$(this).attr({role:"tabpanel",id:"slick-slide"+_.instanceUid+i,tabindex:-1});if(slideControlIndex!==-1){var ariaButtonControl="slick-slide-control"+_.instanceUid+slideControlIndex;if($("#"+ariaButtonControl).length){$(this).attr({"aria-describedby":ariaButtonControl})}}});_.$dots.attr("role","tablist").find("li").each(function(i){var mappedSlideIndex=tabControlIndexes[i];$(this).attr({role:"presentation"});$(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+_.instanceUid+i,"aria-controls":"slick-slide"+_.instanceUid+mappedSlideIndex,"aria-label":i+1+" of "+numDotGroups,"aria-selected":null,tabindex:"-1"})}).eq(_.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end()}for(var i=_.currentSlide,max=i+_.options.slidesToShow;i<max;i++){if(_.options.focusOnChange){_.$slides.eq(i).attr({tabindex:"0"})}else{_.$slides.eq(i).removeAttr("tabindex")}}_.activateADA()};Slick.prototype.initArrowEvents=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},_.changeSlide);_.$nextArrow.off("click.slick").on("click.slick",{message:"next"},_.changeSlide);if(_.options.accessibility===true){_.$prevArrow.on("keydown.slick",_.keyHandler);_.$nextArrow.on("keydown.slick",_.keyHandler)}}};Slick.prototype.initDotEvents=function(){var _=this;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("click.slick",{message:"index"},_.changeSlide);if(_.options.accessibility===true){_.$dots.on("keydown.slick",_.keyHandler)}}if(_.options.dots===true&&_.options.pauseOnDotsHover===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("mouseenter.slick",$.proxy(_.interrupt,_,true)).on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initSlideEvents=function(){var _=this;if(_.options.pauseOnHover){_.$list.on("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initializeEvents=function(){var _=this;_.initArrowEvents();_.initDotEvents();_.initSlideEvents();_.$list.on("touchstart.slick mousedown.slick",{action:"start"},_.swipeHandler);_.$list.on("touchmove.slick mousemove.slick",{action:"move"},_.swipeHandler);_.$list.on("touchend.slick mouseup.slick",{action:"end"},_.swipeHandler);_.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},_.swipeHandler);_.$list.on("click.slick",_.clickHandler);$(document).on(_.visibilityChange,$.proxy(_.visibility,_));if(_.options.accessibility===true){_.$list.on("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}$(window).on("orientationchange.slick.slick-"+_.instanceUid,$.proxy(_.orientationChange,_));$(window).on("resize.slick.slick-"+_.instanceUid,$.proxy(_.resize,_));$("[draggable!=true]",_.$slideTrack).on("dragstart",_.preventDefault);$(window).on("load.slick.slick-"+_.instanceUid,_.setPosition);$(_.setPosition)};Slick.prototype.initUI=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.show();_.$nextArrow.show()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.show()}};Slick.prototype.keyHandler=function(event){var _=this;if(!event.target.tagName.match("TEXTAREA|INPUT|SELECT")){if(event.keyCode===37&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"next":"previous"}})}else if(event.keyCode===39&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"previous":"next"}})}}};Slick.prototype.lazyLoad=function(){var _=this,loadRange,cloneRange,rangeStart,rangeEnd;function loadImages(imagesScope){$("img[data-lazy]",imagesScope).each(function(){var image=$(this),imageSource=$(this).attr("data-lazy"),imageSrcSet=$(this).attr("data-srcset"),imageSizes=$(this).attr("data-sizes")||_.$slider.attr("data-sizes"),imageToLoad=document.createElement("img");imageToLoad.onload=function(){image.animate({opacity:0},100,function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).animate({opacity:1},200,function(){image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")});_.$slider.trigger("lazyLoaded",[_,image,imageSource])})};imageToLoad.onerror=function(){image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource])};imageToLoad.src=imageSource})}if(_.options.centerMode===true){if(_.options.infinite===true){rangeStart=_.currentSlide+(_.options.slidesToShow/2+1);rangeEnd=rangeStart+_.options.slidesToShow+2}else{rangeStart=Math.max(0,_.currentSlide-(_.options.slidesToShow/2+1));rangeEnd=2+(_.options.slidesToShow/2+1)+_.currentSlide}}else{rangeStart=_.options.infinite?_.options.slidesToShow+_.currentSlide:_.currentSlide;rangeEnd=Math.ceil(rangeStart+_.options.slidesToShow);if(_.options.fade===true){if(rangeStart>0)rangeStart--;if(rangeEnd<=_.slideCount)rangeEnd++}}loadRange=_.$slider.find(".slick-slide").slice(rangeStart,rangeEnd);if(_.options.lazyLoad==="anticipated"){var prevSlide=rangeStart-1,nextSlide=rangeEnd,$slides=_.$slider.find(".slick-slide");for(var i=0;i<_.options.slidesToScroll;i++){if(prevSlide<0)prevSlide=_.slideCount-1;loadRange=loadRange.add($slides.eq(prevSlide));loadRange=loadRange.add($slides.eq(nextSlide));prevSlide--;nextSlide++}}loadImages(loadRange);if(_.slideCount<=_.options.slidesToShow){cloneRange=_.$slider.find(".slick-slide");loadImages(cloneRange)}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow){cloneRange=_.$slider.find(".slick-cloned").slice(0,_.options.slidesToShow);loadImages(cloneRange)}else if(_.currentSlide===0){cloneRange=_.$slider.find(".slick-cloned").slice(_.options.slidesToShow*-1);loadImages(cloneRange)}};Slick.prototype.loadSlider=function(){var _=this;_.setPosition();_.$slideTrack.css({opacity:1});_.$slider.removeClass("slick-loading");_.initUI();if(_.options.lazyLoad==="progressive"){_.progressiveLazyLoad()}};Slick.prototype.next=Slick.prototype.slickNext=function(){var _=this;_.changeSlide({data:{message:"next"}})};Slick.prototype.orientationChange=function(){var _=this;_.checkResponsive();_.setPosition()};Slick.prototype.pause=Slick.prototype.slickPause=function(){var _=this;_.autoPlayClear();_.paused=true};Slick.prototype.play=Slick.prototype.slickPlay=function(){var _=this;_.autoPlay();_.options.autoplay=true;_.paused=false;_.focussed=false;_.interrupted=false};Slick.prototype.postSlide=function(index){var _=this;if(!_.unslicked){_.$slider.trigger("afterChange",[_,index]);_.animating=false;if(_.slideCount>_.options.slidesToShow){_.setPosition()}_.swipeLeft=null;if(_.options.autoplay){_.autoPlay()}if(_.options.accessibility===true){_.initADA();if(_.options.focusOnChange){var $currentSlide=$(_.$slides.get(_.currentSlide));$currentSlide.attr("tabindex",0).focus()}}}};Slick.prototype.prev=Slick.prototype.slickPrev=function(){var _=this;_.changeSlide({data:{message:"previous"}})};Slick.prototype.preventDefault=function(event){event.preventDefault()};Slick.prototype.progressiveLazyLoad=function(tryCount){tryCount=tryCount||1;var _=this,$imgsToLoad=$("img[data-lazy]",_.$slider),image,imageSource,imageSrcSet,imageSizes,imageToLoad;if($imgsToLoad.length){image=$imgsToLoad.first();imageSource=image.attr("data-lazy");imageSrcSet=image.attr("data-srcset");imageSizes=image.attr("data-sizes")||_.$slider.attr("data-sizes");imageToLoad=document.createElement("img");imageToLoad.onload=function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");if(_.options.adaptiveHeight===true){_.setPosition()}_.$slider.trigger("lazyLoaded",[_,image,imageSource]);_.progressiveLazyLoad()};imageToLoad.onerror=function(){if(tryCount<3){setTimeout(function(){_.progressiveLazyLoad(tryCount+1)},500)}else{image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource]);_.progressiveLazyLoad()}};imageToLoad.src=imageSource}else{_.$slider.trigger("allImagesLoaded",[_])}};Slick.prototype.refresh=function(initializing){var _=this,currentSlide,lastVisibleIndex;lastVisibleIndex=_.slideCount-_.options.slidesToShow;if(!_.options.infinite&&_.currentSlide>lastVisibleIndex){_.currentSlide=lastVisibleIndex}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}currentSlide=_.currentSlide;_.destroy(true);$.extend(_,_.initials,{currentSlide:currentSlide});_.init();if(!initializing){_.changeSlide({data:{message:"index",index:currentSlide}},false)}};Slick.prototype.registerBreakpoints=function(){var _=this,breakpoint,currentBreakpoint,l,responsiveSettings=_.options.responsive||null;if($.type(responsiveSettings)==="array"&&responsiveSettings.length){_.respondTo=_.options.respondTo||"window";for(breakpoint in responsiveSettings){l=_.breakpoints.length-1;if(responsiveSettings.hasOwnProperty(breakpoint)){currentBreakpoint=responsiveSettings[breakpoint].breakpoint;while(l>=0){if(_.breakpoints[l]&&_.breakpoints[l]===currentBreakpoint){_.breakpoints.splice(l,1)}l--}_.breakpoints.push(currentBreakpoint);_.breakpointSettings[currentBreakpoint]=responsiveSettings[breakpoint].settings}}_.breakpoints.sort(function(a,b){return _.options.mobileFirst?a-b:b-a})}};Slick.prototype.reinit=function(){var _=this;_.$slides=_.$slideTrack.children(_.options.slide).addClass("slick-slide");_.slideCount=_.$slides.length;if(_.currentSlide>=_.slideCount&&_.currentSlide!==0){_.currentSlide=_.currentSlide-_.options.slidesToScroll}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}_.registerBreakpoints();_.setProps();_.setupInfinite();_.buildArrows();_.updateArrows();_.initArrowEvents();_.buildDots();_.updateDots();_.initDotEvents();_.cleanUpSlideEvents();_.initSlideEvents();_.checkResponsive(false,true);if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);_.setPosition();_.focusHandler();_.paused=!_.options.autoplay;_.autoPlay();_.$slider.trigger("reInit",[_])};Slick.prototype.resize=function(){var _=this;if($(window).width()!==_.windowWidth){clearTimeout(_.windowDelay);_.windowDelay=window.setTimeout(function(){_.windowWidth=$(window).width();_.checkResponsive();if(!_.unslicked){_.setPosition()}},50)}};Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(index,removeBefore,removeAll){var _=this;if(typeof index==="boolean"){removeBefore=index;index=removeBefore===true?0:_.slideCount-1}else{index=removeBefore===true?--index:index}if(_.slideCount<1||index<0||index>_.slideCount-1){return false}_.unload();if(removeAll===true){_.$slideTrack.children().remove()}else{_.$slideTrack.children(this.options.slide).eq(index).remove()}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.setCSS=function(position){var _=this,positionProps={},x,y;if(_.options.rtl===true){position=-position}x=_.positionProp=="left"?Math.ceil(position)+"px":"0px";y=_.positionProp=="top"?Math.ceil(position)+"px":"0px";positionProps[_.positionProp]=position;if(_.transformsEnabled===false){_.$slideTrack.css(positionProps)}else{positionProps={};if(_.cssTransitions===false){positionProps[_.animType]="translate("+x+", "+y+")";_.$slideTrack.css(positionProps)}else{positionProps[_.animType]="translate3d("+x+", "+y+", 0px)";_.$slideTrack.css(positionProps)}}};Slick.prototype.setDimensions=function(){var _=this;if(_.options.vertical===false){if(_.options.centerMode===true){_.$list.css({padding:"0px "+_.options.centerPadding})}}else{_.$list.height(_.$slides.first().outerHeight(true)*_.options.slidesToShow);if(_.options.centerMode===true){_.$list.css({padding:_.options.centerPadding+" 0px"})}}_.listWidth=_.$list.width();_.listHeight=_.$list.height();if(_.options.vertical===false&&_.options.variableWidth===false){_.slideWidth=Math.ceil(_.listWidth/_.options.slidesToShow);_.$slideTrack.width(Math.ceil(_.slideWidth*_.$slideTrack.children(".slick-slide").length))}else if(_.options.variableWidth===true){_.$slideTrack.width(5e3*_.slideCount)}else{_.slideWidth=Math.ceil(_.listWidth);_.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true)*_.$slideTrack.children(".slick-slide").length))}var offset=_.$slides.first().outerWidth(true)-_.$slides.first().width();if(_.options.variableWidth===false)_.$slideTrack.children(".slick-slide").width(_.slideWidth-offset)};Slick.prototype.setFade=function(){var _=this,targetLeft;_.$slides.each(function(index,element){targetLeft=_.slideWidth*index*-1;if(_.options.rtl===true){$(element).css({position:"relative",right:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}else{$(element).css({position:"relative",left:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}});_.$slides.eq(_.currentSlide).css({zIndex:_.options.zIndex-1,opacity:1})};Slick.prototype.setHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.css("height",targetHeight)}};Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){var _=this,l,item,option,value,refresh=false,type;if($.type(arguments[0])==="object"){option=arguments[0];refresh=arguments[1];type="multiple"}else if($.type(arguments[0])==="string"){option=arguments[0];value=arguments[1];refresh=arguments[2];if(arguments[0]==="responsive"&&$.type(arguments[1])==="array"){type="responsive"}else if(typeof arguments[1]!=="undefined"){type="single"}}if(type==="single"){_.options[option]=value}else if(type==="multiple"){$.each(option,function(opt,val){_.options[opt]=val})}else if(type==="responsive"){for(item in value){if($.type(_.options.responsive)!=="array"){_.options.responsive=[value[item]]}else{l=_.options.responsive.length-1;while(l>=0){if(_.options.responsive[l].breakpoint===value[item].breakpoint){_.options.responsive.splice(l,1)}l--}_.options.responsive.push(value[item])}}}if(refresh){_.unload();_.reinit()}};Slick.prototype.setPosition=function(){var _=this;_.setDimensions();_.setHeight();if(_.options.fade===false){_.setCSS(_.getLeft(_.currentSlide))}else{_.setFade()}_.$slider.trigger("setPosition",[_])};Slick.prototype.setProps=function(){var _=this,bodyStyle=document.body.style;_.positionProp=_.options.vertical===true?"top":"left";if(_.positionProp==="top"){_.$slider.addClass("slick-vertical")}else{_.$slider.removeClass("slick-vertical")}if(bodyStyle.WebkitTransition!==undefined||bodyStyle.MozTransition!==undefined||bodyStyle.msTransition!==undefined){if(_.options.useCSS===true){_.cssTransitions=true}}if(_.options.fade){if(typeof _.options.zIndex==="number"){if(_.options.zIndex<3){_.options.zIndex=3}}else{_.options.zIndex=_.defaults.zIndex}}if(bodyStyle.OTransform!==undefined){_.animType="OTransform";_.transformType="-o-transform";_.transitionType="OTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.MozTransform!==undefined){_.animType="MozTransform";_.transformType="-moz-transform";_.transitionType="MozTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.MozPerspective===undefined)_.animType=false}if(bodyStyle.webkitTransform!==undefined){_.animType="webkitTransform";_.transformType="-webkit-transform";_.transitionType="webkitTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.msTransform!==undefined){_.animType="msTransform";_.transformType="-ms-transform";_.transitionType="msTransition";if(bodyStyle.msTransform===undefined)_.animType=false}if(bodyStyle.transform!==undefined&&_.animType!==false){_.animType="transform";_.transformType="transform";_.transitionType="transition"}_.transformsEnabled=_.options.useTransform&&(_.animType!==null&&_.animType!==false)};Slick.prototype.setSlideClasses=function(index){var _=this,centerOffset,allSlides,indexOffset,remainder;allSlides=_.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true");_.$slides.eq(index).addClass("slick-current");if(_.options.centerMode===true){var evenCoef=_.options.slidesToShow%2===0?1:0;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.infinite===true){if(index>=centerOffset&&index<=_.slideCount-1-centerOffset){_.$slides.slice(index-centerOffset+evenCoef,index+centerOffset+1).addClass("slick-active").attr("aria-hidden","false")}else{indexOffset=_.options.slidesToShow+index;allSlides.slice(indexOffset-centerOffset+1+evenCoef,indexOffset+centerOffset+2).addClass("slick-active").attr("aria-hidden","false")}if(index===0){allSlides.eq(allSlides.length-1-_.options.slidesToShow).addClass("slick-center")}else if(index===_.slideCount-1){allSlides.eq(_.options.slidesToShow).addClass("slick-center")}}_.$slides.eq(index).addClass("slick-center")}else{if(index>=0&&index<=_.slideCount-_.options.slidesToShow){_.$slides.slice(index,index+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}else if(allSlides.length<=_.options.slidesToShow){allSlides.addClass("slick-active").attr("aria-hidden","false")}else{remainder=_.slideCount%_.options.slidesToShow;indexOffset=_.options.infinite===true?_.options.slidesToShow+index:index;if(_.options.slidesToShow==_.options.slidesToScroll&&_.slideCount-index<_.options.slidesToShow){allSlides.slice(indexOffset-(_.options.slidesToShow-remainder),indexOffset+remainder).addClass("slick-active").attr("aria-hidden","false")}else{allSlides.slice(indexOffset,indexOffset+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}}}if(_.options.lazyLoad==="ondemand"||_.options.lazyLoad==="anticipated"){_.lazyLoad()}};Slick.prototype.setupInfinite=function(){var _=this,i,slideIndex,infiniteCount;if(_.options.fade===true){_.options.centerMode=false}if(_.options.infinite===true&&_.options.fade===false){slideIndex=null;if(_.slideCount>_.options.slidesToShow){if(_.options.centerMode===true){infiniteCount=_.options.slidesToShow+1}else{infiniteCount=_.options.slidesToShow}for(i=_.slideCount;i>_.slideCount-infiniteCount;i-=1){slideIndex=i-1;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex-_.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned")}for(i=0;i<infiniteCount+_.slideCount;i+=1){slideIndex=i;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex+_.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned")}_.$slideTrack.find(".slick-cloned").find("[id]").each(function(){$(this).attr("id","")})}}};Slick.prototype.interrupt=function(toggle){var _=this;if(!toggle){_.autoPlay()}_.interrupted=toggle};Slick.prototype.selectHandler=function(event){var _=this;var targetElement=$(event.target).is(".slick-slide")?$(event.target):$(event.target).parents(".slick-slide");var index=parseInt(targetElement.attr("data-slick-index"));if(!index)index=0;if(_.slideCount<=_.options.slidesToShow){_.slideHandler(index,false,true);return}_.slideHandler(index)};Slick.prototype.slideHandler=function(index,sync,dontAnimate){var targetSlide,animSlide,oldSlide,slideLeft,targetLeft=null,_=this,navTarget;sync=sync||false;if(_.animating===true&&_.options.waitForAnimate===true){return}if(_.options.fade===true&&_.currentSlide===index){return}if(sync===false){_.asNavFor(index)}targetSlide=index;targetLeft=_.getLeft(targetSlide);slideLeft=_.getLeft(_.currentSlide);_.currentLeft=_.swipeLeft===null?slideLeft:_.swipeLeft;if(_.options.infinite===false&&_.options.centerMode===false&&(index<0||index>_.getDotCount()*_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}else if(_.options.infinite===false&&_.options.centerMode===true&&(index<0||index>_.slideCount-_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}if(_.options.autoplay){clearInterval(_.autoPlayTimer)}if(targetSlide<0){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=_.slideCount-_.slideCount%_.options.slidesToScroll}else{animSlide=_.slideCount+targetSlide}}else if(targetSlide>=_.slideCount){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=0}else{animSlide=targetSlide-_.slideCount}}else{animSlide=targetSlide}_.animating=true;_.$slider.trigger("beforeChange",[_,_.currentSlide,animSlide]);oldSlide=_.currentSlide;_.currentSlide=animSlide;_.setSlideClasses(_.currentSlide);if(_.options.asNavFor){navTarget=_.getNavTarget();navTarget=navTarget.slick("getSlick");if(navTarget.slideCount<=navTarget.options.slidesToShow){navTarget.setSlideClasses(_.currentSlide)}}_.updateDots();_.updateArrows();if(_.options.fade===true){if(dontAnimate!==true){_.fadeSlideOut(oldSlide);_.fadeSlide(animSlide,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}_.animateHeight();return}if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(targetLeft,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}};Slick.prototype.startLoad=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.hide();_.$nextArrow.hide()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.hide()}_.$slider.addClass("slick-loading")};Slick.prototype.swipeDirection=function(){var xDist,yDist,r,swipeAngle,_=this;xDist=_.touchObject.startX-_.touchObject.curX;yDist=_.touchObject.startY-_.touchObject.curY;r=Math.atan2(yDist,xDist);swipeAngle=Math.round(r*180/Math.PI);if(swipeAngle<0){swipeAngle=360-Math.abs(swipeAngle)}if(swipeAngle<=45&&swipeAngle>=0){return _.options.rtl===false?"left":"right"}if(swipeAngle<=360&&swipeAngle>=315){return _.options.rtl===false?"left":"right"}if(swipeAngle>=135&&swipeAngle<=225){return _.options.rtl===false?"right":"left"}if(_.options.verticalSwiping===true){if(swipeAngle>=35&&swipeAngle<=135){return"down"}else{return"up"}}return"vertical"};Slick.prototype.swipeEnd=function(event){var _=this,slideCount,direction;_.dragging=false;_.swiping=false;if(_.scrolling){_.scrolling=false;return false}_.interrupted=false;_.shouldClick=_.touchObject.swipeLength>10?false:true;if(_.touchObject.curX===undefined){return false}if(_.touchObject.edgeHit===true){_.$slider.trigger("edge",[_,_.swipeDirection()])}if(_.touchObject.swipeLength>=_.touchObject.minSwipe){direction=_.swipeDirection();switch(direction){case"left":case"down":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide+_.getSlideCount()):_.currentSlide+_.getSlideCount();_.currentDirection=0;break;case"right":case"up":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide-_.getSlideCount()):_.currentSlide-_.getSlideCount();_.currentDirection=1;break;default:}if(direction!="vertical"){_.slideHandler(slideCount);_.touchObject={};_.$slider.trigger("swipe",[_,direction])}}else{if(_.touchObject.startX!==_.touchObject.curX){_.slideHandler(_.currentSlide);_.touchObject={}}}};Slick.prototype.swipeHandler=function(event){var _=this;if(_.options.swipe===false||"ontouchend"in document&&_.options.swipe===false){return}else if(_.options.draggable===false&&event.type.indexOf("mouse")!==-1){return}_.touchObject.fingerCount=event.originalEvent&&event.originalEvent.touches!==undefined?event.originalEvent.touches.length:1;_.touchObject.minSwipe=_.listWidth/_.options.touchThreshold;if(_.options.verticalSwiping===true){_.touchObject.minSwipe=_.listHeight/_.options.touchThreshold}switch(event.data.action){case"start":_.swipeStart(event);break;case"move":_.swipeMove(event);break;case"end":_.swipeEnd(event);break}};Slick.prototype.swipeMove=function(event){var _=this,edgeWasHit=false,curLeft,swipeDirection,swipeLength,positionOffset,touches,verticalSwipeLength;touches=event.originalEvent!==undefined?event.originalEvent.touches:null;if(!_.dragging||_.scrolling||touches&&touches.length!==1){return false}curLeft=_.getLeft(_.currentSlide);_.touchObject.curX=touches!==undefined?touches[0].pageX:event.clientX;_.touchObject.curY=touches!==undefined?touches[0].pageY:event.clientY;_.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curX-_.touchObject.startX,2)));verticalSwipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curY-_.touchObject.startY,2)));if(!_.options.verticalSwiping&&!_.swiping&&verticalSwipeLength>4){_.scrolling=true;return false}if(_.options.verticalSwiping===true){_.touchObject.swipeLength=verticalSwipeLength}swipeDirection=_.swipeDirection();if(event.originalEvent!==undefined&&_.touchObject.swipeLength>4){_.swiping=true;event.preventDefault()}positionOffset=(_.options.rtl===false?1:-1)*(_.touchObject.curX>_.touchObject.startX?1:-1);if(_.options.verticalSwiping===true){positionOffset=_.touchObject.curY>_.touchObject.startY?1:-1}swipeLength=_.touchObject.swipeLength;_.touchObject.edgeHit=false;if(_.options.infinite===false){if(_.currentSlide===0&&swipeDirection==="right"||_.currentSlide>=_.getDotCount()&&swipeDirection==="left"){swipeLength=_.touchObject.swipeLength*_.options.edgeFriction;_.touchObject.edgeHit=true}}if(_.options.vertical===false){_.swipeLeft=curLeft+swipeLength*positionOffset}else{_.swipeLeft=curLeft+swipeLength*(_.$list.height()/_.listWidth)*positionOffset}if(_.options.verticalSwiping===true){_.swipeLeft=curLeft+swipeLength*positionOffset}if(_.options.fade===true||_.options.touchMove===false){return false}if(_.animating===true){_.swipeLeft=null;return false}_.setCSS(_.swipeLeft)};Slick.prototype.swipeStart=function(event){var _=this,touches;_.interrupted=true;if(_.touchObject.fingerCount!==1||_.slideCount<=_.options.slidesToShow){_.touchObject={};return false}if(event.originalEvent!==undefined&&event.originalEvent.touches!==undefined){touches=event.originalEvent.touches[0]}_.touchObject.startX=_.touchObject.curX=touches!==undefined?touches.pageX:event.clientX;_.touchObject.startY=_.touchObject.curY=touches!==undefined?touches.pageY:event.clientY;_.dragging=true};Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var _=this;if(_.$slidesCache!==null){_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.unload=function(){var _=this;$(".slick-cloned",_.$slider).remove();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}if(_.$nextArrow&&_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}_.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")};Slick.prototype.unslick=function(fromBreakpoint){var _=this;_.$slider.trigger("unslick",[_,fromBreakpoint]);_.destroy()};Slick.prototype.updateArrows=function(){var _=this,centerOffset;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow&&!_.options.infinite){_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false");if(_.currentSlide===0){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow&&_.options.centerMode===false){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-1&&_.options.centerMode===true){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}}};Slick.prototype.updateDots=function(){var _=this;if(_.$dots!==null){_.$dots.find("li").removeClass("slick-active").end();_.$dots.find("li").eq(Math.floor(_.currentSlide/_.options.slidesToScroll)).addClass("slick-active")}};Slick.prototype.visibility=function(){var _=this;if(_.options.autoplay){if(document[_.hidden]){_.interrupted=true}else{_.interrupted=false}}};$.fn.slick=function(){var _=this,opt=arguments[0],args=Array.prototype.slice.call(arguments,1),l=_.length,i,ret;for(i=0;i<l;i++){if(typeof opt=="object"||typeof opt=="undefined")_[i].slick=new Slick(_[i],opt);else ret=_[i].slick[opt].apply(_[i].slick,args);if(typeof ret!="undefined")return ret}return _}});

/**
 * Swiper 8.4.4
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: October 14, 2022
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Swiper=t()}(this,(function(){"use strict";function e(e){return null!==e&&"object"==typeof e&&"constructor"in e&&e.constructor===Object}function t(s,i){void 0===s&&(s={}),void 0===i&&(i={}),Object.keys(i).forEach((n=>{void 0===s[n]?s[n]=i[n]:e(i[n])&&e(s[n])&&Object.keys(i[n]).length>0&&t(s[n],i[n])}))}const s={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createEvent:()=>({initEvent(){}}),createElement:()=>({children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName:()=>[]}),createElementNS:()=>({}),importNode:()=>null,location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function i(){const e="undefined"!=typeof document?document:{};return t(e,s),e}const n={document:s,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle:()=>({getPropertyValue:()=>""}),Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia:()=>({}),requestAnimationFrame:e=>"undefined"==typeof setTimeout?(e(),null):setTimeout(e,0),cancelAnimationFrame(e){"undefined"!=typeof setTimeout&&clearTimeout(e)}};function a(){const e="undefined"!=typeof window?window:{};return t(e,n),e}class r extends Array{constructor(e){"number"==typeof e?super(e):(super(...e||[]),function(e){const t=e.__proto__;Object.defineProperty(e,"__proto__",{get:()=>t,set(e){t.__proto__=e}})}(this))}}function l(e){void 0===e&&(e=[]);const t=[];return e.forEach((e=>{Array.isArray(e)?t.push(...l(e)):t.push(e)})),t}function o(e,t){return Array.prototype.filter.call(e,t)}function d(e,t){const s=a(),n=i();let l=[];if(!t&&e instanceof r)return e;if(!e)return new r(l);if("string"==typeof e){const s=e.trim();if(s.indexOf("<")>=0&&s.indexOf(">")>=0){let e="div";0===s.indexOf("<li")&&(e="ul"),0===s.indexOf("<tr")&&(e="tbody"),0!==s.indexOf("<td")&&0!==s.indexOf("<th")||(e="tr"),0===s.indexOf("<tbody")&&(e="table"),0===s.indexOf("<option")&&(e="select");const t=n.createElement(e);t.innerHTML=s;for(let e=0;e<t.childNodes.length;e+=1)l.push(t.childNodes[e])}else l=function(e,t){if("string"!=typeof e)return[e];const s=[],i=t.querySelectorAll(e);for(let e=0;e<i.length;e+=1)s.push(i[e]);return s}(e.trim(),t||n)}else if(e.nodeType||e===s||e===n)l.push(e);else if(Array.isArray(e)){if(e instanceof r)return e;l=e}return new r(function(e){const t=[];for(let s=0;s<e.length;s+=1)-1===t.indexOf(e[s])&&t.push(e[s]);return t}(l))}d.fn=r.prototype;const c={addClass:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];const i=l(t.map((e=>e.split(" "))));return this.forEach((e=>{e.classList.add(...i)})),this},removeClass:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];const i=l(t.map((e=>e.split(" "))));return this.forEach((e=>{e.classList.remove(...i)})),this},hasClass:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];const i=l(t.map((e=>e.split(" "))));return o(this,(e=>i.filter((t=>e.classList.contains(t))).length>0)).length>0},toggleClass:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];const i=l(t.map((e=>e.split(" "))));this.forEach((e=>{i.forEach((t=>{e.classList.toggle(t)}))}))},attr:function(e,t){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(let s=0;s<this.length;s+=1)if(2===arguments.length)this[s].setAttribute(e,t);else for(const t in e)this[s][t]=e[t],this[s].setAttribute(t,e[t]);return this},removeAttr:function(e){for(let t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},transform:function(e){for(let t=0;t<this.length;t+=1)this[t].style.transform=e;return this},transition:function(e){for(let t=0;t<this.length;t+=1)this[t].style.transitionDuration="string"!=typeof e?`${e}ms`:e;return this},on:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];let[i,n,a,r]=t;function l(e){const t=e.target;if(!t)return;const s=e.target.dom7EventData||[];if(s.indexOf(e)<0&&s.unshift(e),d(t).is(n))a.apply(t,s);else{const e=d(t).parents();for(let t=0;t<e.length;t+=1)d(e[t]).is(n)&&a.apply(e[t],s)}}function o(e){const t=e&&e.target&&e.target.dom7EventData||[];t.indexOf(e)<0&&t.unshift(e),a.apply(this,t)}"function"==typeof t[1]&&([i,a,r]=t,n=void 0),r||(r=!1);const c=i.split(" ");let p;for(let e=0;e<this.length;e+=1){const t=this[e];if(n)for(p=0;p<c.length;p+=1){const e=c[p];t.dom7LiveListeners||(t.dom7LiveListeners={}),t.dom7LiveListeners[e]||(t.dom7LiveListeners[e]=[]),t.dom7LiveListeners[e].push({listener:a,proxyListener:l}),t.addEventListener(e,l,r)}else for(p=0;p<c.length;p+=1){const e=c[p];t.dom7Listeners||(t.dom7Listeners={}),t.dom7Listeners[e]||(t.dom7Listeners[e]=[]),t.dom7Listeners[e].push({listener:a,proxyListener:o}),t.addEventListener(e,o,r)}}return this},off:function(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];let[i,n,a,r]=t;"function"==typeof t[1]&&([i,a,r]=t,n=void 0),r||(r=!1);const l=i.split(" ");for(let e=0;e<l.length;e+=1){const t=l[e];for(let e=0;e<this.length;e+=1){const s=this[e];let i;if(!n&&s.dom7Listeners?i=s.dom7Listeners[t]:n&&s.dom7LiveListeners&&(i=s.dom7LiveListeners[t]),i&&i.length)for(let e=i.length-1;e>=0;e-=1){const n=i[e];a&&n.listener===a||a&&n.listener&&n.listener.dom7proxy&&n.listener.dom7proxy===a?(s.removeEventListener(t,n.proxyListener,r),i.splice(e,1)):a||(s.removeEventListener(t,n.proxyListener,r),i.splice(e,1))}}}return this},trigger:function(){const e=a();for(var t=arguments.length,s=new Array(t),i=0;i<t;i++)s[i]=arguments[i];const n=s[0].split(" "),r=s[1];for(let t=0;t<n.length;t+=1){const i=n[t];for(let t=0;t<this.length;t+=1){const n=this[t];if(e.CustomEvent){const t=new e.CustomEvent(i,{detail:r,bubbles:!0,cancelable:!0});n.dom7EventData=s.filter(((e,t)=>t>0)),n.dispatchEvent(t),n.dom7EventData=[],delete n.dom7EventData}}}return this},transitionEnd:function(e){const t=this;return e&&t.on("transitionend",(function s(i){i.target===this&&(e.call(this,i),t.off("transitionend",s))})),this},outerWidth:function(e){if(this.length>0){if(e){const e=this.styles();return this[0].offsetWidth+parseFloat(e.getPropertyValue("margin-right"))+parseFloat(e.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(this.length>0){if(e){const e=this.styles();return this[0].offsetHeight+parseFloat(e.getPropertyValue("margin-top"))+parseFloat(e.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},styles:function(){const e=a();return this[0]?e.getComputedStyle(this[0],null):{}},offset:function(){if(this.length>0){const e=a(),t=i(),s=this[0],n=s.getBoundingClientRect(),r=t.body,l=s.clientTop||r.clientTop||0,o=s.clientLeft||r.clientLeft||0,d=s===e?e.scrollY:s.scrollTop,c=s===e?e.scrollX:s.scrollLeft;return{top:n.top+d-l,left:n.left+c-o}}return null},css:function(e,t){const s=a();let i;if(1===arguments.length){if("string"!=typeof e){for(i=0;i<this.length;i+=1)for(const t in e)this[i].style[t]=e[t];return this}if(this[0])return s.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(i=0;i<this.length;i+=1)this[i].style[e]=t;return this}return this},each:function(e){return e?(this.forEach(((t,s)=>{e.apply(t,[t,s])})),this):this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:null;for(let t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(let t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(e){const t=a(),s=i(),n=this[0];let l,o;if(!n||void 0===e)return!1;if("string"==typeof e){if(n.matches)return n.matches(e);if(n.webkitMatchesSelector)return n.webkitMatchesSelector(e);if(n.msMatchesSelector)return n.msMatchesSelector(e);for(l=d(e),o=0;o<l.length;o+=1)if(l[o]===n)return!0;return!1}if(e===s)return n===s;if(e===t)return n===t;if(e.nodeType||e instanceof r){for(l=e.nodeType?[e]:e,o=0;o<l.length;o+=1)if(l[o]===n)return!0;return!1}return!1},index:function(){let e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(e){if(void 0===e)return this;const t=this.length;if(e>t-1)return d([]);if(e<0){const s=t+e;return d(s<0?[]:[this[s]])}return d([this[e]])},append:function(){let e;const t=i();for(let s=0;s<arguments.length;s+=1){e=s<0||arguments.length<=s?void 0:arguments[s];for(let s=0;s<this.length;s+=1)if("string"==typeof e){const i=t.createElement("div");for(i.innerHTML=e;i.firstChild;)this[s].appendChild(i.firstChild)}else if(e instanceof r)for(let t=0;t<e.length;t+=1)this[s].appendChild(e[t]);else this[s].appendChild(e)}return this},prepend:function(e){const t=i();let s,n;for(s=0;s<this.length;s+=1)if("string"==typeof e){const i=t.createElement("div");for(i.innerHTML=e,n=i.childNodes.length-1;n>=0;n-=1)this[s].insertBefore(i.childNodes[n],this[s].childNodes[0])}else if(e instanceof r)for(n=0;n<e.length;n+=1)this[s].insertBefore(e[n],this[s].childNodes[0]);else this[s].insertBefore(e,this[s].childNodes[0]);return this},next:function(e){return this.length>0?e?this[0].nextElementSibling&&d(this[0].nextElementSibling).is(e)?d([this[0].nextElementSibling]):d([]):this[0].nextElementSibling?d([this[0].nextElementSibling]):d([]):d([])},nextAll:function(e){const t=[];let s=this[0];if(!s)return d([]);for(;s.nextElementSibling;){const i=s.nextElementSibling;e?d(i).is(e)&&t.push(i):t.push(i),s=i}return d(t)},prev:function(e){if(this.length>0){const t=this[0];return e?t.previousElementSibling&&d(t.previousElementSibling).is(e)?d([t.previousElementSibling]):d([]):t.previousElementSibling?d([t.previousElementSibling]):d([])}return d([])},prevAll:function(e){const t=[];let s=this[0];if(!s)return d([]);for(;s.previousElementSibling;){const i=s.previousElementSibling;e?d(i).is(e)&&t.push(i):t.push(i),s=i}return d(t)},parent:function(e){const t=[];for(let s=0;s<this.length;s+=1)null!==this[s].parentNode&&(e?d(this[s].parentNode).is(e)&&t.push(this[s].parentNode):t.push(this[s].parentNode));return d(t)},parents:function(e){const t=[];for(let s=0;s<this.length;s+=1){let i=this[s].parentNode;for(;i;)e?d(i).is(e)&&t.push(i):t.push(i),i=i.parentNode}return d(t)},closest:function(e){let t=this;return void 0===e?d([]):(t.is(e)||(t=t.parents(e).eq(0)),t)},find:function(e){const t=[];for(let s=0;s<this.length;s+=1){const i=this[s].querySelectorAll(e);for(let e=0;e<i.length;e+=1)t.push(i[e])}return d(t)},children:function(e){const t=[];for(let s=0;s<this.length;s+=1){const i=this[s].children;for(let s=0;s<i.length;s+=1)e&&!d(i[s]).is(e)||t.push(i[s])}return d(t)},filter:function(e){return d(o(this,e))},remove:function(){for(let e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this}};function p(e,t){return void 0===t&&(t=0),setTimeout(e,t)}function u(){return Date.now()}function h(e,t){void 0===t&&(t="x");const s=a();let i,n,r;const l=function(e){const t=a();let s;return t.getComputedStyle&&(s=t.getComputedStyle(e,null)),!s&&e.currentStyle&&(s=e.currentStyle),s||(s=e.style),s}(e);return s.WebKitCSSMatrix?(n=l.transform||l.webkitTransform,n.split(",").length>6&&(n=n.split(", ").map((e=>e.replace(",","."))).join(", ")),r=new s.WebKitCSSMatrix("none"===n?"":n)):(r=l.MozTransform||l.OTransform||l.MsTransform||l.msTransform||l.transform||l.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),i=r.toString().split(",")),"x"===t&&(n=s.WebKitCSSMatrix?r.m41:16===i.length?parseFloat(i[12]):parseFloat(i[4])),"y"===t&&(n=s.WebKitCSSMatrix?r.m42:16===i.length?parseFloat(i[13]):parseFloat(i[5])),n||0}function m(e){return"object"==typeof e&&null!==e&&e.constructor&&"Object"===Object.prototype.toString.call(e).slice(8,-1)}function f(e){return"undefined"!=typeof window&&void 0!==window.HTMLElement?e instanceof HTMLElement:e&&(1===e.nodeType||11===e.nodeType)}function g(){const e=Object(arguments.length<=0?void 0:arguments[0]),t=["__proto__","constructor","prototype"];for(let s=1;s<arguments.length;s+=1){const i=s<0||arguments.length<=s?void 0:arguments[s];if(null!=i&&!f(i)){const s=Object.keys(Object(i)).filter((e=>t.indexOf(e)<0));for(let t=0,n=s.length;t<n;t+=1){const n=s[t],a=Object.getOwnPropertyDescriptor(i,n);void 0!==a&&a.enumerable&&(m(e[n])&&m(i[n])?i[n].__swiper__?e[n]=i[n]:g(e[n],i[n]):!m(e[n])&&m(i[n])?(e[n]={},i[n].__swiper__?e[n]=i[n]:g(e[n],i[n])):e[n]=i[n])}}}return e}function v(e,t,s){e.style.setProperty(t,s)}function b(e){let{swiper:t,targetPosition:s,side:i}=e;const n=a(),r=-t.translate;let l,o=null;const d=t.params.speed;t.wrapperEl.style.scrollSnapType="none",n.cancelAnimationFrame(t.cssModeFrameID);const c=s>r?"next":"prev",p=(e,t)=>"next"===c&&e>=t||"prev"===c&&e<=t,u=()=>{l=(new Date).getTime(),null===o&&(o=l);const e=Math.max(Math.min((l-o)/d,1),0),a=.5-Math.cos(e*Math.PI)/2;let c=r+a*(s-r);if(p(c,s)&&(c=s),t.wrapperEl.scrollTo({[i]:c}),p(c,s))return t.wrapperEl.style.overflow="hidden",t.wrapperEl.style.scrollSnapType="",setTimeout((()=>{t.wrapperEl.style.overflow="",t.wrapperEl.scrollTo({[i]:c})})),void n.cancelAnimationFrame(t.cssModeFrameID);t.cssModeFrameID=n.requestAnimationFrame(u)};u()}let w,T,y;function C(){return w||(w=function(){const e=a(),t=i();return{smoothScroll:t.documentElement&&"scrollBehavior"in t.documentElement.style,touch:!!("ontouchstart"in e||e.DocumentTouch&&t instanceof e.DocumentTouch),passiveListener:function(){let t=!1;try{const s=Object.defineProperty({},"passive",{get(){t=!0}});e.addEventListener("testPassiveListener",null,s)}catch(e){}return t}(),gestures:"ongesturestart"in e}}()),w}function x(e){return void 0===e&&(e={}),T||(T=function(e){let{userAgent:t}=void 0===e?{}:e;const s=C(),i=a(),n=i.navigator.platform,r=t||i.navigator.userAgent,l={ios:!1,android:!1},o=i.screen.width,d=i.screen.height,c=r.match(/(Android);?[\s\/]+([\d.]+)?/);let p=r.match(/(iPad).*OS\s([\d_]+)/);const u=r.match(/(iPod)(.*OS\s([\d_]+))?/),h=!p&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),m="Win32"===n;let f="MacIntel"===n;return!p&&f&&s.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"].indexOf(`${o}x${d}`)>=0&&(p=r.match(/(Version)\/([\d.]+)/),p||(p=[0,1,"13_0_0"]),f=!1),c&&!m&&(l.os="android",l.android=!0),(p||h||u)&&(l.os="ios",l.ios=!0),l}(e)),T}function S(){return y||(y=function(){const e=a();return{isSafari:function(){const t=e.navigator.userAgent.toLowerCase();return t.indexOf("safari")>=0&&t.indexOf("chrome")<0&&t.indexOf("android")<0}(),isWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)}}()),y}Object.keys(c).forEach((e=>{Object.defineProperty(d.fn,e,{value:c[e],writable:!0})}));var E={on(e,t,s){const i=this;if(!i.eventsListeners||i.destroyed)return i;if("function"!=typeof t)return i;const n=s?"unshift":"push";return e.split(" ").forEach((e=>{i.eventsListeners[e]||(i.eventsListeners[e]=[]),i.eventsListeners[e][n](t)})),i},once(e,t,s){const i=this;if(!i.eventsListeners||i.destroyed)return i;if("function"!=typeof t)return i;function n(){i.off(e,n),n.__emitterProxy&&delete n.__emitterProxy;for(var s=arguments.length,a=new Array(s),r=0;r<s;r++)a[r]=arguments[r];t.apply(i,a)}return n.__emitterProxy=t,i.on(e,n,s)},onAny(e,t){const s=this;if(!s.eventsListeners||s.destroyed)return s;if("function"!=typeof e)return s;const i=t?"unshift":"push";return s.eventsAnyListeners.indexOf(e)<0&&s.eventsAnyListeners[i](e),s},offAny(e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsAnyListeners)return t;const s=t.eventsAnyListeners.indexOf(e);return s>=0&&t.eventsAnyListeners.splice(s,1),t},off(e,t){const s=this;return!s.eventsListeners||s.destroyed?s:s.eventsListeners?(e.split(" ").forEach((e=>{void 0===t?s.eventsListeners[e]=[]:s.eventsListeners[e]&&s.eventsListeners[e].forEach(((i,n)=>{(i===t||i.__emitterProxy&&i.__emitterProxy===t)&&s.eventsListeners[e].splice(n,1)}))})),s):s},emit(){const e=this;if(!e.eventsListeners||e.destroyed)return e;if(!e.eventsListeners)return e;let t,s,i;for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];"string"==typeof a[0]||Array.isArray(a[0])?(t=a[0],s=a.slice(1,a.length),i=e):(t=a[0].events,s=a[0].data,i=a[0].context||e),s.unshift(i);return(Array.isArray(t)?t:t.split(" ")).forEach((t=>{e.eventsAnyListeners&&e.eventsAnyListeners.length&&e.eventsAnyListeners.forEach((e=>{e.apply(i,[t,...s])})),e.eventsListeners&&e.eventsListeners[t]&&e.eventsListeners[t].forEach((e=>{e.apply(i,s)}))})),e}};var M={updateSize:function(){const e=this;let t,s;const i=e.$el;t=void 0!==e.params.width&&null!==e.params.width?e.params.width:i[0].clientWidth,s=void 0!==e.params.height&&null!==e.params.height?e.params.height:i[0].clientHeight,0===t&&e.isHorizontal()||0===s&&e.isVertical()||(t=t-parseInt(i.css("padding-left")||0,10)-parseInt(i.css("padding-right")||0,10),s=s-parseInt(i.css("padding-top")||0,10)-parseInt(i.css("padding-bottom")||0,10),Number.isNaN(t)&&(t=0),Number.isNaN(s)&&(s=0),Object.assign(e,{width:t,height:s,size:e.isHorizontal()?t:s}))},updateSlides:function(){const e=this;function t(t){return e.isHorizontal()?t:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[t]}function s(e,s){return parseFloat(e.getPropertyValue(t(s))||0)}const i=e.params,{$wrapperEl:n,size:a,rtlTranslate:r,wrongRTL:l}=e,o=e.virtual&&i.virtual.enabled,d=o?e.virtual.slides.length:e.slides.length,c=n.children(`.${e.params.slideClass}`),p=o?e.virtual.slides.length:c.length;let u=[];const h=[],m=[];let f=i.slidesOffsetBefore;"function"==typeof f&&(f=i.slidesOffsetBefore.call(e));let g=i.slidesOffsetAfter;"function"==typeof g&&(g=i.slidesOffsetAfter.call(e));const b=e.snapGrid.length,w=e.slidesGrid.length;let T=i.spaceBetween,y=-f,C=0,x=0;if(void 0===a)return;"string"==typeof T&&T.indexOf("%")>=0&&(T=parseFloat(T.replace("%",""))/100*a),e.virtualSize=-T,r?c.css({marginLeft:"",marginBottom:"",marginTop:""}):c.css({marginRight:"",marginBottom:"",marginTop:""}),i.centeredSlides&&i.cssMode&&(v(e.wrapperEl,"--swiper-centered-offset-before",""),v(e.wrapperEl,"--swiper-centered-offset-after",""));const S=i.grid&&i.grid.rows>1&&e.grid;let E;S&&e.grid.initSlides(p);const M="auto"===i.slidesPerView&&i.breakpoints&&Object.keys(i.breakpoints).filter((e=>void 0!==i.breakpoints[e].slidesPerView)).length>0;for(let n=0;n<p;n+=1){E=0;const r=c.eq(n);if(S&&e.grid.updateSlide(n,r,p,t),"none"!==r.css("display")){if("auto"===i.slidesPerView){M&&(c[n].style[t("width")]="");const a=getComputedStyle(r[0]),l=r[0].style.transform,o=r[0].style.webkitTransform;if(l&&(r[0].style.transform="none"),o&&(r[0].style.webkitTransform="none"),i.roundLengths)E=e.isHorizontal()?r.outerWidth(!0):r.outerHeight(!0);else{const e=s(a,"width"),t=s(a,"padding-left"),i=s(a,"padding-right"),n=s(a,"margin-left"),l=s(a,"margin-right"),o=a.getPropertyValue("box-sizing");if(o&&"border-box"===o)E=e+n+l;else{const{clientWidth:s,offsetWidth:a}=r[0];E=e+t+i+n+l+(a-s)}}l&&(r[0].style.transform=l),o&&(r[0].style.webkitTransform=o),i.roundLengths&&(E=Math.floor(E))}else E=(a-(i.slidesPerView-1)*T)/i.slidesPerView,i.roundLengths&&(E=Math.floor(E)),c[n]&&(c[n].style[t("width")]=`${E}px`);c[n]&&(c[n].swiperSlideSize=E),m.push(E),i.centeredSlides?(y=y+E/2+C/2+T,0===C&&0!==n&&(y=y-a/2-T),0===n&&(y=y-a/2-T),Math.abs(y)<.001&&(y=0),i.roundLengths&&(y=Math.floor(y)),x%i.slidesPerGroup==0&&u.push(y),h.push(y)):(i.roundLengths&&(y=Math.floor(y)),(x-Math.min(e.params.slidesPerGroupSkip,x))%e.params.slidesPerGroup==0&&u.push(y),h.push(y),y=y+E+T),e.virtualSize+=E+T,C=E,x+=1}}if(e.virtualSize=Math.max(e.virtualSize,a)+g,r&&l&&("slide"===i.effect||"coverflow"===i.effect)&&n.css({width:`${e.virtualSize+i.spaceBetween}px`}),i.setWrapperSize&&n.css({[t("width")]:`${e.virtualSize+i.spaceBetween}px`}),S&&e.grid.updateWrapperSize(E,u,t),!i.centeredSlides){const t=[];for(let s=0;s<u.length;s+=1){let n=u[s];i.roundLengths&&(n=Math.floor(n)),u[s]<=e.virtualSize-a&&t.push(n)}u=t,Math.floor(e.virtualSize-a)-Math.floor(u[u.length-1])>1&&u.push(e.virtualSize-a)}if(0===u.length&&(u=[0]),0!==i.spaceBetween){const s=e.isHorizontal()&&r?"marginLeft":t("marginRight");c.filter(((e,t)=>!i.cssMode||t!==c.length-1)).css({[s]:`${T}px`})}if(i.centeredSlides&&i.centeredSlidesBounds){let e=0;m.forEach((t=>{e+=t+(i.spaceBetween?i.spaceBetween:0)})),e-=i.spaceBetween;const t=e-a;u=u.map((e=>e<0?-f:e>t?t+g:e))}if(i.centerInsufficientSlides){let e=0;if(m.forEach((t=>{e+=t+(i.spaceBetween?i.spaceBetween:0)})),e-=i.spaceBetween,e<a){const t=(a-e)/2;u.forEach(((e,s)=>{u[s]=e-t})),h.forEach(((e,s)=>{h[s]=e+t}))}}if(Object.assign(e,{slides:c,snapGrid:u,slidesGrid:h,slidesSizesGrid:m}),i.centeredSlides&&i.cssMode&&!i.centeredSlidesBounds){v(e.wrapperEl,"--swiper-centered-offset-before",-u[0]+"px"),v(e.wrapperEl,"--swiper-centered-offset-after",e.size/2-m[m.length-1]/2+"px");const t=-e.snapGrid[0],s=-e.slidesGrid[0];e.snapGrid=e.snapGrid.map((e=>e+t)),e.slidesGrid=e.slidesGrid.map((e=>e+s))}if(p!==d&&e.emit("slidesLengthChange"),u.length!==b&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),h.length!==w&&e.emit("slidesGridLengthChange"),i.watchSlidesProgress&&e.updateSlidesOffset(),!(o||i.cssMode||"slide"!==i.effect&&"fade"!==i.effect)){const t=`${i.containerModifierClass}backface-hidden`,s=e.$el.hasClass(t);p<=i.maxBackfaceHiddenSlides?s||e.$el.addClass(t):s&&e.$el.removeClass(t)}},updateAutoHeight:function(e){const t=this,s=[],i=t.virtual&&t.params.virtual.enabled;let n,a=0;"number"==typeof e?t.setTransition(e):!0===e&&t.setTransition(t.params.speed);const r=e=>i?t.slides.filter((t=>parseInt(t.getAttribute("data-swiper-slide-index"),10)===e))[0]:t.slides.eq(e)[0];if("auto"!==t.params.slidesPerView&&t.params.slidesPerView>1)if(t.params.centeredSlides)(t.visibleSlides||d([])).each((e=>{s.push(e)}));else for(n=0;n<Math.ceil(t.params.slidesPerView);n+=1){const e=t.activeIndex+n;if(e>t.slides.length&&!i)break;s.push(r(e))}else s.push(r(t.activeIndex));for(n=0;n<s.length;n+=1)if(void 0!==s[n]){const e=s[n].offsetHeight;a=e>a?e:a}(a||0===a)&&t.$wrapperEl.css("height",`${a}px`)},updateSlidesOffset:function(){const e=this,t=e.slides;for(let s=0;s<t.length;s+=1)t[s].swiperSlideOffset=e.isHorizontal()?t[s].offsetLeft:t[s].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this&&this.translate||0);const t=this,s=t.params,{slides:i,rtlTranslate:n,snapGrid:a}=t;if(0===i.length)return;void 0===i[0].swiperSlideOffset&&t.updateSlidesOffset();let r=-e;n&&(r=e),i.removeClass(s.slideVisibleClass),t.visibleSlidesIndexes=[],t.visibleSlides=[];for(let e=0;e<i.length;e+=1){const l=i[e];let o=l.swiperSlideOffset;s.cssMode&&s.centeredSlides&&(o-=i[0].swiperSlideOffset);const d=(r+(s.centeredSlides?t.minTranslate():0)-o)/(l.swiperSlideSize+s.spaceBetween),c=(r-a[0]+(s.centeredSlides?t.minTranslate():0)-o)/(l.swiperSlideSize+s.spaceBetween),p=-(r-o),u=p+t.slidesSizesGrid[e];(p>=0&&p<t.size-1||u>1&&u<=t.size||p<=0&&u>=t.size)&&(t.visibleSlides.push(l),t.visibleSlidesIndexes.push(e),i.eq(e).addClass(s.slideVisibleClass)),l.progress=n?-d:d,l.originalProgress=n?-c:c}t.visibleSlides=d(t.visibleSlides)},updateProgress:function(e){const t=this;if(void 0===e){const s=t.rtlTranslate?-1:1;e=t&&t.translate&&t.translate*s||0}const s=t.params,i=t.maxTranslate()-t.minTranslate();let{progress:n,isBeginning:a,isEnd:r}=t;const l=a,o=r;0===i?(n=0,a=!0,r=!0):(n=(e-t.minTranslate())/i,a=n<=0,r=n>=1),Object.assign(t,{progress:n,isBeginning:a,isEnd:r}),(s.watchSlidesProgress||s.centeredSlides&&s.autoHeight)&&t.updateSlidesProgress(e),a&&!l&&t.emit("reachBeginning toEdge"),r&&!o&&t.emit("reachEnd toEdge"),(l&&!a||o&&!r)&&t.emit("fromEdge"),t.emit("progress",n)},updateSlidesClasses:function(){const e=this,{slides:t,params:s,$wrapperEl:i,activeIndex:n,realIndex:a}=e,r=e.virtual&&s.virtual.enabled;let l;t.removeClass(`${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`),l=r?e.$wrapperEl.find(`.${s.slideClass}[data-swiper-slide-index="${n}"]`):t.eq(n),l.addClass(s.slideActiveClass),s.loop&&(l.hasClass(s.slideDuplicateClass)?i.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${a}"]`).addClass(s.slideDuplicateActiveClass):i.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${a}"]`).addClass(s.slideDuplicateActiveClass));let o=l.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);s.loop&&0===o.length&&(o=t.eq(0),o.addClass(s.slideNextClass));let d=l.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);s.loop&&0===d.length&&(d=t.eq(-1),d.addClass(s.slidePrevClass)),s.loop&&(o.hasClass(s.slideDuplicateClass)?i.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass):i.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass),d.hasClass(s.slideDuplicateClass)?i.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass):i.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass)),e.emitSlidesClasses()},updateActiveIndex:function(e){const t=this,s=t.rtlTranslate?t.translate:-t.translate,{slidesGrid:i,snapGrid:n,params:a,activeIndex:r,realIndex:l,snapIndex:o}=t;let d,c=e;if(void 0===c){for(let e=0;e<i.length;e+=1)void 0!==i[e+1]?s>=i[e]&&s<i[e+1]-(i[e+1]-i[e])/2?c=e:s>=i[e]&&s<i[e+1]&&(c=e+1):s>=i[e]&&(c=e);a.normalizeSlideIndex&&(c<0||void 0===c)&&(c=0)}if(n.indexOf(s)>=0)d=n.indexOf(s);else{const e=Math.min(a.slidesPerGroupSkip,c);d=e+Math.floor((c-e)/a.slidesPerGroup)}if(d>=n.length&&(d=n.length-1),c===r)return void(d!==o&&(t.snapIndex=d,t.emit("snapIndexChange")));const p=parseInt(t.slides.eq(c).attr("data-swiper-slide-index")||c,10);Object.assign(t,{snapIndex:d,realIndex:p,previousIndex:r,activeIndex:c}),t.emit("activeIndexChange"),t.emit("snapIndexChange"),l!==p&&t.emit("realIndexChange"),(t.initialized||t.params.runCallbacksOnInit)&&t.emit("slideChange")},updateClickedSlide:function(e){const t=this,s=t.params,i=d(e).closest(`.${s.slideClass}`)[0];let n,a=!1;if(i)for(let e=0;e<t.slides.length;e+=1)if(t.slides[e]===i){a=!0,n=e;break}if(!i||!a)return t.clickedSlide=void 0,void(t.clickedIndex=void 0);t.clickedSlide=i,t.virtual&&t.params.virtual.enabled?t.clickedIndex=parseInt(d(i).attr("data-swiper-slide-index"),10):t.clickedIndex=n,s.slideToClickedSlide&&void 0!==t.clickedIndex&&t.clickedIndex!==t.activeIndex&&t.slideToClickedSlide()}};var $={getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");const{params:t,rtlTranslate:s,translate:i,$wrapperEl:n}=this;if(t.virtualTranslate)return s?-i:i;if(t.cssMode)return i;let a=h(n[0],e);return s&&(a=-a),a||0},setTranslate:function(e,t){const s=this,{rtlTranslate:i,params:n,$wrapperEl:a,wrapperEl:r,progress:l}=s;let o,d=0,c=0;s.isHorizontal()?d=i?-e:e:c=e,n.roundLengths&&(d=Math.floor(d),c=Math.floor(c)),n.cssMode?r[s.isHorizontal()?"scrollLeft":"scrollTop"]=s.isHorizontal()?-d:-c:n.virtualTranslate||a.transform(`translate3d(${d}px, ${c}px, 0px)`),s.previousTranslate=s.translate,s.translate=s.isHorizontal()?d:c;const p=s.maxTranslate()-s.minTranslate();o=0===p?0:(e-s.minTranslate())/p,o!==l&&s.updateProgress(e),s.emit("setTranslate",s.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e,t,s,i,n){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===s&&(s=!0),void 0===i&&(i=!0);const a=this,{params:r,wrapperEl:l}=a;if(a.animating&&r.preventInteractionOnTransition)return!1;const o=a.minTranslate(),d=a.maxTranslate();let c;if(c=i&&e>o?o:i&&e<d?d:e,a.updateProgress(c),r.cssMode){const e=a.isHorizontal();if(0===t)l[e?"scrollLeft":"scrollTop"]=-c;else{if(!a.support.smoothScroll)return b({swiper:a,targetPosition:-c,side:e?"left":"top"}),!0;l.scrollTo({[e?"left":"top"]:-c,behavior:"smooth"})}return!0}return 0===t?(a.setTransition(0),a.setTranslate(c),s&&(a.emit("beforeTransitionStart",t,n),a.emit("transitionEnd"))):(a.setTransition(t),a.setTranslate(c),s&&(a.emit("beforeTransitionStart",t,n),a.emit("transitionStart")),a.animating||(a.animating=!0,a.onTranslateToWrapperTransitionEnd||(a.onTranslateToWrapperTransitionEnd=function(e){a&&!a.destroyed&&e.target===this&&(a.$wrapperEl[0].removeEventListener("transitionend",a.onTranslateToWrapperTransitionEnd),a.$wrapperEl[0].removeEventListener("webkitTransitionEnd",a.onTranslateToWrapperTransitionEnd),a.onTranslateToWrapperTransitionEnd=null,delete a.onTranslateToWrapperTransitionEnd,s&&a.emit("transitionEnd"))}),a.$wrapperEl[0].addEventListener("transitionend",a.onTranslateToWrapperTransitionEnd),a.$wrapperEl[0].addEventListener("webkitTransitionEnd",a.onTranslateToWrapperTransitionEnd))),!0}};function k(e){let{swiper:t,runCallbacks:s,direction:i,step:n}=e;const{activeIndex:a,previousIndex:r}=t;let l=i;if(l||(l=a>r?"next":a<r?"prev":"reset"),t.emit(`transition${n}`),s&&a!==r){if("reset"===l)return void t.emit(`slideResetTransition${n}`);t.emit(`slideChangeTransition${n}`),"next"===l?t.emit(`slideNextTransition${n}`):t.emit(`slidePrevTransition${n}`)}}var P={slideTo:function(e,t,s,i,n){if(void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===s&&(s=!0),"number"!=typeof e&&"string"!=typeof e)throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`);if("string"==typeof e){const t=parseInt(e,10);if(!isFinite(t))throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);e=t}const a=this;let r=e;r<0&&(r=0);const{params:l,snapGrid:o,slidesGrid:d,previousIndex:c,activeIndex:p,rtlTranslate:u,wrapperEl:h,enabled:m}=a;if(a.animating&&l.preventInteractionOnTransition||!m&&!i&&!n)return!1;const f=Math.min(a.params.slidesPerGroupSkip,r);let g=f+Math.floor((r-f)/a.params.slidesPerGroup);g>=o.length&&(g=o.length-1);const v=-o[g];if(l.normalizeSlideIndex)for(let e=0;e<d.length;e+=1){const t=-Math.floor(100*v),s=Math.floor(100*d[e]),i=Math.floor(100*d[e+1]);void 0!==d[e+1]?t>=s&&t<i-(i-s)/2?r=e:t>=s&&t<i&&(r=e+1):t>=s&&(r=e)}if(a.initialized&&r!==p){if(!a.allowSlideNext&&v<a.translate&&v<a.minTranslate())return!1;if(!a.allowSlidePrev&&v>a.translate&&v>a.maxTranslate()&&(p||0)!==r)return!1}let w;if(r!==(c||0)&&s&&a.emit("beforeSlideChangeStart"),a.updateProgress(v),w=r>p?"next":r<p?"prev":"reset",u&&-v===a.translate||!u&&v===a.translate)return a.updateActiveIndex(r),l.autoHeight&&a.updateAutoHeight(),a.updateSlidesClasses(),"slide"!==l.effect&&a.setTranslate(v),"reset"!==w&&(a.transitionStart(s,w),a.transitionEnd(s,w)),!1;if(l.cssMode){const e=a.isHorizontal(),s=u?v:-v;if(0===t){const t=a.virtual&&a.params.virtual.enabled;t&&(a.wrapperEl.style.scrollSnapType="none",a._immediateVirtual=!0),h[e?"scrollLeft":"scrollTop"]=s,t&&requestAnimationFrame((()=>{a.wrapperEl.style.scrollSnapType="",a._swiperImmediateVirtual=!1}))}else{if(!a.support.smoothScroll)return b({swiper:a,targetPosition:s,side:e?"left":"top"}),!0;h.scrollTo({[e?"left":"top"]:s,behavior:"smooth"})}return!0}return a.setTransition(t),a.setTranslate(v),a.updateActiveIndex(r),a.updateSlidesClasses(),a.emit("beforeTransitionStart",t,i),a.transitionStart(s,w),0===t?a.transitionEnd(s,w):a.animating||(a.animating=!0,a.onSlideToWrapperTransitionEnd||(a.onSlideToWrapperTransitionEnd=function(e){a&&!a.destroyed&&e.target===this&&(a.$wrapperEl[0].removeEventListener("transitionend",a.onSlideToWrapperTransitionEnd),a.$wrapperEl[0].removeEventListener("webkitTransitionEnd",a.onSlideToWrapperTransitionEnd),a.onSlideToWrapperTransitionEnd=null,delete a.onSlideToWrapperTransitionEnd,a.transitionEnd(s,w))}),a.$wrapperEl[0].addEventListener("transitionend",a.onSlideToWrapperTransitionEnd),a.$wrapperEl[0].addEventListener("webkitTransitionEnd",a.onSlideToWrapperTransitionEnd)),!0},slideToLoop:function(e,t,s,i){if(void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===s&&(s=!0),"string"==typeof e){const t=parseInt(e,10);if(!isFinite(t))throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);e=t}const n=this;let a=e;return n.params.loop&&(a+=n.loopedSlides),n.slideTo(a,t,s,i)},slideNext:function(e,t,s){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);const i=this,{animating:n,enabled:a,params:r}=i;if(!a)return i;let l=r.slidesPerGroup;"auto"===r.slidesPerView&&1===r.slidesPerGroup&&r.slidesPerGroupAuto&&(l=Math.max(i.slidesPerViewDynamic("current",!0),1));const o=i.activeIndex<r.slidesPerGroupSkip?1:l;if(r.loop){if(n&&r.loopPreventsSlide)return!1;i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft}return r.rewind&&i.isEnd?i.slideTo(0,e,t,s):i.slideTo(i.activeIndex+o,e,t,s)},slidePrev:function(e,t,s){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);const i=this,{params:n,animating:a,snapGrid:r,slidesGrid:l,rtlTranslate:o,enabled:d}=i;if(!d)return i;if(n.loop){if(a&&n.loopPreventsSlide)return!1;i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft}function c(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}const p=c(o?i.translate:-i.translate),u=r.map((e=>c(e)));let h=r[u.indexOf(p)-1];if(void 0===h&&n.cssMode){let e;r.forEach(((t,s)=>{p>=t&&(e=s)})),void 0!==e&&(h=r[e>0?e-1:e])}let m=0;if(void 0!==h&&(m=l.indexOf(h),m<0&&(m=i.activeIndex-1),"auto"===n.slidesPerView&&1===n.slidesPerGroup&&n.slidesPerGroupAuto&&(m=m-i.slidesPerViewDynamic("previous",!0)+1,m=Math.max(m,0))),n.rewind&&i.isBeginning){const n=i.params.virtual&&i.params.virtual.enabled&&i.virtual?i.virtual.slides.length-1:i.slides.length-1;return i.slideTo(n,e,t,s)}return i.slideTo(m,e,t,s)},slideReset:function(e,t,s){return void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),this.slideTo(this.activeIndex,e,t,s)},slideToClosest:function(e,t,s,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),void 0===i&&(i=.5);const n=this;let a=n.activeIndex;const r=Math.min(n.params.slidesPerGroupSkip,a),l=r+Math.floor((a-r)/n.params.slidesPerGroup),o=n.rtlTranslate?n.translate:-n.translate;if(o>=n.snapGrid[l]){const e=n.snapGrid[l];o-e>(n.snapGrid[l+1]-e)*i&&(a+=n.params.slidesPerGroup)}else{const e=n.snapGrid[l-1];o-e<=(n.snapGrid[l]-e)*i&&(a-=n.params.slidesPerGroup)}return a=Math.max(a,0),a=Math.min(a,n.slidesGrid.length-1),n.slideTo(a,e,t,s)},slideToClickedSlide:function(){const e=this,{params:t,$wrapperEl:s}=e,i="auto"===t.slidesPerView?e.slidesPerViewDynamic():t.slidesPerView;let n,a=e.clickedIndex;if(t.loop){if(e.animating)return;n=parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"),10),t.centeredSlides?a<e.loopedSlides-i/2||a>e.slides.length-e.loopedSlides+i/2?(e.loopFix(),a=s.children(`.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),p((()=>{e.slideTo(a)}))):e.slideTo(a):a>e.slides.length-i?(e.loopFix(),a=s.children(`.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`).eq(0).index(),p((()=>{e.slideTo(a)}))):e.slideTo(a)}else e.slideTo(a)}};var L={loopCreate:function(){const e=this,t=i(),{params:s,$wrapperEl:n}=e,a=n.children().length>0?d(n.children()[0].parentNode):n;a.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();let r=a.children(`.${s.slideClass}`);if(s.loopFillGroupWithBlank){const e=s.slidesPerGroup-r.length%s.slidesPerGroup;if(e!==s.slidesPerGroup){for(let i=0;i<e;i+=1){const e=d(t.createElement("div")).addClass(`${s.slideClass} ${s.slideBlankClass}`);a.append(e)}r=a.children(`.${s.slideClass}`)}}"auto"!==s.slidesPerView||s.loopedSlides||(s.loopedSlides=r.length),e.loopedSlides=Math.ceil(parseFloat(s.loopedSlides||s.slidesPerView,10)),e.loopedSlides+=s.loopAdditionalSlides,e.loopedSlides>r.length&&e.params.loopedSlidesLimit&&(e.loopedSlides=r.length);const l=[],o=[];r.each(((e,t)=>{d(e).attr("data-swiper-slide-index",t)}));for(let t=0;t<e.loopedSlides;t+=1){const e=t-Math.floor(t/r.length)*r.length;o.push(r.eq(e)[0]),l.unshift(r.eq(r.length-e-1)[0])}for(let e=0;e<o.length;e+=1)a.append(d(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));for(let e=l.length-1;e>=0;e-=1)a.prepend(d(l[e].cloneNode(!0)).addClass(s.slideDuplicateClass))},loopFix:function(){const e=this;e.emit("beforeLoopFix");const{activeIndex:t,slides:s,loopedSlides:i,allowSlidePrev:n,allowSlideNext:a,snapGrid:r,rtlTranslate:l}=e;let o;e.allowSlidePrev=!0,e.allowSlideNext=!0;const d=-r[t]-e.getTranslate();if(t<i){o=s.length-3*i+t,o+=i;e.slideTo(o,0,!1,!0)&&0!==d&&e.setTranslate((l?-e.translate:e.translate)-d)}else if(t>=s.length-i){o=-s.length+t+i,o+=i;e.slideTo(o,0,!1,!0)&&0!==d&&e.setTranslate((l?-e.translate:e.translate)-d)}e.allowSlidePrev=n,e.allowSlideNext=a,e.emit("loopFix")},loopDestroy:function(){const{$wrapperEl:e,params:t,slides:s}=this;e.children(`.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`).remove(),s.removeAttr("data-swiper-slide-index")}};function O(e){const t=this,s=i(),n=a(),r=t.touchEventsData,{params:l,touches:o,enabled:c}=t;if(!c)return;if(t.animating&&l.preventInteractionOnTransition)return;!t.animating&&l.cssMode&&l.loop&&t.loopFix();let p=e;p.originalEvent&&(p=p.originalEvent);let h=d(p.target);if("wrapper"===l.touchEventsTarget&&!h.closest(t.wrapperEl).length)return;if(r.isTouchEvent="touchstart"===p.type,!r.isTouchEvent&&"which"in p&&3===p.which)return;if(!r.isTouchEvent&&"button"in p&&p.button>0)return;if(r.isTouched&&r.isMoved)return;const m=!!l.noSwipingClass&&""!==l.noSwipingClass,f=e.composedPath?e.composedPath():e.path;m&&p.target&&p.target.shadowRoot&&f&&(h=d(f[0]));const g=l.noSwipingSelector?l.noSwipingSelector:`.${l.noSwipingClass}`,v=!(!p.target||!p.target.shadowRoot);if(l.noSwiping&&(v?function(e,t){return void 0===t&&(t=this),function t(s){if(!s||s===i()||s===a())return null;s.assignedSlot&&(s=s.assignedSlot);const n=s.closest(e);return n||s.getRootNode?n||t(s.getRootNode().host):null}(t)}(g,h[0]):h.closest(g)[0]))return void(t.allowClick=!0);if(l.swipeHandler&&!h.closest(l.swipeHandler)[0])return;o.currentX="touchstart"===p.type?p.targetTouches[0].pageX:p.pageX,o.currentY="touchstart"===p.type?p.targetTouches[0].pageY:p.pageY;const b=o.currentX,w=o.currentY,T=l.edgeSwipeDetection||l.iOSEdgeSwipeDetection,y=l.edgeSwipeThreshold||l.iOSEdgeSwipeThreshold;if(T&&(b<=y||b>=n.innerWidth-y)){if("prevent"!==T)return;e.preventDefault()}if(Object.assign(r,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),o.startX=b,o.startY=w,r.touchStartTime=u(),t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,l.threshold>0&&(r.allowThresholdMove=!1),"touchstart"!==p.type){let e=!0;h.is(r.focusableElements)&&(e=!1,"SELECT"===h[0].nodeName&&(r.isTouched=!1)),s.activeElement&&d(s.activeElement).is(r.focusableElements)&&s.activeElement!==h[0]&&s.activeElement.blur();const i=e&&t.allowTouchMove&&l.touchStartPreventDefault;!l.touchStartForcePreventDefault&&!i||h[0].isContentEditable||p.preventDefault()}t.params.freeMode&&t.params.freeMode.enabled&&t.freeMode&&t.animating&&!l.cssMode&&t.freeMode.onTouchStart(),t.emit("touchStart",p)}function I(e){const t=i(),s=this,n=s.touchEventsData,{params:a,touches:r,rtlTranslate:l,enabled:o}=s;if(!o)return;let c=e;if(c.originalEvent&&(c=c.originalEvent),!n.isTouched)return void(n.startMoving&&n.isScrolling&&s.emit("touchMoveOpposite",c));if(n.isTouchEvent&&"touchmove"!==c.type)return;const p="touchmove"===c.type&&c.targetTouches&&(c.targetTouches[0]||c.changedTouches[0]),h="touchmove"===c.type?p.pageX:c.pageX,m="touchmove"===c.type?p.pageY:c.pageY;if(c.preventedByNestedSwiper)return r.startX=h,void(r.startY=m);if(!s.allowTouchMove)return d(c.target).is(n.focusableElements)||(s.allowClick=!1),void(n.isTouched&&(Object.assign(r,{startX:h,startY:m,currentX:h,currentY:m}),n.touchStartTime=u()));if(n.isTouchEvent&&a.touchReleaseOnEdges&&!a.loop)if(s.isVertical()){if(m<r.startY&&s.translate<=s.maxTranslate()||m>r.startY&&s.translate>=s.minTranslate())return n.isTouched=!1,void(n.isMoved=!1)}else if(h<r.startX&&s.translate<=s.maxTranslate()||h>r.startX&&s.translate>=s.minTranslate())return;if(n.isTouchEvent&&t.activeElement&&c.target===t.activeElement&&d(c.target).is(n.focusableElements))return n.isMoved=!0,void(s.allowClick=!1);if(n.allowTouchCallbacks&&s.emit("touchMove",c),c.targetTouches&&c.targetTouches.length>1)return;r.currentX=h,r.currentY=m;const f=r.currentX-r.startX,g=r.currentY-r.startY;if(s.params.threshold&&Math.sqrt(f**2+g**2)<s.params.threshold)return;if(void 0===n.isScrolling){let e;s.isHorizontal()&&r.currentY===r.startY||s.isVertical()&&r.currentX===r.startX?n.isScrolling=!1:f*f+g*g>=25&&(e=180*Math.atan2(Math.abs(g),Math.abs(f))/Math.PI,n.isScrolling=s.isHorizontal()?e>a.touchAngle:90-e>a.touchAngle)}if(n.isScrolling&&s.emit("touchMoveOpposite",c),void 0===n.startMoving&&(r.currentX===r.startX&&r.currentY===r.startY||(n.startMoving=!0)),n.isScrolling)return void(n.isTouched=!1);if(!n.startMoving)return;s.allowClick=!1,!a.cssMode&&c.cancelable&&c.preventDefault(),a.touchMoveStopPropagation&&!a.nested&&c.stopPropagation(),n.isMoved||(a.loop&&!a.cssMode&&s.loopFix(),n.startTranslate=s.getTranslate(),s.setTransition(0),s.animating&&s.$wrapperEl.trigger("webkitTransitionEnd transitionend"),n.allowMomentumBounce=!1,!a.grabCursor||!0!==s.allowSlideNext&&!0!==s.allowSlidePrev||s.setGrabCursor(!0),s.emit("sliderFirstMove",c)),s.emit("sliderMove",c),n.isMoved=!0;let v=s.isHorizontal()?f:g;r.diff=v,v*=a.touchRatio,l&&(v=-v),s.swipeDirection=v>0?"prev":"next",n.currentTranslate=v+n.startTranslate;let b=!0,w=a.resistanceRatio;if(a.touchReleaseOnEdges&&(w=0),v>0&&n.currentTranslate>s.minTranslate()?(b=!1,a.resistance&&(n.currentTranslate=s.minTranslate()-1+(-s.minTranslate()+n.startTranslate+v)**w)):v<0&&n.currentTranslate<s.maxTranslate()&&(b=!1,a.resistance&&(n.currentTranslate=s.maxTranslate()+1-(s.maxTranslate()-n.startTranslate-v)**w)),b&&(c.preventedByNestedSwiper=!0),!s.allowSlideNext&&"next"===s.swipeDirection&&n.currentTranslate<n.startTranslate&&(n.currentTranslate=n.startTranslate),!s.allowSlidePrev&&"prev"===s.swipeDirection&&n.currentTranslate>n.startTranslate&&(n.currentTranslate=n.startTranslate),s.allowSlidePrev||s.allowSlideNext||(n.currentTranslate=n.startTranslate),a.threshold>0){if(!(Math.abs(v)>a.threshold||n.allowThresholdMove))return void(n.currentTranslate=n.startTranslate);if(!n.allowThresholdMove)return n.allowThresholdMove=!0,r.startX=r.currentX,r.startY=r.currentY,n.currentTranslate=n.startTranslate,void(r.diff=s.isHorizontal()?r.currentX-r.startX:r.currentY-r.startY)}a.followFinger&&!a.cssMode&&((a.freeMode&&a.freeMode.enabled&&s.freeMode||a.watchSlidesProgress)&&(s.updateActiveIndex(),s.updateSlidesClasses()),s.params.freeMode&&a.freeMode.enabled&&s.freeMode&&s.freeMode.onTouchMove(),s.updateProgress(n.currentTranslate),s.setTranslate(n.currentTranslate))}function A(e){const t=this,s=t.touchEventsData,{params:i,touches:n,rtlTranslate:a,slidesGrid:r,enabled:l}=t;if(!l)return;let o=e;if(o.originalEvent&&(o=o.originalEvent),s.allowTouchCallbacks&&t.emit("touchEnd",o),s.allowTouchCallbacks=!1,!s.isTouched)return s.isMoved&&i.grabCursor&&t.setGrabCursor(!1),s.isMoved=!1,void(s.startMoving=!1);i.grabCursor&&s.isMoved&&s.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);const d=u(),c=d-s.touchStartTime;if(t.allowClick){const e=o.path||o.composedPath&&o.composedPath();t.updateClickedSlide(e&&e[0]||o.target),t.emit("tap click",o),c<300&&d-s.lastClickTime<300&&t.emit("doubleTap doubleClick",o)}if(s.lastClickTime=u(),p((()=>{t.destroyed||(t.allowClick=!0)})),!s.isTouched||!s.isMoved||!t.swipeDirection||0===n.diff||s.currentTranslate===s.startTranslate)return s.isTouched=!1,s.isMoved=!1,void(s.startMoving=!1);let h;if(s.isTouched=!1,s.isMoved=!1,s.startMoving=!1,h=i.followFinger?a?t.translate:-t.translate:-s.currentTranslate,i.cssMode)return;if(t.params.freeMode&&i.freeMode.enabled)return void t.freeMode.onTouchEnd({currentPos:h});let m=0,f=t.slidesSizesGrid[0];for(let e=0;e<r.length;e+=e<i.slidesPerGroupSkip?1:i.slidesPerGroup){const t=e<i.slidesPerGroupSkip-1?1:i.slidesPerGroup;void 0!==r[e+t]?h>=r[e]&&h<r[e+t]&&(m=e,f=r[e+t]-r[e]):h>=r[e]&&(m=e,f=r[r.length-1]-r[r.length-2])}let g=null,v=null;i.rewind&&(t.isBeginning?v=t.params.virtual&&t.params.virtual.enabled&&t.virtual?t.virtual.slides.length-1:t.slides.length-1:t.isEnd&&(g=0));const b=(h-r[m])/f,w=m<i.slidesPerGroupSkip-1?1:i.slidesPerGroup;if(c>i.longSwipesMs){if(!i.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(b>=i.longSwipesRatio?t.slideTo(i.rewind&&t.isEnd?g:m+w):t.slideTo(m)),"prev"===t.swipeDirection&&(b>1-i.longSwipesRatio?t.slideTo(m+w):null!==v&&b<0&&Math.abs(b)>i.longSwipesRatio?t.slideTo(v):t.slideTo(m))}else{if(!i.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(o.target===t.navigation.nextEl||o.target===t.navigation.prevEl)?o.target===t.navigation.nextEl?t.slideTo(m+w):t.slideTo(m):("next"===t.swipeDirection&&t.slideTo(null!==g?g:m+w),"prev"===t.swipeDirection&&t.slideTo(null!==v?v:m))}}function D(){const e=this,{params:t,el:s}=e;if(s&&0===s.offsetWidth)return;t.breakpoints&&e.setBreakpoint();const{allowSlideNext:i,allowSlidePrev:n,snapGrid:a}=e;e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),e.updateSlidesClasses(),("auto"===t.slidesPerView||t.slidesPerView>1)&&e.isEnd&&!e.isBeginning&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0),e.autoplay&&e.autoplay.running&&e.autoplay.paused&&e.autoplay.run(),e.allowSlidePrev=n,e.allowSlideNext=i,e.params.watchOverflow&&a!==e.snapGrid&&e.checkOverflow()}function z(e){const t=this;t.enabled&&(t.allowClick||(t.params.preventClicks&&e.preventDefault(),t.params.preventClicksPropagation&&t.animating&&(e.stopPropagation(),e.stopImmediatePropagation())))}function B(){const e=this,{wrapperEl:t,rtlTranslate:s,enabled:i}=e;if(!i)return;let n;e.previousTranslate=e.translate,e.isHorizontal()?e.translate=-t.scrollLeft:e.translate=-t.scrollTop,0===e.translate&&(e.translate=0),e.updateActiveIndex(),e.updateSlidesClasses();const a=e.maxTranslate()-e.minTranslate();n=0===a?0:(e.translate-e.minTranslate())/a,n!==e.progress&&e.updateProgress(s?-e.translate:e.translate),e.emit("setTranslate",e.translate,!1)}let G=!1;function N(){}const _=(e,t)=>{const s=i(),{params:n,touchEvents:a,el:r,wrapperEl:l,device:o,support:d}=e,c=!!n.nested,p="on"===t?"addEventListener":"removeEventListener",u=t;if(d.touch){const t=!("touchstart"!==a.start||!d.passiveListener||!n.passiveListeners)&&{passive:!0,capture:!1};r[p](a.start,e.onTouchStart,t),r[p](a.move,e.onTouchMove,d.passiveListener?{passive:!1,capture:c}:c),r[p](a.end,e.onTouchEnd,t),a.cancel&&r[p](a.cancel,e.onTouchEnd,t)}else r[p](a.start,e.onTouchStart,!1),s[p](a.move,e.onTouchMove,c),s[p](a.end,e.onTouchEnd,!1);(n.preventClicks||n.preventClicksPropagation)&&r[p]("click",e.onClick,!0),n.cssMode&&l[p]("scroll",e.onScroll),n.updateOnWindowResize?e[u](o.ios||o.android?"resize orientationchange observerUpdate":"resize observerUpdate",D,!0):e[u]("observerUpdate",D,!0)};var H={attachEvents:function(){const e=this,t=i(),{params:s,support:n}=e;e.onTouchStart=O.bind(e),e.onTouchMove=I.bind(e),e.onTouchEnd=A.bind(e),s.cssMode&&(e.onScroll=B.bind(e)),e.onClick=z.bind(e),n.touch&&!G&&(t.addEventListener("touchstart",N),G=!0),_(e,"on")},detachEvents:function(){_(this,"off")}};const F=(e,t)=>e.grid&&t.grid&&t.grid.rows>1;var j={addClasses:function(){const e=this,{classNames:t,params:s,rtl:i,$el:n,device:a,support:r}=e,l=function(e,t){const s=[];return e.forEach((e=>{"object"==typeof e?Object.keys(e).forEach((i=>{e[i]&&s.push(t+i)})):"string"==typeof e&&s.push(t+e)})),s}(["initialized",s.direction,{"pointer-events":!r.touch},{"free-mode":e.params.freeMode&&s.freeMode.enabled},{autoheight:s.autoHeight},{rtl:i},{grid:s.grid&&s.grid.rows>1},{"grid-column":s.grid&&s.grid.rows>1&&"column"===s.grid.fill},{android:a.android},{ios:a.ios},{"css-mode":s.cssMode},{centered:s.cssMode&&s.centeredSlides},{"watch-progress":s.watchSlidesProgress}],s.containerModifierClass);t.push(...l),n.addClass([...t].join(" ")),e.emitContainerClasses()},removeClasses:function(){const{$el:e,classNames:t}=this;e.removeClass(t.join(" ")),this.emitContainerClasses()}};var V={init:!0,direction:"horizontal",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopedSlidesLimit:!0,loopFillGroupWithBlank:!1,loopPreventsSlide:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0,_emitClasses:!1};function R(e,t){return function(s){void 0===s&&(s={});const i=Object.keys(s)[0],n=s[i];"object"==typeof n&&null!==n?(["navigation","pagination","scrollbar"].indexOf(i)>=0&&!0===e[i]&&(e[i]={auto:!0}),i in e&&"enabled"in n?(!0===e[i]&&(e[i]={enabled:!0}),"object"!=typeof e[i]||"enabled"in e[i]||(e[i].enabled=!0),e[i]||(e[i]={enabled:!1}),g(t,s)):g(t,s)):g(t,s)}}const q={eventsEmitter:E,update:M,translate:$,transition:{setTransition:function(e,t){const s=this;s.params.cssMode||s.$wrapperEl.transition(e),s.emit("setTransition",e,t)},transitionStart:function(e,t){void 0===e&&(e=!0);const s=this,{params:i}=s;i.cssMode||(i.autoHeight&&s.updateAutoHeight(),k({swiper:s,runCallbacks:e,direction:t,step:"Start"}))},transitionEnd:function(e,t){void 0===e&&(e=!0);const s=this,{params:i}=s;s.animating=!1,i.cssMode||(s.setTransition(0),k({swiper:s,runCallbacks:e,direction:t,step:"End"}))}},slide:P,loop:L,grabCursor:{setGrabCursor:function(e){const t=this;if(t.support.touch||!t.params.simulateTouch||t.params.watchOverflow&&t.isLocked||t.params.cssMode)return;const s="container"===t.params.touchEventsTarget?t.el:t.wrapperEl;s.style.cursor="move",s.style.cursor=e?"grabbing":"grab"},unsetGrabCursor:function(){const e=this;e.support.touch||e.params.watchOverflow&&e.isLocked||e.params.cssMode||(e["container"===e.params.touchEventsTarget?"el":"wrapperEl"].style.cursor="")}},events:H,breakpoints:{setBreakpoint:function(){const e=this,{activeIndex:t,initialized:s,loopedSlides:i=0,params:n,$el:a}=e,r=n.breakpoints;if(!r||r&&0===Object.keys(r).length)return;const l=e.getBreakpoint(r,e.params.breakpointsBase,e.el);if(!l||e.currentBreakpoint===l)return;const o=(l in r?r[l]:void 0)||e.originalParams,d=F(e,n),c=F(e,o),p=n.enabled;d&&!c?(a.removeClass(`${n.containerModifierClass}grid ${n.containerModifierClass}grid-column`),e.emitContainerClasses()):!d&&c&&(a.addClass(`${n.containerModifierClass}grid`),(o.grid.fill&&"column"===o.grid.fill||!o.grid.fill&&"column"===n.grid.fill)&&a.addClass(`${n.containerModifierClass}grid-column`),e.emitContainerClasses()),["navigation","pagination","scrollbar"].forEach((t=>{const s=n[t]&&n[t].enabled,i=o[t]&&o[t].enabled;s&&!i&&e[t].disable(),!s&&i&&e[t].enable()}));const u=o.direction&&o.direction!==n.direction,h=n.loop&&(o.slidesPerView!==n.slidesPerView||u);u&&s&&e.changeDirection(),g(e.params,o);const m=e.params.enabled;Object.assign(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),p&&!m?e.disable():!p&&m&&e.enable(),e.currentBreakpoint=l,e.emit("_beforeBreakpoint",o),h&&s&&(e.loopDestroy(),e.loopCreate(),e.updateSlides(),e.slideTo(t-i+e.loopedSlides,0,!1)),e.emit("breakpoint",o)},getBreakpoint:function(e,t,s){if(void 0===t&&(t="window"),!e||"container"===t&&!s)return;let i=!1;const n=a(),r="window"===t?n.innerHeight:s.clientHeight,l=Object.keys(e).map((e=>{if("string"==typeof e&&0===e.indexOf("@")){const t=parseFloat(e.substr(1));return{value:r*t,point:e}}return{value:e,point:e}}));l.sort(((e,t)=>parseInt(e.value,10)-parseInt(t.value,10)));for(let e=0;e<l.length;e+=1){const{point:a,value:r}=l[e];"window"===t?n.matchMedia(`(min-width: ${r}px)`).matches&&(i=a):r<=s.clientWidth&&(i=a)}return i||"max"}},checkOverflow:{checkOverflow:function(){const e=this,{isLocked:t,params:s}=e,{slidesOffsetBefore:i}=s;if(i){const t=e.slides.length-1,s=e.slidesGrid[t]+e.slidesSizesGrid[t]+2*i;e.isLocked=e.size>s}else e.isLocked=1===e.snapGrid.length;!0===s.allowSlideNext&&(e.allowSlideNext=!e.isLocked),!0===s.allowSlidePrev&&(e.allowSlidePrev=!e.isLocked),t&&t!==e.isLocked&&(e.isEnd=!1),t!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock")}},classes:j,images:{loadImage:function(e,t,s,i,n,r){const l=a();let o;function c(){r&&r()}d(e).parent("picture")[0]||e.complete&&n?c():t?(o=new l.Image,o.onload=c,o.onerror=c,i&&(o.sizes=i),s&&(o.srcset=s),t&&(o.src=t)):c()},preloadImages:function(){const e=this;function t(){null!=e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(let s=0;s<e.imagesToLoad.length;s+=1){const i=e.imagesToLoad[s];e.loadImage(i,i.currentSrc||i.getAttribute("src"),i.srcset||i.getAttribute("srcset"),i.sizes||i.getAttribute("sizes"),!0,t)}}}},W={};class X{constructor(){let e,t;for(var s=arguments.length,i=new Array(s),n=0;n<s;n++)i[n]=arguments[n];if(1===i.length&&i[0].constructor&&"Object"===Object.prototype.toString.call(i[0]).slice(8,-1)?t=i[0]:[e,t]=i,t||(t={}),t=g({},t),e&&!t.el&&(t.el=e),t.el&&d(t.el).length>1){const e=[];return d(t.el).each((s=>{const i=g({},t,{el:s});e.push(new X(i))})),e}const a=this;a.__swiper__=!0,a.support=C(),a.device=x({userAgent:t.userAgent}),a.browser=S(),a.eventsListeners={},a.eventsAnyListeners=[],a.modules=[...a.__modules__],t.modules&&Array.isArray(t.modules)&&a.modules.push(...t.modules);const r={};a.modules.forEach((e=>{e({swiper:a,extendParams:R(t,r),on:a.on.bind(a),once:a.once.bind(a),off:a.off.bind(a),emit:a.emit.bind(a)})}));const l=g({},V,r);return a.params=g({},l,W,t),a.originalParams=g({},a.params),a.passedParams=g({},t),a.params&&a.params.on&&Object.keys(a.params.on).forEach((e=>{a.on(e,a.params.on[e])})),a.params&&a.params.onAny&&a.onAny(a.params.onAny),a.$=d,Object.assign(a,{enabled:a.params.enabled,el:e,classNames:[],slides:d(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:()=>"horizontal"===a.params.direction,isVertical:()=>"vertical"===a.params.direction,activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,allowSlideNext:a.params.allowSlideNext,allowSlidePrev:a.params.allowSlidePrev,touchEvents:function(){const e=["touchstart","touchmove","touchend","touchcancel"],t=["pointerdown","pointermove","pointerup"];return a.touchEventsTouch={start:e[0],move:e[1],end:e[2],cancel:e[3]},a.touchEventsDesktop={start:t[0],move:t[1],end:t[2]},a.support.touch||!a.params.simulateTouch?a.touchEventsTouch:a.touchEventsDesktop}(),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:a.params.focusableElements,lastClickTime:u(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:a.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),a.emit("_swiper"),a.params.init&&a.init(),a}enable(){const e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))}disable(){const e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))}setProgress(e,t){const s=this;e=Math.min(Math.max(e,0),1);const i=s.minTranslate(),n=(s.maxTranslate()-i)*e+i;s.translateTo(n,void 0===t?0:t),s.updateActiveIndex(),s.updateSlidesClasses()}emitContainerClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=e.el.className.split(" ").filter((t=>0===t.indexOf("swiper")||0===t.indexOf(e.params.containerModifierClass)));e.emit("_containerClasses",t.join(" "))}getSlideClasses(e){const t=this;return t.destroyed?"":e.className.split(" ").filter((e=>0===e.indexOf("swiper-slide")||0===e.indexOf(t.params.slideClass))).join(" ")}emitSlidesClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=[];e.slides.each((s=>{const i=e.getSlideClasses(s);t.push({slideEl:s,classNames:i}),e.emit("_slideClass",s,i)})),e.emit("_slideClasses",t)}slidesPerViewDynamic(e,t){void 0===e&&(e="current"),void 0===t&&(t=!1);const{params:s,slides:i,slidesGrid:n,slidesSizesGrid:a,size:r,activeIndex:l}=this;let o=1;if(s.centeredSlides){let e,t=i[l].swiperSlideSize;for(let s=l+1;s<i.length;s+=1)i[s]&&!e&&(t+=i[s].swiperSlideSize,o+=1,t>r&&(e=!0));for(let s=l-1;s>=0;s-=1)i[s]&&!e&&(t+=i[s].swiperSlideSize,o+=1,t>r&&(e=!0))}else if("current"===e)for(let e=l+1;e<i.length;e+=1){(t?n[e]+a[e]-n[l]<r:n[e]-n[l]<r)&&(o+=1)}else for(let e=l-1;e>=0;e-=1){n[l]-n[e]<r&&(o+=1)}return o}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:t,params:s}=e;function i(){const t=e.rtlTranslate?-1*e.translate:e.translate,s=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(s),e.updateActiveIndex(),e.updateSlidesClasses()}let n;s.breakpoints&&e.setBreakpoint(),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),e.params.freeMode&&e.params.freeMode.enabled?(i(),e.params.autoHeight&&e.updateAutoHeight()):(n=("auto"===e.params.slidesPerView||e.params.slidesPerView>1)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0),n||i()),s.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,t){void 0===t&&(t=!0);const s=this,i=s.params.direction;return e||(e="horizontal"===i?"vertical":"horizontal"),e===i||"horizontal"!==e&&"vertical"!==e||(s.$el.removeClass(`${s.params.containerModifierClass}${i}`).addClass(`${s.params.containerModifierClass}${e}`),s.emitContainerClasses(),s.params.direction=e,s.slides.each((t=>{"vertical"===e?t.style.width="":t.style.height=""})),s.emit("changeDirection"),t&&s.update()),s}changeLanguageDirection(e){const t=this;t.rtl&&"rtl"===e||!t.rtl&&"ltr"===e||(t.rtl="rtl"===e,t.rtlTranslate="horizontal"===t.params.direction&&t.rtl,t.rtl?(t.$el.addClass(`${t.params.containerModifierClass}rtl`),t.el.dir="rtl"):(t.$el.removeClass(`${t.params.containerModifierClass}rtl`),t.el.dir="ltr"),t.update())}mount(e){const t=this;if(t.mounted)return!0;const s=d(e||t.params.el);if(!(e=s[0]))return!1;e.swiper=t;const n=()=>`.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;let a=(()=>{if(e&&e.shadowRoot&&e.shadowRoot.querySelector){const t=d(e.shadowRoot.querySelector(n()));return t.children=e=>s.children(e),t}return s.children?s.children(n()):d(s).children(n())})();if(0===a.length&&t.params.createElements){const e=i().createElement("div");a=d(e),e.className=t.params.wrapperClass,s.append(e),s.children(`.${t.params.slideClass}`).each((e=>{a.append(e)}))}return Object.assign(t,{$el:s,el:e,$wrapperEl:a,wrapperEl:a[0],mounted:!0,rtl:"rtl"===e.dir.toLowerCase()||"rtl"===s.css("direction"),rtlTranslate:"horizontal"===t.params.direction&&("rtl"===e.dir.toLowerCase()||"rtl"===s.css("direction")),wrongRTL:"-webkit-box"===a.css("display")}),!0}init(e){const t=this;if(t.initialized)return t;return!1===t.mount(e)||(t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.params.loop&&t.loopCreate(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.preloadImages&&t.preloadImages(),t.params.loop?t.slideTo(t.params.initialSlide+t.loopedSlides,0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.attachEvents(),t.initialized=!0,t.emit("init"),t.emit("afterInit")),t}destroy(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);const s=this,{params:i,$el:n,$wrapperEl:a,slides:r}=s;return void 0===s.params||s.destroyed||(s.emit("beforeDestroy"),s.initialized=!1,s.detachEvents(),i.loop&&s.loopDestroy(),t&&(s.removeClasses(),n.removeAttr("style"),a.removeAttr("style"),r&&r.length&&r.removeClass([i.slideVisibleClass,i.slideActiveClass,i.slideNextClass,i.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),s.emit("destroy"),Object.keys(s.eventsListeners).forEach((e=>{s.off(e)})),!1!==e&&(s.$el[0].swiper=null,function(e){const t=e;Object.keys(t).forEach((e=>{try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}}))}(s)),s.destroyed=!0),null}static extendDefaults(e){g(W,e)}static get extendedDefaults(){return W}static get defaults(){return V}static installModule(e){X.prototype.__modules__||(X.prototype.__modules__=[]);const t=X.prototype.__modules__;"function"==typeof e&&t.indexOf(e)<0&&t.push(e)}static use(e){return Array.isArray(e)?(e.forEach((e=>X.installModule(e))),X):(X.installModule(e),X)}}function Y(e,t,s,n){const a=i();return e.params.createElements&&Object.keys(n).forEach((i=>{if(!s[i]&&!0===s.auto){let r=e.$el.children(`.${n[i]}`)[0];r||(r=a.createElement("div"),r.className=n[i],e.$el.append(r)),s[i]=r,t[i]=r}})),s}function U(e){return void 0===e&&(e=""),`.${e.trim().replace(/([\.:!\/])/g,"\\$1").replace(/ /g,".")}`}Object.keys(q).forEach((e=>{Object.keys(q[e]).forEach((t=>{X.prototype[t]=q[e][t]}))})),X.use([function(e){let{swiper:t,on:s,emit:i}=e;const n=a();let r=null,l=null;const o=()=>{t&&!t.destroyed&&t.initialized&&(i("beforeResize"),i("resize"))},d=()=>{t&&!t.destroyed&&t.initialized&&i("orientationchange")};s("init",(()=>{t.params.resizeObserver&&void 0!==n.ResizeObserver?t&&!t.destroyed&&t.initialized&&(r=new ResizeObserver((e=>{l=n.requestAnimationFrame((()=>{const{width:s,height:i}=t;let n=s,a=i;e.forEach((e=>{let{contentBoxSize:s,contentRect:i,target:r}=e;r&&r!==t.el||(n=i?i.width:(s[0]||s).inlineSize,a=i?i.height:(s[0]||s).blockSize)})),n===s&&a===i||o()}))})),r.observe(t.el)):(n.addEventListener("resize",o),n.addEventListener("orientationchange",d))})),s("destroy",(()=>{l&&n.cancelAnimationFrame(l),r&&r.unobserve&&t.el&&(r.unobserve(t.el),r=null),n.removeEventListener("resize",o),n.removeEventListener("orientationchange",d)}))},function(e){let{swiper:t,extendParams:s,on:i,emit:n}=e;const r=[],l=a(),o=function(e,t){void 0===t&&(t={});const s=new(l.MutationObserver||l.WebkitMutationObserver)((e=>{if(1===e.length)return void n("observerUpdate",e[0]);const t=function(){n("observerUpdate",e[0])};l.requestAnimationFrame?l.requestAnimationFrame(t):l.setTimeout(t,0)}));s.observe(e,{attributes:void 0===t.attributes||t.attributes,childList:void 0===t.childList||t.childList,characterData:void 0===t.characterData||t.characterData}),r.push(s)};s({observer:!1,observeParents:!1,observeSlideChildren:!1}),i("init",(()=>{if(t.params.observer){if(t.params.observeParents){const e=t.$el.parents();for(let t=0;t<e.length;t+=1)o(e[t])}o(t.$el[0],{childList:t.params.observeSlideChildren}),o(t.$wrapperEl[0],{attributes:!1})}})),i("destroy",(()=>{r.forEach((e=>{e.disconnect()})),r.splice(0,r.length)}))}]);const K=[function(e){let{swiper:t,extendParams:s,on:n,emit:r}=e;const l=i(),o=a();function c(e){if(!t.enabled)return;const{rtlTranslate:s}=t;let i=e;i.originalEvent&&(i=i.originalEvent);const n=i.keyCode||i.charCode,a=t.params.keyboard.pageUpDown,d=a&&33===n,c=a&&34===n,p=37===n,u=39===n,h=38===n,m=40===n;if(!t.allowSlideNext&&(t.isHorizontal()&&u||t.isVertical()&&m||c))return!1;if(!t.allowSlidePrev&&(t.isHorizontal()&&p||t.isVertical()&&h||d))return!1;if(!(i.shiftKey||i.altKey||i.ctrlKey||i.metaKey||l.activeElement&&l.activeElement.nodeName&&("input"===l.activeElement.nodeName.toLowerCase()||"textarea"===l.activeElement.nodeName.toLowerCase()))){if(t.params.keyboard.onlyInViewport&&(d||c||p||u||h||m)){let e=!1;if(t.$el.parents(`.${t.params.slideClass}`).length>0&&0===t.$el.parents(`.${t.params.slideActiveClass}`).length)return;const i=t.$el,n=i[0].clientWidth,a=i[0].clientHeight,r=o.innerWidth,l=o.innerHeight,d=t.$el.offset();s&&(d.left-=t.$el[0].scrollLeft);const c=[[d.left,d.top],[d.left+n,d.top],[d.left,d.top+a],[d.left+n,d.top+a]];for(let t=0;t<c.length;t+=1){const s=c[t];if(s[0]>=0&&s[0]<=r&&s[1]>=0&&s[1]<=l){if(0===s[0]&&0===s[1])continue;e=!0}}if(!e)return}t.isHorizontal()?((d||c||p||u)&&(i.preventDefault?i.preventDefault():i.returnValue=!1),((c||u)&&!s||(d||p)&&s)&&t.slideNext(),((d||p)&&!s||(c||u)&&s)&&t.slidePrev()):((d||c||h||m)&&(i.preventDefault?i.preventDefault():i.returnValue=!1),(c||m)&&t.slideNext(),(d||h)&&t.slidePrev()),r("keyPress",n)}}function p(){t.keyboard.enabled||(d(l).on("keydown",c),t.keyboard.enabled=!0)}function u(){t.keyboard.enabled&&(d(l).off("keydown",c),t.keyboard.enabled=!1)}t.keyboard={enabled:!1},s({keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}}),n("init",(()=>{t.params.keyboard.enabled&&p()})),n("destroy",(()=>{t.keyboard.enabled&&u()})),Object.assign(t.keyboard,{enable:p,disable:u})},function(e){let{swiper:t,extendParams:s,on:i,emit:n}=e;const r=a();let l;s({mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null}}),t.mousewheel={enabled:!1};let o,c=u();const h=[];function m(){t.enabled&&(t.mouseEntered=!0)}function f(){t.enabled&&(t.mouseEntered=!1)}function g(e){return!(t.params.mousewheel.thresholdDelta&&e.delta<t.params.mousewheel.thresholdDelta)&&(!(t.params.mousewheel.thresholdTime&&u()-c<t.params.mousewheel.thresholdTime)&&(e.delta>=6&&u()-c<60||(e.direction<0?t.isEnd&&!t.params.loop||t.animating||(t.slideNext(),n("scroll",e.raw)):t.isBeginning&&!t.params.loop||t.animating||(t.slidePrev(),n("scroll",e.raw)),c=(new r.Date).getTime(),!1)))}function v(e){let s=e,i=!0;if(!t.enabled)return;const a=t.params.mousewheel;t.params.cssMode&&s.preventDefault();let r=t.$el;if("container"!==t.params.mousewheel.eventsTarget&&(r=d(t.params.mousewheel.eventsTarget)),!t.mouseEntered&&!r[0].contains(s.target)&&!a.releaseOnEdges)return!0;s.originalEvent&&(s=s.originalEvent);let c=0;const m=t.rtlTranslate?-1:1,f=function(e){let t=0,s=0,i=0,n=0;return"detail"in e&&(s=e.detail),"wheelDelta"in e&&(s=-e.wheelDelta/120),"wheelDeltaY"in e&&(s=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=s,s=0),i=10*t,n=10*s,"deltaY"in e&&(n=e.deltaY),"deltaX"in e&&(i=e.deltaX),e.shiftKey&&!i&&(i=n,n=0),(i||n)&&e.deltaMode&&(1===e.deltaMode?(i*=40,n*=40):(i*=800,n*=800)),i&&!t&&(t=i<1?-1:1),n&&!s&&(s=n<1?-1:1),{spinX:t,spinY:s,pixelX:i,pixelY:n}}(s);if(a.forceToAxis)if(t.isHorizontal()){if(!(Math.abs(f.pixelX)>Math.abs(f.pixelY)))return!0;c=-f.pixelX*m}else{if(!(Math.abs(f.pixelY)>Math.abs(f.pixelX)))return!0;c=-f.pixelY}else c=Math.abs(f.pixelX)>Math.abs(f.pixelY)?-f.pixelX*m:-f.pixelY;if(0===c)return!0;a.invert&&(c=-c);let v=t.getTranslate()+c*a.sensitivity;if(v>=t.minTranslate()&&(v=t.minTranslate()),v<=t.maxTranslate()&&(v=t.maxTranslate()),i=!!t.params.loop||!(v===t.minTranslate()||v===t.maxTranslate()),i&&t.params.nested&&s.stopPropagation(),t.params.freeMode&&t.params.freeMode.enabled){const e={time:u(),delta:Math.abs(c),direction:Math.sign(c)},i=o&&e.time<o.time+500&&e.delta<=o.delta&&e.direction===o.direction;if(!i){o=void 0,t.params.loop&&t.loopFix();let r=t.getTranslate()+c*a.sensitivity;const d=t.isBeginning,u=t.isEnd;if(r>=t.minTranslate()&&(r=t.minTranslate()),r<=t.maxTranslate()&&(r=t.maxTranslate()),t.setTransition(0),t.setTranslate(r),t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses(),(!d&&t.isBeginning||!u&&t.isEnd)&&t.updateSlidesClasses(),t.params.freeMode.sticky){clearTimeout(l),l=void 0,h.length>=15&&h.shift();const s=h.length?h[h.length-1]:void 0,i=h[0];if(h.push(e),s&&(e.delta>s.delta||e.direction!==s.direction))h.splice(0);else if(h.length>=15&&e.time-i.time<500&&i.delta-e.delta>=1&&e.delta<=6){const s=c>0?.8:.2;o=e,h.splice(0),l=p((()=>{t.slideToClosest(t.params.speed,!0,void 0,s)}),0)}l||(l=p((()=>{o=e,h.splice(0),t.slideToClosest(t.params.speed,!0,void 0,.5)}),500))}if(i||n("scroll",s),t.params.autoplay&&t.params.autoplayDisableOnInteraction&&t.autoplay.stop(),r===t.minTranslate()||r===t.maxTranslate())return!0}}else{const s={time:u(),delta:Math.abs(c),direction:Math.sign(c),raw:e};h.length>=2&&h.shift();const i=h.length?h[h.length-1]:void 0;if(h.push(s),i?(s.direction!==i.direction||s.delta>i.delta||s.time>i.time+150)&&g(s):g(s),function(e){const s=t.params.mousewheel;if(e.direction<0){if(t.isEnd&&!t.params.loop&&s.releaseOnEdges)return!0}else if(t.isBeginning&&!t.params.loop&&s.releaseOnEdges)return!0;return!1}(s))return!0}return s.preventDefault?s.preventDefault():s.returnValue=!1,!1}function b(e){let s=t.$el;"container"!==t.params.mousewheel.eventsTarget&&(s=d(t.params.mousewheel.eventsTarget)),s[e]("mouseenter",m),s[e]("mouseleave",f),s[e]("wheel",v)}function w(){return t.params.cssMode?(t.wrapperEl.removeEventListener("wheel",v),!0):!t.mousewheel.enabled&&(b("on"),t.mousewheel.enabled=!0,!0)}function T(){return t.params.cssMode?(t.wrapperEl.addEventListener(event,v),!0):!!t.mousewheel.enabled&&(b("off"),t.mousewheel.enabled=!1,!0)}i("init",(()=>{!t.params.mousewheel.enabled&&t.params.cssMode&&T(),t.params.mousewheel.enabled&&w()})),i("destroy",(()=>{t.params.cssMode&&w(),t.mousewheel.enabled&&T()})),Object.assign(t.mousewheel,{enable:w,disable:T})},function(e){let{swiper:t,extendParams:s,on:i,emit:n}=e;function a(e){let s;return e&&(s=d(e),t.params.uniqueNavElements&&"string"==typeof e&&s.length>1&&1===t.$el.find(e).length&&(s=t.$el.find(e))),s}function r(e,s){const i=t.params.navigation;e&&e.length>0&&(e[s?"addClass":"removeClass"](i.disabledClass),e[0]&&"BUTTON"===e[0].tagName&&(e[0].disabled=s),t.params.watchOverflow&&t.enabled&&e[t.isLocked?"addClass":"removeClass"](i.lockClass))}function l(){if(t.params.loop)return;const{$nextEl:e,$prevEl:s}=t.navigation;r(s,t.isBeginning&&!t.params.rewind),r(e,t.isEnd&&!t.params.rewind)}function o(e){e.preventDefault(),(!t.isBeginning||t.params.loop||t.params.rewind)&&(t.slidePrev(),n("navigationPrev"))}function c(e){e.preventDefault(),(!t.isEnd||t.params.loop||t.params.rewind)&&(t.slideNext(),n("navigationNext"))}function p(){const e=t.params.navigation;if(t.params.navigation=Y(t,t.originalParams.navigation,t.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),!e.nextEl&&!e.prevEl)return;const s=a(e.nextEl),i=a(e.prevEl);s&&s.length>0&&s.on("click",c),i&&i.length>0&&i.on("click",o),Object.assign(t.navigation,{$nextEl:s,nextEl:s&&s[0],$prevEl:i,prevEl:i&&i[0]}),t.enabled||(s&&s.addClass(e.lockClass),i&&i.addClass(e.lockClass))}function u(){const{$nextEl:e,$prevEl:s}=t.navigation;e&&e.length&&(e.off("click",c),e.removeClass(t.params.navigation.disabledClass)),s&&s.length&&(s.off("click",o),s.removeClass(t.params.navigation.disabledClass))}s({navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),t.navigation={nextEl:null,$nextEl:null,prevEl:null,$prevEl:null},i("init",(()=>{!1===t.params.navigation.enabled?h():(p(),l())})),i("toEdge fromEdge lock unlock",(()=>{l()})),i("destroy",(()=>{u()})),i("enable disable",(()=>{const{$nextEl:e,$prevEl:s}=t.navigation;e&&e[t.enabled?"removeClass":"addClass"](t.params.navigation.lockClass),s&&s[t.enabled?"removeClass":"addClass"](t.params.navigation.lockClass)})),i("click",((e,s)=>{const{$nextEl:i,$prevEl:a}=t.navigation,r=s.target;if(t.params.navigation.hideOnClick&&!d(r).is(a)&&!d(r).is(i)){if(t.pagination&&t.params.pagination&&t.params.pagination.clickable&&(t.pagination.el===r||t.pagination.el.contains(r)))return;let e;i?e=i.hasClass(t.params.navigation.hiddenClass):a&&(e=a.hasClass(t.params.navigation.hiddenClass)),n(!0===e?"navigationShow":"navigationHide"),i&&i.toggleClass(t.params.navigation.hiddenClass),a&&a.toggleClass(t.params.navigation.hiddenClass)}}));const h=()=>{t.$el.addClass(t.params.navigation.navigationDisabledClass),u()};Object.assign(t.navigation,{enable:()=>{t.$el.removeClass(t.params.navigation.navigationDisabledClass),p(),l()},disable:h,update:l,init:p,destroy:u})},function(e){let{swiper:t,extendParams:s,on:i,emit:n}=e;const a="swiper-pagination";let r;s({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:e=>e,formatFractionTotal:e=>e,bulletClass:`${a}-bullet`,bulletActiveClass:`${a}-bullet-active`,modifierClass:`${a}-`,currentClass:`${a}-current`,totalClass:`${a}-total`,hiddenClass:`${a}-hidden`,progressbarFillClass:`${a}-progressbar-fill`,progressbarOppositeClass:`${a}-progressbar-opposite`,clickableClass:`${a}-clickable`,lockClass:`${a}-lock`,horizontalClass:`${a}-horizontal`,verticalClass:`${a}-vertical`,paginationDisabledClass:`${a}-disabled`}}),t.pagination={el:null,$el:null,bullets:[]};let l=0;function o(){return!t.params.pagination.el||!t.pagination.el||!t.pagination.$el||0===t.pagination.$el.length}function c(e,s){const{bulletActiveClass:i}=t.params.pagination;e[s]().addClass(`${i}-${s}`)[s]().addClass(`${i}-${s}-${s}`)}function p(){const e=t.rtl,s=t.params.pagination;if(o())return;const i=t.virtual&&t.params.virtual.enabled?t.virtual.slides.length:t.slides.length,a=t.pagination.$el;let p;const u=t.params.loop?Math.ceil((i-2*t.loopedSlides)/t.params.slidesPerGroup):t.snapGrid.length;if(t.params.loop?(p=Math.ceil((t.activeIndex-t.loopedSlides)/t.params.slidesPerGroup),p>i-1-2*t.loopedSlides&&(p-=i-2*t.loopedSlides),p>u-1&&(p-=u),p<0&&"bullets"!==t.params.paginationType&&(p=u+p)):p=void 0!==t.snapIndex?t.snapIndex:t.activeIndex||0,"bullets"===s.type&&t.pagination.bullets&&t.pagination.bullets.length>0){const i=t.pagination.bullets;let n,o,u;if(s.dynamicBullets&&(r=i.eq(0)[t.isHorizontal()?"outerWidth":"outerHeight"](!0),a.css(t.isHorizontal()?"width":"height",r*(s.dynamicMainBullets+4)+"px"),s.dynamicMainBullets>1&&void 0!==t.previousIndex&&(l+=p-(t.previousIndex-t.loopedSlides||0),l>s.dynamicMainBullets-1?l=s.dynamicMainBullets-1:l<0&&(l=0)),n=Math.max(p-l,0),o=n+(Math.min(i.length,s.dynamicMainBullets)-1),u=(o+n)/2),i.removeClass(["","-next","-next-next","-prev","-prev-prev","-main"].map((e=>`${s.bulletActiveClass}${e}`)).join(" ")),a.length>1)i.each((e=>{const t=d(e),i=t.index();i===p&&t.addClass(s.bulletActiveClass),s.dynamicBullets&&(i>=n&&i<=o&&t.addClass(`${s.bulletActiveClass}-main`),i===n&&c(t,"prev"),i===o&&c(t,"next"))}));else{const e=i.eq(p),a=e.index();if(e.addClass(s.bulletActiveClass),s.dynamicBullets){const e=i.eq(n),r=i.eq(o);for(let e=n;e<=o;e+=1)i.eq(e).addClass(`${s.bulletActiveClass}-main`);if(t.params.loop)if(a>=i.length){for(let e=s.dynamicMainBullets;e>=0;e-=1)i.eq(i.length-e).addClass(`${s.bulletActiveClass}-main`);i.eq(i.length-s.dynamicMainBullets-1).addClass(`${s.bulletActiveClass}-prev`)}else c(e,"prev"),c(r,"next");else c(e,"prev"),c(r,"next")}}if(s.dynamicBullets){const n=Math.min(i.length,s.dynamicMainBullets+4),a=(r*n-r)/2-u*r,l=e?"right":"left";i.css(t.isHorizontal()?l:"top",`${a}px`)}}if("fraction"===s.type&&(a.find(U(s.currentClass)).text(s.formatFractionCurrent(p+1)),a.find(U(s.totalClass)).text(s.formatFractionTotal(u))),"progressbar"===s.type){let e;e=s.progressbarOpposite?t.isHorizontal()?"vertical":"horizontal":t.isHorizontal()?"horizontal":"vertical";const i=(p+1)/u;let n=1,r=1;"horizontal"===e?n=i:r=i,a.find(U(s.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${n}) scaleY(${r})`).transition(t.params.speed)}"custom"===s.type&&s.renderCustom?(a.html(s.renderCustom(t,p+1,u)),n("paginationRender",a[0])):n("paginationUpdate",a[0]),t.params.watchOverflow&&t.enabled&&a[t.isLocked?"addClass":"removeClass"](s.lockClass)}function u(){const e=t.params.pagination;if(o())return;const s=t.virtual&&t.params.virtual.enabled?t.virtual.slides.length:t.slides.length,i=t.pagination.$el;let a="";if("bullets"===e.type){let n=t.params.loop?Math.ceil((s-2*t.loopedSlides)/t.params.slidesPerGroup):t.snapGrid.length;t.params.freeMode&&t.params.freeMode.enabled&&!t.params.loop&&n>s&&(n=s);for(let s=0;s<n;s+=1)e.renderBullet?a+=e.renderBullet.call(t,s,e.bulletClass):a+=`<${e.bulletElement} class="${e.bulletClass}"></${e.bulletElement}>`;i.html(a),t.pagination.bullets=i.find(U(e.bulletClass))}"fraction"===e.type&&(a=e.renderFraction?e.renderFraction.call(t,e.currentClass,e.totalClass):`<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`,i.html(a)),"progressbar"===e.type&&(a=e.renderProgressbar?e.renderProgressbar.call(t,e.progressbarFillClass):`<span class="${e.progressbarFillClass}"></span>`,i.html(a)),"custom"!==e.type&&n("paginationRender",t.pagination.$el[0])}function h(){t.params.pagination=Y(t,t.originalParams.pagination,t.params.pagination,{el:"swiper-pagination"});const e=t.params.pagination;if(!e.el)return;let s=d(e.el);0!==s.length&&(t.params.uniqueNavElements&&"string"==typeof e.el&&s.length>1&&(s=t.$el.find(e.el),s.length>1&&(s=s.filter((e=>d(e).parents(".swiper")[0]===t.el)))),"bullets"===e.type&&e.clickable&&s.addClass(e.clickableClass),s.addClass(e.modifierClass+e.type),s.addClass(t.isHorizontal()?e.horizontalClass:e.verticalClass),"bullets"===e.type&&e.dynamicBullets&&(s.addClass(`${e.modifierClass}${e.type}-dynamic`),l=0,e.dynamicMainBullets<1&&(e.dynamicMainBullets=1)),"progressbar"===e.type&&e.progressbarOpposite&&s.addClass(e.progressbarOppositeClass),e.clickable&&s.on("click",U(e.bulletClass),(function(e){e.preventDefault();let s=d(this).index()*t.params.slidesPerGroup;t.params.loop&&(s+=t.loopedSlides),t.slideTo(s)})),Object.assign(t.pagination,{$el:s,el:s[0]}),t.enabled||s.addClass(e.lockClass))}function m(){const e=t.params.pagination;if(o())return;const s=t.pagination.$el;s.removeClass(e.hiddenClass),s.removeClass(e.modifierClass+e.type),s.removeClass(t.isHorizontal()?e.horizontalClass:e.verticalClass),t.pagination.bullets&&t.pagination.bullets.removeClass&&t.pagination.bullets.removeClass(e.bulletActiveClass),e.clickable&&s.off("click",U(e.bulletClass))}i("init",(()=>{!1===t.params.pagination.enabled?f():(h(),u(),p())})),i("activeIndexChange",(()=>{(t.params.loop||void 0===t.snapIndex)&&p()})),i("snapIndexChange",(()=>{t.params.loop||p()})),i("slidesLengthChange",(()=>{t.params.loop&&(u(),p())})),i("snapGridLengthChange",(()=>{t.params.loop||(u(),p())})),i("destroy",(()=>{m()})),i("enable disable",(()=>{const{$el:e}=t.pagination;e&&e[t.enabled?"removeClass":"addClass"](t.params.pagination.lockClass)})),i("lock unlock",(()=>{p()})),i("click",((e,s)=>{const i=s.target,{$el:a}=t.pagination;if(t.params.pagination.el&&t.params.pagination.hideOnClick&&a&&a.length>0&&!d(i).hasClass(t.params.pagination.bulletClass)){if(t.navigation&&(t.navigation.nextEl&&i===t.navigation.nextEl||t.navigation.prevEl&&i===t.navigation.prevEl))return;const e=a.hasClass(t.params.pagination.hiddenClass);n(!0===e?"paginationShow":"paginationHide"),a.toggleClass(t.params.pagination.hiddenClass)}}));const f=()=>{t.$el.addClass(t.params.pagination.paginationDisabledClass),t.pagination.$el&&t.pagination.$el.addClass(t.params.pagination.paginationDisabledClass),m()};Object.assign(t.pagination,{enable:()=>{t.$el.removeClass(t.params.pagination.paginationDisabledClass),t.pagination.$el&&t.pagination.$el.removeClass(t.params.pagination.paginationDisabledClass),h(),u(),p()},disable:f,render:u,update:p,init:h,destroy:m})},function(e){let{swiper:t,extendParams:s,on:i}=e;function n(e,t){const s=function(){let e,t,s;return(i,n)=>{for(t=-1,e=i.length;e-t>1;)s=e+t>>1,i[s]<=n?t=s:e=s;return e}}();let i,n;return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(n=s(this.x,e),i=n-1,(e-this.x[i])*(this.y[n]-this.y[i])/(this.x[n]-this.x[i])+this.y[i]):0},this}function a(){t.controller.control&&t.controller.spline&&(t.controller.spline=void 0,delete t.controller.spline)}s({controller:{control:void 0,inverse:!1,by:"slide"}}),t.controller={control:void 0},i("beforeInit",(()=>{t.controller.control=t.params.controller.control})),i("update",(()=>{a()})),i("resize",(()=>{a()})),i("observerUpdate",(()=>{a()})),i("setTranslate",((e,s,i)=>{t.controller.control&&t.controller.setTranslate(s,i)})),i("setTransition",((e,s,i)=>{t.controller.control&&t.controller.setTransition(s,i)})),Object.assign(t.controller,{setTranslate:function(e,s){const i=t.controller.control;let a,r;const l=t.constructor;function o(e){const s=t.rtlTranslate?-t.translate:t.translate;"slide"===t.params.controller.by&&(!function(e){t.controller.spline||(t.controller.spline=t.params.loop?new n(t.slidesGrid,e.slidesGrid):new n(t.snapGrid,e.snapGrid))}(e),r=-t.controller.spline.interpolate(-s)),r&&"container"!==t.params.controller.by||(a=(e.maxTranslate()-e.minTranslate())/(t.maxTranslate()-t.minTranslate()),r=(s-t.minTranslate())*a+e.minTranslate()),t.params.controller.inverse&&(r=e.maxTranslate()-r),e.updateProgress(r),e.setTranslate(r,t),e.updateActiveIndex(),e.updateSlidesClasses()}if(Array.isArray(i))for(let e=0;e<i.length;e+=1)i[e]!==s&&i[e]instanceof l&&o(i[e]);else i instanceof l&&s!==i&&o(i)},setTransition:function(e,s){const i=t.constructor,n=t.controller.control;let a;function r(s){s.setTransition(e,t),0!==e&&(s.transitionStart(),s.params.autoHeight&&p((()=>{s.updateAutoHeight()})),s.$wrapperEl.transitionEnd((()=>{n&&(s.params.loop&&"slide"===t.params.controller.by&&s.loopFix(),s.transitionEnd())})))}if(Array.isArray(n))for(a=0;a<n.length;a+=1)n[a]!==s&&n[a]instanceof i&&r(n[a]);else n instanceof i&&s!==n&&r(n)}})},function(e){let{swiper:t,extendParams:s,on:i}=e;s({a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",slideLabelMessage:"{{index}} / {{slidesLength}}",containerMessage:null,containerRoleDescriptionMessage:null,itemRoleDescriptionMessage:null,slideRole:"group",id:null}}),t.a11y={clicked:!1};let n=null;function a(e){const t=n;0!==t.length&&(t.html(""),t.html(e))}function r(e){e.attr("tabIndex","0")}function l(e){e.attr("tabIndex","-1")}function o(e,t){e.attr("role",t)}function c(e,t){e.attr("aria-roledescription",t)}function p(e,t){e.attr("aria-label",t)}function u(e){e.attr("aria-disabled",!0)}function h(e){e.attr("aria-disabled",!1)}function m(e){if(13!==e.keyCode&&32!==e.keyCode)return;const s=t.params.a11y,i=d(e.target);t.navigation&&t.navigation.$nextEl&&i.is(t.navigation.$nextEl)&&(t.isEnd&&!t.params.loop||t.slideNext(),t.isEnd?a(s.lastSlideMessage):a(s.nextSlideMessage)),t.navigation&&t.navigation.$prevEl&&i.is(t.navigation.$prevEl)&&(t.isBeginning&&!t.params.loop||t.slidePrev(),t.isBeginning?a(s.firstSlideMessage):a(s.prevSlideMessage)),t.pagination&&i.is(U(t.params.pagination.bulletClass))&&i[0].click()}function f(){return t.pagination&&t.pagination.bullets&&t.pagination.bullets.length}function g(){return f()&&t.params.pagination.clickable}const v=(e,t,s)=>{r(e),"BUTTON"!==e[0].tagName&&(o(e,"button"),e.on("keydown",m)),p(e,s),function(e,t){e.attr("aria-controls",t)}(e,t)},b=()=>{t.a11y.clicked=!0},w=()=>{requestAnimationFrame((()=>{requestAnimationFrame((()=>{t.a11y.clicked=!1}))}))},T=e=>{if(t.a11y.clicked)return;const s=e.target.closest(`.${t.params.slideClass}`);if(!s||!t.slides.includes(s))return;const i=t.slides.indexOf(s)===t.activeIndex,n=t.params.watchSlidesProgress&&t.visibleSlides&&t.visibleSlides.includes(s);i||n||(t.isHorizontal()?t.el.scrollLeft=0:t.el.scrollTop=0,t.slideTo(t.slides.indexOf(s),0))},y=()=>{const e=t.params.a11y;e.itemRoleDescriptionMessage&&c(d(t.slides),e.itemRoleDescriptionMessage),e.slideRole&&o(d(t.slides),e.slideRole);const s=t.params.loop?t.slides.filter((e=>!e.classList.contains(t.params.slideDuplicateClass))).length:t.slides.length;e.slideLabelMessage&&t.slides.each(((i,n)=>{const a=d(i),r=t.params.loop?parseInt(a.attr("data-swiper-slide-index"),10):n;p(a,e.slideLabelMessage.replace(/\{\{index\}\}/,r+1).replace(/\{\{slidesLength\}\}/,s))}))},C=()=>{const e=t.params.a11y;t.$el.append(n);const s=t.$el;e.containerRoleDescriptionMessage&&c(s,e.containerRoleDescriptionMessage),e.containerMessage&&p(s,e.containerMessage);const i=t.$wrapperEl,a=e.id||i.attr("id")||`swiper-wrapper-${r=16,void 0===r&&(r=16),"x".repeat(r).replace(/x/g,(()=>Math.round(16*Math.random()).toString(16)))}`;var r;const l=t.params.autoplay&&t.params.autoplay.enabled?"off":"polite";var o;let d,u;o=a,i.attr("id",o),function(e,t){e.attr("aria-live",t)}(i,l),y(),t.navigation&&t.navigation.$nextEl&&(d=t.navigation.$nextEl),t.navigation&&t.navigation.$prevEl&&(u=t.navigation.$prevEl),d&&d.length&&v(d,a,e.nextSlideMessage),u&&u.length&&v(u,a,e.prevSlideMessage),g()&&t.pagination.$el.on("keydown",U(t.params.pagination.bulletClass),m),t.$el.on("focus",T,!0),t.$el.on("pointerdown",b,!0),t.$el.on("pointerup",w,!0)};i("beforeInit",(()=>{n=d(`<span class="${t.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`)})),i("afterInit",(()=>{t.params.a11y.enabled&&C()})),i("slidesLengthChange snapGridLengthChange slidesGridLengthChange",(()=>{t.params.a11y.enabled&&y()})),i("fromEdge toEdge afterInit lock unlock",(()=>{t.params.a11y.enabled&&function(){if(t.params.loop||t.params.rewind||!t.navigation)return;const{$nextEl:e,$prevEl:s}=t.navigation;s&&s.length>0&&(t.isBeginning?(u(s),l(s)):(h(s),r(s))),e&&e.length>0&&(t.isEnd?(u(e),l(e)):(h(e),r(e)))}()})),i("paginationUpdate",(()=>{t.params.a11y.enabled&&function(){const e=t.params.a11y;f()&&t.pagination.bullets.each((s=>{const i=d(s);t.params.pagination.clickable&&(r(i),t.params.pagination.renderBullet||(o(i,"button"),p(i,e.paginationBulletMessage.replace(/\{\{index\}\}/,i.index()+1)))),i.is(`.${t.params.pagination.bulletActiveClass}`)?i.attr("aria-current","true"):i.removeAttr("aria-current")}))}()})),i("destroy",(()=>{t.params.a11y.enabled&&function(){let e,s;n&&n.length>0&&n.remove(),t.navigation&&t.navigation.$nextEl&&(e=t.navigation.$nextEl),t.navigation&&t.navigation.$prevEl&&(s=t.navigation.$prevEl),e&&e.off("keydown",m),s&&s.off("keydown",m),g()&&t.pagination.$el.off("keydown",U(t.params.pagination.bulletClass),m),t.$el.off("focus",T,!0),t.$el.off("pointerdown",b,!0),t.$el.off("pointerup",w,!0)}()}))},function(e){let t,{swiper:s,extendParams:n,on:a,emit:r}=e;function l(){if(!s.size)return s.autoplay.running=!1,void(s.autoplay.paused=!1);const e=s.slides.eq(s.activeIndex);let i=s.params.autoplay.delay;e.attr("data-swiper-autoplay")&&(i=e.attr("data-swiper-autoplay")||s.params.autoplay.delay),clearTimeout(t),t=p((()=>{let e;s.params.autoplay.reverseDirection?s.params.loop?(s.loopFix(),e=s.slidePrev(s.params.speed,!0,!0),r("autoplay")):s.isBeginning?s.params.autoplay.stopOnLastSlide?d():(e=s.slideTo(s.slides.length-1,s.params.speed,!0,!0),r("autoplay")):(e=s.slidePrev(s.params.speed,!0,!0),r("autoplay")):s.params.loop?(s.loopFix(),e=s.slideNext(s.params.speed,!0,!0),r("autoplay")):s.isEnd?s.params.autoplay.stopOnLastSlide?d():(e=s.slideTo(0,s.params.speed,!0,!0),r("autoplay")):(e=s.slideNext(s.params.speed,!0,!0),r("autoplay")),(s.params.cssMode&&s.autoplay.running||!1===e)&&l()}),i)}function o(){return void 0===t&&(!s.autoplay.running&&(s.autoplay.running=!0,r("autoplayStart"),l(),!0))}function d(){return!!s.autoplay.running&&(void 0!==t&&(t&&(clearTimeout(t),t=void 0),s.autoplay.running=!1,r("autoplayStop"),!0))}function c(e){s.autoplay.running&&(s.autoplay.paused||(t&&clearTimeout(t),s.autoplay.paused=!0,0!==e&&s.params.autoplay.waitForTransition?["transitionend","webkitTransitionEnd"].forEach((e=>{s.$wrapperEl[0].addEventListener(e,h)})):(s.autoplay.paused=!1,l())))}function u(){const e=i();"hidden"===e.visibilityState&&s.autoplay.running&&c(),"visible"===e.visibilityState&&s.autoplay.paused&&(l(),s.autoplay.paused=!1)}function h(e){s&&!s.destroyed&&s.$wrapperEl&&e.target===s.$wrapperEl[0]&&(["transitionend","webkitTransitionEnd"].forEach((e=>{s.$wrapperEl[0].removeEventListener(e,h)})),s.autoplay.paused=!1,s.autoplay.running?l():d())}function m(){s.params.autoplay.disableOnInteraction?d():(r("autoplayPause"),c()),["transitionend","webkitTransitionEnd"].forEach((e=>{s.$wrapperEl[0].removeEventListener(e,h)}))}function f(){s.params.autoplay.disableOnInteraction||(s.autoplay.paused=!1,r("autoplayResume"),l())}s.autoplay={running:!1,paused:!1},n({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!0,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}}),a("init",(()=>{if(s.params.autoplay.enabled){o();i().addEventListener("visibilitychange",u),s.params.autoplay.pauseOnMouseEnter&&(s.$el.on("mouseenter",m),s.$el.on("mouseleave",f))}})),a("beforeTransitionStart",((e,t,i)=>{s.autoplay.running&&(i||!s.params.autoplay.disableOnInteraction?s.autoplay.pause(t):d())})),a("sliderFirstMove",(()=>{s.autoplay.running&&(s.params.autoplay.disableOnInteraction?d():c())})),a("touchEnd",(()=>{s.params.cssMode&&s.autoplay.paused&&!s.params.autoplay.disableOnInteraction&&l()})),a("destroy",(()=>{s.$el.off("mouseenter",m),s.$el.off("mouseleave",f),s.autoplay.running&&d();i().removeEventListener("visibilitychange",u)})),Object.assign(s.autoplay,{pause:c,run:l,start:o,stop:d})},function(e){let{swiper:t,extendParams:s,on:i}=e;s({thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-thumbs"}});let n=!1,a=!1;function r(){const e=t.thumbs.swiper;if(!e||e.destroyed)return;const s=e.clickedIndex,i=e.clickedSlide;if(i&&d(i).hasClass(t.params.thumbs.slideThumbActiveClass))return;if(null==s)return;let n;if(n=e.params.loop?parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"),10):s,t.params.loop){let e=t.activeIndex;t.slides.eq(e).hasClass(t.params.slideDuplicateClass)&&(t.loopFix(),t._clientLeft=t.$wrapperEl[0].clientLeft,e=t.activeIndex);const s=t.slides.eq(e).prevAll(`[data-swiper-slide-index="${n}"]`).eq(0).index(),i=t.slides.eq(e).nextAll(`[data-swiper-slide-index="${n}"]`).eq(0).index();n=void 0===s?i:void 0===i?s:i-e<e-s?i:s}t.slideTo(n)}function l(){const{thumbs:e}=t.params;if(n)return!1;n=!0;const s=t.constructor;if(e.swiper instanceof s)t.thumbs.swiper=e.swiper,Object.assign(t.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),Object.assign(t.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1});else if(m(e.swiper)){const i=Object.assign({},e.swiper);Object.assign(i,{watchSlidesProgress:!0,slideToClickedSlide:!1}),t.thumbs.swiper=new s(i),a=!0}return t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass),t.thumbs.swiper.on("tap",r),!0}function o(e){const s=t.thumbs.swiper;if(!s||s.destroyed)return;const i="auto"===s.params.slidesPerView?s.slidesPerViewDynamic():s.params.slidesPerView;let n=1;const a=t.params.thumbs.slideThumbActiveClass;if(t.params.slidesPerView>1&&!t.params.centeredSlides&&(n=t.params.slidesPerView),t.params.thumbs.multipleActiveThumbs||(n=1),n=Math.floor(n),s.slides.removeClass(a),s.params.loop||s.params.virtual&&s.params.virtual.enabled)for(let e=0;e<n;e+=1)s.$wrapperEl.children(`[data-swiper-slide-index="${t.realIndex+e}"]`).addClass(a);else for(let e=0;e<n;e+=1)s.slides.eq(t.realIndex+e).addClass(a);const r=t.params.thumbs.autoScrollOffset,l=r&&!s.params.loop;if(t.realIndex!==s.realIndex||l){let n,a,o=s.activeIndex;if(s.params.loop){s.slides.eq(o).hasClass(s.params.slideDuplicateClass)&&(s.loopFix(),s._clientLeft=s.$wrapperEl[0].clientLeft,o=s.activeIndex);const e=s.slides.eq(o).prevAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index(),i=s.slides.eq(o).nextAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index();n=void 0===e?i:void 0===i?e:i-o==o-e?s.params.slidesPerGroup>1?i:o:i-o<o-e?i:e,a=t.activeIndex>t.previousIndex?"next":"prev"}else n=t.realIndex,a=n>t.previousIndex?"next":"prev";l&&(n+="next"===a?r:-1*r),s.visibleSlidesIndexes&&s.visibleSlidesIndexes.indexOf(n)<0&&(s.params.centeredSlides?n=n>o?n-Math.floor(i/2)+1:n+Math.floor(i/2)-1:n>o&&s.params.slidesPerGroup,s.slideTo(n,e?0:void 0))}}t.thumbs={swiper:null},i("beforeInit",(()=>{const{thumbs:e}=t.params;e&&e.swiper&&(l(),o(!0))})),i("slideChange update resize observerUpdate",(()=>{o()})),i("setTransition",((e,s)=>{const i=t.thumbs.swiper;i&&!i.destroyed&&i.setTransition(s)})),i("beforeDestroy",(()=>{const e=t.thumbs.swiper;e&&!e.destroyed&&a&&e.destroy()})),Object.assign(t.thumbs,{init:l,update:o})},function(e){let{swiper:t,extendParams:s,emit:i,once:n}=e;s({freeMode:{enabled:!1,momentum:!0,momentumRatio:1,momentumBounce:!0,momentumBounceRatio:1,momentumVelocityRatio:1,sticky:!1,minimumVelocity:.02}}),Object.assign(t,{freeMode:{onTouchStart:function(){const e=t.getTranslate();t.setTranslate(e),t.setTransition(0),t.touchEventsData.velocities.length=0,t.freeMode.onTouchEnd({currentPos:t.rtl?t.translate:-t.translate})},onTouchMove:function(){const{touchEventsData:e,touches:s}=t;0===e.velocities.length&&e.velocities.push({position:s[t.isHorizontal()?"startX":"startY"],time:e.touchStartTime}),e.velocities.push({position:s[t.isHorizontal()?"currentX":"currentY"],time:u()})},onTouchEnd:function(e){let{currentPos:s}=e;const{params:a,$wrapperEl:r,rtlTranslate:l,snapGrid:o,touchEventsData:d}=t,c=u()-d.touchStartTime;if(s<-t.minTranslate())t.slideTo(t.activeIndex);else if(s>-t.maxTranslate())t.slides.length<o.length?t.slideTo(o.length-1):t.slideTo(t.slides.length-1);else{if(a.freeMode.momentum){if(d.velocities.length>1){const e=d.velocities.pop(),s=d.velocities.pop(),i=e.position-s.position,n=e.time-s.time;t.velocity=i/n,t.velocity/=2,Math.abs(t.velocity)<a.freeMode.minimumVelocity&&(t.velocity=0),(n>150||u()-e.time>300)&&(t.velocity=0)}else t.velocity=0;t.velocity*=a.freeMode.momentumVelocityRatio,d.velocities.length=0;let e=1e3*a.freeMode.momentumRatio;const s=t.velocity*e;let c=t.translate+s;l&&(c=-c);let p,h=!1;const m=20*Math.abs(t.velocity)*a.freeMode.momentumBounceRatio;let f;if(c<t.maxTranslate())a.freeMode.momentumBounce?(c+t.maxTranslate()<-m&&(c=t.maxTranslate()-m),p=t.maxTranslate(),h=!0,d.allowMomentumBounce=!0):c=t.maxTranslate(),a.loop&&a.centeredSlides&&(f=!0);else if(c>t.minTranslate())a.freeMode.momentumBounce?(c-t.minTranslate()>m&&(c=t.minTranslate()+m),p=t.minTranslate(),h=!0,d.allowMomentumBounce=!0):c=t.minTranslate(),a.loop&&a.centeredSlides&&(f=!0);else if(a.freeMode.sticky){let e;for(let t=0;t<o.length;t+=1)if(o[t]>-c){e=t;break}c=Math.abs(o[e]-c)<Math.abs(o[e-1]-c)||"next"===t.swipeDirection?o[e]:o[e-1],c=-c}if(f&&n("transitionEnd",(()=>{t.loopFix()})),0!==t.velocity){if(e=l?Math.abs((-c-t.translate)/t.velocity):Math.abs((c-t.translate)/t.velocity),a.freeMode.sticky){const s=Math.abs((l?-c:c)-t.translate),i=t.slidesSizesGrid[t.activeIndex];e=s<i?a.speed:s<2*i?1.5*a.speed:2.5*a.speed}}else if(a.freeMode.sticky)return void t.slideToClosest();a.freeMode.momentumBounce&&h?(t.updateProgress(p),t.setTransition(e),t.setTranslate(c),t.transitionStart(!0,t.swipeDirection),t.animating=!0,r.transitionEnd((()=>{t&&!t.destroyed&&d.allowMomentumBounce&&(i("momentumBounce"),t.setTransition(a.speed),setTimeout((()=>{t.setTranslate(p),r.transitionEnd((()=>{t&&!t.destroyed&&t.transitionEnd()}))}),0))}))):t.velocity?(i("_freeModeNoMomentumRelease"),t.updateProgress(c),t.setTransition(e),t.setTranslate(c),t.transitionStart(!0,t.swipeDirection),t.animating||(t.animating=!0,r.transitionEnd((()=>{t&&!t.destroyed&&t.transitionEnd()})))):t.updateProgress(c),t.updateActiveIndex(),t.updateSlidesClasses()}else{if(a.freeMode.sticky)return void t.slideToClosest();a.freeMode&&i("_freeModeNoMomentumRelease")}(!a.freeMode.momentum||c>=a.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}}}})}];return X.use(K),X}));
//# sourceMappingURL=swiper-bundle.min.js.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   




function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));

  if(summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (event) => {
    event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
  });

  if (summary.closest('header-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch(e) {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'TAB', 'ENTER', 'SPACE', 'ESCAPE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN']
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if(navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', (event) => {
    mouseClick = true;
  });

  window.addEventListener('focus', () => {
    if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

    if (mouseClick) return;

    currentFocusedElement = document.activeElement;
    currentFocusedElement.classList.add('focused');

  }, true);
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector('details');

    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
  }

  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if(!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest('.has-submenu');
    const isOpen = detailsElement.hasAttribute('open');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function addTrapFocus() {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
      summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
    }

    if (detailsElement === this.mainDetailsToggle) {
      if(isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(event, summaryElement) : this.openMenuDrawer(summaryElement);

      if (window.matchMedia('(max-width: 1025px)')) {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
        summaryElement.setAttribute('aria-expanded', true);
        parentMenuElement && parentMenuElement.classList.add('submenu-open');
        !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
      }, 100);
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;

    this.mainDetailsToggle.classList.remove('menu-opening');
    this.mainDetailsToggle.querySelectorAll('details').forEach(details => {
      details.removeAttribute('open');
      details.classList.remove('menu-opening');
    });
    this.mainDetailsToggle.querySelectorAll('.submenu-open').forEach(submenu => {
      submenu.classList.remove('submenu-open');
    });
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement)) this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest('.submenu-open');
    parentMenuElement && parentMenuElement.classList.remove('submenu-open');
    detailsElement.classList.remove('menu-opening');
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
    removeTrapFocus(detailsElement.querySelector('summary'));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
    var headerHeight = $('#shopify-section-header').outerHeight();
    $(".template-index #MainContent").css('position','relative').css('top','-'+headerHeight+'px');
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.getElementById('shopify-section-header');
    this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
    document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`);
    this.header.classList.add('menu-open');

    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus) {
    super.closeMenuDrawer(event, elementToFocus);
    this.header.classList.remove('menu-open');
  }
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this, false)
    );
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

class announcementComponent extends HTMLElement {
  constructor() {
    super();
    this.element = this.querySelector('.announcement-bar');
    this.slider = this.querySelector('[id^="sliderAnno-"]');
    const num = this.slider.getAttribute("data-style");    
    console.log('Announcement num ---'+num);
    
    this.initSlider();
    this.show();
  
  }
  initSlider() {
    $(".lsn-slider").each(function(e, t) {
      var a = $(this);
      a.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        fade: true,
        arrows: false,
        dots: false,
        autoplaySpeed: 3000,
      });
     })
  }
  show() {
      setTimeout(() => {
        this.style.display = "block";
      }, 3000)
  }
  
}
  customElements.define('announcement-component', announcementComponent);

/*
window.addEventListener('load', () => {
  customElements.define('announcement-component', announcementComponent);
});
*/

class AnnouncementBar extends HTMLElement {
  constructor() {
    super();

    this.sessionStorageKey = 'announcementBarClosed';
    this.closeButton = this.querySelector('[data-close-button]');
    this.closeButton &&
      this.closeButton.addEventListener(
        'click',
        this.onClose.bind(this)
      );
  }

  connectedCallback() {
    if (sessionStorage.getItem(this.sessionStorageKey)) return;
    this.classList.remove('hidden');
    this.initSlider();
  }

  initSlider() {
    if (!this.querySelector('.swiper')) return;

    this.options = {
      slidesPerPage: 1,
      rewind: true,
      draggable: true
    };

    if (this.dataset.sliderType !== 'controls') {
      this.options.autoplay = {
        delay: 3000
      };
    } else {
      this.options.navigation = {
        prevEl: '[data-arrow-prev]',
        nextEl: '[data-arrow-next]'
      };
    }

    this.slider = new Swiper(
      this.querySelector('.swiper'),
      this.options
    );
  }

  onClose() {
    this.classList.add('hidden');
    sessionStorage.setItem(this.sessionStorageKey, true);
  }
}

customElements.define('announcement-bar', AnnouncementBar);

// Create a class for the element
class PopUpInfo extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

   
  }
}

// Define the new element
customElements.define("popup-info", PopUpInfo);


class SliderComponent extends HTMLElement {
  constructor() {
    super();
    console.log('SliderComponent');
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor((this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset);
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(new CustomEvent('slideChanged', { detail: {
        currentPage: this.currentPage,
        currentElement: this.sliderItemsToShow[this.currentPage - 1]
      }}));
    }

    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return (element.offsetLeft + element.clientWidth) <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + (step * this.sliderItemOffset) : this.slider.scrollLeft - (step * this.sliderItemOffset);
    this.slider.scrollTo({
      left: this.slideScrollPosition
    });
  }
}

customElements.define('slider-component', SliderComponent);

class SlideshowComponent extends SliderComponent {
  constructor() {
    super();

    $(".lsn-slideshow").each(function(e, t) {
      var a = $(this);
      var e = a.attr('data-autoplay');
      a.slick({
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: false,
        dots: true,
        autoplaySpeed: 3000,
      });
      if("true" == e){
        a.slick('slickSetOption', 'autoplay', true).slick('slickPlay');
      }else{
        a.slick('slickSetOption', 'autoplay', false).slick('slickPause');
      }
    })
  }

}

customElements.define('slideshow-component', SlideshowComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${this.dataset.section}"]`);
    mediaGalleries.forEach(mediaGallery => mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true));

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    if (!modalContent) return;
    const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
    modalContent.prepend(newMediaModal);
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }
}

customElements.define('variant-radios', VariantRadios);

class ProductRecommendations extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then(response => response.text())
        .then(text => {
          const html = document.createElement('div');
          html.innerHTML = text;
          const recommendations = html.querySelector('product-recommendations');

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;
          }

          if (!this.querySelector('slideshow-component') && this.classList.contains('complementary-products')) {
            this.remove();
          }

          if (html.querySelector('.grid__item')) {
            this.classList.add('product-recommendations--loaded');
          }
        })
        .catch(e => {
          console.error(e);
        });
    }

    new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 400px 0px'}).observe(this);
  }
}

customElements.define('product-recommendations', ProductRecommendations);



 //Testimonials
$('.testimonials').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
  speed: 300,
  infinite: true,
  autoplaySpeed: 10000,
  autoplay: false,
});



