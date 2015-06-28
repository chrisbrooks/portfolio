var GLOBAL = GLOBAL || {};

GLOBAL.$dom = $(document);


GLOBAL.plugins = {

	lazyload: function () {
		GLOBAL.$dom.find('img').show().lazyload({
			effect : 'fadeIn'
		});
	},

	onePageNav: function () {
		GLOBAL.$dom.find('.navigation').onePageNav({
			changeHash: true,
			currentClass: 'current',
			'scrollOffset': 117
		});
	},

	viewPort: function () {
		GLOBAL.$dom.find('.post').addClass('opacity').viewportChecker({
			classToAdd: 'visible animated fadeInUp',
			offset: 100
		});
	}
};

GLOBAL.general = {

	sectionHeight: function (){

		function sHeight(){
			GLOBAL.$dom.find('section').each( function(){
				if($(this).height() < $(window).height()){
					$(this).css('height', $(window).height());
				}
			});
		}

		$(window).on('orientationchange',function(){
			setTimeout(function(){
				sHeight();
			}, 10);
		});

		sHeight();
	},

	homeHeight: function (){

		function hHeight(){
			if($(this).height() < $(window).height()){
				GLOBAL.$dom.find('.home').css('height', $(window).height());
			}
		}

		$(window).on('orientationchange',function(){
			setTimeout(function(){
				hHeight();
			}, 10);
		});

		hHeight();

	},

	scrollButton: function (){

		var scroller = GLOBAL.$dom.find('.scroll-button, .scroll-button svg');

		function scrolling() {
			if ($(this).scrollTop() > 100 && $(window).width() > 767) {
				scroller.fadeIn();
			} else {
				scroller.fadeOut();
			}
		}

		$(window).on('scroll', function () {
			scrolling();
		});

		scrolling();
	},

	navBackground: function(){

		function background() {
			if ($(this).scrollTop() > $('.home').outerHeight() - 70){
				GLOBAL.$dom.find('.navigation .icon-container').addClass('background');
			}else{
				GLOBAL.$dom.find('.navigation .icon-container').removeClass('background');
			}
		}

		$(window).on('scroll', function () {
			background();
		});

		background();
	},

	bannerText: function(){

		function text() {

			var fadeStart = 1,
			fadeUntil = 500,
			offset = GLOBAL.$dom.scrollTop(),
			opacity = 0,
			selector = GLOBAL.$dom.find('.logo-container');

			if (offset <= fadeStart) {
				opacity = 1;
			} else if (offset <= fadeUntil) {
				opacity = 1 - offset / fadeUntil;
			}

			selector.css({
				'opacity': opacity,
				'bottom' : -($(this).scrollTop()/2)+'px'
			});

			GLOBAL.$dom.find('.home .arrow-down').css('opacity', opacity);
		}

		$(window).on('scroll', function () {

			if ($(window).width() > 1024) {
				text();
			}
		});
	},

	portfolioImageFade: function(){

		var container = GLOBAL.$dom.find('.project-container');

		container.css('opacity', '1.0');

		container.hover(function () {
			$(this).siblings().stop().animate({'opacity': '0.6'}, 500);
		},
		function () {
			container.stop().animate({'opacity': '1'}, 'slow');
		});

	},

	scrollDown: function(){

		GLOBAL.$dom.find('.arrow-down').on('mouseenter', function() {
			$(this).removeClass('as-circle-none').addClass('as-circle-full');
		}).on('mouseleave', function() {
			$(this).removeClass('as-circle-full').addClass('as-circle-none');
		});

		GLOBAL.$dom.find('.arrow-down').on('click', function () {
			var nextSection = $(this).closest('section').next();
			GLOBAL.$dom.find('body,html').animate({scrollTop: $(nextSection).offset().top}, 800, 'swing');
			return false;
		});

		GLOBAL.$dom.find('.scroll-button, .logo-containers a').on('click', function () {
			GLOBAL.$dom.find('body').animate({scrollTop: 0}, 800, 'swing');
			return false;
		});
	},

	navToggle: function(){
		GLOBAL.$dom.find( '.icon-container' ).on( 'click', function() {
			GLOBAL.$dom.find('body').toggleClass('opened');
			return false;
		});
	}

};

GLOBAL.portfolio = {

	init: function(){

		function datastorage(dataName) {
			var storedData = JSON.parse(localStorage.getItem('site data')),
				oneDay,
				currentTime,
				storedTime,
				diffDays

			if (storedData) {
				oneDay = 24 * 60 * 60 * 1000;
				currentTime = new Date();
				storedTime = new Date(storedData.storedTime);
				diffDays = Math.round(Math.abs((currentTime.getTime() - storedTime.getTime()) / (oneDay)));
			}

			if (storedData && diffDays < 30) {
				dataSort(storedData, dataName);
			} else {
				ajaxcall(dataName);
			}
		}

		function  ajaxcall(dataName) {
			$.ajax({
				type: 'GET',
				url: 'data/content.json',
				dataType: 'JSON',
				success: function(data) {

				data.storedTime = new Date();
				localStorage.setItem('site data', JSON.stringify(data));
				dataSort(data, dataName);

			}
			}).fail(function() {
				console.log('ajax call failed');
			});
		}

		function dataSort(data, dataName){
				var projectDetails = GLOBAL.$dom.find('.project-details'),
					projectDetailsOuter = GLOBAL.$dom.find('.project-details-outer');

				if(projectDetails.length && $('.project-details').attr('id') != dataName){
					projectDetails.fadeOut(300, function(){
						projectDetailsOuter.removeClass('fadeIn').css('opacity','0');
						projectDetails.remove();
						goDataGo(data, dataName);
					});

				}else if(parseFloat(projectDetails.attr('id')) === dataName){
					GLOBAL.$dom.find('body,html').animate({scrollTop: $('#'+ dataName +'').offset().top}, 800, 'swing');

				}else{
					goDataGo(data, dataName);
				}

				if(dataName === 8){
					$('.next').fadeOut(300);

				}else{
					$('.next').fadeIn(300);

				}

				if(dataName === 0){
					$('.prev').fadeOut(300);

				}else{
					$('.prev').fadeIn(300);

				}
		}

		function goDataGo(data, dataName) {

			var results = data.projects[dataName].details[0];

			if(!$('#'+ dataName +'').length && results.layout === 1){
				GLOBAL.$dom.find('.project-details-outer').find('.container').append(

					'<div class="row section-padding project-details" id="'+ dataName +'">
						<div class="col-lg-offset-2 col-lg-8 col-md-10 col-md-offset-1 col-xs-12 col-xs-offset-0">
							<div class="icon portfolio-icon no-hover centered lighter"></div>
							<h2 class="header-title">'+ results.name +'</h2>
							<div class="project-info">
								<p class="small">'+ results.information +'</p>
								<p class="small">'+ results.skills +'</p>
								<p class="small"><a href="'+ results.link +'" target="_blank">'+ results.link +'</a></p>
							</div>

							<div class="browser-container">
								<span class="toolbar"></span>
								<span class="close-browser"></span>
								<span class="minimize-browser"></span>
								<span class="zoom-browser"></span>
								<img class="lazy" alt="EE Shop Home Page" data-original="images/' + results.image + '">
							</div>
							<br/><br/>
							<img class="lazy" data-original="images/' + results.image2 +'"/>
							<br/><br/>
							<img class="lazy" data-original="images/' + results.image3 +'"/>
						</div>
					</div>'
				);
			}

			if(!$('#'+ dataName +'').length && results.layout === 2){
				GLOBAL.$dom.find('.project-details-outer').find('.container').append(
					'<div class="row section-padding project-details" id="'+ dataName +'">
						<div class="col-lg-offset-2 col-lg-8 col-md-10 col-md-offset-1 col-xs-12 col-xs-offset-0">
							<div class="icon portfolio-icon no-hover centered lighter"></div>
							<h2 class="header-title">'+ results.name +'</h2>
							<div class="project-info">
								<p class="small">'+ results.information +'</p>
								<p class="small">'+ results.skills +'</p>
								<p class="small"><a href="'+ results.link +'" target="_blank">'+ results.link +'</a></p>
							</div>

							<div class="browser-container">
								<span class="toolbar"></span>
								<span class="close-browser"></span>
								<span class="minimize-browser"></span>
								<span class="zoom-browser"></span>
								<img class="lazy" alt="EE Shop Home Page" data-original="images/' + results.image + '">
							</div>

							<br/><br/>
							<div class="browser-container">
								<span class="toolbar"></span>
								<span class="close-browser"></span>
								<span class="minimize-browser"></span>
								<span class="zoom-browser"></span>
								<img class="lazy" alt="EE Shop Home Page" data-original="images/' + results.image2 + '">
							</div>
							<br/><br/>
							<div class="browser-container">
								<span class="toolbar"></span>
								<span class="close-browser"></span>
								<span class="minimize-browser"></span>
								<span class="zoom-browser"></span>
								<img class="lazy" alt="EE Shop Home Page" data-original="images/' + results.image3 + '">
							</div>
						</div>
					</div>'
				);
			}

			GLOBAL.$dom.find('body').animate({scrollTop: $('#'+ dataName +'').offset().top}, 800, 'swing');
			GLOBAL.$dom.find('.project-details-outer').addClass('fadeIn');

			GLOBAL.$dom.find('img').show().lazyload({
				effect : 'fadeIn'
			});
		}

		GLOBAL.$dom.find('.next').click(function(){
			var dataName =  parseInt($('.project-details').attr('id')) + 1;
			datastorage(dataName);
			return false;
		});

		GLOBAL.$dom.find('.prev').click(function(){
			var dataName =  parseInt($('.project-details').attr('id')) - 1;
			datastorage(dataName);
			return false;
		});

		GLOBAL.$dom.find('.project-container').find('.project').on('click', function () {
			var dataName =  $(this).parent().index();
			datastorage(dataName);
			return false;
		});
	}
};

GLOBAL.ctrl = {
	exec: function( controller, action ) {
		var ns = GLOBAL.ctrl,
		action = ( action === undefined ) ? 'init' : action;

		if ( controller !== "" && ns[controller] && typeof ns[controller][action] == 'function' ) {
			ns[controller][action]();
		}
	},

	init: function() {
		var body = document.body,
		controller = body.getAttribute('data-controller'),
		action = body.getAttribute('data-action');

		GLOBAL.ctrl.exec('common');
		GLOBAL.ctrl.exec( controller );
		GLOBAL.ctrl.exec( controller, action );
	},

	common: {
		init: function() {
			'use strict';
			GLOBAL.portfolio.init();
			GLOBAL.plugins.lazyload();
			GLOBAL.plugins.onePageNav();
			GLOBAL.plugins.viewPort();
			GLOBAL.general.sectionHeight();
			GLOBAL.general.homeHeight();
			GLOBAL.general.scrollButton();
			GLOBAL.general.bannerText();
			GLOBAL.general.navBackground();
			GLOBAL.general.portfolioImageFade();
			GLOBAL.general.scrollDown();
			GLOBAL.general.navToggle();
		}
	}
};

$( document ).ready( GLOBAL.ctrl.init );