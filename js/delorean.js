(function( $, window, undefined ) {
	
Delorean = {};
window.Delorean = Delorean;

Delorean.init = function() {
	$( "#upload" ).dialog({
        autoOpen: false,
        modal: true,
        width: 800,
        height: 450,
		resizable: false,
		draggable: false,
        buttons: {
            "Cancel": function() { 
                $( "#upload" ).dialog( "close" ); 
            },
            "Import": function() {
				Delorean.travelTo( $( "#upgrade-to-version" ).val(), true );
			}
        }
    });

	$( "#import-default" ).click(function(e) {
		e.preventDefault();
		
		$.ajax({
			url: "jqm/" + TR.version + "/jqm.default.theme.css",
			dataType: "text",
			mimeType: "text/plain",
			success: function( data ) {
				$( "#load-css" ).val( data );
			}
		});
	});
	
	$( "#version-select ul li" ).click( function() {
		Delorean.travelTo( $( this ).attr( "data-version" ), false );
	})
}

Delorean.travelTo = function( version, importing ) {
	$.ajax({
		url: "jqm/" + version + "/jqm.starter.theme.css",
		dataType: "text",
		success: function( target ) {
			Delorean.merge( target, version, importing );
			if ( version != TR.version ) {
				Delorean.passTheme( version );
			} else {
				$( "#upload" ).dialog( "close" );
			}
		}
	});
}

Delorean.passTheme = function( version ) {
	var form = $( '<form style="display: none" action="?\
		ver=' + version + '" method="post"><input name="style" value="' + encodeURI( TR.styleBlock.text() ) + '" /></form>' );
	$( "body" ).append( form );
	form.submit();
}

//takes current theme and updates styleDict, takes target CSS file (version we are traveling to)
//and merges the two and writes out to styleBlock, ready for travel
Delorean.merge = function( css, version, importing ) {
	TR.undoLog.push( TR.styleBlock.text() );
	
	if( importing ) {	
		//takes in the imported CSS and puts values into styleArray
		TR.styleBlock.text($('#load-css').val());
		TR.initStyleArray();
		TR.correctNumberOfSwatches();
	}
	
	//reads the target CSS file, adds/subtracts appropriate number of swatches and tokenizes it
	var swatchCount = Delorean.getNumberOfSwatches();
	TR.styleBlock.text( Delorean.fixNumberOfSwatches( css, swatchCount ) );
	TR.initStyleArray( "refresh" );
	
	//styleArray has correct values and tokens array has the appropriate stylesheet
	//so we write out
	TR.updateAllCSS( true );
}

//matches the target CSS file to have the right number of swatches in the current theme
Delorean.fixNumberOfSwatches = function( style, count ) {
	var diff = count - 1;
	if( diff > 0 ) {
		var start = style.search( /\/\* A.*\n-*\*\// ),
        	end = style.search( /\/\* Structure /),
 			swatch_a = style.substring( start, end );
		
		for( var i = 0; i < diff; i++) {
			var letter = String.fromCharCode( i + 98 );
	
			var temp_style_template = swatch_a.replace( /-a,/g, "-" + letter + "," ).replace( /-a\s/g, "-" + letter + " " )
				.replace( /{a-/g, "{" + letter + "-" ).replace( /\/\*\sA/, "/* " + letter.toUpperCase() );
			
			style = style.replace( /\/\*\sStructure\s/, temp_style_template + "\n\n/* Structure " );
		}
	}
	return style;
}

//gets number of swatches in the current theme by enumerating dictionary keys in styleDict
Delorean.getNumberOfSwatches = function() {
	var count = 1;
	for( var i in TR.styleArray ) {
		var letter = i.split("-")[0];
		if( letter.length == 1 ) {
			var num = letter.charCodeAt(0) - 96;
			if ( num > count ) {
				count = num;
			}
		}
	}
	return count;
}
	
}) ( jQuery, window );