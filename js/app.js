

(function( $, window, undefined ) {
//this file holds the main functionality of ThemeRoller

//Object that can be used across multiple files to reference certain functions
$.tr = {};

$.tr.initializeThemeRoller = function()
{
	
    //Style
    var style_block; //reference to #styleblock in iframe - defined on iframe load
    var frame; //reference to contents of the iframe - deinfed on iframe load
    var style_array = []; //global array of CSS rules
    var tokens = new Array(); //global array of tokens in the css file 
                               //used to write out placeholder tokens and string tokens
	$.tr.style_array = style_array;
	
    //New Swatch
    var first_add = 1;//used to initialize the paging of the tabs
    var tab_counter = 5;//initially we have a global tab an A tab and an add swatch taba
    //global lookup objects to convert number to alpha and visa versa
    var num = { "global": 0, "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8, "i": 9, "j": 10, "k": 11, "l": 12, "m": 13, "n": 14, "o": 15, "p": 16, "q": 17, "r": 18, "s": 19, "t": 20, "u": 21, "v": 22, "w": 23, "x": 24, "y": 25, "z": 26 };
    var alpha = [ "global", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
    //strings that contain templates of the contents of a TR tab and a swatch in the preview
    var swatch_template = "<div class=\"preview ui-shadow swatch\">\n		<div class=\"ui-header ui-bar-a\" data-swatch=\"a\" data-theme=\"a\" data-form=\"ui-bar-a\" data-role=\"header\" role=\"banner\">\n			<a class=\"ui-btn-left ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"home\" title=\" Home \">\n				<span class=\"ui-btn-inner ui-btn-corner-all\">\n					<span class=\"ui-btn-text\"> Home </span>\n					<span data-form=\"ui-icon\" class=\"ui-icon ui-icon-home ui-icon-shadow\"></span>\n				</span>\n			</a>\n			<h1 class=\"ui-title\" tabindex=\"0\" role=\"heading\" aria-level=\"1\">A</h1>\n			<a class=\"ui-btn-right ui-btn ui-btn-icon-notext ui-btn-corner-all ui-shadow ui-btn-up-a\" data-iconpos=\"notext\" data-theme=\"a\" data-role=\"button\" data-icon=\"grid\" title=\" Navigation \">\n				<span class=\"ui-btn-inner ui-btn-corner-all\">\n					<span class=\"ui-btn-text\"> Navigation </span>\n					<span data-form=\"ui-icon\" class=\"ui-icon ui-icon-grid ui-icon-shadow\"></span>\n				</span>\n			</a>\n		</div>\n\n		<div class=\"ui-content ui-body-a\" data-theme=\"a\" data-form=\"ui-body-a\" data-role=\"content\" role=\"main\">\n\n			<p>\n				Sample text and <a class=\"ui-link\" data-form=\"ui-body-a\" href=\"#\" data-theme=\"a\">links</a>.\n			</p>\n\n			<div data-role=\"fieldcontain\">\n			    <fieldset data-role=\"controlgroup\">\n						<li data-swatch=\"a\" class=\"ui-li ui-li-divider ui-btn ui-bar-a ui-corner-top\" data-role=\"list-divider\" role=\"\" data-form=\"ui-bar-a\">List Header</li>\n\n						<input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-1-a\" value=\"choice-1\" checked=\"checked\" />\n				        <label for=\"radio-choice-1-a\" data-form=\"ui-btn-up-a\" class=\"ui-corner-none\">Radio 1</label>\n\n		         		<input type=\"radio\" name=\"radio-choice-a\" id=\"radio-choice-2-a\" value=\"choice-2\"  />\n			         	<label for=\"radio-choice-2-a\" data-form=\"ui-btn-up-a\">Radio 2</label>\n\n						<input type=\"checkbox\" name=\"checkbox-1\" id=\"checkbox-1\" class=\"custom\" checked=\"checked\" />\n						<label for=\"checkbox-1\" data-form=\"ui-btn-up-a\">Checkbox</label>\n\n\n			    </fieldset>\n			</div>\n\n			<div data-role=\"fieldcontain\"> \n				<fieldset data-role=\"controlgroup\" data-type=\"horizontal\">\n						<input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-a-a\" value=\"list\" checked=\"checked\"/> \n						<label for=\"radio-view-a-a\" data-form=\"ui-btn-up-a\">On</label> \n						<input type=\"radio\" name=\"radio-view-a\" id=\"radio-view-b-a\" value=\"grid\"  /> \n						<label for=\"radio-view-b-a\" data-form=\"ui-btn-up-a\">Off</label> \n				</fieldset> \n			</div>\n\n			<div data-role=\"fieldcontain\">\n				<select name=\"select-choice-1\" id=\"select-choice-1\" data-native-menu=\"false\" data-theme=\"a\" data-form=\"ui-btn-up-a\">\n					<option value=\"standard\">Option 1</option>\n					<option value=\"rush\">Option 2</option>\n					<option value=\"express\">Option 3</option>\n					<option value=\"overnight\">Option 4</option>\n				</select>\n			</div>\n\n			<input type=\"text\" value=\"Text Input\" class=\"input\" data-form=\"ui-body-a\" />\n\n			<div data-role=\"fieldcontain\">\n				<input type=\"range\" name=\"slider\" value=\"0\" min=\"0\" max=\"100\" data-form=\"ui-body-a\" data-theme=\"a\" />\n			</div>\n\n			<button data-icon=\"star\" data-theme=\"a\" data-form=\"ui-btn-up-a\">Button</button>\n		</div>\n	</div>";
	var panel_template = $( "#tab2" ).html();
	//var panel_template = "<h1>Swatch A<a class=\"delete-swatch-a\" href=\"\">Delete</a></h1>\n			\n				<div class=\"accordion\" data-form=\"ui-bar-a\">\n					<div>\n						<h3><a href=\"#\">Header/Footer Bar</a></h3>\n						<form>\n							<label class=\"first\">FONT</label><input data-type=\"font-family\" data-name=\"a-bar-font\" value=\"Helvetica, Arial, Sans serif\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT COLOR</label><input data-type=\"color\" data-name=\"a-bar-color\" class=\"colorwell\" value=\"#3E3E3E\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT SHADOW</label><input title=\"Controls the horizontal offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bar-shadow-x\" value=\"0px\"/>&nbsp;<input title=\"Controls the vertical offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bar-shadow-y\" value=\"1px\"/>&nbsp;<input title=\"Controls the blur of text shadow\" data-type=\"text-shadow\" data-name=\"a-bar-shadow-radius\" value=\"1px\"/>&nbsp;<input data-name=\"a-bar-shadow-color\" data-type=\"text-shadow\" class=\"colorwell\" value=\"#FFFFFF\"/><br class=\"clear\"/>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BACKGROUND</label><input data-type=\"background\" data-name=\"a-bar-background-color\" class=\"colorwell\" value=\"#EDEDED\"/><div class=\"slider\" data-type=\"background\" data-name=\"a-bar-background-color\"></div>&nbsp;&nbsp;<a class=\"more\" data-name=\"a-bar-background\" href=\"#\">+</a>\n							<div class=\"start-end\" data-name=\"a-bar-background\"><label class=\"first\">START</label><input data-type=\"start\"  data-name=\"a-bar-background-start\" class=\"colorwell\" value=\"#F0F0F0\"/>&nbsp;<span class=\"end-label\">END</span>&nbsp;<input data-type=\"end\" data-name=\"a-bar-background-end\" class=\"colorwell\" value=\"#E9EAEB\"/></div>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BORDER</label><input data-type=\"border\" data-name=\"a-bar-border\" class=\"colorwell\" value=\"#B3B3B3\"/><br class=\"clear\"/>\n						</form>\n					</div>\n				</div>\n				<div class=\"accordion\" data-form=\"ui-body-a\">\n					<div>\n						<h3><a href=\"#\">Content Body</a></h3>\n						<form>\n							<label class=\"first\">FONT</label><input data-type=\"font-family\" data-name=\"a-body-font\" value=\"Helvetica, Arial, Sans serif\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT COLOR</label><input data-type=\"color\" data-name=\"a-body-color\" class=\"colorwell\" value=\"#333333\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT SHADOW</label><input title=\"Controls the horizontal offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-body-shadow-x\" value=\"0px\"/>&nbsp;<input title=\"Controls the vertical offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-body-shadow-y\" value=\"1px\"/>&nbsp;<input title=\"Controls the blur of text shadow\" data-type=\"text-shadow\" data-name=\"a-body-shadow-radius\" value=\"0px\"/>&nbsp;<input data-name=\"a-body-shadow-color\" data-type=\"text-shadow\" class=\"colorwell\" value=\"#FFFFFF\"/><br class=\"clear\"/>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BACKGROUND</label><input data-type=\"background\" data-name=\"a-body-background-color\" class=\"colorwell\" value=\"#E5E5E5\"/><div class=\"slider\" data-type=\"background\" data-name=\"a-body-background-color\"></div>&nbsp;&nbsp;<a class=\"more\" data-name=\"a-body-background\" href=\"#\">+</a>\n							<div class=\"start-end\" data-name=\"a-body-background\"><label class=\"first\">START</label><input data-type=\"start\"  data-name=\"a-body-background-start\" class=\"colorwell\" value=\"#EEEEEE\"/>&nbsp;<span class=\"end-label\">END</span>&nbsp;<input data-type=\"end\" data-name=\"a-body-background-end\" class=\"colorwell\" value=\"#DDDDDD\"/></div>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BORDER</label><input data-type=\"border\" data-name=\"a-body-border\" class=\"colorwell\" value=\"#B3B3B3\"/><br class=\"clear\"/>\n						</form>\n					</div>\n				</div>\n				<div class=\"accordion\" data-form=\"ui-btn-up-a\">\n					<div>\n						<h3><a href=\"#\">Button: Normal</a></h3>\n						<form>\n							<label class=\"first\">FONT</label><input data-type=\"font-family\" data-name=\"a-button-font\" value=\"Helvetica, Arial, Sans serif\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT COLOR</label><input data-type=\"color\" data-name=\"a-bup-color\" class=\"colorwell\" value=\"#444444\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT SHADOW</label><input title=\"Controls the horizontal offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bup-shadow-x\" value=\"0px\"/>&nbsp;<input title=\"Controls the vertical offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bup-shadow-y\" value=\"1px\"/>&nbsp;<input title=\"Controls the blur of text shadow\" data-type=\"text-shadow\" data-name=\"a-bup-shadow-radius\" value=\"1px\"/>&nbsp;<input data-name=\"a-bup-shadow-color\" data-type=\"text-shadow\" class=\"colorwell\" value=\"#F6F6F6\"/><br class=\"clear\"/>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BACKGROUND</label><input data-type=\"background\" data-name=\"a-bup-background-color\" class=\"colorwell\" value=\"#F6F6F6\"/><div class=\"slider\" data-type=\"background\" data-name=\"a-bup-background-color\"></div>&nbsp;&nbsp;<a class=\"more\" data-name=\"a-bup-background\" href=\"#\">+</a>\n							<div class=\"start-end\" data-name=\"a-bup-background\"><label class=\"first\">START</label><input data-type=\"start\"  data-name=\"a-bup-background-start\" class=\"colorwell\" value=\"#FEFEFE\"/>&nbsp;<span class=\"end-label\">END</span>&nbsp;<input data-type=\"end\" data-name=\"a-bup-background-end\" class=\"colorwell\" value=\"#EEEEEE\"/></div>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BORDER</label><input data-type=\"border\" data-name=\"a-bup-border\" class=\"colorwell\" value=\"#CCCCCC\"/><br class=\"clear\"/>\n						</form>\n					</div>\n				</div>\n				<div class=\"accordion\" data-form=\"ui-btn-hover-a\">\n					<div>\n						<h3><a href=\"#\">Button: Hover</a></h3>\n						<form>\n							<label class=\"first\">FONT</label><input data-type=\"font-family\" data-name=\"a-button-font\" value=\"Helvetica, Arial, Sans serif\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT COLOR</label><input data-type=\"color\" data-name=\"a-bhover-color\" class=\"colorwell\" value=\"#101010\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT SHADOW</label><input title=\"Controls the horizontal offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bhover-shadow-x\" value=\"0px\"/>&nbsp;<input title=\"Controls the vertical offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bhover-shadow-y\" value=\"1px\"/>&nbsp;<input title=\"Controls the blur of text shadow\" data-type=\"text-shadow\" data-name=\"a-bhover-shadow-radius\" value=\"1px\"/>&nbsp;<input data-name=\"a-bhover-shadow-color\" data-type=\"text-shadow\" class=\"colorwell\" value=\"#FFFFFF\"/><br class=\"clear\"/>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BACKGROUND</label><input data-type=\"background\" data-name=\"a-bhover-background-color\" class=\"colorwell\" value=\"#E3E3E3\"/><div class=\"slider\" data-type=\"background\" data-name=\"a-bhover-background-color\"></div>&nbsp;&nbsp;<a class=\"more\" data-name=\"a-bhover-background\" href=\"#\">+</a>\n							<div class=\"start-end\" data-name=\"a-bhover-background\"><label class=\"first\">START</label><input data-type=\"start\"  data-name=\"a-bhover-background-start\" class=\"colorwell\" value=\"#EDEDED\"/>&nbsp;<span class=\"end-label\">END</span>&nbsp;<input data-type=\"end\" data-name=\"a-bhover-background-end\" class=\"colorwell\" value=\"#DADADA\"/></div>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BORDER</label><input data-type=\"border\" data-name=\"a-bhover-border\" class=\"colorwell\" value=\"#BBBBBB\"/><br class=\"clear\"/>\n						</form>\n					</div>\n				</div>\n				<div class=\"accordion\" data-form=\"ui-btn-down-a\">\n					<div>\n						<h3><a href=\"#\">Button: Pressed</a></h3>\n						<form>\n							<label class=\"first\">FONT</label><input data-type=\"font-family\" data-name=\"a-button-font\" value=\"Helvetica, Arial, Sans serif\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT COLOR</label><input data-type=\"color\" data-name=\"a-bdown-color\" class=\"colorwell\"  value=\"#FFFFFF\"/><br class=\"clear\"/>\n							<label class=\"first\">TEXT SHADOW</label><input title=\"Controls the horizontal offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bdown-shadow-x\" value=\"0px\"/>&nbsp;<input title=\"Controls the vertical offset of text shadow\" data-type=\"text-shadow\" data-name=\"a-bdown-shadow-y\" value=\"1px\"/>&nbsp;<input title=\"Controls the blur of text shadow\" data-type=\"text-shadow\" data-name=\"a-bdown-shadow-radius\" value=\"1px\"/>&nbsp;<input data-name=\"a-bdown-shadow-color\" data-type=\"text-shadow\" class=\"colorwell\" value=\"#FFFFFF\"/><br class=\"clear\"/>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BACKGROUND</label><input data-type=\"background\" data-name=\"a-bdown-background-color\" class=\"colorwell\" value=\"#F5F5F5\"/><div class=\"slider\" data-type=\"background\" data-name=\"a-bdown-background-color\"></div>&nbsp;&nbsp;<a class=\"more\" data-name=\"a-bdown-background\" href=\"#\">+</a>\n							<div class=\"start-end\" data-name=\"a-bdown-background\"><label class=\"first\">START</label><input data-type=\"start\"  data-name=\"a-bdown-background-start\" class=\"colorwell\" value=\"#EEEEEE\"/>&nbsp;<span class=\"end-label\">END</span>&nbsp;<input data-type=\"end\" data-name=\"a-bdown-background-end\" class=\"colorwell\" value=\"#FDFDFD\"/></div>\n							<div class=\"separator\"></div>\n							<label class=\"first\">BORDER</label><input data-type=\"border\" data-name=\"a-bdown-border\" class=\"colorwell\" value=\"#808080\"/><br class=\"clear\"/>\n						</form>\n					</div>\n				</div>";
	

    //Timer ID
    var t = 0;
	
    //Gradient Start-End Showing/Not showing
    var more = {};

	//Global for draggable colors
	var moving_color = 0;
    
	//for rgbtohex
	var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
		
	//Dialogs
	$( "#welcome" ).dialog({
		autoOpen: false,
		width: 560,
		modal: true,
		resizable: false,
		draggable: false,
		buttons: {
			"Get Rolling": function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	$( "#share" ).dialog({
		autoOpen: false,
		modal: true,
		width: 800,
		resizable: false,
		draggable: false,
		buttons: {
			"Done": function() {
				$( this ).dialog( "close" );
			}
		}
	});
		
	$( "#tr_window" ).dialog({
		autoOpen: false,
		modal: false,
		width: 320,
		height: "auto",
		position: [0, 116],
		maxWidth: 320,
		dialogClass: "tr_widget"
	});
		
    $( ".dialog#upload" ).dialog({
        autoOpen: false,
        modal: true,
        width: 800,
        height: 430,
		resizable: false,
		draggable: false,
        buttons: {
            "Cancel": function() { 
                $( ".dialog#upload" ).dialog( "close" ); 
            },
            "Import": function() { 
            	if( $( "#load-css" ).val() != "" ) {
					style_block.text( $("#load-css").val() );
					init();
					correctNumberOfSwatches();
                }
                $( ".dialog#upload" ).dialog( "close" ); 
            }
        }
    });

	$( "#help" ).dialog({
		autoOpen: false,
		width: 700,
		height: 400,
		modal: true,
		resizable: false,
		draggable: false,
		buttons: {
			"Close": function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
    $( ".dialog#download" ).dialog({
        autoOpen: false,
        modal: true,
        width: 850,
		resizable: false,
		draggable: false,
        buttons: {
			"Close": function() { 
                $( this ).dialog( "close" ); 
            },
 			"Download Zip": function() { 
				var theme_name = $( "input", this ).val();
				if( theme_name && theme_name.indexOf(" ") == -1 ) {
					$.ajax({
						url: "./generate_zip.php",
						type: "POST",
						data: "theme_name=" + $( "input", this ).val() + "&file=" + encodeURIComponent(style_block.text()),
						dataType: "text",
						mimeType: "text/plain",
						beforeSend: function() {
							//loading gif here
						},
						success: function(response) {
							window.location = response;
						}
					});
				} else {
					alert( "Invalid theme name" );
				}
            }
        }
    });
	
	function addInspectorAttributes( swatch ) {
		var slider = frame.find( "[name=slider][data-theme=" + swatch + "]" ).siblings( "div" );
		var select = frame.find( "select[data-theme=" + swatch + "]" );
		var btn = select.siblings( "a" );
		slider.attr( "data-form", "ui-btn-down-" + swatch ).attr( "data-theme", swatch );
		slider.find( "a" ).attr( "data-form", "ui-btn-up-" + swatch ).attr( "data-theme", swatch );
		btn.attr( "data-theme", swatch ).attr( "data-form", "ui-btn-up-" + swatch );
		btn.find( ".ui-icon" ).attr( "data-form", "ui-icon" );
		return;
	}
	
    //Binds add-swatch box to newSwatch and sets up the Inspector
    	//define global reference style_block to #styleblock in iframe
        frame = $( "#frame" ).contents();

        //#style is where the initial CSS file is put
        //copy it to #styleblock so its in the scope of the iframe
    	style_block = frame.find( "#styleblock" );
    	style_block.text( $("#style").text() );
        
        //adding attributes to elements in the preview to make them compatible
        //with the inspector
		var starting_swatches = ["a", "b", "c"];
		for( var i = 0; i < 3; i++ ) {
			addInspectorAttributes( starting_swatches[i] );
		}

		/*
		var swatch = frame.find( "[name=slider]:first" ).attr( "data-theme" );
		frame.find( "[name=slider]:first" ).siblings( "div" ).attr( "data-form", "ui-btn-down-" + swatch ).attr( "data-theme", swatch );
		frame.find( "[name=slider]:first" ).siblings( "div" ).find( "a" ).attr( "data-form", "ui-btn-up-" + swatch ).attr( "data-theme", swatch );
		//frame.find( ".ui-select .ui-btn" ).attr( "data-form", "ui-btn-up-" + swatch ).attr( "data-theme", swatch );
		//frame.find( ".ui-select .ui-btn .ui-icon" ).attr( "data-form", "ui-icon" );
		frame.find( ".ui-btn .ui-icon-star" ).attr( "data-form", "ui-icon" ).attr( "data-theme", swatch );
		
		frame.find( "select" ).each(function() {
			var swatch = $( this ).attr( "data-theme" );
			var btn = $( this ).siblings( "a" );
			
			btn.attr( "data-theme", swatch );
			btn.attr( "data-form", "ui-btn-up-" + swatch );
			$( ".ui-icon", btn ).attr( "data-form", "ui-icon" );
		});
		*/
    	
        //wait for iframe to load to add appropriate number of swatches and call init
	    //initial binding for newSwatch
	    $( "[href=#tab" + tab_counter + "]" ).bind( "click", newSwatch );
        correctNumberOfSwatches();
    	init();
    	
        //copy color in colorwells to corresponding sliders
    	$( "input[data-type=background]" ).each(function() {
			var $this = $( this )
			$( ".slider[data-type=background][data-name=" + $this.attr("data-name") + "] a" ).css({
				"background": $this.val(), 
				"border-color": $this.val()
			});
		});
    	
    	var swatch_height = frame.find( ".swatch:last" ).outerHeight();
		frame.find( ".add-swatch" ).height(swatch_height);
    	
        frame.find( "[data-role=page]" ).removeClass( "ui-body-c" );
		frame.find( "[data-role=dialog]" ).remove();
        frame.find( "#add-swatch" ).bind( "click", newSwatch );
	
        var css = style_block.text();

        //click on an element with inspector-on and select element in panel
        frame.find( "[data-form]" ).mouseup(function(e) {
            if( $("[data-id=inspector-on]").hasClass("on") ) {
                e.stopPropagation();
				selectElement( $(this) );  		
                frame.find( "#highlight" ).show();
            }
        });
		
        //highlight moves as you mouseover things
        frame.find( "[data-form]" ).bind( "mouseover", function() {
			var $this = $( this );
            if( $("[data-id=inspector-on]").hasClass("on") ) {
                var left = $this.offset().left, top = $this.offset().top,
                	width = $this.outerWidth(), height = $this.outerHeight();
				
                var parent = this;
				
                frame.find( "#highlight" ).mousemove(function(e) { 
                    var highlight = $( this );
                    $( "[data-form]", parent ).each(function() {
                        var left = $( this ).offset().left, top = $( this ).offset().top,
                        	width = $( this ).outerWidth(), height = $( this ).outerHeight(),
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
		
        frame.find( "#highlight" ).mousedown(function() {
            if( $("[data-id=inspector-on]").hasClass("on") ) {
                $( this ).css( "z-index", -1 );
            }
        });
		
        frame.bind( "mouseleave", function() {
            $( "iframe" ).contents().find( "#highlight" ).hide();
        });
		
        frame.find( "#styleblock" ).text( css );
        frame.find( "body" ).show().delay( 600 );
    		
	//ajax call performed when share link is clicked
	$( "#generate_url" ).click(function(e) {
		e.preventDefault();
		
		$( "#share" ).dialog( "open" );
		
		var post_data = "file=" + style_block.text();
		
		$.ajax({
			type: "post",
			url: "generate_url.php",
			data: post_data,
			beforeSend: function() {
				$( "#share" ).dialog("open" );
			},
			success: function( data ) {
				$( "#share input" ).val( data );
			}
		});
		
	});
	
	//help dialog
	$( "#tr_help" ).click(function(e) {
		e.preventDefault();
		
		$( "#help" ).dialog( "open" );
		
	});
	
    $( "[class|=\"delete-swatch\"]" ).click( deleteSwatch );
	
	//draggable colors
	$( ".color-drag:not(.disabled)" ).draggable({
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
			$.tr.moving_color = 1;
		}
	});
	
	$( ".color-drag" ).mousedown(function() {
		var color = $(this).css("background-color");
		$.tr.addMostRecent( color );
	});
	
	//droppable for colorwell
	$( ".colorwell" ).droppable({
		accept: ".color-drag",
		hoverClass: "hover",
		drop: function() {
			var $this = $( this );
			var color = $.tr.rgbtohex( $(".ui-draggable-dragging").css("background-color") );
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
		
		if($.tr.moving_color) {
			$.tr.moving_color = 0;
			var frame_offset = $( "#frame" ).offset();
			var el_offset = $( "#frame" ).contents().find( ".ui-bar-a" ).offset();
			
			var element = null;
			var el_class = "";
			//loop through possible classes and if mouse is above one,
			//end the loop (order is based on precedence)
			for( var i = 0; i < droppables.length; i++ ) {
				for( var j = 0; j < alphabet.length; j++ ) {
					frame.find( droppables[i] + alphabet[j] ).each(function() {
						var $this = $( this );
						var top = frame_offset.top + $this.offset().top - frame.scrollTop(), bottom = top + $this.outerHeight(),
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
			$( "#frame" ).contents().find( ".ui-link, .ui-btn-active" ).each(function() {
				var $this = $( this );
				var top = frame_offset.top + $this.offset().top - frame.scrollTop(), bottom = top + $this.outerHeight(),
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
				color = $.tr.rgbtohex( color );
			
				for( var i in classtokey ) {
					if( el_class.indexOf(i) != -1 ) {
						applyColor( color, swatch + classtokey[i] );
						break;
					}
				}
				
	            selectElement(element);
			}
		}
		
	});
	

    //change colorwell -> change bg color of its corresponding slider
    $( ".colorwell" ).bind( "change" , function() {
        $( ".slider[data-name=" + $(this).attr("data-name") + "][data-type=" + $(this).attr("data-type") + "] a").css({
            "background": $( this ).val(), 
            "border-color": $( this ).val()
        });
    });

    //initiating download/upload dialogs
    $( "#themeroller_upload" ).click(function() {
        $( ".dialog#upload" ).dialog( "open" );
        return false;
    });

    $( "#themeroller_download" ).click(function() {
        $( ".dialog#download" ).dialog( "open" );			
        return false;
    });
    
    //global more dictionary keeps track of which start-end fields are showing
    //i.e. more["a-bar-background"] = "showing" means that the next click of that .more should
    //hide that set of start-end fields
    $( ".more" ).click(function() {
        var index = $( this ).attr( "data-name" );
        if( more[index] ) {
            if( more[index] == "showing" ) {
                $( ".start-end[data-name=" + index + "]" ).hide( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "+" );
                more[index] = "hiding";
            } else {
                $( ".start-end[data-name=" + index + "]" ).show( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "-" );
                more[index] = "showing";
            }
        } else {
            $( ".start-end[data-name=" + index + "]" ).show( "slide", {
                direction: "up"
            }, 300 );
            $( this ).text( "-" );
            more[index] = "showing";
        }
    	return false;
    });

	//triggering change on current colorwell forces the update of the css as well as
	//the change in background of the slider
    $( "#colorpicker" ).bind( "mousemove", function() {
        $( ".colorwell[data-name=" + $("*:focus").attr("data-name") + "]" ).trigger( "change" );
    });


    //All of the following bind different fields in TR
    //to functions that change CSS rules and call updateAllCSS()

    $( "[data-type=font-family]" ).bind( "blur change keyup", function() {
		var name = $( this ).attr( "data-name" );
        $.tr.style_array[name] = "font-family: " + this.value;
        updateAllCSS();
    });


	$( "[data-type=link], [data-type=color], [data-type=text-shadow], [data-type=border]" )
		.bind( "blur change keyup", function(){
			$.tr.style_array[$( this ).attr( "data-name" )] = this.value;
			updateAllCSS();
	});

	$( "[data-type=radius]" ).bind("change slide keyup mouseup", function() {
		var $this = $( this );
		var name = $this.attr( "data-name" );
		var input = $( "input[data-type=radius][data-name=" + name + "]" );
		var slider = $( ".slider[data-type=radius][data-name=" + name + "]" );
		input.val( slider.slider("value") + "em" );
		$.tr.style_array[name] = input.val();
		updateAllCSS();
	});

    $( "[data-type=background]" ).bind( "blur slide mouseup change keyup", function(event, slider) {
        if( !t ) {
            t = setTimeout(function() {
                t = 0;
            }, 100);

            var index = $( this ).attr( "data-name" ) + "";
            index = index.split( "-" );
            var prefix = index[0] + "-" + index[1];
            var color = $( "input[data-type=background][data-name|=" + prefix + "]" ).val();
            var slider_value = $( ".slider[data-type=background][data-name|=" + prefix + "]" ).slider( "value" );

			var start_end = computeGradient(color, slider_value);
			var start = start_end[0];
			var end = start_end[1];

            $( "[data-type=start][data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
            $( "[data-type=end][data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", end );
            $.tr.style_array[prefix + "-background-color"] = color;
            $.tr.style_array[prefix + "-background-start"] = start;
            $.tr.style_array[prefix + "-background-end"] = end;
            updateAllCSS();
        }
    });
	

    $( "[data-type=start] , [data-type=end]" ).bind( "blur mouseup change keyup", function() {
        var index = $( this ).attr( "data-name" ) + "";
        index = index.split( "-" );
        var prefix = index[0] + "-" + index[1];
        var start = $( "[data-type=start][data-name=" + prefix + "-background-start]" ).val();
        var end = $( "[data-type=end][data-name=" + prefix + "-background-end]" ).val();

        $.tr.style_array[prefix + "-background-start"] = start;
        $.tr.style_array[prefix + "-background-end"] = end;
        updateAllCSS();
    });

    $( "[data-type=icon_set]" ).bind( "blur mouseup", function() {
        if( this.value == "white" ) {
            $.tr.style_array[$( this ).attr( "data-name" )] = "url(http://code.jquery.com/mobile/latest/images/icons-18-white.png)";

        } else if(this.value == "black") {
            $.tr.style_array[$( this ).attr( "data-name" )] = "url(http://code.jquery.com/mobile/latest/images/icons-18-black.png)";
        }
        updateAllCSS();
    });

	$( "[data-type=box_shadow]" ).bind( "blur change keyup", function() {
		var color_el = $( "[data-type=box_shadow]:first" );
		var opac_el = $( "[data-type=box_shadow]:eq(1)" );
		
		var color_arr = color_el.val().split( "" );
        var red = hextodec( color_arr[1] + color_arr[2]);
        var green = hextodec( color_arr[3] + color_arr[4] );
        var blue = hextodec( color_arr[5] + color_arr[6] );
		
		$.tr.style_array["global-box-shadow-color"] = "rgba(" + red + "," + green + "," + blue + "," + ( parseFloat(opac_el.val()) / 100 ) + ")";	
        updateAllCSS();
	});
	
	$( "[data-type=box_shadow][data-name=global-box-shadow-size]" ).bind( "blur change keyup", function() {
		$.tr.style_array["global-box-shadow-size"] = $(this).val();
		updateAllCSS();
	});

    $( "[data-type=icon_disc]" ).bind( "blur change keyup", function() {
        var elements = [];
        $( "[data-name=global-icon-disc]" ).each(function() {
            elements.push( this.value );
        });

        color_arr = elements[1].split( "" );
        var red = hextodec( color_arr[1] + color_arr[2]);
        var green = hextodec( color_arr[3] + color_arr[4] );
        var blue = hextodec( color_arr[5] + color_arr[6] );

        if( elements[0] == "with_disc" ) {
            $.tr.style_array["global-icon-color"] = "#FFFFFF";
            $.tr.style_array["global-icon-disc"] = "rgba(" + red + "," + green + "," + blue + "," + ( parseFloat(elements[2]) / 100 ) + ")";	
            $.tr.style_array["global-icon-shadow"] = "#fff";
        } else {
            $.tr.style_array["global-icon-disc"] = "transparent";
            $.tr.style_array["global-icon-shadow"] = "none";
        }
        updateAllCSS();
    });
    

    //removing the close button from ui-dialogs
    $( ".tr_widget .ui-dialog-titlebar-close" ).remove();

	function addMostRecent(color) {
		var found = 0;
		$( "#quickswatch .color-drag:gt(31)" ).each(function() {
			if( color == $(this).css("background-color") ) {
				found = 1;
			}
		});
		if( !found ) {
			$( "#quickswatch .color-drag:last" ).remove();
			$( "#quickswatch .colors .color-drag:eq(31)" ).removeClass( "separator" );
			var new_color = $( "<div class=\"color-drag separator\" style=\"background-color: " + color + "\"></div>" );
			new_color.draggable({
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
					$.tr.moving_color = 1;
				}
			});
			$( "#quickswatch .colors .color-drag:eq(30)" ).after( new_color );
			
			/*
			$( "#picker-colors .color-drag:first" ).remove();
			var new_picker_color = $( "<div class=\"color-drag\" style=\"background-color: " + color + "\"></div>" );
			new_picker_color.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$.tr.colorwell.focus();
				$( ".colorwell:focus" ).val( $.tr.rgbtohex($(this).css("background-color")) ).trigger( "change" );
			});
			$( "#picker-colors" ).append( new_picker_color );
			*/
		}
	}
    
    //When a color is dropped this function applies a color to the element
	//automatically detecting things like 
	function applyColor( color, prefix ) {
		var color_arr = color.split( "" );

        var red = $.tr.hextodec( color_arr[1] + color_arr[2] );
        var green = $.tr.hextodec( color_arr[3] + color_arr[4] );
        var blue = $.tr.hextodec( color_arr[5] + color_arr[6] );
		var gray = grayValue( color );
		
		//swatch is the letter of the swatch or it is global
		var swatch = prefix.substr( 0, 1 );
		var element = prefix.substr( 2, prefix.length - 2 );
		var element = prefix.split( "-" );
		element[0] = "";
		element = element.join( "" );
		
		//if we're on a button hover we call this same function with button down as element
		if( element == "bhover" ) {
			color = percentColor( color, 1.15 );
			applyColor( color, swatch + "-bdown");
		}
		//if we're on a button up we call same function with button hover
		//which then calls it with button down
		if( element == "bup" ) {
			applyColor( color, swatch + "-bhover" );
		}
		//if we're on button down then the gradient gets flipped
		var start, end;
		if( element != "bdown" ) {
			start = $.tr.computeGradient(color, 50)[0];
			end = $.tr.computeGradient(color, 50)[1];
		} else {
			start = $.tr.computeGradient(color, 50)[1];
			end = $.tr.computeGradient(color, 50)[0];
		}
		if( element != "link" ) {
			//anything but a link has gradients and text color
			$( "input[data-name=" + prefix + "-background-color]" ).val( color ).css( "background-color", color );
			$( "input[data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
			$( "input[data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", start );
			$( ".slider[data-name=" + prefix + "-background-color]" ).slider( {value: 50} )
				.find( "a" ).css({"background-color": color, "border-color": color});
			$.tr.style_array[prefix + "-background-start"] = start;
			$.tr.style_array[prefix + "-background-end"] = end;
			$.tr.style_array[prefix + "-background-color"] = color;

			//special border for content body elements
			if( element != "body" ) {
				$( "input[data-name=" + prefix + "-border]" ).val( color ).css( "background-color", color );
				$.tr.style_array[prefix + "-border"] = color;
			} else {
				var border;
				if( gray > 90 ) {
					border = percentColor( color, 0.55 );
				} else {
					border = percentColor( color, 1.4 );
				}
				$( "input[data-name=" + prefix + "-border]" ).val( border ).css( "background-color", border );
				$.tr.style_array[prefix + "-border"] = border;
			}

			//contrast calculation for text color
			if( gray > (150) ) {
				$( "input[data-name=" + prefix + "-color]" ).val( "#000000" ).css( "background-color", "#000000" );
				$( "input[data-name=" + prefix + "-shadow-color]" ).val( "#eeeeee" ).css( "background-color", "#eeeeee" );
				$.tr.style_array[prefix + "-color"] = "#000000";
				$.tr.style_array[prefix + "-shadow-color"] = "#eeeeee";
			} else {	
				$( "input[data-name=" + prefix + "-color]" ).val( "#ffffff" ).css( "background-color", "#ffffff" );
				$( "input[data-name=" + prefix + "-shadow-color]" ).val( "#444444" ).css( "background-color", "#444444" );
				$.tr.style_array[prefix + "-color"] = "#ffffff";
				$.tr.style_array[prefix + "-shadow-color"] = "#444444";
			}
		} else {
			//links are lighter on hover and darker once visited
			var lighter = percentColor( color, 1.15 );
			var darker = percentColor( color, 0.65 );
			$.tr.style_array[swatch + "-body-link-color"] = color;
			$.tr.style_array[swatch + "-body-link-active"] = color;
			$.tr.style_array[swatch + "-body-link-hover"] = lighter;
			$.tr.style_array[swatch + "-body-link-visited"] = darker;
			$( "input[data-name=" + swatch + "-body-link-color]" ).val( color ).css( "background-color", color );
			$( "input[data-name=" + swatch + "-body-link-active]" ).val( color ).css( "background-color", color );
			$( "input[data-name=" + swatch + "-body-link-hover]" ).val( darker ).css( "background-color", lighter );
			$( "input[data-name=" + swatch + "-body-link-visited]" ).val( lighter ).css( "background-color", darker );
		}

		//we've updated style_array now update the CSS
		$.tr.updateAllCSS();
	}
	
	function computeGradient(color, slider_value) {
		var color_arr = color.split( "" );

        var red = hextodec( color_arr[1] + color_arr[2] );
        var green = hextodec( color_arr[3] + color_arr[4] );
        var blue = hextodec( color_arr[5] + color_arr[6] );


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
            red_start = dectohex( Math.floor(percent * red) );
        }
        if( percent * green > 255 ) {
            green_start = "FF";
        } else {
            green_start = dectohex( Math.floor(percent * green) );
        }
        if( percent * blue > 255 ) {
            blue_start = "FF";
        } else {
            blue_start = dectohex( Math.floor(percent * blue) );
        }

        if( convex ) {
            percent = ( 100 - (slider_value - 40) ) / 100;
        } else {
            percent = ( 100 - (40 - slider_value) ) / 100;
        }

        var red_end = dectohex( Math.floor(percent * red) );
        var green_end = dectohex( Math.floor(percent * green) );
        var blue_end = dectohex( Math.floor(percent * blue) );

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
    
    
    //this function is used when a theme is loaded
    //it counts the number of swatches in the current stylesheet
    //and adds or subtracts the correct number of swatches in the preview
    function correctNumberOfSwatches()
    {
    	var style = style_block.text();
    	var matches = style.match( /\/\*\s[A-Z]\s*-*\*\//g );
    	var swatch_counter = matches.length + 2;
    	
        //add appropriate number of tabs to TR and swatches to preview
    	for( ; tab_counter < swatch_counter && tab_counter < 28; tab_counter++ ) {
			$( ".delete-swatch-a" ).show();
    		var lower = alpha[tab_counter - 1];
			var upper = lower.toUpperCase();
			var next_tab = tab_counter + 1;
			
			//swap text in the tabs
            $( "#tabs" ).tabs( "add", "#tab" + next_tab, "+" );
            $( "#tabs ul li a[href=#tab" + tab_counter + "]" ).text( upper );
            
            //reconfigure binding of newSwatch event
            $( "[href=#tab" + tab_counter + "]" ).unbind( "click", newSwatch );
            $( "[href=#tab" + next_tab + "]" ).bind( "click", newSwatch );
            
			//giving the contents of the new tab
			var temp_panel_template = panel_template.replace( /Swatch A/, "Swatch " + upper );
			temp_panel_template = temp_panel_template.replace( /"a\-/g, "\"" + lower + "-" );
			temp_panel_template = temp_panel_template.replace( /\-a"/g, "-" + lower + "\"" );
			$( "#tabs #tab" + tab_counter ).html( temp_panel_template );
				
			//add swatch to preview	
			temp_swatch_template = swatch_template.replace( /="a"/g, "=\"" + lower + "\"" );
			temp_swatch_template = temp_swatch_template.replace( />A<\/h1>/g, ">" + upper + "</h1>" );
			temp_swatch_template = temp_swatch_template.replace( /-a\s/g, "-" + lower + " " );
			temp_swatch_template = temp_swatch_template.replace( /-a\"/g, "-" + lower + "\"" );
			$( temp_swatch_template ).insertAfter( frame.find(".swatch:last") );
			
			updateThemeRoller( tab_counter );
			
			if( first_add ) {
				//apply paging of the tabs on the first addswatch
				$( "#tabs" ).tabs("paging", {
					cycle: true, 
					follow: true, 
					tabsPerPage: 0, 
					followOnSelect: true, 
					selectOnAdd: false
				});
            	first_add = 0;
            }
            
            
			var iframe_window = $( "#frame" )[0].contentWindow;
			//This is a bug in JQM. Header initialization is using a live pagecreate handler on the page
			//ideally we should be able to write iframe_window.$(".swatch:last").trigger("create");
			iframe_window.$( ".ui-page" ).trigger( "pagecreate" );
            //special treatment for the slider - adding data-form dynamically after pagecreate
			addInspectorAttributes( lower );
			
			refreshFrame( alpha[tab_counter - 1] );
		}
		
        //remove swatches from preview if necessary and tabs
		for( ; tab_counter > swatch_counter; tab_counter-- ) {
			frame.find( ".swatch:last" ).remove();
			
			$( "#tabs .ui-tabs-panel:last" ).attr( "id", "tab" + (tab_counter - 1) );
			$( "#tabs ul li a:contains(\"+\")" ).attr( "href", "#tab" + (tab_counter - 1) );
			if( $("#tabs").tabs("option", "selected") == (tab_counter - 2) ) {
				$( "#tabs" ).tabs( "select", 0 );
			}
			$( "#tabs" ).tabs( "remove", tab_counter - 2 );
		}
    }
    
    // Function to convert decimal to hexidecimal
    function dectohex( dec ) {
        var dec_arr = { 10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F" };
        var first = Math.floor( dec / 16 );
        var second = Math.floor( dec % 16 );
        if( first >= 10 ) {
            first = dec_arr[first];
        }
        if( second >= 10 ) {
            second = dec_arr[second];
        }
        return first + "" + second + "";
    }
    
    
    //using the $.tr.style_array to successfully copy over data to appropriate swatches
    //and then deleting last swatch so the one clicked appears to be deleted
    function deleteSwatch( e ) {
    	e.preventDefault();
        var delete_class = $( this ).attr( "class" );
        var letter =  delete_class.substr( delete_class.length - 1, delete_class.length );
        var number = num[letter];	
        
        //moving content of the tabs back one starting at the one we're deleting
        for( var i = number + 1; i <= tab_counter - 2; i++ ) {
            var current_letter = alpha[i];
            var current_number = num[current_letter];
            var indices = [];
            for( var j in $.tr.style_array ) {
                var reg = new RegExp( "^" + current_letter + "-.*" );
                if( j.match(reg) ) {
                    indices.push( j.match(reg) );
                }
            }
            for( var k in indices ) {
                var index = indices[k] + "";
                var suffix = index.substr( 1, index.length - 1 );
                $.tr.style_array[alpha[current_number - 1] + suffix] = $.tr.style_array[index];
                if( (current_number + 2) == tab_counter ) {
                    delete( $.tr.style_array[index] );
                }
            }
            $( "#tab" + (current_number+1) + " input[data-name], #tab" + (current_number+1) + " .slider[data-name]" ).each(function() {
                var value;
                if( $(this).hasClass("slider") ) {
                    value = $( this ).slider( "value" );
                } else {
                    value = $( this ).val();
                }
                var suffix = $( this ).attr( "data-name" ).substr( 1, $(this).attr("data-name").length - 1 );
                if( $(this).hasClass("slider") ){
                    $( "#tab" + current_number + " div.slider[data-name=" + alpha[current_number - 1] + suffix + "]" ).slider( "value", value );
                } else {
                    $( "#tab" + current_number + " input[data-name=" + alpha[current_number - 1] + suffix + "]" ).val( value );
                }
            });
        }
        
        //deleting the last swatch's rules in the $.tr.style_array
        var last_letter = alpha[tab_counter - 2];
        var prefix = last_letter + "-";
        var new_style_array = {};
        for( var i in $.tr.style_array ) {
        	if( i.indexOf(prefix) != 0 ) {
        		new_style_array[i] = $.tr.style_array[i];
        	}
        }
        $.tr.style_array = new_style_array;
        
        //delete the swatch's CSS from the file
        var css = style_block.text();
        var start_reg = new RegExp ("\\/\\* " + alpha[tab_counter - 2].toUpperCase() + "\\s*\\n-*\\*\\/" );
        
		var end_reg = new RegExp( "\\/\\* Structure \\*\\/" );
		var start = css.search( start_reg );
		var end = css.search( end_reg );         
        
		var part1 = css.substring(0, start);
		var part2 = css.substring(end, css.length);
		style_block.text( part1 + part2 );
		$( ".dialog#download textarea" ).val( part1 + part2 );
		
        tab_counter--;
        $( "#tabs .ui-tabs-panel:last" ).attr( "id", "tab" + tab_counter );
        $( "#tabs ul li a:contains(\"+\")" ).attr( "href", "#tab" + tab_counter );
        frame.find( ".swatch:last" ).remove();
        if( $("#tabs").tabs("option", "selected") == tab_counter - 1 ) {
			$( "#tabs" ).tabs( "select", tab_counter - 2 );
        }
		$( "#tabs" ).tabs( "remove", tab_counter - 1 );
		
		if( tab_counter == 3 ) {
			$( ".delete-swatch-a" ).hide();
		}
			
        var swatch_height = frame.find( ".swatch:last" ).outerHeight();
        frame.find( ".add-swatch" ).height(swatch_height);
            
        init( "refresh" );
        updateAllCSS();
		
		return false;
    }
    
	function grayValue( color ) {	
		var color_arr = color.split( "" );

        var red = $.tr.hextodec( color_arr[1] + color_arr[2] );
        var green = $.tr.hextodec( color_arr[3] + color_arr[4] );
        var blue = $.tr.hextodec( color_arr[5] + color_arr[6] );

		return ( red + green + blue ) / 3;
	}

    
	function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
    
    //Function to convert hexidecimal to demical
    function hextodec( hex ){
        var hex_arr = { "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15 };
        if( hex[0] in hex_arr ){
            var first = hex_arr[hex[0]];
        } else {
            var first = hex[0];
        }
        first = parseInt( first );
        if( hex[1] in hex_arr ){
            var second = hex_arr[hex[1]];
        } else {
            var second = hex[1];
        }
        second = parseInt( second );
        return ( 16*first ) + second;
    }
    
    
    //init is used to initialize the array of tokens and the $.tr.style_array
    //if the refresh flag is passed it refreshes the token array and does not initialize the $.tr.style_array
    function init( refresh ) {
    	refresh = refresh || "fresh";
	
        var style = style_block.text();
        escaped_style = style.replace( /\n/g, "%0A" );
        escaped_style = escaped_style.replace( /\t/g, "%09" );
        $( ".dialog#download textarea" ).val( style );
		
		
        var reg = new RegExp( "(?:font-family:)[^/\\*]+/\\*{[^\\*/]*}\\*/|\\s*\\S*\\s*/\\*{[^\\*/]*}\\*/" );
		
        tokens = [];
        var reference = "";
        var length = 0;
        var index = -1;
        var i = 0;
		
        while( style.length > 0 ) {
            var temp = reg.exec( style ) + "";
            length = temp.length;
            reference = /{.*}/.exec( temp ) + "";
            reference = reference.substr( 1,reference.length-2 );
            index = style.search( reg );
            if( index != -1 ) {
                tokens[i++] = {
                    value: style.substr( 0, index ), 
                    type: "string"
                };
                tokens[i++] = {
                    value: style.substr( index, length ), 
                    type: "placeholder", 
                    ref: reference
                };
                //update $.tr.style_array
                var prefix_end = reference.indexOf( "-" );
                var prefix = reference.substring( 0, prefix_end );
                if( refresh != "refresh" ) {
					$.tr.style_array[reference] = tokens[i-1].value.replace( /\/\*.*\*\//, "" );
				}
				//cut off string and continue
                style = style.substring( index+length ); 
            } else {
                tokens[i++] = {
                    value: style,
                    type: "string"
                };
                style = "";
            }
			
        }
    }
        
	//This function adds a new tab and makes the previous "newSwatch tab" into a Swatch
	//So we unbind that one and bind the new one as the "newSwatch tab"
    function newSwatch( ev ) {
        ev.preventDefault();
        $( ".delete-swatch-a" ).show();
        if( tab_counter < 28 ) {
            var next_tab = tab_counter+1;
            var lower = alpha[tab_counter - 1] + "";
            var upper = lower.toUpperCase();
            $( "#tabs" ).tabs( "add", "#tab" + next_tab, "+" );
            $( "#tabs ul li a[href=#tab" + tab_counter + "]" ).text( upper );
            
            //reconfigure binding of newSwatch event
            $( "[href=#tab" + tab_counter + "]" ).unbind( "click", newSwatch );
            $( "[href=#tab" + next_tab + "]" ).bind( "click", newSwatch );
			
            //defining $.tr.style_array indices
            var indices = [];
			var reg = new RegExp( "a-.*" );
            for( var j in $.tr.style_array ) {
                if( j.search(reg) != -1 ) {
                    indices.push( j );
                }
            }
            for( var k in indices ) {
                var index = indices[k] + "";
                var suffix = index.substr( 1, index.length - 1 );
                $.tr.style_array[lower + suffix] = $.tr.style_array[index];
            }
			
            //giving the contents of the new tab
            var temp_panel_template = panel_template.replace( /Swatch A/, "Swatch " + upper );
            temp_panel_template = temp_panel_template.replace( /"a\-/g, "\"" + lower + "-" );
            temp_panel_template = temp_panel_template.replace( /\-a"/g, "-" + lower + "\"" );
            $( "#tabs #tab" + tab_counter ).html( temp_panel_template );
			
            //adding swatch to CSS		
            reg = new RegExp( "\\/\\* " + upper + "\\s*\\n-*\\*\\/" );
			var css = style_block.text();
            
			var start = css.search( /\/\* A.*\n-*\*\// );
            var end;
            if(tab_counter > 3) {
                end = css.search( /\/\* B.*\n-*\*\// );
            } else {
                end = css.search( /\/\* Structure /);
            }
			var swatch_a = css.substring( start, end );
        
			var temp_css_template = swatch_a.replace( /-a,/g, "-" + lower + "," );
			temp_css_template = temp_css_template.replace( /-a\s/g, "-" + lower + " " );
			temp_css_template = temp_css_template.replace( /{a-/g, "{" + lower + "-" );
			temp_css_template = temp_css_template.replace( /\/\*\sA/, "/* " + upper );
			var current_css = style_block.text();
			current_css = current_css.replace( /\/\*\sStructure\s/, temp_css_template + "\n\n/* Structure " );
			style_block.text( current_css );   

            //adding swatch to preview document
            var temp_swatch_template = swatch_template.replace( /"a"/g, "\"" + lower + "\"" );
            temp_swatch_template = temp_swatch_template.replace( />A<\/h1>/g, ">" + upper + "</h1>" );
            temp_swatch_template = temp_swatch_template.replace( /-a\s/g, "-" + lower + " " );
            temp_swatch_template = temp_swatch_template.replace( /-a\"/g, "-" + lower + "\"" );
            $( temp_swatch_template ).insertAfter( $("#frame").contents().find(".swatch:last") );

            var iframe_window = $( "#frame" )[0].contentWindow;
            //This is a bug in JQM. Header initialization is using a live pagecreate handler on the page
            //ideally we should be able to write iframe_window.$(".swatch:last").trigger("create");
            iframe_window.$( ".ui-page" ).trigger( "pagecreate" );
            
            //adding data-form attribute to slider
			addInspectorAttributes( lower );
				 
            //redefine the token array
            init( "refresh" );
            //binds all appropriate events for accordions and new tab
            updateThemeRoller( tab_counter );
			
            var swatch_height = frame.find( ".swatch:last" ).outerHeight();
            frame.find( ".add-swatch" ).height(swatch_height);
            
			if( first_add ) {
				//apply paging of the tabs
				$( "#tabs" ).tabs("paging", {
					cycle: true, 
					follow: true, 
					tabsPerPage: 0, 
					followOnSelect: true, 
					selectOnAdd: false
				});
            	first_add = 0;
            }
            
            refreshFrame( alpha[tab_counter - 1] );
            frame.find( "[data-role=dialog]" ).remove();

            tab_counter++;
        }
    }
    
	function percentColor( color, percent ) {
		var color_arr = color.split( "" );

        var red = $.tr.hextodec( color_arr[1] + color_arr[2] );
        var green = $.tr.hextodec( color_arr[3] + color_arr[4] );
        var blue = $.tr.hextodec( color_arr[5] + color_arr[6] );
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
			red = $.tr.dectohex( red * percent );
		} else {
			if( red * percent >= 255 ) {
				red = "FF";
			} else {
				red = "00";
			}
		}
		if( green * percent < 255 && green * percent > 0 ) {
			green = $.tr.dectohex( green * percent );
		} else {
			if( green * percent >= 255 ) {
				green = "FF";
			} else {
				green = "00";
			}
		}
		if( blue * percent < 255 && blue * percent > 0 ) {
			blue = $.tr.dectohex( blue * percent );
		} else {
			if( blue * percent >= 255 ) {
				blue = "FF";
			} else {
				blue = "00";
			}
		}
		
		return "#" + red + "" + green + "" + blue + "";
	}
    
    //refreshes the inspector behaviors on the preview frame
    function refreshFrame( swatch )
    {	
        //click behavior for inspector
    	$( "#frame").contents().find( ".ui-bar-" + swatch + ", " + ".ui-body-" + swatch + ", .ui-bar-" + swatch + " [data-form], .ui-body-" + swatch + " [data-form]" ).mouseup(function(e) {
            if( $("[data-id=inspector-on]").hasClass("on") ) {
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
				
				
                $( "#tabs" ).tabs( "select", num[data_theme] );	
				
                setTimeout(function() {
					$( "#tab" + (num[data_theme] + 1) + " .accordion" ).each(function() {
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
						
	
                $( this ).contents().find( "#highlight" ).show();
            }
        });
		
        //bind hover behavior for inspector
        frame.find( "[data-form$=-" + swatch + "]" ).bind( "mouseover", function() {
            if( $("[data-id=inspector-on]").hasClass("on") ) {
                var left = $( this ).offset().left;
                var top = $( this ).offset().top;
                var width = $( this ).outerWidth();
                var height = $( this ).outerHeight();
				
                var parent = this;
				
                frame.find( "#highlight" ).mousemove(function(e) {
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
				
                $( "iframe" ).contents().find( "#highlight" ).css({
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
    
	//Function to convert hex format to a rgb color
	function rgbtohex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

    //function used to open a specific accordion
    //the element passed in is one selected by the incpector or when dropping a color
	function selectElement(element) {
		var data_theme = element.attr( "data-theme" );
		var form = element.attr( "data-form" );
		
		if(!data_theme) {
			data_theme = form.split( "-" );
			data_theme = data_theme[data_theme.length - 1];
		}

		if( element.hasClass("ui-radio-on") ) {
			data_theme = "global";
			form = "ui-btn-active";
		}
		if( form == "ui-link" ) {
			data_theme = "global";
		}
		if( form == "ui-icon" ) {
			data_theme = "global";
		}


		$( "#tabs" ).tabs( "select", num[data_theme] );	
		
		setTimeout(function() {
			$( "#tab" + (num[data_theme]+1) + " .accordion" ).each(function() {
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
    
    //work horse of the app
    //this function runs through the token array and pushes out any changes that may have been made
    function updateAllCSS() {
    
        var new_style = [];
        for( var i in tokens ) {
        	var t = tokens[i];
            if( t.type == "placeholder" ) {
				new_style.push( " " + $.tr.style_array[t.ref] + " " + "/*{" + t.ref + "}*/" );
            } else {
            	new_style.push( t.value );
            }
        }
        new_style = new_style.join( "" );
        
        style_block.text( new_style );
        $( ".dialog#download textarea" ).val( new_style );
    }
    
	//function to restyle and reconnect different input elements in the new swatch"s control panel
    function updateThemeRoller( tab ) {
	
	
        $( "#tab" + tab + " .accordion" ).accordion({
            header: "h3", 
            active: false, 
            clearStyle: true, 
            collapsible: true
        });
		
        $( "#tab" + tab + " .colorwell" ).focus(function() {
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
            $( "#tab" + tab + " .slider[data-name=" + $(this).attr("data-name") + "][data-type=" + $(this).attr("data-type") + "] a" ).css({
                "background": $( this ).val(), 
                "border-color": $( this ).val()
            });
        });
		
        var f = $.farbtastic( "#colorpicker" );
        var p = $( "#colorpicker" ).css( "opacity", 1 );
        var selected;
        $( "#tab" + tab + " .colorwell" )
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
        $( "#tab" + tab + " .slider" ).slider({
            max : 80, 
            value: 40
        });

		//droppable for colorwell
		$( "#tab" + tab + " .colorwell" ).droppable({
			accept: ".color-drag",
			hoverClass: "hover",
			drop: function() {
				var $this = $( this );
				var color = $.tr.rgbtohex( $(".ui-draggable-dragging").css("background-color") );
				$( ".ui-draggable .ui-draggable-dragging" ).trigger( "drop" );
				$this.val( color ).css( "background-color", color );
				$this.trigger( "change" );
			}
		});
		
        $( "#tab" + tab + " input[data-type=background]" ).each(function() {
            $( "#tab" + tab + " .slider[data-type=background][data-name=" + $(this).attr("data-name") + "] a" ).css({
                "background": $( this ).val(), 
                "border-color": $( this ).val()
            });
        });

        $( "#tab" + tab + " .colorwell" ).bind( "change", function() {
            $( "#tab" + tab + " .slider[data-name=" + $(this).attr("data-name") + "][data-type=" + $(this).attr("data-type") + "] a" ).css({
                "background": $( this ).val(), 
                "border-color": $( this ).val()
            });
        });
		
        $( "#tab" + tab + " .more" ).click(function() {
            var index = $( this ).attr( "data-name" );
            if( more[index] ) {
                if( more[index] == "showing" ) {
                    $( "#tab" + tab + " .start-end[data-name=" + index + "]" ).hide( "slide", {
                        direction: "up"
                    }, 300);
                    $( this ).text( "+" );
                    more[index] = "hiding";
                } else {
                    $( "#tab" + tab + " .start-end[data-name=" + index + "]" ).show( "slide", {
                        direction: "up"
                    }, 300);
                    $( this ).text( "-" );
                    more[index] = "showing";
                }
            } else {
                $( "#tab" + tab + " .start-end[data-name=" + index + "]" ).show( "slide", {
                    direction: "up"
                }, 300);
                $( this ).text( "-" );
                more[index] = "showing";
            }
        });
		
        $( "#tab" + tab + " [data-type=font-family]" ).bind( "blur change keyup", function() {
            $.tr.style_array[$( this ).attr( "data-name" )] = "font-family: " + this.value;
            updateAllCSS();
        });
        
        $( "[data-type=color], [data-type=text-shadow], [data-type=border], [data-type=link]", "#tab" + tab )
		.bind( "blur change keyup", function(){
			$.tr.style_array[$( this ).attr( "data-name" )] = this.value;
			updateAllCSS();
		});
		
        $( "#tab" + tab + " [data-type=background]" ).bind("blur slide mouseup change keyup", function(event, slider) {
            if(!t) {
                t = setTimeout(function() {
                    t = 0;
                }, 100);

                var index = $( this ).attr( "data-name" ) + "";
                index = index.split( "-" );
                var prefix = index[0] + "-" + index[1];
                var color = $( "#tab" + tab + " input[data-type=background][data-name|=" + prefix + "]" ).val();
                var slider_value = $( "#tab" + tab + " .slider[data-type=background][data-name|=" + prefix + "]" ).slider( "value" );
				
                var color_arr = color.split( "" );
				
                var red = hextodec( color_arr[1] + color_arr[2] );
                var green = hextodec( color_arr[3] + color_arr[4] );
                var blue = hextodec( color_arr[5] + color_arr[6] );
				
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
                    red_start = dectohex( Math.floor(percent * red) );
                }
                if( percent * green > 255 ) {
                    green_start = "FF";
                } else {
                    green_start = dectohex( Math.floor(percent * green) );
                }
                if( percent * blue > 255 ) {
                    blue_start = "FF";
                } else {
                    blue_start = dectohex( Math.floor(percent * blue) );
                }
				
                if( convex ) {
                    percent = ( 100 - (slider_value - 40) ) / 100;
                } else {
                    percent = ( 100 - (40 - slider_value) ) / 100;
                }
				
                var red_end = dectohex( Math.floor(percent * red) );
                var green_end = dectohex( Math.floor(percent * green) );
                var blue_end = dectohex( Math.floor(percent * blue) );
				
                var start, end;
                if( convex ) {
                    start = "#" + red_start + "" + green_start + "" + blue_start + "";
                    end = "#" + red_end + "" + green_end + "" + blue_end + "";
                } else {
                    start = "#" + red_end + "" + green_end + "" + blue_end + "";
                    end = "#" + red_start + "" + green_start + "" + blue_start + "";
                }
                $( "#tab" + tab + " [data-type=start][data-name=" + prefix + "-background-start]" ).val( start ).css( "background-color", start );
                $( "#tab" + tab + " [data-type=end][data-name=" + prefix + "-background-end]" ).val( end ).css( "background-color", end );
                $.tr.style_array[prefix + "-background-color"] = color;
                $.tr.style_array[prefix + "-background-start"] = start;
                $.tr.style_array[prefix + "-background-end"] = end;
                updateAllCSS();
            }
        });
		
        $( "#tab" + tab + " [data-type=start] , #tab" + tab + " [data-type=end]" ).bind("blur mouseup change keyup", function() {
            var index = $( this ).attr( "data-name" ) + "";
            index = index.split( "-" );
            var prefix = index[0] + "-" + index[1];
            var start = $( "#tab" + tab + " [data-type=start][data-name=" + prefix + "-background-start]" ).val();
            var end = $( "#tab" + tab + " [data-type=end][data-name=" + prefix + "-background-end]" ).val();

            $.tr.style_array[prefix + "-background-start"] = start;
            $.tr.style_array[prefix + "-background-end"] = end;
            updateAllCSS();
        });

		$( ".delete-swatch-" + alpha[tab - 1] ).click( deleteSwatch );
    }

	$.tr.updateAllCSS = updateAllCSS;
	$.tr.computeGradient = computeGradient;
	$.tr.correctNumberOfSwatches = correctNumberOfSwatches;
	$.tr.dectohex = dectohex;
	$.tr.hextodec = hextodec;
	$.tr.rgbtohex = rgbtohex;
	$.tr.addMostRecent = addMostRecent;
	$.tr.moving_color = moving_color;

	$(document).trigger("themerollerready");
}



})( jQuery, window );