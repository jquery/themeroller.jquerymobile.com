<?php
require_once( 'version.php' );
require_once( 'upgrade/upgrade.php' );
if ( isset($_GET['style_id']) ) {
	$style_id = $_GET['style_id'];
}
if ( isset($_POST['style']) ) {
	$style = urldecode($_POST['style']);
}
?>
<!DOCTYPE html>
<html>             
<head>
	<meta charset="UTF-8" />

	<title>ThemeRoller | jQuery Mobile</title>
	
	<link rel="canonical" href="index.php" />
	<link rel="shortcut icon" type="image/x-icon" href="images/favicon.png" />

	<link rel="stylesheet" type="text/css" href="css/tr.layout.css" media="all" />
	<link rel="stylesheet" type="text/css" href="css/jquery.ui.css" />
	<link rel="stylesheet" type="text/css" href="css/farbtastic.css" />
	<link rel="stylesheet" type="text/css" href="css/tr.panel.css" />

	<script src="js/jquery.js"></script>
	<script src="js/jquery.ui.js"></script>
	<script src="js/jquery.ui.tabs.paging.js"></script>
	<script src="js/jquery.color.js"></script>
	<script src="js/farbtastic.js"></script>
	<script src="js/app.js"></script>
	<script src="js/ui.js"></script>
	<script src="js/kuler.js"></script>
	<script src="upgrade/upgrade.js"></script>
</head>
<body>
	
	<div id="load-mask">
		<div id="load-screen">
				<div id="load-spinner"></div>
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
				We <strong>strongly</strong> recommend building themes with at least 3 swatches (A-C). 
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
			<h1><strong>Import</strong> Theme<span href="#" id="import-default">Import Default Theme</span></h1>
			<?php
				if (isset($VERSION_LIST) && isset($MASTER)) {
					echo '<label>Upgrade to version:</label><select id="upgrade-to-version">';
					foreach($VERSION_LIST as $key => $l) {
						$version = explode( "-", $l );
						$version[1] = strtoupper($version[1]);
						$version[1] = implode( "", explode( ".", $version[1] ) );
						echo '<option value="' . $key . '"';
						//if the build script has been run, $MASTER will be the same in each version
						if( $l == $MASTER ) {
							echo ' class="master"';
						}
						echo '>' . implode( " ", $version ) . '</option>';
					}
					echo '</select>';
				}
			?>
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
			<h1><strong>Download</strong> Theme<input value="" /><label for="theme-name">Theme Name</label></h1>
			<p>
				This will generate a Zip file that contains both a compressed (for production) and uncompressed (for editing) 
				version of the theme.
			</p>
			<p><strong>To use your theme</strong>, add it to the head of your page before the jquery.mobile.structure file, like this:</p>
			<pre>
				<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;

  &lt;title&gt;jQuery Mobile page&lt;/title&gt;
  &lt;meta charset="utf-8" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  <span class="highlight">&lt;link rel="stylesheet" href="css/themes/my-custom-theme.css" /&gt;</span>
  &lt;link rel="stylesheet" href="http://code.jquery.com/mobile/<?php echo $JQM_VERSION; ?>/jquery.mobile.structure-<?php echo $JQM_VERSION; ?>.min.css" /&gt; 
  &lt;script src="http://code.jquery.com/jquery-<?php echo $JQUERY_VERSION; ?>.min.js"&gt;&lt;/script&gt; 
  &lt;script src="http://code.jquery.com/mobile/<?php echo $JQM_VERSION; ?>/jquery.mobile-<?php echo $JQM_VERSION; ?>.min.js"&gt;&lt;/script&gt; 

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

		<div id="help" class="dialog" title=" ">
			<h1 id="help-top"><strong>ThemeRoller Mobile Help</strong></h1>

			<p>The ThemeRoller Mobile tool makes it easy to create custom-designed themes for your mobile site or app. Just pick colors, then share your theme URL, or download the theme and drop it into your site.</p>
			<ul>
				<li><a href="#theme-intro">Theme basics</a></li>
				<li><a href="#getting-started">Getting started</a></li>
				<li><a href="#downloading">Downloading themes</a></li>
				<li><a href="#importing">Importing themes</a></li>
				<li><a href="#sharing">Sharing themes</a></li>
				<li><a href="#supported">Supported browsers</a></li>
			</ul>

			<h3 id="theme-intro">Theme basics <a href="#help-top" class="help-top">^ Top</a></h3>
			<p>A jQuery Mobile theme contains a both global settings for things like rounded corner radius and active (on) state, and up to to 26 "swatches" lettered from A-Z, each with a unique color scheme that can be mixed and matched for unlimited possibilities. Each swatch  sets the colors, textures and font settings for the primary elements: toolbar, content block and button. Buttons have 3 interaction states: normal, hover, pressed. We recommend building themes with at least 3 swatches (A-C).</p>

			<h3 id="getting-started">Getting Started <a href="#help-top" class="help-top">^ Top</a></h3>
			<p>The ThemeRoller interface has 3 major zones: the left column contains the inspector panel, along the top is the QuickSwatch/Kuler bar, and below this is the preview window. </p>
			<p>Use the <strong>inspector pane</strong> to set global theme settings on the first tab and tweak the individual style options for each swatch. Above the tabs, there are links to download, share, or import a theme.</p>
			<p>In the <strong>QuickSwatch bar</strong>, you can turn the inspector feature on to automatically expand the relevant inspector section when you click on an element in the preview pane. Drag and drop a color from the QuickSwatch panel onto an element in the preview pane and the tool with automatically calculate text color and shadow, borders, gradients and even button states. The sliders make it easy to adjust the lightness and saturation of the colors. Click the Adobe Kuler Swatches to load pre-made color palettes from Adobe's popular color palette sharing site.</p>
				<p>The <strong>preview pane</strong> shows a sample of common jQuery Mobile widgets that live update each time you make a change to the theme so you can quickly test and tweak the theme.</p>

				<h3 id="downloading">Downloading themes <a href="#help-top" class="help-top">^ Top</a></h3>
				<p>Once you have created your final theme, click the <strong>Download Theme</strong> link at the top of the inspector panel. In the download dialog, give your theme a name and press the <strong>Download Zip</strong> button. This will generate a zip file that contains both the compressed (production-ready) and uncompressed (editable) theme files and a simple test page (index.html) to show that everything worked (whew) and instructions on how to add the theme to your site. It's pretty simple: link your custom theme in the head of the page followed by the jQuery Mobile structure theme and you're ready to go. </p>

				<h3 id="importing">Importing themes <a href="#help-top" class="help-top">^ Top</a></h3>
				<p>The import feature is primarily designed to make it easy to either edit a theme you've downloaded or to generate a updated version of a theme for a new release of the library. When you download a theme, be sure keep the uncompressed version of the theme CSS file because this is used in the import process. To import a theme, click the <strong>Import</strong> link and paste the entire contents of the uncompressed theme file (select all > copy > paste) into the text input in the dialog, and the system will parse the theme into an editable format for sharing and downloading.</p>

				<h3 id="Sharing">Sharing themes <a href="#help-top" class="help-top">^ Top</a></h3>
				<p>To generate a theme URL that can be shared with others, click the <strong>Share</strong> link and copy the URL. Post it on Twitter and become a famous theme artist. Anyone that opens the shared URL can edit or download the theme, but theor activity won't affect your original theme. Note that due to the high volume of traffic, we can only store your theme on the server for 30 days so shared links have an expiration date. Be sure to download a copy of your theme for safekeeping.</p>

				<h3 id="supported">Supported browsers <a href="#help-top" class="help-top">^ Top</a></h3>
				<p>This is a beta version of a developer tool so we're committing to supporting the <strong>latest</strong> versions of popular desktop browsers: Chrome, Firefox, Safari. Even though the tool works in IE9, it doesn't support CSS gradients so we don't recommend recommend using this browser to create themes. If you're running into issues, maybe try a different browser or <a href="https://github.com/jquery/web-jquery-mobile-theme-roller/issues" target="new"><strong>log an issue</strong></a> in the tracker.</p>

			<div class="buttonpane">
				<div class="separator"></div>
				<img src="images/target_big.png" alt=" "/>
				<p>
					&nbsp;&nbsp;
				</p>
			</div>
		</div>
		
		<div id="toolbar">
			<div id="tr-logo"></div>
			<div id="button-block-1">
				<div class="tb-button" id="version-select">
					<img src="images/jqm_logo_small.png" alt="jQuery Mobile"/>
					<img id="version-select-arrow" src="images/version_select_arrow.png" alt=" " />
					<div id="current-version">Version 1.1.0 RC2</div>
					
					<?php
						if (isset($VERSION_LIST)) {
							echo '<ul><b>Switch to</b>';
							foreach($VERSION_LIST as $key => $l) {
								if( $l != $JQM_VERSION ) {
									$version = explode( "-", $l );
									$version[1] = strtoupper($version[1]);
									$version[1] = implode( "", explode( ".", $version[1] ) );
									echo '<li data-version="' . $key . '">' . implode( " ", $version ) . '</li>';
								}
							}
							echo '</ul>';
						}
					?>
				</div>
				
				<div id="fix-buttons">
					<div id="undo">
						<img src="images/undo.png" alt="Undo" /><br />
						<span>undo</span>
					</div>
					<div id="redo">
						<img src="images/redo.png" alt="Redo" /><br />
						<span>redo</span>
					</div>
				</div>
				<div class="tb-button" id="inspector-button">
					<img src="images/inspector.png" alt=" "/><br />
					<span>Inspector <strong>off</strong></span>
				</div>
			</div>
			<div id="button-block-2">
				<div class="tb-button" id="download-button">
					<div class="tb-button-inner">
						<img src="images/download.png" alt="Download" />
						<div class="text">
							<span class="big">Download</span><br />
							<span>theme zip file</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="import-button">
					<div class="tb-button-inner">
						<img src="images/import.png" alt="Import" />
						<div class="text">
							<span class="big">Import</span><br />
							<span>or upgrade</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="share-button">
					<div class="tb-button-inner">
						<img src="images/share.png" alt="Share" />
						<div class="text">
							<span class="big">Share</span><br />
							<span>theme link</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="help-button">
					<div class="tb-button-inner">
						<img src="images/help.png" alt="Help" />
						<div class="text">
							<span class="big">Help</span><br />
							<span>center</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="colorpicker"></div>
		
		<div id="tr_panel">
			<!--
			<div id="tr_header">
				<div id="tr_logo"><img src="images/themeroller_logo.png" alt=" "/></div>
				<a href="#" id="tr_download"><img src="images/themeroller_download.png" alt=" "/></a>
				<div id="separator"></div>
				<span id="tr_links"><a href="#" id="tr_help">Help</a><a href="#" id="tr_upload">Import</a><a href="#" id="generate_url">Share</a></span>
			</div>
			-->
			<div id="tabs">
				<ul>
					<li><a href="#tab1">Global</a></li>
					<li><a href="#tab2">A</a></li>
					<li><a href="#tab3">B</a></li>
					<li><a href="#tab4">C</a></li>
					<li><a href="#tab5">+</a></li>
				</ul>
				<div id="tab1">
					<h1>Theme Settings</h1>

					<div class="accordion" data-form="ui-btn-active">
						<div>
							<h3><a href="#">Font Family</a></h3>
							<form>
								<label class="first">FONT</label><input data-type="font-family" data-name="global-font-family" value="Helvetica, Arial, sans-serif"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-active">
						<div>
							<h3><a href="#">Active State</a></h3>
							<form>
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
					<h1>Swatch B<a class="delete-swatch-b" href="">Delete</a></h1>

					<div class="accordion" data-form="ui-bar-b">
						<div>
							<h3><a href="#">Header/Footer Bar</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="b-bar-color" class="colorwell" value="#3E3E3E"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="b-bar-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="b-bar-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="b-bar-shadow-radius" value="1px"/>&nbsp;<input data-name="b-bar-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="b-bar-background-color" class="colorwell" value="#EDEDED"/><div class="slider" data-type="background" data-name="b-bar-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="b-bar-background" href="#">+</a>
								<div class="start-end" data-name="b-bar-background"><label class="first">START</label><input data-type="start"  data-name="b-bar-background-start" class="colorwell" value="#F0F0F0"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="b-bar-background-end" class="colorwell" value="#E9EAEB"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="b-bar-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-body-b">
						<div>
							<h3><a href="#">Content Body</a></h3>
							<form>
								<label class="first">LINK COLOR</label><input data-type="link" data-name="b-body-link-color" class="colorwell" value="#2489CE"/>&nbsp;&nbsp;<a class="more" data-name="b-body-link-color" href="#">+</a><br class="clear" />
								<div class="start-end links" data-name="b-body-link-color">
									<label class="first">LINK HOVER</label><input data-type="link" data-name="b-body-link-hover" class="colorwell" value="#2489CE"/><br class="clear" />
									<label class="first">LINK ACTIVE</label><input data-type="link" data-name="b-body-link-active" class="colorwell" value="#2489CE"/><br class="clear" />
									<label class="first">LINK VISITED</label><input data-type="link" data-name="b-body-link-visited" class="colorwell" value="#2489CE"/>
								</div>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="b-body-color" class="colorwell" value="#333333"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="b-body-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="b-body-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="b-body-shadow-radius" value="0px"/>&nbsp;<input data-name="b-body-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="b-body-background-color" class="colorwell" value="#E5E5E5"/><div class="slider" data-type="background" data-name="b-body-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="b-body-background" href="#">+</a>
								<div class="start-end" data-name="b-body-background"><label class="first">START</label><input data-type="start"  data-name="b-body-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="b-body-background-end" class="colorwell" value="#DDDDDD"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="b-body-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-up-b">
						<div>
							<h3><a href="#">Button: Normal</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="b-bup-color" class="colorwell" value="#444444"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="b-bup-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="b-bup-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="b-bup-shadow-radius" value="1px"/>&nbsp;<input data-name="b-bup-shadow-color" data-type="text-shadow" class="colorwell" value="#F6F6F6"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="b-bup-background-color" class="colorwell" value="#F6F6F6"/><div class="slider" data-type="background" data-name="b-bup-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="b-bup-background" href="#">+</a>
								<div class="start-end" data-name="b-bup-background"><label class="first">START</label><input data-type="start"  data-name="b-bup-background-start" class="colorwell" value="#FEFEFE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="b-bup-background-end" class="colorwell" value="#EEEEEE"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="b-bup-border" class="colorwell" value="#CCCCCC"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-hover-b">
						<div>
							<h3><a href="#">Button: Hover</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="b-bhover-color" class="colorwell" value="#101010"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="b-bhover-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="b-bhover-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="b-bhover-shadow-radius" value="1px"/>&nbsp;<input data-name="b-bhover-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="b-bhover-background-color" class="colorwell" value="#E3E3E3"/><div class="slider" data-type="background" data-name="b-bhover-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="b-bhover-background" href="#">+</a>
								<div class="start-end" data-name="b-bhover-background"><label class="first">START</label><input data-type="start"  data-name="b-bhover-background-start" class="colorwell" value="#EDEDED"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="b-bhover-background-end" class="colorwell" value="#DADADA"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="b-bhover-border" class="colorwell" value="#BBBBBB"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-down-b">
						<div>
							<h3><a href="#">Button: Pressed</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="b-bdown-color" class="colorwell"  value="#FFFFFF"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="b-bdown-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="b-bdown-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="b-bdown-shadow-radius" value="1px"/>&nbsp;<input data-name="b-bdown-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="b-bdown-background-color" class="colorwell" value="#F5F5F5"/><div class="slider" data-type="background" data-name="b-bdown-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="b-bdown-background" href="#">+</a>
								<div class="start-end" data-name="b-bdown-background"><label class="first">START</label><input data-type="start"  data-name="b-bdown-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="b-bdown-background-end" class="colorwell" value="#FDFDFD"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="b-bdown-border" class="colorwell" value="#808080"/><br class="clear"/>
							</form>
						</div>
					</div>
				</div>
				<div id="tab4">
					<h1>Swatch C<a class="delete-swatch-c" href="">Delete</a></h1>

					<div class="accordion" data-form="ui-bar-c">
						<div>
							<h3><a href="#">Header/Footer Bar</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="c-bar-color" class="colorwell" value="#3E3E3E"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="c-bar-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="c-bar-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="c-bar-shadow-radius" value="1px"/>&nbsp;<input data-name="c-bar-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="c-bar-background-color" class="colorwell" value="#EDEDED"/><div class="slider" data-type="background" data-name="c-bar-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="c-bar-background" href="#">+</a>
								<div class="start-end" data-name="c-bar-background"><label class="first">START</label><input data-type="start"  data-name="c-bar-background-start" class="colorwell" value="#F0F0F0"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="c-bar-background-end" class="colorwell" value="#E9EAEB"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="c-bar-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-body-c">
						<div>
							<h3><a href="#">Content Body</a></h3>
							<form>
								<label class="first">LINK COLOR</label><input data-type="link" data-name="c-body-link-color" class="colorwell" value="#2489CE"/>&nbsp;&nbsp;<a class="more" data-name="c-body-link-color" href="#">+</a><br class="clear" />
								<div class="start-end links" data-name="c-body-link-color">
									<label class="first">LINK HOVER</label><input data-type="link" data-name="c-body-link-hover" class="colorwell" value="#2489CE"/><br class="clear" />
									<label class="first">LINK ACTIVE</label><input data-type="link" data-name="c-body-link-active" class="colorwell" value="#2489CE"/><br class="clear" />
									<label class="first">LINK VISITED</label><input data-type="link" data-name="c-body-link-visited" class="colorwell" value="#2489CE"/>
								</div>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="c-body-color" class="colorwell" value="#333333"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="c-body-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="c-body-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="c-body-shadow-radius" value="0px"/>&nbsp;<input data-name="c-body-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="c-body-background-color" class="colorwell" value="#E5E5E5"/><div class="slider" data-type="background" data-name="c-body-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="c-body-background" href="#">+</a>
								<div class="start-end" data-name="c-body-background"><label class="first">START</label><input data-type="start"  data-name="c-body-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="c-body-background-end" class="colorwell" value="#DDDDDD"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="c-body-border" class="colorwell" value="#B3B3B3"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-up-c">
						<div>
							<h3><a href="#">Button: Normal</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="c-bup-color" class="colorwell" value="#444444"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="c-bup-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="c-bup-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="c-bup-shadow-radius" value="1px"/>&nbsp;<input data-name="c-bup-shadow-color" data-type="text-shadow" class="colorwell" value="#F6F6F6"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="c-bup-background-color" class="colorwell" value="#F6F6F6"/><div class="slider" data-type="background" data-name="c-bup-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="c-bup-background" href="#">+</a>
								<div class="start-end" data-name="c-bup-background"><label class="first">START</label><input data-type="start"  data-name="c-bup-background-start" class="colorwell" value="#FEFEFE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="c-bup-background-end" class="colorwell" value="#EEEEEE"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="c-bup-border" class="colorwell" value="#CCCCCC"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-hover-c">
						<div>
							<h3><a href="#">Button: Hover</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="c-bhover-color" class="colorwell" value="#101010"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="c-bhover-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="c-bhover-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="c-bhover-shadow-radius" value="1px"/>&nbsp;<input data-name="c-bhover-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="c-bhover-background-color" class="colorwell" value="#E3E3E3"/><div class="slider" data-type="background" data-name="c-bhover-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="c-bhover-background" href="#">+</a>
								<div class="start-end" data-name="c-bhover-background"><label class="first">START</label><input data-type="start"  data-name="c-bhover-background-start" class="colorwell" value="#EDEDED"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="c-bhover-background-end" class="colorwell" value="#DADADA"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="c-bhover-border" class="colorwell" value="#BBBBBB"/><br class="clear"/>
							</form>
						</div>
					</div>
					<div class="accordion" data-form="ui-btn-down-c">
						<div>
							<h3><a href="#">Button: Pressed</a></h3>
							<form>
								<label class="first">TEXT COLOR</label><input data-type="color" data-name="c-bdown-color" class="colorwell"  value="#FFFFFF"/><br class="clear"/>
								<label class="first">TEXT SHADOW</label><input title="Controls the horizontal offset of text shadow" data-type="text-shadow" data-name="c-bdown-shadow-x" value="0px"/>&nbsp;<input title="Controls the vertical offset of text shadow" data-type="text-shadow" data-name="c-bdown-shadow-y" value="1px"/>&nbsp;<input title="Controls the blur of text shadow" data-type="text-shadow" data-name="c-bdown-shadow-radius" value="1px"/>&nbsp;<input data-name="c-bdown-shadow-color" data-type="text-shadow" class="colorwell" value="#FFFFFF"/><br class="clear"/>
								<div class="separator"></div>
								<label class="first">BACKGROUND</label><input data-type="background" data-name="c-bdown-background-color" class="colorwell" value="#F5F5F5"/><div class="slider" data-type="background" data-name="c-bdown-background-color"></div>&nbsp;&nbsp;<a class="more" data-name="c-bdown-background" href="#">+</a>
								<div class="start-end" data-name="c-bdown-background"><label class="first">START</label><input data-type="start"  data-name="c-bdown-background-start" class="colorwell" value="#EEEEEE"/>&nbsp;<span class="end-label">END</span>&nbsp;<input data-type="end" data-name="c-bdown-background-end" class="colorwell" value="#FDFDFD"/></div>
								<div class="separator"></div>
								<label class="first">BORDER</label><input data-type="border" data-name="c-bdown-border" class="colorwell" value="#808080"/><br class="clear"/>
							</form>
						</div>
					</div>
				</div>
				<div id="tab5">
					<!--new swatch -->
				</div>

			</div>
		</div>
		
		<div id="wrapper">
			<div id="header-wrapper">
				<div id="header">
					<div id="quickswatch">
						<h2>Drag a color onto an element below</h2>
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
						</div>
						<div id="sliders">
							<img src="images/target.png" alt=" "/>
							<span>LIGHTNESS</span><div id="lightness_slider"></div>
							<span>SATURATION</span><div id="saturation_slider"></div>
						</div>
					</div>
					<div id="most-recent-colors">
						<h2>Recent Colors</h2>
						<div class="colors">
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
							<div class="color-drag disabled" style="background-color: #ddd"></div>
						</div>
					</div>
					<div id="back-to-jquery">
						<a href="http://jquerymobile.com/">
							<img src="images/jquery-mobile-logo.png" alt="jQuery Mobile" />
							<img id="right-arrow" src="images/right_arrow.png" alt=" "/>
						</a>
					</div>
				</div>
			</div>

			<div id="content">
				<iframe id="frame" src="preview.html" onload="TR.iframeLoadCallback();">
				</iframe>
			</div>
			
			<?php
				if( isset($style) ) {
					echo '<div style="display: none" id="skip-welcome"></div>';
				} 
			?>
			
			<?php
				if( isset($JQM_VERSION) ) {
					echo '<div id="version">' . $JQM_VERSION . '</div>';
				}
			?>
			
			<div id="style"><?php
					if( isset($style) ) {
						echo $style;
					} else {
						//If the file exists we add the CSS here, if not, we leave it blank for the JS to find on load
						$file_path = "css/jqm.starter.theme.css";
						if( isset($style_id) ) {
							$file_path = "css/user_themes/" . $style_id . ".css";
						}
						if( is_file($file_path) ) {
							echo file_get_contents( $file_path );
						}
					}
				?>
			</div>

		</div>
	</div>
	
	
	
</body>
</html>