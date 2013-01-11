<?php

	// http://bavotasan.com/2011/convert-hex-color-to-rgb-using-php/
	function hex2rgb($hex) {
	   $hex = str_replace("#", "", $hex);

	   if(strlen($hex) == 3) {
		  $r = hexdec(substr($hex,0,1).substr($hex,0,1));
		  $g = hexdec(substr($hex,1,1).substr($hex,1,1));
		  $b = hexdec(substr($hex,2,1).substr($hex,2,1));
	   } else {
		  $r = hexdec(substr($hex,0,2));
		  $g = hexdec(substr($hex,2,2));
		  $b = hexdec(substr($hex,4,2));
	   }
	   $rgb = array($r, $g, $b);
	   //return implode(",", $rgb); // returns the rgb values separated by commas
	   return $rgb; // returns an array with the rgb values
	}

	require_once('version.php');
	date_default_timezone_set('America/Los_Angeles');

    $JQM_VERSION = $_POST["ver"];
    $JQUERY_VERSION = $ALL_JQUERY_VERSIONS[ $JQM_VERSION ];

	$theme_name = $_POST["theme_name"];
	$uncompressed = $_POST["file"];
	/* LessCSS */
	$compressed_less = $_POST["less"];
	$less_attrs = explode('___',$compressed_less);
	$swatches = array();
	$globalVars = array();
	foreach($less_attrs as $attr) {
		$couple = explode('|',$attr);
		$key = $couple[0];
		$value = $couple[1];
		if($key != 'recent' && substr($key,1,1)=='-') {
			$letter = substr($key,0,1);
			$attribute = substr($key,2);
			$swatches[$letter][$attribute] = $value;
		} elseif($key != 'recent' && substr($key,0,7)=='global-') {
			$attribute = substr($key,7);
			if($attribute=='box-shadow-color') {
				$globalVars[$attribute][] = $value;
			} else {
				$globalVars[$attribute] = $value;
			}
		}
	}
	/* /LessCSS */
	
	/*
	//no longer using alternate image paths - keep this here in case we do later on
	//this preg_replace went from url(jqm/1.1.0-rc.1/images/....) to url(images/....)
	//replace image paths with appropriate ones
	$uncompressed = preg_replace_callback('/url\(\.\.\/jqm\/[^\/]*\//sim', 
		create_function(
			'$matches',
			'return "url(";'
		), $uncompressed);
	*/
	
	//minifying CSS file
	$comment_pos = strpos($uncompressed, "\n/* Swatches");
	$comment = substr($uncompressed, 0, $comment_pos);
	$css = substr($uncompressed, $comment_pos, strlen($uncompressed) - $comment_pos);
	
    $compressed = preg_replace_callback('/(\/\*.*?\*\/|\n|\t)/sim',
        create_function(
            '$matches',
            'return "";'
        ), $css);

    // remove all around in ",", ":" and "{"
    $compressed = preg_replace_callback('/\s?(,|{|:){1}\s?/sim',
        create_function(
            '$matches',
            'return $matches[1];'
        ), $compressed);

	$compressed = $comment . $compressed;
	
	$zip = new ZipArchive();

	if(!is_dir('zips')){
		mkdir('zips');
	}

	$dir = scandir('zips');
	$today = date('His', strtotime('now'));
	
	//Loop to detect if any other zips are being created at this very second,
	//Also deletes zip that are older than 15 seconds
	$last_file_num = 0;
	foreach($dir as $file) {
		if($file != '.' && $file != '..' && $file != '.DS_Store') {
			$file_name = explode('.', $file);
			if(isset($file_name[0])) {
				$date = explode('-', $file_name[0]);
				$file_num = $date[4];
				$time = $date[3];
					
				if(is_numeric($file_num) && $file_num > $last_file_num && $date == $today) {
					$last_file_num = $file_num;
				}
				if(strtotime('now - 15 seconds') >= strtotime($time) || strtotime('now + 15 seconds') <= strtotime($time)) {
					unlink('zips/' . $file);
				}
			}
		}
	}
	$filename = "./zips/jquery-mobile-theme-" .  $today . "-" . $last_file_num . ".zip";

	if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
	    exit("cannot open <$filename>\n");
	}
	
	preg_match("/url\(images\/ajax-load[^\)]*\)/", $uncompressed, $match);
	if(!isset($match[0])) {
	    $match = "ajax-loader.gif";
	} else {
	    $match = $match[0];
	    $match = preg_replace("/url\(/", "", $match);
	    $match = preg_replace("/\)/", "", $match);
	}
	
	//add files to zip and echo it back to page
	$zip->addFromString("themes/images/icons-18-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-white.png"));
	$zip->addFromString("themes/images/icons-18-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-black.png"));
	$zip->addFromString("themes/images/icons-36-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-white.png"));
	$zip->addFromString("themes/images/icons-36-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-black.png"));
	$zip->addFromString("themes/" . $match, file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/" . $match));
	$zip->addFromString("themes/" . $theme_name . ".css", $uncompressed);
	$zip->addFromString("themes/" . $theme_name . ".min.css", $compressed);
	
	/* LessCSS */
	$lessString = file_get_contents('./less/swatch.less');
	$globalString = file_get_contents('./less/global.less');
	$appString = "@import \"global.less\";\n@import \"jqm-mixins.less\";";
	$globalVars['icon-color'] = ($globalVars['icon-color']=='white'?'#ffffff':'#000000');
	$opacity = ($globalVars['icon-disc']/100);
	$globalVars['icon-disc'] = "rgba(".implode(',',hex2rgb($globalVars['icon-color'])).",".$opacity.")";
	$globalVars['icon-alt-color'] = ($swatch['global']['icon-color']=='#ffffff'?'#000000':'#ffffff');
	$globalVars['icon-alt-disc'] = "rgba(".implode(',',hex2rgb($globalVars['icon-alt-color'])).",".$opacity.")";
	$globalVars['icon-shadow-color'] = "rgba(".implode(',',hex2rgb($globalVars['icon-alt-color'])).",".$opacity.")";
	foreach($globalVars as $property => $value ) {
		if($property == 'box-shadow-color') {
			$globalString = str_replace('{{box-shadow-color}}',"rgba(".implode(',',hex2rgb($value[0])).",".($value[1]/100).")",$globalString);		
		} else {
			$globalString = str_replace('{{'.$property.'}}',$value,$globalString);
		}
	}
	$zip->addFromString("themes/global.less", $globalString);
	foreach($swatches as $letter => $swatch) {
		$swatchString = str_replace('{{swatch}}',$letter,$lessString);
		foreach($swatch as $property => $value ) {
			$swatchString = str_replace('{{'.$property.'}}',$value,$swatchString);
		}
		$zip->addFromString("themes/swatch-$letter.less", $swatchString);
		$appString .= "\n@import \"swatch-$letter.less\";";
	}
	$zip->addFromString("themes/jqm-mixins.less", file_get_contents('./less/jqm-mixins.less'));
	$zip->addFromString("themes/app.less", $appString);
	$zip->addFromString("themes/$theme_name.less", file_get_contents('./less/theme.less'));
	/* /LessCSS */
	//$zip->addFromString("js/jquery.mobile.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/mobile/latest/jquery.mobile.min.js")));
	//$zip->addFromString("js/jquery.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/jquery.min.js")));
	$zip->addFromString("index.html", "\n<!DOCTYPE html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n		<title>jQuery Mobile: Theme Download</title>\n		<link rel=\"stylesheet\" href=\"themes/" . $theme_name . ".min.css\" />\n		<link rel=\"stylesheet\" href=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css\" />\n		<script src=\"http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js\"></script>\n		<script src=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js\"></script>\n	</head>\n	<body>\n		<div data-role=\"page\" data-theme=\"a\">\n			<div data-role=\"header\" data-position=\"inline\">\n				<h1>It Worked!</h1>\n			</div>\n			<div data-role=\"content\" data-theme=\"a\">\n				<p>Your theme was successfully downloaded. You can use this page as a reference for how to link it up!</p>\n				<pre>\n<strong>&lt;link rel=&quot;stylesheet&quot; href=&quot;themes/" . $theme_name . ".min.css&quot; /&gt;</strong>\n&lt;link rel=&quot;stylesheet&quot; href=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css&quot; /&gt;\n&lt;script src=&quot;http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js&quot;&gt;&lt;/script&gt;\n&lt;script src=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js&quot;&gt;&lt;/script&gt;\n				</pre>\n				<p>This is content color swatch \"A\" and a preview of a <a href=\"#\" class=\"ui-link\">link</a>.</p>\n				<label for=\"slider1\">Input slider:</label>\n				<input type=\"range\" name=\"slider1\" id=\"slider1\" value=\"50\" min=\"0\" max=\"100\" data-theme=\"a\" />\n				<fieldset data-role=\"controlgroup\"  data-type=\"horizontal\" data-role=\"fieldcontain\">\n				<legend>Cache settings:</legend>\n				<input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-a1\" value=\"on\" checked=\"checked\" />\n				<label for=\"radio-choice-a1\">On</label>\n				<input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-b1\" value=\"off\"  />\n				<label for=\"radio-choice-b1\">Off</label>\n				</fieldset>\n			</div>\n		</div>\n	</body>\n</html>");
	$zip->close();
	echo ($filename);
	
	
?>