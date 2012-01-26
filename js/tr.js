$(function(){
	
	$( "#load-mask" ).height($(window).height()).width($(window).width() + 15);
	
});



$.tr.isDOMReady = false;
$.tr.isIFrameReady = false;

//this file is used to initialize the jquery-ui behaviors and the farbtastic colorpicker
function initializeUI() {
	
	if ( !$.tr.isDOMReady || !$.tr.isIFrameReady ) {
		return;
	}
		
	
	var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
		
	//size the load mask and show the rest of the content after 3000ms
	setTimeout(function() {
		$( "#interface" ).css({
			"position": "static",
			"left": ""
		});
		$( "#load-mask" ).hide();
		$( "#welcome" ).dialog( "open" );
	}, 3000);
			
	var colors = [];

	//setting up farbtastic
	var f = $.farbtastic( "#colorpicker" );
	var p = $( "#picker" ).css( "opacity", 0.25 );
	var selected;
	$( ".colorwell" )
	  	.each(function() { 
	  		f.linkTo( this ); 
	  		$( this ).css( "opacity", 0.75 ); 
	  	})
	  	.focus(function() {
			if( selected ) {
		  		$( selected ).css( "opacity", 0.75 ).removeClass( "colorwell-selected" );
			}
			f.linkTo( this );
			p.css( "opacity", 1 );
			$( selected = this ).css( "opacity", 1 ).addClass( "colorwell-selected" );
	  	});
	
	resize();
	
	$(window).resize( resize );
	
	//sizing content to the right of the TR panel
	function resize() {
		var top_border = $( "#themeroller_mobile" ).css( "border-top-width" ).substring( 0, 1 );
		$( "#themeroller_mobile" ).height( $(window).height() - top_border );
		$( "#content" ).height( $(window).height() - $("#header-wrapper").outerHeight() - 3 );
	}
	
	//global array of color values in quickswatch colors for lightness/saturation adjustments
	var quickswatch = $( "#quickswatch" );
    quickswatch.find( ".color-drag:not(.disabled)" ).each(function() {
		colors.push( rgbtohex($(this).css("background-color")) );
	});

	//colorwell refers to the inputs with color values
	$( ".colorwell" ).focus(function() {
		colorwell = $(this);
		var pos = $( this ).offset();
		var name = $( this ).attr( "data-name" );
		if(name.indexOf( "shadow-color" ) == -1) {
			$( "#colorpicker" ).css({
				"position": "absolute", 
				"left": 40, 
				"top": pos.top + 21
			});
		} else {
			$( "#colorpicker" ).css({
				"position": "absolute", 
				"left": 100, 
				"top": pos.top + 21
			});
		}
		$( "#colorpicker" ).show();
	}).blur(function(e) {
		$( "#colorpicker" ).hide();
		colorwell = null;
	});
	
	//Inspector Radio behavior
	$( "#inspector_form" ).find( "div" ).click(function() {
		var other = $(this).siblings( "div" );
		$(this).addClass( "on" );
		other.removeClass( "on" );
	});
	
	//Keyboard shortcut for inspector radio
	$(document).keypress(function(e) {
		if( (e.ctrlKey || e.metaKey) && e.shiftKey && (e.which == 73 || e.which == 9) ) {
			e.preventDefault();
			if( $("#inspector_form .left").hasClass("on") ) {
				$( "iframe" ).contents().find( "#highlight" ).hide();
				$( "#inspector_form .left" ).removeClass( "on" );
				$( "#inspector_form .right" ).addClass( "on" );
			} else {
				$( "#inspector_form .left" ).addClass( "on" );
				$( "#inspector_form .right" ).removeClass( "on" );
			}
		}
	})

	// Accordion
	$( ".accordion" ).accordion({ 
		header: "h3", 
		active: false, 
		clearStyle: true, 
		collapsible: true 
	});

	// Tabs
	$( "#tabs" ).tabs({
		add: function( event, ui ) {
			$( ui.panel ).append( "&nbsp;" );
		}
	});

	// Slider
	$( ".slider" ).slider({ 
		max : 80, 
		value: 40 
	});

	//radius sliders has different range of values
	$( ".slider[data-type=radius]" ).slider("option", {
		max: 2,
		step: .1
	});
	
	//Lightness and Saturation sliders
	$( "#lightness_slider" ).slider({
		width: 100,
		max: 50,
		min: -40,
	});
	
	$( "#saturation_slider" ).slider({
		width: 100,
		value: 0,
		min: -100,
		max: 100,
	});
	
	$( "#saturation_slider" ).bind("slide", function() {
		var sat_val = $( this ).slider( "value" );
		var sat_percent = sat_val / 100;	
		if( sat_percent >= 0 ) {
			var sat_str = "+=";
		} else {
			var sat_str = "-=";
			sat_percent = sat_percent - (2 * sat_percent);
		}
		
		var lit_val = $( "#lightness_slider" ).slider( "value" );
		var lit_percent = lit_val / 100;	
		if( lit_percent >= 0 ) {
			var lit_str = "+=";
		} else {
			var lit_str = "-=";
			lit_percent = lit_percent - (2 * lit_percent);
		}
		
		
		for( var i = 1; i< colors.length; i++ ) {
			var orig = $.Color( colors[i] );
			quickswatch.find( ".color-drag:nth-child(" + (i + 1) + ")" )
				.css("background-color", orig.saturation(sat_str + sat_percent).lightness(lit_str + lit_percent) );
		}
	});
	
	$( "#lightness_slider" ).bind("slide", function() {
		var sat_val = $( "#saturation_slider" ).slider( "value" );
		var sat_percent = sat_val / 100;	
		if( sat_percent >= 0 ) {
			var sat_str = "+=";
		} else {
			var sat_str = "-=";
			sat_percent = sat_percent - (2 * sat_percent);
		}
		
		var lit_val = $( this ).slider( "value" );
		var lit_percent = lit_val / 100;	
		if( lit_percent >= 0 ) {
			var lit_str = "+=";
		} else {
			var lit_str = "-=";
			lit_percent = lit_percent - (2 * lit_percent);
		}
		
		for( var i = 1; i < colors.length; i++ ) {
			var orig = $.Color( colors[i] );
			quickswatch.find( ".color-drag:nth-child(" + (i + 1) + ")" )
				.css("background-color", orig.saturation(sat_str + sat_percent).lightness(lit_str + lit_percent) );
		}
	});
	
	
	
	function rgbtohex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
	
	function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
	
	$.tr.initializeThemeRoller();
	
}

$.tr.iframeLoadCallback = function()
{
	$.tr.isIFrameReady = true;
	initializeUI();
};

$(function() {
	$.tr.isDOMReady = true;
	initializeUI();
});