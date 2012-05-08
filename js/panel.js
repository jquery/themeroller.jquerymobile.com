(function( $, window, undefined ) {
	
TR.initPanel = function() {
	if ( $.isEmptyObject( TR.panelDict ) ) {
		TR.panelDict = TR.panelDictBase;
	}
	
	TR.panel = $( "#tr_panel" );
	
	var tabPanel, tabPanelLabel,
		controlGroup, controlGroupLabel,
		control, controlLabel,
		newTabPanel, newAccordion,
		newControlGroup, newControl,
		count = 1;
	
	for ( var tab in TR.panelDict ) {
		tabPanel = TR.panelDict[ tab ];
		tabPanelLabel = tabPanel.label;
		//create tabPanel and tab
		newTab = $( '<li><a href="#tab' + count + '">' + tab + '</a></li>' );
		newTabPanel = $( '<div id="tab' + count + '"><h1></h1></div>' );
		for ( controlGroupLabel in tabPanel ) {
			controlGroup = tabPanel[ controlGroupLabel ];
			if ( typeof controlGroup !== "string" ) {
				//create accordion
				newAccordion = $( '<div class="accordion"><div><h3><a href="#">' + controlGroupLabel + '</a></h3><form></form></div></div>' );
				newControlGroup = newAccordion.find( "form" );
				for ( controlLabel in controlGroup ) {
					control = controlGroup[ controlLabel ];
					if (typeof control !== "string" ) {
						//create control
						newControlGroup.append( TR.createControl( control, controlLabel ) );
					} else {
						newAccordion.attr( "data-form", control );
					}
				}
				newTabPanel.append( newAccordion );
			} else {
				var header = newTabPanel.find( "h1" )
				switch ( controlGroupLabel ) {
					case "label":
						header.text( controlGroup );
						break;
					case "delete":
						header.append( '<a class="' + controlGroup + '" href="">Delete</a>' );
						break;
					case "duplicate":
						header.append( '<a class="' + controlGroup + '" href="">Duplicate</a>' );
						break;
					default:
						break;
				}
			}
		}
		TR.panel.find( "ul" ).append( newTab );
		TR.panel.find( "#tabs" ).append( newTabPanel );
		count++;
	}
	
	TR.panelReady = true;
	TR.initializeUI();
}

TR.createControl = function( control, label, subGroup ) {
	var controlMarkup = subGroup ? '' : '<label class="first">' + label.toUpperCase() + '</label>',
		type = control.type,
		group = control.group,
		name = control.name;
	
	if ( TR.isArray( control ) ) {
		var controlSubGroup = $( "" );
		for ( var i in control ) {
			controlMarkup += TR.createControl( control[ i ], label, true );
		}
		if ( control[i].separator ) {
			return $( controlMarkup += '<br class="clear" /><div class="separator"></div>' );
		}
		
		return $( controlMarkup + '<br class="clear" />' );
	}

	
	var prefix = name.split( "-" );
	prefix = prefix[0] + "-" + prefix[1] + "-" + prefix[2];

	switch ( control.type ) {
		case "text":
			controlMarkup += '<input data-type="' + group + '" data-name="' + name + '" />'; 
			break;
		case "number":
			var title = control.title ? 'title="' + control.title + '"' : "";
			controlMarkup += '<input class="number" ' + title + ' data-type="' + group + '" data-name="' + name + '"/>';
			if ( control.slider ) {
				controlMarkup += '<div class="slider" data-type="' + group + '" data-name="' + name + '" ></div>';
			}
			break;
		case "link":
			controlMarkup += '<input data-type="' + group + '" data-name="' + name + '" class="colorwell"/>&nbsp;&nbsp;<a class="more" data-name="' + name + '" href="#">+</a><br class="clear" />';
			controlMarkup += '<div class="start-end links" data-name="' + name + '">';
			controlMarkup += '<label class="first">LINK HOVER</label><input data-type="' + group + '" data-name="' + prefix + '-hover" class="colorwell"/><br class="clear" />';
			controlMarkup += '<label class="first">LINK ACTIVE</label><input data-type="' + group + '" data-name="' + prefix + '-active" class="colorwell"/><br class="clear" />';
			controlMarkup += '<label class="first">LINK VISITED</label><input data-type="' + group + '" data-name="' + prefix + '-visited" class="colorwell"/></div>';
			var noBreak = true;
			break;
		case "color":
			controlMarkup += '<input data-type="' + group + '" data-name="' + name + '" class="colorwell" />';
			break;
		case "gradient":
			controlMarkup += '<input data-type="' + group + '" data-name="' + name + '" class="colorwell" />';
			controlMarkup += '<div class="slider" data-type="' + group + '" data-name="' + name + '"></div>&nbsp;&nbsp;'
			controlMarkup += '<a class="more" data-name="' + prefix + '" href="">+</a>';
			controlMarkup += '<div class="start-end" data-name="' + prefix + '">';
			controlMarkup += '<label class="first">START</label>';
			controlMarkup += '<input data-type="start" data-name="' + prefix + '-start" class="colorwell"/>';
			controlMarkup += '<label>END</label><input data-name="' + prefix + '-end" data-type="end" class="colorwell" /></div>';
			break;
		case "select":
			controlMarkup += '<select data-type="' + group + '" data-name="' + name + '">';
			for ( var optVal in control.options ) {
				controlMarkup += '<option value="' + optVal + '">' + control.options[ optVal ] + '</option>';
			}
			controlMarkup += '</select>';
			break;
		default:
			break;
	}
	
	if ( noBreak ) {
		return $( controlMarkup );
	}
	if ( subGroup ) {
		return controlMarkup + '&nbsp;'
	}
	if ( control.separator ) {
		return $( controlMarkup += '<div class="separator"></div>' );
	} 
	return $( controlMarkup += '<br class="clear"/>' );
};

TR.extendPanelDict = function( letter ) {
	var target = TR.num[ letter.toLowerCase() ] + 1,
		tabPanelA = TR.panelDict[ "A" ];
    
	for ( var i = 3; i <= target; i++ ) {
		var lower = TR.alpha[ i - 1 ],
			upper = lower.toUpperCase(),
			newTabJSON = JSON.stringify(tabPanelA, null, 2).replace( /\"a-/g, "\"" + lower + "-" )
				.replace( /-a\"/g, '-' + lower + '"' ).replace( /\"Swatch A\"/, '"Swatch ' + upper + '"' ),
			newTabDict = JSON.parse( newTabJSON );
		
		TR.panelDict[ upper ] = newTabDict;
	}
	
	TR.panelDict[ "+" ] = {};
}

TR.panelDictBase = {
	"Global": {
		"label": "Theme Settings",
		
		"Font Family": {
			"Font": {
				"type": "text",
				"group": "font-family",
				"name": "global-font-family",
			}
		},
		
		"Active State": {
			"data-form": "ui-btn-active",
			
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "global-active-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "global-active-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "global-active-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "global-active-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "global-active-shadow-color",
					"separator": true
				},
			],
            
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "global-active-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "global-active-border"
			}
		},
		
		"Corner Radii": {
			"Group": {
				"type": "number",
				"unit": "em",
				"slider": true,
				"group": "radius",
				"name": "global-radii-blocks"
			},
			
			"Buttons": {
				"type": "number",
				"unit": "em",
				"slider": true,
				"group": "radius",
				"name": "global-radii-buttons"
			}
		},
		
		"Icon": {
			"data-form": "ui-icon",
			
			"Default Icon": [
				{
					"type": "select",
					"group": "icon_set",
					"name": "global-icon-set",
					"options": {
						"white": "White",
						"black": "Black"
					}
				},
				
				{
					"type": "select",
					"group": "icon_disc",
					"name": "global-icon-disc",
					"options": {
						"with_disc": "With Disc",
						"without_disc": "W/O Disc"
					}
				}
			],
			
			"Disc Color": {
				"type": "color",
				"group": "icon_disc",
				"name": "global-icon-disc"
			},
			
			"Disc Opacity": {
				"type": "number",
				"unit": "%",
				"group": "icon_disc",
				"name": "global-icon-disc"
			}
		},
		
		"Box Shadow": {
			"Color": {
				"type": "color",
				"group": "box_shadow",
				"name": "global-box-shadow-color"
			},
			
			"Opacity": {
				"type": "number",
				"unit": "%",
				"group": "box_shadow",
				"name": "global-box-shadow-color"
			},
			
			"Size": {
				"type": "number",
				"unit": "px",
				"group": "box_shadow",
				"name": "global-box-shadow-size"
			}
		}
	},
	
	"A": {
		"label": "Swatch A",
		
		"duplicate": "duplicate-swatch-a",
		
		"delete": "delete-swatch-a",
		
		"Header/Footer Bar": {
			"data-form": "ui-bar-a",
			
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "a-bar-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bar-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bar-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bar-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "a-bar-shadow-color",
					"separator": true
				},
			],
			
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "a-bar-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "a-bar-border"
			}
		},
		
		"Content Body": {
			"data-form": "ui-body-a",
			
			"Link Color": {
				"type": "link",
				"group": "link",
				"name": "a-body-link-color"
			},
			
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "a-body-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-body-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-body-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-body-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "a-body-shadow-color",
					"separator": true
				},
			],
			
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "a-body-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "a-body-border"
			}
		},
		
		"Button: Normal": {
			"data-form": "ui-btn-up-a",
			
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "a-bup-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bup-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bup-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bup-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "a-bup-shadow-color",
					"separator": true
				},
			],
			
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "a-bup-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "a-bup-border"
			}
		},
		
		"Button: Hover": {
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "a-bhover-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bhover-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bhover-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bhover-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "a-bhover-shadow-color",
					"separator": true
				},
			],
			
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "a-bhover-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "a-bhover-border"
			}
		},
		
		"Button: Pressed": {
			"Text Color": {
				"type": "color",
				"group": "color",
				"name": "a-bdown-color"
			},
			
			"Text Shadow": [
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bdown-shadow-x",
					"title": "Controls the horizontal offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bdown-shadow-y",
					"title": "Controls the vertical offset of text shadow"
				},
				
				{
					"type": "number",
					"unit": "px",
					"group": "text-shadow",
					"name": "a-bdown-shadow-radius",
					"title": "Controls the blur of text shadow"
				},
				
				{
					"type": "color",
					"group": "text-shadow",
					"name": "a-bdown-shadow-color",
					"separator": true
				},
			],
			
			"Background": {
				"type": "gradient",
				"group": "background",
				"name": "a-bdown-background-color",
				"separator": true
			},
			
			"Border": {
				"type": "color",
				"group": "border",
				"name": "a-bdown-border"
			}
		}
	},
	
	"+": {}
};

TR.isArray = function( obj ) {	
	if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
	    return true;
	}
	return false;
}
	
}) ( jQuery, window );