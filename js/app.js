/**
 *
 * The main ThemeRoller JavaScript file. Handles pretty much everything
 *
 *
 * jQuery Mobile Framework : ThemeRoller
 * Copyright (c) jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * 
 * Originally created by Tyler Benziger: https://github.com/TylerBenziger
 *
 */

(function( $, window, undefined ) {
//Object that can be used across multiple files to reference certain functions
TR = {};
window.TR = TR;

TR.styleArray = [];
TR.tokens = {};
TR.undoLog = [];
TR.redoLog = [];
TR.version = null;

TR.showStartEnd = [];
TR.firstAdd = 1;
TR.welcomed = 0;
TR.tabCount = 3;

TR.alpha = [ "global", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
TR.num = { "global": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15, "p": 16, "q": 17, "r": 18, "s": 19, "t": 20, "u": 21, "v": 22, "w": 23, "x": 24, "y": 25, "z": 26 };

TR.timerID = 0;
TR.movingColor = 0;
TR.firstLoad = 1;

TR.hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//cleaning up a few classes and adding a few attributes so the 
//inspector works properly after jQuery Mobile has done its markup injection
TR.addInspectorAttributes = function( swatch ) {
    var slider = TR.iframe.find( "[name=slider][data-theme=" + swatch + "]" ).siblings( "div" ),
        select = TR.iframe.find( "select[data-theme=" + swatch + "]" ),
        btn = select.siblings( "a" ),
        radio = TR.iframe.find( ".ui-content" ).each(function() {
            $( this ).find( ".ui-radio:first span:first" ).removeClass( "ui-corner-top" );
        });
        
    slider.attr( "data-form", "ui-btn-down-" + swatch ).attr( "data-theme", swatch );
    slider.find( "a" ).attr( "data-form", "ui-btn-up-" + swatch ).attr( "data-theme", swatch );
    btn.attr( "data-theme", swatch ).attr( "data-form", "ui-btn-up-" + swatch );
    btn.find( ".ui-icon" ).attr( "data-form", "ui-icon" );
}

//adds a most-recent-color to the five right-most draggables in the quickswatch panel
TR.addMostRecent = function( color ) {
    var found = 0,
        most_recents = $( "#most-recent-colors .color-drag" );
    
    most_recents.each( function() {
        if( color == $(this).css("background-color") ) {
            found = 1;
        }
    });
    
    if( !found ) {
        var last = null;
        most_recents.each(function() {
            var $this = $( this ),
                temp = $this.css( "background-color" )
                last = last ? last : color;
            $this.css( "background-color", last );
            if( last != temp ) {
                $this.draggable( "enable" );
                $this.removeClass( "disabled" );
            }
            last = temp;
        });
    }
}
//updates the newest recent color. Used when adding a color with the color picker
TR.updateMostRecent = function( newColor ) {
    var found = 0,
        most_recent = $( "#most-recent-colors .color-drag:first" );

    if( most_recent.length ) {
        most_recent.css( "background-color", newColor );
    }
}

//adds some CSS, a tab panel, and a preview for the new swatch 
TR.addSwatch = function( new_style, duplicate ) {
    var duplicate = duplicate || null;
    $( ".delete-swatch-a" ).show();
    if( TR.tabCount < 28 ) {
        var next_tab = TR.tabCount + 1,
            lower = TR.alpha[TR.tabCount - 1],
            upper = lower.toUpperCase();
        
        //new_style flag is only set if styles have not been added to TR.styleArray
        //or CSS yet. correctNumberOfSwatches calles addSwatch with new_style=false
        //so this block is skipped
        if( new_style ) {
            TR.undoLog.push( TR.styleBlock.text() );
            TR.redoLog = [];

            //adding swatch to CSS
            var temp_css_template = TR.graySwatch.replace( /-a,/g, "-" + lower + "," )
                .replace( /-a:/g, "-" + lower + ":" ).replace( /-a\s/g, "-" + lower + " " )
                .replace( /\{a-/g, "{" + lower + "-" ).replace( /\/\*\sA/, "/* " + upper ),
                css = TR.styleBlock.text();
            if( duplicate ) {
                //if there is a swatch to be duplicated, we use the letter passed in to do our regex patterns
                var start_reg = new RegExp( "\\/\\*\\s" + duplicate.toUpperCase() + ".*\\n-*\\*\\/" ),
                    end_reg = new RegExp( "\\/\\*\\s" + TR.alpha[ TR.num[duplicate] + 1 ].toUpperCase() + ".*\\n-*\\*\\/" );
                
                if( css.search( end_reg ) == -1 ) {
                    end_reg = new RegExp( "\\/\\*\\sStructure " );
                }
                temp_css_template = css.substring( css.search( start_reg ), css.search( end_reg ) );

                var reg1 = new RegExp( "-" + duplicate + ",", "g" ),
                    reg2 = new RegExp( "-" + duplicate + "\\s", "g" ),
                    reg3 = new RegExp( "\\{" + duplicate + "-", "g" ),
                    reg4 = new RegExp( "-" + duplicate + ":", "g" ),
                    reg5 = new RegExp( "\\/\\*\\s" + duplicate.toUpperCase(), "g" );
                temp_css_template = temp_css_template.replace( reg1, "-" + lower + "," )
                    .replace( reg2, "-" + lower + " " )
                    .replace( reg3, "{" + lower + "-" )
                    .replace( reg4, "-" + lower + ":" )
                    .replace( reg5, "/* " + upper );
            }
            css = css.replace( /\/\*\sStructure\s/, temp_css_template + "\n\n/* Structure " );
            TR.styleBlock.text( css );
        }
        
        //giving the contents of the new tab
        var temp_panel_template = TR.panelTemplate.replace( /Swatch A/, "Swatch " + upper )
            .replace( /"a\-/g, "\"" + lower + "-" ).replace( /\-a"/g, "-" + lower + "\"" );
        
        $( "#tabs" ).tabs( "add", "#tab" + (TR.tabCount + 1), "+" )
            .find( "ul li a[href=#tab" + TR.tabCount + "]" ).text( upper );

        var newTabPanel = $( "#tab" + TR.tabCount );

        newTabPanel.html( temp_panel_template );
        
        //adding swatch to preview document
        var temp_swatch_template = TR.swatchTemplate.replace( /"a"/g, "\"" + lower + "\"" ).replace( />A<\/h1>/g, ">" + upper + "</h1>" )
            .replace( /-a\s/g, "-" + lower + " " ).replace( /-a\"/g, "-" + lower + "\"" );
        $( temp_swatch_template ).insertAfter( TR.iframe.find(".swatch:last") );
        
        var iframe_window = $( "iframe" )[0].contentWindow;
        //This is a bug in JQM. Header initialization is using a live pagecreate handler on the page
        //ideally we should be able to write iframe_window.$(".swatch:last").trigger("create");
        iframe_window.$( ".ui-page" ).trigger( "pagecreate" );
        
        //adding data-form attribute to slider
        TR.addInspectorAttributes( lower );
             
        //redefine the token array
        //not with refresh because we've only defined the CSS
        //let initStyleArray edit the styleArray
        TR.initStyleArray();

        TR.updateFormValues( newTabPanel );

        //binds all appropriate events for accordions and new tab
        TR.updateThemeRoller( TR.tabCount );
        
        //adjust the height of the add-swatch box
        var swatch_height = TR.iframe.find( ".swatch:last" ).outerHeight();
        TR.iframe.find( ".add-swatch" ).height( swatch_height );
        
        if( TR.firstAdd ) {
            //apply paging of the tabs
            $( "#tabs" ).tabs("paging", {
                cycle: true, 
                follow: true, 
                tabsPerPage: 0, 
                followOnSelect: true, 
                selectOnAdd: false
            });
            TR.firstAdd = 0;
        }
        
        TR.refreshIframe( TR.alpha[TR.tabCount - 1] );
        TR.iframe.find( "[data-role=dialog]" ).remove();
        
        //reconfigure binding of addSwatch event
        $( "[href=#tab" + TR.tabCount + "]" ).unbind( "click", TR.addSwatchEvent );
        
        $( "[href=#tab" + next_tab + "]" ).bind( "click", TR.addSwatchEvent );

        TR.tabCount++;
    }
}

//used for binding and unbinding to addSwatch
TR.addSwatchEvent = function(e) {
    e.preventDefault();
    TR.addSwatch( true );
}

//When a color is dropped this function applies a color to the element
//automatically detecting things like 
TR.applyColor = function( color, prefix ) {
    var color_arr = color.split( "" ),
        red = parseInt( (color_arr[1] + color_arr[2]), 16 ),
        green = parseInt( (color_arr[3] + color_arr[4]), 16 ),
        blue = parseInt( (color_arr[5] + color_arr[6]), 16 ),
        gray = TR.grayValue( color ),
        swatch = prefix.substr( 0, 1 ),
        element = prefix.substr( 2, prefix.length - 2 );
        
    element = prefix.split( "-" );
    element[0] = "";
    element = element.join( "" );
    
    //if we're on a button hover we call this same function with button down as element
    if( element == "bhover" ) {
        color = TR.percentColor( color, 1.15 );
        TR.applyColor( color, swatch + "-bdown");
    }
    //if we're on a button up we call same function with button hover
    //which then calls it with button down
    if( element == "bup" ) {
        TR.applyColor( color, swatch + "-bhover" );
    }
    //if we're on button down then the gradient gets flipped
    var start, end;
    if( element != "bdown" ) {
        start = TR.computeGradient(color, 50)[0];
        end = TR.computeGradient(color, 50)[1];
    } else {
        start = TR.computeGradient(color, 50)[1];
        end = TR.computeGradient(color, 50)[0];
    }
    if( element != "link" ) {
        //anything but a link has gradients and text color
        $( "input[data-name=" + prefix + "-background-color]" ).val( color ).css( "background-color", color );
        $( "input[data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
        $( "input[data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", start );
        $( ".slider[data-name=" + prefix + "-background-color]" ).slider( {value: 50} )
            .find( "a" ).css({"background": color, "border-color": color});
        TR.styleArray[prefix + "-background-start"] = start;
        TR.styleArray[prefix + "-background-end"] = end;
        TR.styleArray[prefix + "-background-color"] = color;

        //special border for content body elements
        if( element != "body" ) {
            $( "input[data-name=" + prefix + "-border]" ).val( color ).css( "background-color", color );
            TR.styleArray[prefix + "-border"] = color;
        } else {
            var border;
            if( gray > 90 ) {
                border = TR.percentColor( color, 0.55 );
            } else {
                border = TR.percentColor( color, 1.4 );
            }
            $( "input[data-name=" + prefix + "-border]" ).val( border ).css( "background-color", border );
            TR.styleArray[prefix + "-border"] = border;
        }

        //contrast calculation for text color
        if( gray > 150 ) {
            $( "input[data-name=" + prefix + "-color]" ).val( "#000000" ).css( "background-color", "#000000" );
            $( "input[data-name=" + prefix + "-shadow-color]" ).val( "#eeeeee" ).css( "background-color", "#eeeeee" );
            TR.styleArray[prefix + "-color"] = "#000000";
            TR.styleArray[prefix + "-shadow-color"] = "#eeeeee";
        } else {    
            $( "input[data-name=" + prefix + "-color]" ).val( "#ffffff" ).css( "background-color", "#ffffff" );
            $( "input[data-name=" + prefix + "-shadow-color]" ).val( "#444444" ).css( "background-color", "#444444" );
            TR.styleArray[prefix + "-color"] = "#ffffff";
            TR.styleArray[prefix + "-shadow-color"] = "#444444";
        }
    } else {
        //links are lighter on hover and darker once visited
        var lighter = TR.percentColor( color, 1.15 );
        var darker = TR.percentColor( color, 0.65 );
        TR.styleArray[swatch + "-body-link-color"] = color;
        TR.styleArray[swatch + "-body-link-active"] = color;
        TR.styleArray[swatch + "-body-link-hover"] = lighter;
        TR.styleArray[swatch + "-body-link-visited"] = darker;
        $( "input[data-name=" + swatch + "-body-link-color]" ).val( color ).css( "background-color", color );
        $( "input[data-name=" + swatch + "-body-link-active]" ).val( color ).css( "background-color", color );
        $( "input[data-name=" + swatch + "-body-link-hover]" ).val( darker ).css( "background-color", lighter );
        $( "input[data-name=" + swatch + "-body-link-visited]" ).val( lighter ).css( "background-color", darker );
    }

    //we've updated TR.styleArray now update the CSS
    //if it's a button, we don't call updateAllCSS until all three are updated in the styleArray
    if( element != "bdown" && element != "bhover" ) {
        TR.updateAllCSS();
    }
}

//pass in a color and a slider value and get back a tuple with start and end colors
//of a gradient - the slider value is a number between 0 and 100
//greater than 50 -> convex gradient, less than 50 -> concave
TR.computeGradient = function( color, slider_value ) {
    var color_arr = color.split( "" );

    var red = parseInt( (color_arr[1] + color_arr[2]), 16 );
    var green = parseInt( (color_arr[3] + color_arr[4]), 16 );
    var blue = parseInt( (color_arr[5] + color_arr[6]), 16 );

    var convex, red_start, green_start, blue_start, percent;
        
    if( slider_value >= 40 ) {
        convex = 1;
        percent = 1 + ( slider_value - 40 ) / 100;
    } else {
        convex = 0;
        percent = 1 + ( 40 - slider_value ) / 100;
    }
    if( percent * red > 255 ) {
        red_start = "FF";
    } else {
        red_start = TR.padNumber( Math.floor(percent * red).toString( 16 ), 2 );
    }
    if( percent * green > 255 ) {
        green_start = "FF";
    } else {
        green_start = TR.padNumber( Math.floor(percent * green).toString( 16 ), 2 );
    }
    if( percent * blue > 255 ) {
        blue_start = "FF";
    } else {
        blue_start = TR.padNumber( Math.floor(percent * blue).toString( 16 ), 2 );
    }

    if( convex ) {
        percent = ( 100 - (slider_value - 40) ) / 100;
    } else {
        percent = ( 100 - (40 - slider_value) ) / 100;
    }

    var red_end = TR.padNumber( Math.floor(percent * red).toString( 16 ), 2 );
    var green_end = TR.padNumber( Math.floor(percent * green).toString( 16 ), 2 );
    var blue_end = TR.padNumber( Math.floor(percent * blue).toString( 16 ), 2 );

    var start, end;
    if( convex ) {
        start = "#" + red_start + "" + green_start + "" + blue_start + "";
        end = "#" + red_end + "" + green_end + "" + blue_end + "";
    } else {
        start = "#" + red_end + "" + green_end + "" + blue_end + "";
        end = "#" + red_start + "" + green_start + "" + blue_start + "";
    }
    return [start, end];
}

//method used to calculate the number of swatches in the CSS and adjusts
//the number of tab panels in TR and the number of swatches in the preview
TR.correctNumberOfSwatches = function() {
    var style = TR.styleBlock.text();
    var matches = style.match( /\/\*\s[A-Z]\s*-*\*\//g );
    if( !matches ) {
        if(TR.firstLoad) {
            TR.firstLoad = 0;
            //initial load - the theme specified cannot be found on the server
            var error_message = $( "<h3>Invalid Theme</h3><p>Reminder: We can only store this theme URL on the server for 30 days, then it will be deleted. \
            Download a theme to keep a copy safe that you can import later.</p>" ).css( "color", "#f00" );
            $( "#welcome h1" ).after( error_message );
        
            //import default theme
            $.ajax({
                url: "jqm/" + TR.version + "/jqm.starter.theme.css",
                dataType: "text",
                mimeType: "text/plain",
                success: function( data ) {
                    $( "#upload textarea" ).val( data );
                    TR.styleBlock.text( data ); 
                    TR.correctNumberOfSwatches();
                    for ( var letter = TR.num[ "a" ]; letter < TR.num[ "c" ]; letter++ ) {
                        TR.addSwatch( true, "a" );
                    }
                }
            });
        } else {
            alert( "Invalid theme file. Please import unminified files only with all original CSS comments in place." );
            TR.undo();
        }
        //return early because the file is of the incorrect format
        return;
    } else {
        if(TR.firstLoad) {
            TR.firstLoad = 0;
        }
    }
    var swatch_counter = matches.length + 2;
    
    //start at A and go over current tabs and update form values
    for( var i = 1; i < TR.tabCount; i++ ) {
        TR.updateFormValues( $("#tab" + i) );
    }

    //add appropriate number of tabs to TR and swatches to preview
    for( ; TR.tabCount < swatch_counter && TR.tabCount < 28;  ) {
        TR.addSwatch( false );
    }
    
    //remove swatches from preview if necessary and tabs
    for( ; TR.tabCount > swatch_counter; TR.tabCount-- ) {
        TR.iframe.find( ".swatch:last" ).remove();
        
        $( "#tabs .ui-tabs-panel:last" ).attr( "id", "tab" + (TR.tabCount - 1) );
        $( "#tabs ul li a:contains(\"+\")" ).attr( "href", "#tab" + (TR.tabCount - 1) );
        if( $("#tabs").tabs("option", "selected") == (TR.tabCount - 2) ) {
            $( "#tabs" ).tabs( "select", 0 );
        }
        $( "#tabs" ).tabs( "remove", TR.tabCount - 2 );
    }
}

//using the TR.styleArray to successfully copy over data to appropriate swatches
//and then deleting last swatch so the one clicked appears to be deleted
TR.deleteSwatch = function( e, ele ) {
    e.preventDefault();
       var delete_class = ele.attr( "class" );
    var letter =  delete_class.substr( delete_class.length - 1, delete_class.length );
    var number = TR.num[letter];    

    //log before delete
    TR.undoLog.push( TR.styleBlock.text() );
    TR.redoLog = [];

    //moving content of the tabs back one starting at the one we're deleting
    for( var i = number + 1; i <= TR.tabCount - 2; i++ ) {
        var current_letter = TR.alpha[i];
        var current_number = TR.num[current_letter];
        var indices = [];
        for( var j in TR.styleArray ) {
            var reg = new RegExp( "^" + current_letter + "-.*" );
            if( j.match(reg) ) {
                indices.push( j.match(reg) );
            }
        }
        for( var k in indices ) {
            var index = indices[k] + "";
            var suffix = index.substr( 1, index.length - 1 );
            TR.styleArray[TR.alpha[current_number - 1] + suffix] = TR.styleArray[index];
            if( (current_number + 2) == TR.tabCount ) {
                delete( TR.styleArray[index] );
            }
        }

        TR.updateFormValues( $("#tab" + i) );
    }
    
    //deleting the last swatch's rules in the TR.styleArray
    var last_letter = TR.alpha[TR.tabCount - 2];
    var prefix = last_letter + "-";
    var newStyleArray = {};
    for( var i in TR.styleArray ) {
        if( i.indexOf(prefix) != 0 ) {
            newStyleArray[i] = TR.styleArray[i];
        }
    }
    TR.styleArray = newStyleArray;
    
    //delete the swatch's CSS from the file
    var css = TR.styleBlock.text(),
        start_reg = new RegExp ("\\/\\*\\s" + TR.alpha[TR.tabCount - 2].toUpperCase() + "\\s*\\n-*\\*\\/" ),
        end_reg = new RegExp( "\\/\\*\\sStructure \\*\\/" ),
        start = css.search( start_reg ),
        end = css.search( end_reg ),
        part1 = css.substring(0, start),
        part2 = css.substring(end, css.length);
    TR.styleBlock.text( part1 + part2 );
    
    TR.tabCount--;
    $( "#tabs" ).find( ".ui-tabs-panel:last" ).attr( "id", "tab" + TR.tabCount ).end()
        .find( "ul li a:contains(\"+\")" ).attr( "href", "#tab" + TR.tabCount );
    TR.iframe.find( ".swatch:last" ).remove();
    if( $("#tabs").tabs("option", "selected") == TR.tabCount - 1 ) {
        $( "#tabs" ).tabs( "select", TR.tabCount - 2 );
    }
    $( "#tabs" ).tabs( "remove", TR.tabCount - 1 );
    
    if( TR.tabCount == 3 ) {
        $( ".delete-swatch-a" ).hide();
    }
    
    var swatch_height = TR.iframe.find( ".swatch:last" ).outerHeight();
    TR.iframe.find( ".add-swatch" ).height(swatch_height);
        
    TR.initStyleArray( "refresh" );
    TR.updateAllCSS( true );
    
    return false;
}

//takes a hex color and computes the grayscale value
TR.grayValue = function( color ) {
    var color_arr = color.split( "" );
    
    var red = parseInt( ( color_arr[1] + color_arr[2] ), 16 );
    var green = parseInt( ( color_arr[3] + color_arr[4] ), 16 );
    var blue = parseInt( ( color_arr[5] + color_arr[6] ), 16 );

    return ( red + green + blue ) / 3;
}

TR.hex = function(x) {
    return isNaN(x) ? "00" : TR.hexDigits[(x - x % 16) / 16] + TR.hexDigits[x % 16];
}

//sets up bindings for the addSwatch method
TR.initAddSwatch = function() {
    var swatch_height = TR.iframe.find( ".swatch:last" ).outerHeight();
    TR.iframe.find( ".add-swatch" ).height(swatch_height);
    TR.iframe.find( "#add-swatch" ).bind( "click", TR.addSwatchEvent );
    $( "[href=#tab" + TR.tabCount + "]" ).bind( "click", TR.addSwatchEvent );
}

//binds TR controls to updateAllCSS
//also takes care of things like slider handle color, etc.
TR.initControls = function() {
    //Undo
    $( "#undo" ).click(function() {
        TR.undo();
    });
    
    //Redo
    $( "#redo" ).click(function() {
        TR.redo();
    })
    
    //Font Family
    $( "[data-type=font-family]" ).bind( "blur change keyup", function() {
        var name = $( this ).attr( "data-name" );
        TR.styleArray[name] = "font-family: " + this.value;
        TR.updateAllCSS();
    });

    //Link, Text Color, Text Shadow, Border Color
    $( "[data-type=link], [data-type=color], [data-type=text-shadow], [data-type=border]" )
        .bind( "blur change keyup", function(){
            TR.styleArray[$( this ).attr( "data-name" )] = this.value;
            TR.updateAllCSS();
    });

    //Corner Radius
    $( "input[data-type=radius]" ).bind("change keyup mouseup", function() {
        var $this = $( this );
        var name = $this.attr( "data-name" );
        var slider = $( ".slider[data-type=radius][data-name=" + name + "]" );
        var val = parseFloat( $this.val().replace(/[^0-9\.]/g, "") );
        slider.slider( "value", val );
        TR.styleArray[name] = $this.val();
        TR.updateAllCSS();
    });

    //Corner Radius
    $( ".slider[data-type=radius]" ).bind("change slide mouseup", function() {
        var $this = $( this );
        var name = $this.attr( "data-name" );
        var input = $( "input[data-type=radius][data-name=" + name + "]" );
        input.val( $this.slider("value") + "em" );
        TR.styleArray[name] = input.val();
        TR.updateAllCSS();
    });

    //Background Colors
    $( "[data-type=background]" ).bind( "blur slide mouseup change keyup", function(event, slider) {
        if( !TR.timerID ) {
            TR.timerID = setTimeout(function() {
                TR.timerID = 0;
            }, 100);

            var index = $( this ).attr( "data-name" ) + "";
            index = index.split( "-" );
            var prefix = index[0] + "-" + index[1];
            var color = $( "input[data-type=background][data-name|=" + prefix + "]" ).val();
            var slider_value = $( ".slider[data-type=background][data-name|=" + prefix + "]" ).slider( "value" );

            var start_end = TR.computeGradient(color, slider_value);
            var start = start_end[0];
            var end = start_end[1];

            $( "[data-type=start][data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
            $( "[data-type=end][data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", end );
            TR.styleArray[prefix + "-background-color"] = color;
            TR.styleArray[prefix + "-background-start"] = start;
            TR.styleArray[prefix + "-background-end"] = end;
            TR.updateAllCSS();
        }
    });
    
    //Start and End colors
    $( "[data-type=start] , [data-type=end]" ).bind( "blur mouseup change keyup", function() {
        var index = $( this ).attr( "data-name" ) + "";
        index = index.split( "-" );
        var prefix = index[0] + "-" + index[1];
        var start = $( "[data-type=start][data-name=" + prefix + "-background-start]" ).val();
        var end = $( "[data-type=end][data-name=" + prefix + "-background-end]" ).val();

        TR.styleArray[prefix + "-background-start"] = start;
        TR.styleArray[prefix + "-background-end"] = end;
        TR.updateAllCSS();
    });

    //Icon Set
    $( "[data-type=icon_set]" ).bind( "blur mouseup", function() {
        TR.styleArray[$( this ).attr( "data-name" )] = "url(images/icons-18-" + this.value + ".png)";
        TR.styleArray["global-large-icon-set"] = "url(images/icons-36-" + this.value + ".png)";
        TR.updateAllCSS();
    });

    //Box Shadow
    $( "[data-type=box_shadow]" ).bind( "blur change keyup", function() {
        var color_el = $( "[data-type=box_shadow]:first" ),
            opac_el = $( "[data-type=box_shadow]:eq(1)" ),
            color_arr = color_el.val().split( "" ),
            red = parseInt( (color_arr[1] + color_arr[2]), 16 ),
            green = parseInt( (color_arr[3] + color_arr[4]), 16 ),
            blue = parseInt( (color_arr[5] + color_arr[6]), 16 ),
            opacity = parseFloat( opac_el.val() ) / 100;
            
        if ( !opacity ) {
            opacity = 0;
        }
        
        TR.styleArray["global-box-shadow-color"] = "rgba(" + red + "," + green + "," + blue + "," + opacity + ")";  
        TR.updateAllCSS();
    });
    
    //Box Shadow
    $( "[data-type=box_shadow][data-name=global-box-shadow-size]" ).bind( "blur change keyup", function() {
        TR.styleArray["global-box-shadow-size"] = $(this).val();
        TR.updateAllCSS();
    });

    //Icon Disc
    $( "[data-type=icon_disc]" ).bind( "blur change keyup", function() {
        var elements = [];
        $( "[data-name=global-icon-disc]" ).each(function() {
            elements.push( this.value );
        });

        color_arr = elements[1].split( "" );
        var red = parseInt( (color_arr[1] + color_arr[2]), 16 );
        var green = parseInt( (color_arr[3] + color_arr[4]), 16 );
        var blue = parseInt( (color_arr[5] + color_arr[6]), 16 );

        if( elements[0] == "with_disc" ) {
            TR.styleArray["global-icon-color"] = elements[1];
            TR.styleArray["global-icon-disc"] = "rgba(" + red + "," + green + "," + blue + "," + ( parseFloat(elements[2]) / 100 ) + ")";   
            TR.styleArray["global-icon-shadow"] = "rgba(255,255,255,.4)";
        } else {
            TR.styleArray["global-icon-disc"] = "transparent";
            TR.styleArray["global-icon-shadow"] = "transparent";
        }
        TR.updateAllCSS();
    });

    //global more dictionary keeps track of which start-end fields are showing
    //i.e. more["a-bar-background"] = "showing" means that the next click of that .more should
    //hide that set of start-end fields
    $( ".more" ).click(function(e) {
        e.preventDefault();
        var index = $( this ).attr( "data-name" );
        if( TR.showStartEnd[index] ) {
            if( TR.showStartEnd[index] == "showing" ) {
                $( ".start-end[data-name=" + index + "]" ).hide( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "+" );
                TR.showStartEnd[index] = "hiding";
            } else {
                $( ".start-end[data-name=" + index + "]" ).show( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "-" );
                TR.showStartEnd[index] = "showing";
            }
        } else {
            $( ".start-end[data-name=" + index + "]" ).show( "slide", {
                direction: "up"
            }, 300 );
            $( this ).text( "-" );
            TR.showStartEnd[index] = "showing";
        }
        return false;
    });

    //change colorwell -> change bg color of its corresponding slider
    $( ".colorwell" ).bind( "change" , function() {
        var $this = $( this );
        $( ".slider[data-name=" + $this.attr("data-name") + "][data-type=" + $this.attr("data-type") + "] a").css({
            "background": $this.val(), 
            "border-color": $this.val()
        });
    });

    //initialize colors of sliders
    $( "input[data-type=background]" ).each(function() {
        var $this = $( this )
        $( ".slider[data-type=background][data-name=" + $this.attr("data-name") + "] a" ).css({
            "background": $this.val(), 
            "border-color": $this.val()
        });
    });

    $( "[class|=\"delete-swatch\"]" ).click( function(e) {
        TR.deleteSwatch( e, $(this) );
    });
    
    $( "[class|=\"duplicate-swatch\"]" ).click( function(e) {
        e.preventDefault();
        var letter = $(this).attr('class').split('-');
        letter = letter[letter.length - 1];
        TR.addSwatch( true, letter );
    })
}

//initializes the dialogs
TR.initDialogs = function() {
    var dialogObj = {
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
    };
    
    $( "#welcome" ).dialog( $.extend( {}, dialogObj, {
        width: 560,
        buttons: {
            "Get Rolling": function() {
                $( this ).dialog( "close" );
            }
        }
    }));
    
    $( "#share" ).dialog( $.extend( {}, dialogObj, {
        width: 800,
        buttons: {
            "Done": function() {
                $( this ).find( "input" ).val( "" );
                $( this ).dialog( "close" );
            }
        }
    }));
        
    $( "#importing" ).dialog( $.extend( {}, dialogObj, {
        height: 70
    }));

    $( "#help" ).dialog( $.extend( {}, dialogObj, {
        width: 700,
        height: 400,
        buttons: {
            "Close": function() {
                $( this ).dialog( "close" );
            }
        }
    }));
    
    $( "#download" ).dialog( $.extend( {}, dialogObj, {
        width: 850,
        buttons: {
            "Close": function() { 
                $( this ).dialog( "close" ); 
            },
            "Download Zip": function() {
                var theme_name = $( "input", this ).val();
                if( theme_name && theme_name.indexOf(" ") == -1 ) {
                    
                    $.ajax({
                        url: "./zip.php",
                        type: "POST",
                        data: "ver=" + TR.version + "&theme_name=" + $( "input", this ).val() + "&file=" + encodeURIComponent(TR.styleBlock.text()),
                        dataType: "text",
                        mimeType: "text/plain",
                        beforeSend: function() {
                            //loading gif here
                        },
                        success: function(response) {
                            window.location = response;
                            $( "#download" ).dialog( "close" );
                        }
                    });
                    
                } else {
                    alert( "Invalid theme name" );
                }
            }
        }
    }));

    $( ".dialog#newColor" ).dialog({
        autoOpen: false,
        width: 450,
        height: 260,
        resizable: false,
        draggable: false,
        buttons: {
            "Cancel": function() { 
                $( ".dialog#newColor" ).dialog( "close" ); 
            },
            "Submit": function() {
                var color = $( "#newColorInput" ).val().toLowerCase();
                color = /^{rgb|#}/.test( color ) ? color : "#" + color;
                if ( color.length) {
                    $.tr.addMostRecent( color, $( this ).data( "swatch" ) );
                }
                $( ".dialog#newColor" ).dialog( "close" );
            }
        },
        open: function( event, ui ) {
            var currentColor = $.tr.rgbtohex( $( this ).data( "swatch" ).css( "background-color" ) );
            $( "#newColorInput" )
                .val( currentColor )
                .next().css( "background-color", currentColor )
                .end()
                .keyup( function( event ) {
                    var input = $( this );
                    if ( event.keyCode === $.ui.keyCode.ENTER ) {
                        input.closest( ".ui-dialog" ).find( "button" ).eq( 1 ).click();
                    }
                    input.next().css( "background-color", input.val() );
                });
        }
    });
        
    
    //ajax call performed when share link is clicked
    $( "#share-button" ).click(function(e) {
        e.preventDefault();
        
        $( "#share" ).dialog( "open" );
        
        var post_data = "ver=" + TR.version + "&file=" + TR.styleBlock.text();
        
        $.ajax({
            type: "post",
            url: "share.php",
            data: post_data,
            beforeSend: function() {
                $( "#share .loading-text" ).show();
                $( "#share" ).dialog( "open" );
            },
            success: function( data ) {
                $( "#share .loading-text" ).hide();
                $( "#share input" ).val( data );
            }
        });
    });
    
    //help dialog
    $( "#help-button" ).click(function(e) {
        e.preventDefault();
        $( "#help" ).dialog( "open" );
    });
    
    //upload dialog
    $( "#import-button" ).click(function() {
        $( "#upload" ).dialog( "open" );
        return false;
    });

    //download dialog
    $( "#download-button" ).click(function() {
        $( "#download" ).dialog( "open" );          
        return false;
    });
    
    //removing the close button from ui-dialogs
    $( ".tr_widget .ui-dialog-titlebar-close" ).remove();
}

//initializes the draggable colors and the drop method
TR.initDraggableColors = function() {
    //draggable colors
    $( ".color-drag" ).draggable({
        appendTo: "body",
        revert: true,
        revertDuration: 200,
        opacity: 1,
        containment: "document",
        cursor: "move",
        helper: "clone",
        zIndex: 3000,
        iframeFix: true,
        drag: function() {
            TR.movingColor = 1;
        }
    });
    
    $( ".color-drag.disabled" ).draggable( "disable" );
    
    //droppable for colorwell
    $( ".colorwell" ).droppable({
        accept: ".color-drag",
        hoverClass: "hover",
        drop: function() {
            var $this = $( this );
            var color = $(".ui-draggable-dragging").css("background-color");
            if( color != "transparent" ) {
                color = TR.rgbtohex( color );
            }
            $( ".ui-draggable .ui-draggable-dragging" ).trigger( "drop" );
            $this.val( color ).css( "background-color", color );
            $this.trigger( "change" );
        }
    });
    
    //large mouseup event detects if the user is dragging a color
    //if so it runs throught the dom to see if the mouse position is above
    //an acceptable element, if so it calls applyColor on that element
    $(document).mouseup(function(e) {
        var classtokey = {
            ".ui-bar-" : "-bar",
            ".ui-body-" : "-body",
            ".ui-btn-up-": "-bup",
            ".ui-link": "-link",
            ".ui-btn-active": "-active"
        }

        //different alpha array - no global
        var alphabet = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];

        var droppables = [ ".ui-btn-up-", ".ui-bar-", ".ui-body-" ];
        
        if(TR.movingColor) {
            TR.movingColor = 0;
            var frame_offset = $( "iframe" ).offset();
            var el_offset = TR.iframe.find( ".ui-bar-a" ).offset();
            
            var element = null;
            var el_class = "";
            //loop through possible classes and if mouse is above one,
            //end the loop (order is based on precedence)
            for( var i = 0; i < droppables.length; i++ ) {
                for( var j = 0; j < alphabet.length; j++ ) {
                    TR.iframe.find( droppables[i] + alphabet[j] ).each(function() {
                        var $this = $( this );
                        var top = frame_offset.top + $this.offset().top - TR.iframe.scrollTop(), bottom = top + $this.outerHeight(),
                            left = frame_offset.left + $this.offset().left, right = left + $this.outerWidth();
                        if( e.pageX <= right && e.pageX >= left && e.pageY <= bottom && e.pageY >= top ) {
                            el_class = droppables[i] + alphabet[j];
                            element = $this;
                            return false;
                        }
                    });
                    if( element ) {
                        break;
                    }
                }
                if( element ) {
                    break;
                }
            }
            //another loop to check if over a link or the active state
            TR.iframe.find( ".ui-link, .ui-btn-active" ).each(function() {
                var $this = $( this );
                var top = frame_offset.top + $this.offset().top - TR.iframe.scrollTop(), bottom = top + $this.outerHeight(),
                    left = frame_offset.left + $this.offset().left, right = left + $this.outerWidth();
                if( e.pageX <= right && e.pageX >= left && e.pageY <= bottom && e.pageY >= top ) {
                    if( $this.hasClass("ui-btn-active") ) {
                        el_class = ".ui-btn-active";
                    } else {
                        el_class = ".ui-link";
                    }
                    element = $this;
                    return false;
                }
            });
            if( !element ) {
                //if no acceptable element was found, drop the color
                $( ".ui-draggable .ui-draggable-dragging" ).trigger( "drop" );
            } else {
                //else apply the color and select the element in the panel
                var swatch = element.attr( "data-theme" );
                if( el_class == ".ui-btn-active" ) {
                    swatch = "global";
                }
                if( el_class.indexOf(".ui-bar") != -1 ) {
                    swatch = element.attr( "data-swatch" );
                }
                var color = $( ".color-drag.ui-draggable-dragging" ).css( "background-color" ) || $( ".kuler-color.ui-draggable-dragging" ).css( "background-color" );
                if( color != "transparent" ) {
                    color = TR.rgbtohex( color );
                }
            
                for( var i in classtokey ) {
                    if( el_class.indexOf(i) != -1 ) {
                        TR.applyColor( color, swatch + classtokey[i] );
                        break;
                    }
                }
                                
                TR.selectElement(element);
    
                //store color in most recent colors
                var color = element.css("background-color");
                TR.addMostRecent( color );
            }
        }
        
    });

    //triggering change on current colorwell forces the update of the css as well as
    //the change in background of the slider
    $( "#colorpicker" ).bind( "mousemove", function() {
        $( ".colorwell[data-name=" + $("*:focus").attr("data-name") + "]" ).trigger( "change" );
    });
}

//intialize mouseover and click events for Inspector
TR.initInspector = function() {
    //click on an element with inspector-on and select element in panel
    TR.iframe.find( "[data-form]" ).mouseup(function(e) {
        if( $("#inspector-button").hasClass("active") ) {
            e.stopPropagation();
            TR.selectElement( $(this) );        
            TR.iframe.find( "#highlight" ).show();
        }
    });
    
    //highlight moves as you mouseover things
    TR.iframe.find( "[data-form]" ).bind( "mouseover", function() {
        var $this = $( this );
        if( $("#inspector-button").hasClass("active") ) {
            var left = $this.offset().left, top = $this.offset().top,
                width = $this.outerWidth(), height = $this.outerHeight();
            
            var parent = this;
            
            TR.iframe.find( "#highlight" ).mousemove(function(e) { 
                var highlight = $( this );
                $( "[data-form]", parent ).each(function() {
                    var $form = $( this ),
                        left = $form.offset().left, top = $form.offset().top,
                        width = $form.outerWidth(), height = $form.outerHeight(),
                        right = left + width, bottom = top + height;

                    if( e.pageX <= right && e.pageX >= left && e.pageY <= bottom && e.pageY >= top ) {
                        highlight.css({
                            "z-index": 20, 
                            "position": "absolute", 
                            "top": ( top - 3 ) + "px", 
                            "left": ( left - 3 ) + "px", 
                            "width": width + "px", 
                            "height": height + "px", 
                            "border": "3px solid #0cc"
                        }).show();
                    }
                });
            });
            
            $( "iframe" ).contents().find( "#highlight" ).css({
                "z-index": 20, 
                "position": "absolute", 
                "top": (top-3) + "px", 
                "left": (left-3) + "px", 
                "width": width + "px", 
                "height": + height + "px", 
                "border": "3px solid #0cc"
            }).show();
        }
    });
    
    TR.iframe.find( "#highlight" ).mousedown(function() {
        if( $("#inspector-button").hasClass("active") ) {
            $( this ).css( "z-index", -1 );
        }
    });
    
    TR.iframe.bind( "mouseleave", function() {
        TR.iframe.find( "#highlight" ).hide();
        TR.iframe.find( "#highlight" ).unbind( "mousemove" );
    });
}

//initialize graySwatch CSS template for a new blank swatch
TR.initGraySwatch = function() {
    var css = TR.styleBlock.text(),
        start_reg = new RegExp( "\\/\\*\\sA.*\\n-*\\*\\/" ),
        end_reg = new RegExp( "\\/\\*\\sStructure " );

    TR.graySwatch = css.substring( css.search( start_reg ), css.search( end_reg ) );
}

//initStyleArray is used to initialize the array of tokens and the TR.styleArray
//if the refresh flag is passed it refreshes the token array and does not initialize the TR.styleArray
TR.initStyleArray = function( refresh ) {
    TR.tokens = [];
    refresh = refresh || "fresh";

    //if we're not refreshing the styleArray
    //we start from scratch
    if( refresh != "refresh" ) {
        TR.styleArray = [];
    }

    var style = TR.styleBlock.text();
    escaped_style = style.replace( /\n/g, "%0A" );
    escaped_style = escaped_style.replace( /\t/g, "%09" );
    
    var reg = new RegExp( "(?:font-family:)[^/\\*]+/\\*{[^\\*/]*}\\*/|\\s*\\S*\\s*/\\*{[^\\*/]*}\\*/" ),
        reference = "",
        length = 0,
        index = -1,
        i = 0;
    
    while( style.length > 0 ) {
        var temp = reg.exec( style ) + "";
        length = temp.length;
        reference = /{.*}/.exec( temp ) + "";
        reference = reference.substr( 1,reference.length-2 );
        index = style.search( reg );
        if( index != -1 ) {
            TR.tokens[i++] = {
                value: style.substr( 0, index ), 
                type: "string"
            };
            TR.tokens[i++] = {
                value: style.substr( index, length ).trim(), 
                type: "placeholder", 
                ref: reference
            };
            //update TR.styleArray
            if( refresh != "refresh" ) {
                TR.styleArray[reference] = TR.tokens[i-1].value.replace( /\/\*.*\*\//, "" ).trim();
            }
            //cut off string and continue
            style = style.substring( index+length ); 
        } else {
            TR.tokens[i++] = {
                value: style,
                type: "string"
            };
            style = "";
        }
        
    }
}

//first initialization method called when the DOM and the iframe are both loaded
//defines globals like TR.styleArray and TR.iframe - also calls other initialization methods
TR.initThemeRoller = function() {
    TR.iframe = $( "iframe" ).contents();

    //#style is where the initial CSS file is put
    //copy it to #styleblock so its in the scope of the iframe
    TR.styleBlock = TR.iframe.find( "#styleblock" );
    TR.styleBlock.text( $("#style").text() );
    
    //store current version and preselect it in the import dropdown
    TR.version = $( "#version" ).text();
    $( "#upgrade-to-version" ).val( TR.version );

    //Are we starting with blank starter theme or an imported one?
    TR.importedStyle = !!$( "#imported-style" ).text();

    //adding attributes to elements in the preview to make them compatible
    //with the inspector
    var starting_swatches = ["a", "b", "c"];
    for( var i = 0; i < 3; i++ ) {
        TR.addInspectorAttributes( starting_swatches[i] );
    }
    
    //remove ui-body-c class so iframe looks ok
    TR.iframe.find( "[data-role=page]" ).removeClass( "ui-body-c" );
    TR.iframe.find( "[data-role=dialog]" ).remove();
    
    //initialize templates for adding swatches later
    TR.panelTemplate = $( "#tab2" ).html();
    if ( TR.version.indexOf( "1.3" ) > -1 ) {
      TR.swatchTemplate = "<div class=\"preview ui-shadow swatch\"> <div class=\"ui-header ui-bar-a\" data-swatch=\"a\" data-theme=\"a\" data-form=\"ui-bar-a\" data-role=\"header\" role=\"banner\">       <a class=\"ui-btn-left ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"home\" title=\" Home \">           <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Home </span>               <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-home ui-icon-shadow\"></span>           </span>     </a>        <h1 class=\"ui-title\" tabindex=\"0\" role=\"heading\" aria-level=\"1\">A</h1>      <a class=\"ui-btn-right ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"grid\" title=\" Navigation \">            <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Navigation </span>             <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-grid ui-icon-shadow\"></span>           </span>     </a>    </div>      <div class=\"ui-content ui-body-a\" data-theme=\"a\" data-form=\"ui-body-a\" data-role=\"content\" role=\"main\">           <p>         Sample text and <a class=\"ui-link\" data-form=\"ui-body-a\" href=\"#\" data-theme=\"a\">links</a>.     </p>                <ul data-role=\"listview\" data-inset=\"true\">           <li data-role=\"list-divider\" data-swatch=\"a\" data-theme=\"a\" data-form=\"ui-bar-a\">List Header</li>        <li data-form=\"ui-btn-up-a\">Read-only list item</li>        <li data-form=\"ui-btn-up-a\"><a href=\"#\">Linked list item</a></li>     </ul>     <div data-role=\"fieldcontain\">           <fieldset data-role=\"controlgroup\">           <input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-1-a\" value=\"choice-1\" checked=\"checked\" />             <label for=\"radio-choice-1-a\" data-form=\"ui-btn-up-a\">Radio</label>              <input type=\"checkbox\" name=\"checkbox-a\" id=\"checkbox-a\" checked=\"checked\" />             <label for=\"checkbox-a\" data-form=\"ui-btn-up-a\">Checkbox</label>                                </fieldset>     </div>      <div data-role=\"fieldcontain\">            <fieldset data-role=\"controlgroup\" data-type=\"horizontal\">              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-a-a\" value=\"list\" checked=\"checked\"/>              <label for=\"radio-view-a-a\" data-form=\"ui-btn-up-a\">On</label>              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-b-a\" value=\"grid\"  />                <label for=\"radio-view-b-a\" data-form=\"ui-btn-up-a\">Off</label>             </fieldset>         </div>              <div data-role=\"fieldcontain\">            <select name=\"select-choice-1\" id=\"select-choice-1\" data-native-menu=\"false\" data-theme=\"a\" data-form=\"ui-btn-up-a\">              <option value=\"standard\">Option 1</option>                <option value=\"rush\">Option 2</option>                <option value=\"express\">Option 3</option>             <option value=\"overnight\">Option 4</option>           </select>       </div>              <input type=\"text\" value=\"Text Input\" class=\"input\" data-form=\"ui-body-a\" />                <div data-role=\"fieldcontain\">            <input type=\"range\" name=\"slider\" value=\"50\" min=\"0\" max=\"100\" data-form=\"ui-body-a\" data-theme=\"a\" data-highlight=\"true\" />        </div>              <button data-icon=\"star\" data-theme=\"a\" data-form=\"ui-btn-up-a\">Button</button>   </div></div>";
    } else if ( TR.version.indexOf( "1.2" ) > -1 ) {
      TR.swatchTemplate = "<div class=\"preview ui-shadow swatch\"> <div class=\"ui-header ui-bar-a\" data-swatch=\"a\" data-theme=\"a\" data-form=\"ui-bar-a\" data-role=\"header\" role=\"banner\">       <a class=\"ui-btn-left ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"home\" title=\" Home \">           <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Home </span>               <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-home ui-icon-shadow\"></span>           </span>     </a>        <h1 class=\"ui-title\" tabindex=\"0\" role=\"heading\" aria-level=\"1\">A</h1>      <a class=\"ui-btn-right ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"grid\" title=\" Navigation \">            <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Navigation </span>             <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-grid ui-icon-shadow\"></span>           </span>     </a>    </div>      <div class=\"ui-content ui-body-a\" data-theme=\"a\" data-form=\"ui-body-a\" data-role=\"content\" role=\"main\">           <p>         Sample text and <a class=\"ui-link\" data-form=\"ui-body-a\" href=\"#\" data-theme=\"a\">links</a>.     </p>                <div data-role=\"fieldcontain\" class=\"ui-listview-inset\">            <fieldset data-role=\"controlgroup\">           <li data-swatch=\"a\" class=\"ui-li ui-li-divider ui-btn ui-bar-a ui-corner-top\" data-role=\"list-divider\" role=\"\" data-form=\"ui-bar-a\">List Header</li>        <li class=\"ui-li ui-li-static ui-btn-up-a\" data-form=\"ui-btn-up-a\" data-theme=\"a\">Read-only list item</li>                      <input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-1-a\" value=\"choice-1\" checked=\"checked\" />             <label for=\"radio-choice-1-a\" data-form=\"ui-btn-up-a\" class=\"ui-corner-none\">Radio 1</label>              <input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-2-a\" value=\"choice-2\" />             <label for=\"radio-choice-2-a\" data-form=\"ui-btn-up-a\">Radio 2</label>               <input type=\"checkbox\" name=\"checkbox-a\" id=\"checkbox-a\" class=\"custom\" checked=\"checked\" />              <label for=\"checkbox-a\" data-form=\"ui-btn-up-a\">Checkbox</label>                                </fieldset>     </div>      <div data-role=\"fieldcontain\">            <fieldset data-role=\"controlgroup\" data-type=\"horizontal\">              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-a-a\" value=\"list\" checked=\"checked\"/>              <label for=\"radio-view-a-a\" data-form=\"ui-btn-up-a\">On</label>              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-b-a\" value=\"grid\"  />                <label for=\"radio-view-b-a\" data-form=\"ui-btn-up-a\">Off</label>             </fieldset>         </div>              <div data-role=\"fieldcontain\">            <select name=\"select-choice-1\" id=\"select-choice-1\" data-native-menu=\"false\" data-theme=\"a\" data-form=\"ui-btn-up-a\">              <option value=\"standard\">Option 1</option>                <option value=\"rush\">Option 2</option>                <option value=\"express\">Option 3</option>             <option value=\"overnight\">Option 4</option>           </select>       </div>              <input type=\"text\" value=\"Text Input\" class=\"input\" data-form=\"ui-body-a\" />                <div data-role=\"fieldcontain\">            <input type=\"range\" name=\"slider\" value=\"50\" min=\"0\" max=\"100\" data-form=\"ui-body-a\" data-theme=\"a\" data-highlight=\"true\" />        </div>              <button data-icon=\"star\" data-theme=\"a\" data-form=\"ui-btn-up-a\">Button</button>   </div></div>";
    } else {
      TR.swatchTemplate = "<div class=\"preview ui-shadow swatch\"> <div class=\"ui-header ui-bar-a\" data-swatch=\"a\" data-theme=\"a\" data-form=\"ui-bar-a\" data-role=\"header\" role=\"banner\">       <a class=\"ui-btn-left ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"home\" title=\" Home \">           <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Home </span>               <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-home ui-icon-shadow\"></span>           </span>     </a>        <h1 class=\"ui-title\" tabindex=\"0\" role=\"heading\" aria-level=\"1\">A</h1>      <a class=\"ui-btn-right ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"grid\" title=\" Navigation \">            <span class=\"ui-btn-inner ui-btn-corner-all\">             <span class=\"ui-btn-text\"> Navigation </span>             <span data-form=\"ui-icon\" class=\"ui-icon ui-icon-grid ui-icon-shadow\"></span>           </span>     </a>    </div>      <div class=\"ui-content ui-body-a\" data-theme=\"a\" data-form=\"ui-body-a\" data-role=\"content\" role=\"main\">           <p>         Sample text and <a class=\"ui-link\" data-form=\"ui-body-a\" href=\"#\" data-theme=\"a\">links</a>.     </p>                <div data-role=\"fieldcontain\">            <fieldset data-role=\"controlgroup\">           <li data-swatch=\"a\" class=\"ui-li ui-li-divider ui-btn ui-bar-a ui-corner-top\" data-role=\"list-divider\" role=\"\" data-form=\"ui-bar-a\">List Header</li>                      <input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-1-a\" value=\"choice-1\" checked=\"checked\" />             <label for=\"radio-choice-1-a\" data-form=\"ui-btn-up-a\" class=\"ui-corner-none\">Radio 1</label>              <input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-2-a\" value=\"choice-2\" />             <label for=\"radio-choice-2-a\" data-form=\"ui-btn-up-a\">Radio 2</label>               <input type=\"checkbox\" name=\"checkbox-a\" id=\"checkbox-a\" class=\"custom\" checked=\"checked\" />              <label for=\"checkbox-a\" data-form=\"ui-btn-up-a\">Checkbox</label>                                </fieldset>     </div>      <div data-role=\"fieldcontain\">            <fieldset data-role=\"controlgroup\" data-type=\"horizontal\">              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-a-a\" value=\"list\" checked=\"checked\"/>              <label for=\"radio-view-a-a\" data-form=\"ui-btn-up-a\">On</label>              <input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-b-a\" value=\"grid\"  />                <label for=\"radio-view-b-a\" data-form=\"ui-btn-up-a\">Off</label>             </fieldset>         </div>              <div data-role=\"fieldcontain\">            <select name=\"select-choice-1\" id=\"select-choice-1\" data-native-menu=\"false\" data-theme=\"a\" data-form=\"ui-btn-up-a\">              <option value=\"standard\">Option 1</option>                <option value=\"rush\">Option 2</option>                <option value=\"express\">Option 3</option>             <option value=\"overnight\">Option 4</option>           </select>       </div>              <input type=\"text\" value=\"Text Input\" class=\"input\" data-form=\"ui-body-a\" />                <div data-role=\"fieldcontain\">            <input type=\"range\" name=\"slider\" value=\"50\" min=\"0\" max=\"100\" data-form=\"ui-body-a\" data-theme=\"a\" data-highlight=\"true\" />        </div>              <button data-icon=\"star\" data-theme=\"a\" data-form=\"ui-btn-up-a\">Button</button>   </div></div>";
    }
    TR.panelTemplate = $( "#tab2" ).html();
    
    //call initialization methods
    TR.initGraySwatch();
    TR.initAddSwatch();
    TR.initInspector();
    TR.initControls();
    TR.initDialogs();
    TR.initDraggableColors();
    TR.initStyleArray();
    TR.correctNumberOfSwatches();
    TR.initVersioning();
    
    if ( !TR.importedStyle ) {
        //start the app out with 3 swatches A-C default starter style only has 1
        for ( var letter = TR.num[ "a" ]; letter < TR.num[ "c" ]; letter++ ) {
            TR.addSwatch( true );
        }
    }
}

//pad a string with zeroes to a certain length
TR.padNumber = function( n, len ) {
    var str = '' + n;
    while (str.length < len) {
        str = '0' + str;
    }
    return str;
}

//takes in a hex color and a percentage and returns a lighter or darker shade of the color
TR.percentColor = function( color, percent ) {
    var color_arr = color.split( "" );

    var red = parseInt( ( color_arr[1] + color_arr[2] ), 16 );
    var green = parseInt( ( color_arr[3] + color_arr[4] ), 16 );
    var blue = parseInt( ( color_arr[5] + color_arr[6] ), 16 );
    if( percent > 1 ) {
        if( red == 0 ) {
            red = 60;
        }
        if( green == 0 ) {
            green = 60;
        }
        if( blue == 0 ) {
            blue = 60;
        }
    }
    if( red * percent < 255 && red * percent > 0 ) {
        red = TR.padNumber( Math.floor( red * percent ).toString( 16 ), 2 );
    } else {
        if( red * percent >= 255 ) {
            red = "FF";
        } else {
            red = "00";
        }
    }
    if( green * percent < 255 && green * percent > 0 ) {
        green = TR.padNumber( Math.floor( green * percent ).toString( 16 ), 2 );
    } else {
        if( green * percent >= 255 ) {
            green = "FF";
        } else {
            green = "00";
        }
    }
    if( blue * percent < 255 && blue * percent > 0 ) {
        blue = TR.padNumber( Math.floor( blue * percent ).toString( 16 ), 2 );
    } else {
        if( blue * percent >= 255 ) {
            blue = "FF";
        } else {
            blue = "00";
        }
    }
    
    return "#" + red + "" + green + "" + blue + "";
}

//updates Inspector behaviors in the iframe for a newly added swatch
TR.refreshIframe = function( swatch ) { 
    //click behavior for inspector
    TR.iframe.find( ".ui-bar-" + swatch + ", " + ".ui-body-" + swatch + ", .ui-bar-" + swatch + " [data-form], .ui-body-" + swatch + " [data-form]" ).mouseup(function(e) {
        if( $("#inspector-button").hasClass("active") ) {
            e.stopPropagation();
            //apply attributes to slider of the new swatch
                    
            var data_theme = $( this ).attr( "data-theme" );
            var form = $( this ).attr( "data-form" );
            
            if(!data_theme) {
                data_theme = form.split( "-" );
                data_theme = data_theme[data_theme.length - 1];
            }
            
            if( $(this).hasClass("ui-radio-on") ) {
                data_theme = "global";
                form = "ui-btn-active";
            }
            if( form == "ui-link" ) {
                data_theme = "global";
            }
            if( form == "ui-icon" ) {
                data_theme = "global";
            }
            
            $( "#tabs" ).tabs( "select", TR.num[data_theme] );  
            
            setTimeout(function() {
                $( "#tab" + (TR.num[data_theme] + 1) + " .accordion" ).each(function() {
                    if( $(this).attr("data-form") == form ) {
                        if( $(this).accordion("option", "active") === false ) {
                            $( this ).accordion( "activate", 0 );
                        }
                    } else {
                        if( $(this).accordion("option", "active") !== false ) {
                            $( this ).accordion( "activate", false );
                        }
                    }
                });
            }, 200);
                    
            TR.iframe.find( "#highlight" ).show();
        }
    });
    
    //bind hover behavior for inspector
    TR.iframe.find( "[data-form$=-" + swatch + "]" ).bind( "mouseover", function() {
        if( $("#inspector-button").hasClass("active") ) {
            var left = $( this ).offset().left;
            var top = $( this ).offset().top;
            var width = $( this ).outerWidth();
            var height = $( this ).outerHeight();
            
            var parent = this;
            
            TR.iframe.find( "#highlight" ).mousemove(function(e) {
                var highlight = this;
                $( "[data-form]", parent ).each(function() {
                    var left = $( this ).offset().left;
                    var top = $( this ).offset().top;
                    var width = $( this ).outerWidth();
                    var height = $( this ).outerHeight();
                    var right = left + width;
                    var bottom = top + height;
                    if( e.pageX <= right && e.pageX >= left && e.pageY <= bottom && e.pageY >= top ) {
                        $( highlight ).css({
                            "z-index": 20, 
                            "position": "absolute", 
                            "top": (top - 3) + "px", 
                            "left": (left - 3) + "px", 
                            "width": width + "px", 
                            "height": height + "px", 
                            "border": "3px solid #0cc"
                        }).show();
                    }
                });
                
            });
            
            TR.iframe.find( "#highlight" ).css({
                "z-index": 20, 
                "position": "absolute", 
                "top": (top - 3) + "px", 
                "left": (left - 3) + "px", 
                "width": width + "px", 
                "height": height + "px", 
                "border": "3px solid #0cc"
            }).show();
        }
    });
}

//Function to convert hex format to a rgba color
TR.rgbatohex = function(rgba) {
    rgba = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    return "#" + TR.hex(rgba[1]) + TR.hex(rgba[2]) + TR.hex(rgba[3]);
}

//Function to get opacity from rgba
TR.rgbaOpacity = function(rgba) {
    rgba = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    return rgba[4];
}

//Function to convert hex format to a rgb color
TR.rgbtohex = function(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + TR.hex(rgb[1]) + TR.hex(rgb[2]) + TR.hex(rgb[3]);
}

//function used to open a specific accordion
//the element passed in is one selected by the incpector or when dropping a color
TR.selectElement = function( element ) {
    var data_theme = element.attr( "data-theme" );
    var form = element.attr( "data-form" );
    
    if( !form ) {
        return;
    }
    
    if( !data_theme ) {
        data_theme = form.split( "-" );
        data_theme = data_theme[data_theme.length - 1];
    }

    if( element.hasClass("ui-btn-active") ) {
        data_theme = "global";
        form = "ui-btn-active";
    }
    if( form == "ui-link" ) {
        data_theme = "global";
    }
    if( form == "ui-icon" ) {
        data_theme = "global";
    }

    $( "#tabs" ).tabs( "select", TR.num[data_theme] );  
    
    setTimeout(function() {
        $( "#tab" + (TR.num[data_theme]+1) ).find( ".accordion" ).each(function() {
            if( $(this).attr("data-form") == form ) {
                if( $(this).accordion("option", "active" ) === false) {
                    $( this ).accordion( "activate", 0 );
                }
            } else if( $(this).accordion("option", "active") !== false ) {
                $( this ).accordion( "activate", false );
            }
        });
    }, 200);
}

//on undo, backup CSS before the undo and push onto the redoLog
//apply previous CSS from undoLog and reinit
TR.undo = function() {
    var style = TR.undoLog.pop();
    if( style ) {
        TR.redoLog.push( TR.styleBlock.text() );
        TR.styleBlock.text( style );
        TR.initStyleArray();
        TR.correctNumberOfSwatches();
    }
}

//on redo, backup CSS before the redo and push onto the undoLog
//apply last action's CSS from redoLog and reinit
TR.redo = function() {
    var style = TR.redoLog.pop();
    if( style ) {
        TR.undoLog.push( TR.styleBlock.text() );
        TR.styleBlock.text( style );
        TR.initStyleArray();
        TR.correctNumberOfSwatches();
    }
}

//work horse of the app
//this function runs through the token array and pushes out any changes that may have been made
TR.updateAllCSS = function( skip_log ) {
    var skip_log = skip_log || false,
        new_style = [];
    if( !skip_log ) {
        TR.undoLog.push( TR.styleBlock.text() );
        TR.redoLog = [];
    }
    
    for( var i in TR.tokens ) {
        var t = TR.tokens[i];
        if( t.type == "placeholder" ) {
            new_style.push( " " + TR.styleArray[t.ref] + " " + "/*{" + t.ref + "}*/" );
        } else {
            new_style.push( t.value );
        }
    }
    new_style = new_style.join( "" );
    
    TR.styleBlock.text( new_style );
}

//updates all form values from the style array
TR.updateFormValues = function( $this ) {
    //check to make sure form values are up to date
    var tab_num = parseInt($this.attr("id").replace(/[^0-9]/g, ""));
    var swatch = TR.alpha[ tab_num - 1 ];

    for( var i in TR.styleArray ) {
        var key = i.split( "-" )[0];
        if ( key == swatch ) {
            var field = $this.find( "input[data-name=" + i + "]" ),
                slider = $this.find( ".slider[data-name=" + i + "]" ),
                value = TR.styleArray[i].trim(),
                colorwell = field.hasClass("colorwell") ? 1 : 0;

            if( i.indexOf("font-family") != -1 ) {
                field.val( TR.styleArray[i].replace(/font-family:\s*/, "") );
            } else if( i.indexOf("global-icon") != -1 ) {
                if( i == "global-icon-set" ) {
                    field = $this.find( "select[data-name=global-icon-set]" );
                    if( value.indexOf("black") != -1 ) {
                        field.val( "black" );
                    } else {
                        field.val( "white" );
                    }
                } else {
                    if( i != "global-icon-color" && i != "global-icon-shadow" ) {
                        var with_disc = $( "select[data-name=global-icon-disc]" ),
                            disc_color = $this.find( "[data-name=global-icon-disc].colorwell" ),
                            disc_opacity = $this.find( "[data-name=global-icon-disc]:not(.colorwell)" );

                        if( value.indexOf( "transparent" ) != -1 ) {
                            with_disc.val( "without_disc" );
                        } else {
                            var hex = TR.rgbatohex( value ),
                                opac = TR.rgbaOpacity( value );
                            disc_color.val( hex ).css( "background-color", hex );
                            disc_opacity.val( parseFloat(opac) * 100 );
                            with_disc.val( "with_disc" );
                            if( TR.grayValue(hex) < 127 ) {
                                disc_color.css( "color", "#ffffff" );
                            } else {
                                disc_color.css( "color", "#000000" );
                            }
                        }
                    }
                }
            } else if( i.indexOf("box-shadow") != -1) {
                if( i.indexOf( "-size" ) == -1 ) {
                    var shadow_color = $this.find( "[data-name=global-box-shadow-color].colorwell" ),
                        shadow_opacity = $this.find( "[data-name=global-box-shadow-color]:not(.colorwell)" ),
                        hex = TR.rgbatohex( value ),
                        opac = TR.rgbaOpacity( value );
                    shadow_color.val( hex ).css( "background-color", hex );
                    shadow_opacity.val( parseFloat(opac) * 100 );
                    if( TR.grayValue(hex) < 127 ) {
                        shadow_color.css( "color", "#ffffff" );
                    } else {
                        shadow_color.css( "color", "#000000" );
                    }
                } else {
                    field.val( value );
                }
            } else {
                field.val( value );
                if( colorwell ) {
                    if( TR.grayValue(value) < 127 ) {
                        field.css( "color", "#ffffff" );
                    } else {
                        field.css( "color", "#000000" );
                    }
                    field.css( "background-color", value );
                    if( slider.html() ) {
                        //if there is some property on slider object, then there exists a slider
                        slider.find( "a" ).css({
                            "background": value,
                            "border-color": value,
                        });
                    }
                }
            }
        }
    }
}

//function to restyle and reconnect different input elements in the new swatch's control panel
TR.updateThemeRoller = function( tab ) {

    var $tab = $( "#tab" + tab );
    $tab.find( ".accordion" ).accordion({
        header: "h3", 
        active: false, 
        clearStyle: true, 
        collapsible: true
    });
    
    $tab.find( ".colorwell" ).focus(function() {
        var pos = $( this ).offset();
        var name = $( this ).attr( "data-name" );
        if( name.indexOf("shadow-color") == -1 ) {
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
    }).blur(function() {
        $( "#colorpicker" ).css( "position", "static" );
        $( "#colorpicker" ).hide();
        $tab.find( ".slider[data-name=" + $(this).attr("data-name") + "][data-type=" + $(this).attr("data-type") + "] a" ).css({
            "background": $( this ).val(), 
            "border-color": $( this ).val()
        });
    });
    
    var f = $.farbtastic( "#colorpicker" );
    var p = $( "#colorpicker" ).css( "opacity", 1 );
    var selected;
    $tab.find( ".colorwell" )
    .each(function() {
        f.linkTo( this );
        $( this ).css( "opacity", 0.75 );
    })
    .focus(function() {
        if (selected) {
            $(selected).css( "opacity", 1 ).removeClass( "colorwell-selected" );
        }
        f.linkTo(this);
        p.css("opacity", 1);
        $( selected = this ).css( "opacity", 1 ).addClass( "colorwell-selected" );
    });
    $tab.find( ".slider" ).slider({
        max : 80, 
        value: 40
    });

    //droppable for colorwell
    $tab.find( ".colorwell" ).droppable({
        accept: ".color-drag",
        hoverClass: "hover",
        drop: function() {
            var $this = $( this );
            var color = $(".ui-draggable-dragging").css("background-color");
            if( color != "transparent" ) {
                color = TR.rgbtohex( color );
            }
            $( ".ui-draggable .ui-draggable-dragging" ).trigger( "drop" );
            $this.val( color ).css( "background-color", color );
            $this.trigger( "change" );
        }
    });
    
    $tab.find( "input[data-type=background]" ).each(function() {
        $tab.find( ".slider[data-type=background][data-name=" + $(this).attr("data-name") + "] a" ).css({
            "background": $( this ).val(), 
            "border-color": $( this ).val()
        });
    });

    $tab.find( ".colorwell" ).bind( "change", function() {
        $tab.find( ".slider[data-name=" + $(this).attr("data-name") + "][data-type=" + $(this).attr("data-type") + "] a" ).css({
            "background": $( this ).val(), 
            "border-color": $( this ).val()
        });
    });
    
    $tab.find( ".more" ).click(function( e ) {
        e.preventDefault();
        var index = $( this ).attr( "data-name" );
        if( TR.showStartEnd[index] ) {
            if( TR.showStartEnd[index] == "showing" ) {
                $tab.find( ".start-end[data-name=" + index + "]" ).hide( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "+" );
                TR.showStartEnd[index] = "hiding";
            } else {
                $tab.find( ".start-end[data-name=" + index + "]" ).show( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "-" );
                TR.showStartEnd[index] = "showing";
            }
        } else {
            $tab.find( ".start-end[data-name=" + index + "]" ).show( "slide", {
                direction: "up"
            }, 300);
            $( this ).text( "-" );
            TR.showStartEnd[index] = "showing";
        }
    });
    
    $tab.find( "[data-type=font-family]" ).bind( "blur change keyup", function() {
        TR.styleArray[$( this ).attr( "data-name" )] = "font-family: " + this.value;
        TR.updateAllCSS();
    });
    
    $( "[data-type=color], [data-type=text-shadow], [data-type=border], [data-type=link]", "#tab" + tab )
        .bind( "blur change keyup", function(){
            TR.styleArray[$( this ).attr( "data-name" )] = this.value;
            TR.updateAllCSS();
        });
    
    $tab.find( "[data-type=background]" ).bind("blur slide mouseup change keyup", function(event, slider) {
        if( !TR.timerID ) {
            TR.timerID = setTimeout(function() {
                TR.timerID = 0;
            }, 100);

            var index = $( this ).attr( "data-name" ) + "";
            index = index.split( "-" );
            var prefix = index[0] + "-" + index[1];
            var color = $( "input[data-type=background][data-name|=" + prefix + "]" ).val();
            var slider_value = $( ".slider[data-type=background][data-name|=" + prefix + "]" ).slider( "value" );

            var start_end = TR.computeGradient(color, slider_value);
            var start = start_end[0];
            var end = start_end[1];

            $( "[data-type=start][data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
            $( "[data-type=end][data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", end );
            TR.styleArray[prefix + "-background-color"] = color;
            TR.styleArray[prefix + "-background-start"] = start;
            TR.styleArray[prefix + "-background-end"] = end;
            TR.updateAllCSS();
        }
    });
    
    $tab.find( "[data-type=start]" ).add( $tab.find( "[data-type=end]" ) ).bind("blur mouseup change keyup", function() {
        var index = $( this ).attr( "data-name" ) + "";
        index = index.split( "-" );
        var prefix = index[0] + "-" + index[1];
        var start = $tab.find( "[data-type=start][data-name=" + prefix + "-background-start]" ).val();
        var end = $tab.find( "[data-type=end][data-name=" + prefix + "-background-end]" ).val();

        TR.styleArray[prefix + "-background-start"] = start;
        TR.styleArray[prefix + "-background-end"] = end;
        TR.updateAllCSS();
    });

    $( ".delete-swatch-" + TR.alpha[tab - 1] ).click( function(e){
        TR.deleteSwatch( e, $(this) );
    });
    
    $( ".duplicate-swatch-" + TR.alpha[tab - 1] ).click( function(e) {
        e.preventDefault();
        var letter = $(this).attr('class').split('-');
        letter = letter[letter.length - 1];
        TR.addSwatch( true, letter );
    });
}

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
}

}) ( jQuery, window );
