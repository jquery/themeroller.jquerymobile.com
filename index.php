<?php
if ( isset($_GET['style_id']) ) {
	$style_id = $_GET['style_id'];
}
?><!DOCTYPE html>
<html>             
<head>
	<meta charset="UTF-8" />

	<title>ThemeRoller | jQuery Mobile</title>

	<link rel="shortcut icon" type="image/x-icon" href="images/favicon.png" />

	<link rel="stylesheet" type="text/css" href="css/layout.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="css/farbtastic.css" />
	<link rel="stylesheet" type="text/css" href="css/tr.css" />

	<script src="js/jquery.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="js/jquery-ui-tabs-paging.js"></script>
	<script src="js/jquery.color.js"></script>
	<script src="js/farbtastic.js"></script>
	<script src="js/app.js"></script>
	<script src="js/tr.js"></script>
	<script src="js/kuler.js"></script>
</head>
<body>
	
	<div id="load-mask">
		<div id="load-screen">
				<div id="load-spinner">

				</div>
		</div>	
	</div>
	
	<div id="interface">
	<div id="welcome" class="dialog" title=" ">
		<h1><strong>Welcome</strong> to ThemeRoller for jQuery Mobile</h1>
		<p>
			You can create up to 26 theme "swatches" lettered from A-Z, 
			each with a unique color scheme that can be mixed and
			matched for unlimited possibilities.
		</p>
		<p>
			<strong>To start,</strong> either drag a QuickSwatch color onto an element in the preview 
			or use the inspector panel on the left to get crafty. 
			We recommend building themes with at least 3 swatches (A-C). 
		</p>
				
		<div class="buttonpane">
			<div class="separator"></div>
			<img src="images/target_big.png" alt=" "/>
			<div id="colors">
				<div class="color-drag disabled" style="background-color: #C1272D"></div>
				<div class="color-drag disabled" style="background-color: #ED1C24"></div>
				<div class="color-drag disabled" style="background-color: #F7931E"></div>
				<div class="color-drag disabled" style="background-color: #FFCC33"></div>
				<div class="color-drag disabled" style="background-color: #FCEE21"></div>
				<div class="color-drag disabled" style="background-color: #D9E021"></div>
				<div class="color-drag disabled" style="background-color: #8CC63F"></div>
				<div class="color-drag disabled" style="background-color: #009245"></div>
				<div class="color-drag disabled" style="background-color: #006837"></div>
				<div class="color-drag disabled" style="background-color: #00A99D"></div>
				<div class="color-drag disabled" style="background-color: #33CCCC"></div>
				<div class="color-drag disabled" style="background-color: #33CCFF"></div>
			</div>
		</div>
	</div>
	
	
	<div id="upload" class="dialog" title=" ">
		<h1><strong>Import</strong> Theme</h1>
		<textarea id="load-css"></textarea>
		<div class="buttonpane">
			
			<img src="images/target_big.png" alt=" "/>
			<p>
				Copy and paste the contents of any uncompressed 
				jQuery Mobile theme file to load it in for editing.
			</p>
		</div>
	</div>
	
	<div id="download" class="dialog" title=" ">
		<h1><strong>Download</strong> Theme</h1>
		<p>
			This will generate a Zip file that contains both a compressed (for production) and uncompressed (for editing) 
			version of the theme.
		</p>
		<p><strong>To use your theme</strong>, add it to the head of your page after the jquery.mobile.structure file, like this:</p>
		<pre>
			<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  
  &lt;title&gt;jQuery Mobile page&lt;/title&gt;
  &lt;meta charset="utf-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  
  &lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0rc2/jquery.mobile.structure-1.0rc2.min.css" /&gt; 
  <span class="highlight">&lt;link rel="stylesheet" href="css/themes/my-custom-theme.css" /&gt;</span>
  &lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt; 
  &lt;script src="http://code.jquery.com/mobile/1.0rc2/jquery.mobile-1.0rc2.min.js"&gt;&lt;/script&gt; 

&lt;/head&gt;
			</code>
		</pre>
		<div class="buttonpane">
			<div class="separator"></div>
			<img src="images/target_big.png" alt=" "/>
			<p>
				Tip: To edit your theme later, use the import feature to paste in the uncompressed theme file
			</p>
		</div>
	</div>
	<div id="share" class="dialog" title=" ">
		<h1><strong>Share</strong> Theme</h1>
		<p>
			Use this link to share a copy of your theme. People can download 
			or edit a copy of the theme, but your version won’t be changed. 
		</p>
		<input type="text" value="" />
		<div class="buttonpane">
			<div class="separator"></div>
			<img src="images/target_big.png" alt=" "/>
			<p>
				Important note: We can only store this theme URL on the server for 30 days, then it will be deleted. 
				Download a theme to keep a copy safe that you can import later.
			</p>
		</div>
	</div>
	
	<div id="colorpicker"></div>
	<div id="themeroller_mobile">
		<div id="themeroller_header">
			<div id="themeroller_logo"><img src="images/themeroller_logo.png" alt=" "/></div>
			<a href="#" id="themeroller_download"><img src="images/themeroller_download.png" alt=" "/></a>
			<div id="separator"></div>
			<span id="tr_links"><a href="#" id="tr_help">Help</a><a href="#" id="themeroller_upload">Import</a><a href="#" id="generate_url">Share</a></span>
		</div>
		
		<div id="tabs">
			<ul>
				<li><a href="#tab1">Global</a></li>
				<li><a href="#tab2">A</a></li>
				<li><a href="#tab3">+</a></li>
			</ul>
			<div id="tab1">
				<h1>Theme Settings</h1>
			
				<div class="accordion" data-form="ui-btn-active">
					<div>
						<h3><a href="#">Active State</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="global-active-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="global-active-color" class="colorwell"  value="#FFFFFF"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="global-active-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="global-active-shadow-y" value="-1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="global-active-shadow-radius" value="1px"/>&nbsp;<input data-name="global-active-shadow-color" data-type="text-shadow" class="colorwell" value="#145072"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="global-active-background-color" class="colorwell" value="#6CA6D4"/><div class="slider" data-type="background" data-name="global-active-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="global-active-background" href="">+</a>
							<div class="start-end" data-name="global-active-background"><label class="first">START</label><input data-type="start" data-name="global-active-background-start" class="colorwell" value="#85BAE4"/><label>END</label><input data-name="global-active-background-end" data-type="end" class="colorwell" value="#5393C5"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-name="global-active-border" data-type="border" class="colorwell" value="#155678"/><br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-corner">
					<div>
						<h3><a href="#">Corner Radii</a></h3>
						<form>
							<label class="first">GROUP</label><input data-type="radius" data-name="global-radii-blocks" value=".6em"/><div class="slider" data-type="radius" data-name="global-radii-blocks" ></div><br class="clear"/>
							<label class="first">BUTTONS</label><input data-type="radius" data-name="global-radii-buttons" value="1em"/><div class="slider" data-type="radius" data-name="global-radii-buttons" ></div><br class="clear" />
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-icon">
					<div>
						<h3><a href="#">Icon</a></h3>
						<form>
							<label class="first">DEFAULT ICON</label><select data-type="icon_set" data-name="global-icon-set" ><option value="white">White</option><option value="black">Black</option></select>&nbsp;<select data-type="icon_disc" data-name="global-icon-disc" id="with_disc" ><option value="with_disc">With disc</option><option value="without_disc">W/O disc</option></select><br class="clear"/>
							<label class="first">DISC COLOR</label><input data-type="icon_disc" data-name="global-icon-disc" class="colorwell" value="#000000"/><br class="clear"/>
							<label class="first">DISC OPACITY</label><input data-type="icon_disc" data-name="global-icon-disc" id="icon_opacity" value="25"/>&nbsp;<br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion">
					<div>
						<h3><a href="#">Box Shadow</a></h3>
						<form>
							<label class="first">COLOR</label><input data-type="box_shadow" data-name="global-box-shadow-color" class="colorwell" value="#000000"/><br class="clear"/>
							<label class="first">OPACITY</label><input data-type="box_shadow" data-name="global-box-shadow-color" id="box-shadow-opacity" value="25"/><br class="clear"/>
							<label class="first">SIZE</label><input data-type="box_shadow" data-name="global-box-shadow-size" id="box-shadow-size" value="4px"/><br class="clear" />
						</form>
					</div>
				</div>
			</div>
			<div id="tab2">
				<h1>Swatch A<a class="delete-swatch-a" href="">Delete</a></h1>
			
				<div class="accordion" data-form="ui-bar-a">
					<div>
						<h3><a href="#">Header/Footer Bar</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="a-bar-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="a-bar-color" class="colorwell" value="#3E3E3E"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="a-bar-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="a-bar-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="a-bar-shadow-radius" value="1px"/>&nbsp;<input data-name="a-bar-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="a-bar-background-color" class="colorwell" value="#EDEDED"/><div class="slider" data-type="background" data-name="a-bar-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="a-bar-background" href="#">+</a>
							<div class="start-end" data-name="a-bar-background"><label class="first">START</label><input data-type="start"  data-name="a-bar-background-start" class="colorwell" value="#F0F0F0"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="a-bar-background-end" class="colorwell" value="#E9EAEB"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-type="border" data-name="a-bar-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-body-a">
					<div>
						<h3><a href="#">Content Body</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="a-body-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">LINK COLOR</label><input data-type="link" data-name="a-body-link-color" class="colorwell" value="#2489CE"/>&nbsp;&nbsp;<a class="more" data-name="a-body-link-color" href="#">+</a><br class="clear" />
							<div class="start-end links" data-name="a-body-link-color">
								<label class="first">LINK HOVER</label><input data-type="link" data-name="a-body-link-hover" class="colorwell" value="#2489CE"/><br class="clear" />
								<label class="first">LINK ACTIVE</label><input data-type="link" data-name="a-body-link-active" class="colorwell" value="#2489CE"/><br class="clear" />
								<label class="first">LINK VISITED</label><input data-type="link" data-name="a-body-link-visited" class="colorwell" value="#2489CE"/>
							</div>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="a-body-color" class="colorwell" value="#333333"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="a-body-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="a-body-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="a-body-shadow-radius" value="0px"/>&nbsp;<input data-name="a-body-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="a-body-background-color" class="colorwell" value="#E5E5E5"/><div class="slider" data-type="background" data-name="a-body-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="a-body-background" href="#">+</a>
							<div class="start-end" data-name="a-body-background"><label class="first">START</label><input data-type="start"  data-name="a-body-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="a-body-background-end" class="colorwell" value="#DDDDDD"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-type="border" data-name="a-body-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-btn-up-a">
					<div>
						<h3><a href="#">Button: Normal</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="a-button-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="a-bup-color" class="colorwell" value="#444444"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="a-bup-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="a-bup-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="a-bup-shadow-radius" value="1px"/>&nbsp;<input data-name="a-bup-shadow-color" data-type="text-shadow" class="colorwell" value="#F6F6F6"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="a-bup-background-color" class="colorwell" value="#F6F6F6"/><div class="slider" data-type="background" data-name="a-bup-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="a-bup-background" href="#">+</a>
							<div class="start-end" data-name="a-bup-background"><label class="first">START</label><input data-type="start"  data-name="a-bup-background-start" class="colorwell" value="#FEFEFE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="a-bup-background-end" class="colorwell" value="#EEEEEE"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-type="border" data-name="a-bup-border" class="colorwell" value="#CCCCCC"/><br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-btn-hover-a">
					<div>
						<h3><a href="#">Button: Hover</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="a-button-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="a-bhover-color" class="colorwell" value="#101010"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="a-bhover-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="a-bhover-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="a-bhover-shadow-radius" value="1px"/>&nbsp;<input data-name="a-bhover-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="a-bhover-background-color" class="colorwell" value="#E3E3E3"/><div class="slider" data-type="background" data-name="a-bhover-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="a-bhover-background" href="#">+</a>
							<div class="start-end" data-name="a-bhover-background"><label class="first">START</label><input data-type="start"  data-name="a-bhover-background-start" class="colorwell" value="#EDEDED"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="a-bhover-background-end" class="colorwell" value="#DADADA"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-type="border" data-name="a-bhover-border" class="colorwell" value="#BBBBBB"/><br class="clear"/>
						</form>
					</div>
				</div>
				<div class="accordion" data-form="ui-btn-down-a">
					<div>
						<h3><a href="#">Button: Pressed</a></h3>
						<form>
							<label class="first">FONT</label><input data-type="font-family" data-name="a-button-font" value="Helvetica, Arial, Sans serif"/><br class="clear"/>
							<label class="first">TEXT COLOR</label><input data-type="color" data-name="a-bdown-color" class="colorwell"  value="#FFFFFF"/><br class="clear"/>
							<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="a-bdown-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="a-bdown-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="a-bdown-shadow-radius" value="1px"/>&nbsp;<input data-name="a-bdown-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
							<div class="separator"></div>
							<label class="first">BACKGROUND</label><input data-type="background" data-name="a-bdown-background-color" class="colorwell" value="#F5F5F5"/><div class="slider" data-type="background" data-name="a-bdown-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="a-bdown-background" href="#">+</a>
							<div class="start-end" data-name="a-bdown-background"><label class="first">START</label><input data-type="start"  data-name="a-bdown-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="a-bdown-background-end" class="colorwell" value="#FDFDFD"/></div>
							<div class="separator"></div>
							<label class="first">BORDER</label><input data-type="border" data-name="a-bdown-border" class="colorwell" value="#808080"/><br class="clear"/>
						</form>
					</div>
				</div>
			</div>
			<div id="tab3">
				<!--Add Swatch-->
			</div>
		
		</div>
	</div>
	
	<div id="wrapper">
		<div id="header-wrapper">
			<div id="header">
				<div id="inspector_form">
					<h2>Inspector:</h2>
					<div class="radio left" data-id="inspector-on">
						On
					</div>
					<div class="radio right on">
						Off
					</div>
				</div>
				<div id="quickswatch">
					<h2>Drag a color onto an element below or in the panel</h2>
					<div class="colors">
						<div class="color-drag" style="background-color: #FFFFFF"></div>
						<div class="color-drag" style="background-color: #F2F2F2"></div>
						<div class="color-drag" style="background-color: #E6E6E6"></div>
						<div class="color-drag" style="background-color: #CCCCCC"></div>
						<div class="color-drag" style="background-color: #808080"></div>
						<div class="color-drag" style="background-color: #4D4D4D"></div>
						<div class="color-drag" style="background-color: #000000"></div>
						<div class="color-drag" style="background-color: #C1272D"></div>
						<div class="color-drag" style="background-color: #ED1C24"></div>
						<div class="color-drag" style="background-color: #F7931E"></div>
						<div class="color-drag" style="background-color: #FFCC33"></div>
						<div class="color-drag" style="background-color: #FCEE21"></div>
						<div class="color-drag" style="background-color: #D9E021"></div>
						<div class="color-drag" style="background-color: #8CC63F"></div>
						<div class="color-drag" style="background-color: #009245"></div>
						<div class="color-drag" style="background-color: #006837"></div>
						<div class="color-drag" style="background-color: #00A99D"></div>
						<div class="color-drag" style="background-color: #33CCCC"></div>
						<div class="color-drag" style="background-color: #33CCFF"></div>
						<div class="color-drag" style="background-color: #29ABE2"></div>
						<div class="color-drag" style="background-color: #0071BC"></div>
						<div class="color-drag" style="background-color: #2E3192"></div>
						<div class="color-drag" style="background-color: #662D91"></div>
						<div class="color-drag" style="background-color: #93278F"></div>
						<div class="color-drag" style="background-color: #D4145A"></div>
						<div class="color-drag" style="background-color: #ED1E79"></div>
						<div class="color-drag" style="background-color: #C7B299"></div>
						<div class="color-drag" style="background-color: #736357"></div>
						<div class="color-drag" style="background-color: #C69C6D"></div>
						<div class="color-drag" style="background-color: #8C6239"></div>
						<div class="color-drag" style="background-color: #603813"></div>
						<div class="color-drag disabled separator" style="background-color: #ddd"></div>
						<div class="color-drag disabled" style="background-color: #ddd"></div>
						<div class="color-drag disabled" style="background-color: #ddd"></div>
						<div class="color-drag disabled" style="background-color: #ddd"></div>
						<div class="color-drag disabled" style="background-color: #ddd"></div>
					</div>
					<div id="sliders">
						<img src="images/target.png" alt=" "/>
						<span>LIGHTNESS</span><div id="lightness_slider"></div>
						<span>SATURATION</span><div id="saturation_slider"></div>
					</div>
				</div>
				<div id="back-to-jquery">
					<a href="http://jquerymobile.com/">
						<img src="images/jquery-mobile-logo.png" alt="jQuery Mobile" />
					</a>
				</div>
			</div>
		</div>
	
		<div id="content">
			<iframe id="frame" src="preview.html">
			</iframe>
		</div>
	
		<div id="style">
			<?php	echo file_get_contents( 'css/' . ( isset($style_id) ? 'user_themes/' . $style_id : 'default' ) . '.css');?>
		</div>
	
	</div>
	</div>
	
</body>
</html>
