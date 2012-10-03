<?php
    require_once( 'version.php' );
    if ( isset($_GET['style_id']) ) {
    	$style_id = $_GET['style_id'];
    }
    if ( isset($_GET['ver']) ) {
        $JQM_VERSION = $_GET['ver'];
    }
    if ( isset($_POST['style']) ) {
    	$style = urldecode($_POST['style']);
    }
    $JQUERY_VERSION = $ALL_JQUERY_VERSIONS[ $JQM_VERSION ] ? $ALL_JQUERY_VERSIONS[ $JQM_VERSION ] : "1.6.4";

    $kuler_markup = rtrim( preg_replace( "/\n/", "\n\t\t\t\t\t", file_get_contents( "kuler/kuler.html" ) ) ) . "\n";
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
	<link rel="stylesheet" type="text/css" href="kuler/kuler.css" />

	<script type="text/javascript" src="js/lib/jquery.js"></script>
	<script type="text/javascript" src="js/lib/jquery.ui.js"></script>
	<script type="text/javascript" src="js/lib/jquery.ui.tabs.paging.js"></script>
	<script type="text/javascript" src="js/lib/jquery.color.js"></script>
	<script type="text/javascript" src="js/lib/json2.js"></script>
	<script type="text/javascript" src="js/lib/farbtastic.js"></script>
	<script type="text/javascript" src="js/app.js"></script>
	<script type="text/javascript" src="js/panel.js"></script>
	<script type="text/javascript" src="js/ui.js"></script>
	<script type="text/javascript" src="js/version.js"></script>
	<script type="text/javascript" src="kuler/kuler.js"></script>
	<?php
	    if( file_exists( "jqm/" . $JQM_VERSION . "/panel.js" ) ) {
	         echo '<script type="text/javascript" src="jqm/' . $JQM_VERSION . '/panel.js"></script>';
	    }
	?>
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
				Create up to 26 theme "swatches" lettered from A-Z, 
				each with a unique color scheme, then mix and
				match for unlimited possibilities. We recommend building themes with at least 3 swatches (A-C). 
			</p>
			<p>
				<strong>To upgrade a 1.0 theme to 1.1 or 1.2:</strong> Click the Import button, paste in your uncompressed 1.0 theme, then tweak and download the upgraded version. 
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
				if ( isset($VERSION_LIST) ) {
					echo '<label>Upgrade to version:</label><select id="upgrade-to-version">';
					foreach($VERSION_LIST as $l) {
						echo '<option value="' . $l . '">' . $l . '</option>';
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
  <b class="highlight">&lt;link rel="stylesheet" href="css/themes/my-custom-theme.css" /&gt;</b>
  &lt;link rel="stylesheet" href="http://code.jquery.com/mobile/<span class="version-num"><?php echo $JQM_VERSION; ?></span>/jquery.mobile.structure-<span class="version-num"><?php echo $JQM_VERSION; ?></span>.min.css" /&gt; 
  &lt;script src="http://code.jquery.com/jquery-<?php echo $JQUERY_VERSION; ?>.min.js"&gt;&lt;/script&gt; 
  &lt;script src="http://code.jquery.com/mobile/<span class="version-num"><?php echo $JQM_VERSION; ?></span>/jquery.mobile-<span class="version-num"><?php echo $JQM_VERSION; ?></span>.min.js"&gt;&lt;/script&gt; 

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
			<div class="input-wrapper">
			    <input type="text" value="" />
			    <span class="loading-text">
			        <img src="images/ajax-load-black.gif" />
    			    Loading...
			    </span>
			</div>
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
				<p>The import feature is primarily designed to make it easy to either edit a theme you've downloaded or to generate an updated version of a theme for a new release of the library. When you download a theme, be sure keep the uncompressed version of the theme CSS file because this is used in the import process. To import a theme, click the <strong>Import</strong> link and paste the entire contents of the uncompressed theme file (select all > copy > paste) into the text input in the dialog, and the system will parse the theme into an editable format for sharing and downloading.</p>

				<h3 id="sharing">Sharing themes <a href="#help-top" class="help-top">^ Top</a></h3>
				<p>To generate a theme URL that can be shared with others, click the <strong>Share</strong> link and copy the URL. Post it on Twitter and become a famous theme artist. Anyone that opens the shared URL can edit or download the theme, but this activity won't affect your original theme. Note that due to the high volume of traffic, we can only store your theme on the server for 30 days so shared links have an expiration date. Be sure to download a copy of your theme for safekeeping.</p>

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
					<div id="current-version">Version <?php echo $JQM_VERSION ?></div>
					
					<?php
						if (isset($VERSION_LIST)) {
							echo '<ul><b>Switch to version:</b>';
							foreach($VERSION_LIST as $l) {
								if( $l != $JQM_VERSION ) {
									echo '<li data-version="' . $l . '">' . $l . '</li>';
								}
							}
							echo '</ul>';
						}
					?>
				</div>
				
				<div id="fix-buttons">
					<div id="undo">
						<img src="images/undo.png" alt="Undo" />
						<span>undo</span>
					</div>
					<div id="redo">
						<img src="images/redo.png" alt="Redo" />
						<span>redo</span>
					</div>
				</div>
				<div class="tb-button" id="inspector-button">
					<img src="images/inspector.png" alt=" "/>
					<span>Inspector <strong>off</strong></span>
				</div>
			</div>
			<div id="button-block-2">
				<div class="tb-button" id="download-button">
					<div class="tb-button-inner">
						<img src="images/download.png" alt="Download" />
						<div class="text">
							<span class="big">Download</span>
							<span>theme zip file</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="import-button">
					<div class="tb-button-inner">
						<img src="images/import.png" alt="Import" />
						<div class="text">
							<span class="big">Import</span>
							<span>or upgrade</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="share-button">
					<div class="tb-button-inner">
						<img src="images/share.png" alt="Share" />
						<div class="text">
							<span class="big">Share</span>
							<span>theme link</span>
						</div>
					</div>
				</div>
				<div class="tb-button" id="help-button">
					<div class="tb-button-inner">
						<img src="images/help.png" alt="Help" />
						<div class="text">
							<span class="big">Help</span>
							<span>center</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div id="colorpicker"></div>
		
		<div id="tr_panel">
			<div id="tabs">
				<ul>
				    <!--Tabs and tab panels go here-->
				</ul>
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
					<?php 
					    if( isset($kuler_markup) ) {
					        echo $kuler_markup;
					    }
					?>
					<div id="most-recent-colors">
						<div class="picker">
							<h2>Recent Colors</h2>
							<div class="compact">
								<a id="recent-color-picker" href="#">colors...</a>
                <input type="text" class="colorwell-toggle" value="#FFFFFF" data-name="recent" style="display: none" />
							</div>
						</div>
						<div class="clear"></div>
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
				<iframe id="frame" src="jqm/<?php echo $JQM_VERSION ;?>/preview.html" onload="TR.iframeLoadCallback();">
				</iframe>
			</div>
			
			<?php
				if( isset($JQM_VERSION) ) {
					echo '<div id="version">' . $JQM_VERSION . '</div>';
				}
			?>
			
			<?php
    			if( isset($style) || isset($style_id) ) {
    			    echo '<div style="display: none" id="imported-style">true</div>';
    			}
			?>
			
			<div id="style"><?php
					if( isset($style) ) {
						echo $style;
					} else {
						//If the file exists we add the CSS here, if not, we leave it blank for the JS to find on load
						$file_path = "jqm/" . $JQM_VERSION . "/jqm.starter.theme.css";
						if( isset($style_id) ) {
							$file_path = "jqm/" . $JQM_VERSION . "/user_themes/" . $style_id . ".css";
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
