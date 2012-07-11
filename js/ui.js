/*
ThemeRoller's various jQuery UI elements and other plugins are initialized here. 
*/

$(function(){
	$( "#load-mask" ).height($(window).height()).width($(window).width() + 15);
});

TR.isDOMReady = false;
TR.isIFrameReady = false;
TR.panelReady = false;

TR.initializeUI = function() {
	
	if ( !TR.isDOMReady || !TR.isIFrameReady || !TR.panelReady ) {
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
		if(!TR.welcomed) {
			if( !$("#skip-welcome").length ) {
				$( "#welcome" ).dialog( "open" );
			}
			TR.welcomed = 1;
		}
		resize();
	}, 2500);
			
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
	
	
	$(window).resize( resize );
	
	//sizing content to the right of the TR panel
	function resize() {
		var top_border = $( "#tr_panel" ).css( "border-top-width" ).substring( 0, 1 ),
			toolbar_height = $( "#toolbar" ).outerHeight();
		$( "#tr_panel" ).height( $(window).height() - top_border - toolbar_height );
		$( "#content" ).height( $(window).height() - $("#header-wrapper").outerHeight() - 3 - toolbar_height );
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
	
	//colorwell refers to the inputs with color values
	$( ".colorwell-toggle" ).focus(function() {
		colorwell = $(this);
		if( colorwell.is(":hidden") ) {
			return;
		}
		var pos = $( this ).offset();
		var name = $( this ).attr( "data-name" );
		if(name.indexOf( "shadow-color" ) == -1) {
			$( "#colorpicker" ).css({
				"position": "absolute", 
				"left": pos.left, 
				"top": pos.top + 21
			});
		} else {
			$( "#colorpicker" ).css({
				"position": "absolute", 
				"left": pos.left, 
				"top": pos.top + 21
			});
		}
		$( "#colorpicker" ).show();
	}).blur(function(e) {
		$( "#colorpicker" ).hide();
		colorwell = null;
	});
	
	//Inspector Radio behavior
	$( "#inspector-button" ).click(function() {
		var $this = $( this ),
			active = $this.hasClass( "active" );
			
		if( !active ) {
			$this.addClass( "active" ).find( "img" ).attr( "src", "images/inspector-active.png" );
			$this.find( "strong" ).text( "on" );
		} else {
			$this.removeClass( "active" ).find( "img" ).attr( "src", "images/inspector.png" );
			$this.find( "strong" ).text( "off" );
		}
	});

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

  // Recent color dropper

	function processFarbChange( color ) {
		$( "#most-recent-colors input" ).val( color );

		TR.updateMostRecent( color );
	}

	$( "#recent-color-picker" ).click( function( evt ) {
		evt.preventDefault();
		var well = $( this ).parent().find( "input" ), pos = $(this).offset();

		$( this ).hide();
		well.show();
		well.focus();

		f.linkTo( processFarbChange );

		TR.addMostRecent( well.val() );

		event.preventDefault();
	});

	$( "#most-recent-colors .colorwell-toggle" ).blur(function() {
		var well = $("#most-recent-colors .colorwell-toggle");
		well.hide();
		$('#recent-color-picker').show();
	});
	
	function rgbtohex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
	
	function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
	
	TR.initThemeRoller();
}

TR.iframeLoadCallback = function()
{
	TR.isIFrameReady = true;
	TR.initializeUI();
};

$(function() {
	TR.isDOMReady = true;
	TR.initPanel();
});
