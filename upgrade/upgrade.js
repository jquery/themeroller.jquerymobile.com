(function( $, window, undefined ) {

$(function() {
	TR.initUpgrade();
});
	
TR.initUpgrade = function() {
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
            "Import": TR.upgradeTheme
        }
    });

	$( "#import-default" ).click(function(e) {
		e.preventDefault();
		
		$.ajax({
			url: "css/jqm.default.theme.css",
			dataType: "text",
			mimeType: "text/plain",
			success: function( data ) {
				$( "#load-css" ).val( data );
			}
		});
	});
}

TR.upgradeTheme = function() {
	var version = $( "#upgrade-to-version" ).val();
	
	$.ajax({
		url: "upgrade/css/" + version + "-theme.css",
		dataType: "text",
		success: function(css) {
			TR.undoLog.push( TR.styleBlock.text() );
			
			$( "#interface" ).css({
				position: "relative",
				left: "-9999px"
			});
			$( "#load-mask" ).height($(window).height()).width($(window).width() + 15).show();
			
			//takes in the imported CSS and puts values into styleArray
			TR.styleBlock.text($('#load-css').val());
			TR.initStyleArray();
			TR.correctNumberOfSwatches();
			
			//reads the target CSS file, adds/subtracts appropriate number of swatches and tokenizes it
			var swatchCount = TR.getNumberOfSwatches();
			TR.styleBlock.text( TR.upgradeNumberOfSwatches( css, swatchCount ) );
			TR.initStyleArray( "refresh" );
			
			//styleArray has correct values and tokens array has the appropriate stylesheet
			//so we write out
			TR.updateAllCSS( true );
			
			//close the import dialog
			$('#upload').dialog('close');
			
			//pass the theme in the post to the appropriate version
			TR.passThemeToVersion( version );
		}
	});
}

TR.passThemeToVersion = function( version ) {
	$( "body" ).append( "<form id=\"pass-theme\" style=\"display: none\" action=\"index.php\" method=\"post\"><input name=\"style\" value=\"" + encodeURI(TR.styleBlock.text()) + "\" /></form>" );
	$( "#pass-theme" ).submit();
}

TR.upgradeNumberOfSwatches = function( style, count ) {
	var diff = count - 3;
	if( diff > 0 ) {
		var start = style.search( /\/\* A.*\n-*\*\// );
        var end = style.search( /\/\* B.*\n-*\*\// );
		var swatch_a = style.substring( start, end );
		
		for( var i = 0; i < diff; i++) {
			var letter = String.fromCharCode( i + 100 );
	
			var temp_style_template = swatch_a.replace( /-a,/g, "-" + letter + "," ).replace( /-a\s/g, "-" + letter + " " )
				.replace( /{a-/g, "{" + letter + "-" ).replace( /\/\*\sA/, "/* " + letter.toUpperCase() );
			
			style = style.replace( /\/\*\sStructure\s/, temp_style_template + "\n\n/* Structure " );
		}
	} else if( diff < 0 ) {
		for( var i = Math.abs(diff); i > 0; i-- ) {
			var start_reg = new RegExp( "\\/\\* " + String.fromCharCode( i + 97 ).toUpperCase() + "\\s*\\n-*\\*\\/" ),
				end_reg = new RegExp( "\\/\\* Structure \\*\\/" ),
				start = style.search( start_reg ),
				end = style.search( end_reg );         

			style = style.substring( 0, start ) + style.substring( end, style.length );
		}
	}
	return style;
}

TR.getNumberOfSwatches = function() {
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
	
})( jQuery, window )