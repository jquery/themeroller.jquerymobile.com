//this file is used to initialize the jquery-ui behaviors and the farbtastic colorpicker
$(function(){
		
	//size the load mask and show the rest of the content after 3000ms
	$( "#load-mask" ).height($(window).height()).width($(window).width() + 15);
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
	
	//sizing content to the right of the TR panel
	var top_border = $( "#themeroller_mobile" ).css( "border-top-width" ).substring( 0, 1 );
	$( "#themeroller_mobile" ).height( $(window).height() - top_border );
	$( "#content" ).height( $(window).height() - $("#header-wrapper").outerHeight() - 3 );
	
	//global array of color values in quickswatch colors for lightness/saturation adjustments
	$( "#quickswatch .color-drag:not(.disabled)" ).each(function() {
		colors.push( $.tr.rgbtohex($(this).css("background-color")) );
	});

	//colorwell refers to the inputs with color values
	$( ".colorwell" ).focus(function() {
		$.tr.colorwell = $(this);
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
		$.tr.colorwell = null;
	});
	
	//Inspector Radio behavior
	$( "#inspector_form div" ).click(function() {
		var other = $(this).siblings( "div" );
		$(this).addClass( "on" );
		other.removeClass( "on" );
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
		
		
		for( var i = 0; i< colors.length; i++ ) {
			var orig = $.Color( colors[i] );
			$( "#quickswatch .color-drag:nth-child(" + (i + 1) + ")" )
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
		
		for( var i = 0; i < colors.length; i++ ) {
			var orig = $.Color( colors[i] );
			$( "#quickswatch .color-drag:nth-child(" + (i + 1) + ")" )
				.css("background-color", orig.saturation(sat_str + sat_percent).lightness(lit_str + lit_percent) );
		}
	});
	
});