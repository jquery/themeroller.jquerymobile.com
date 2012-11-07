<?php
	require_once('version.php');
	date_default_timezone_set('America/Los_Angeles');

    $JQM_VERSION = $_POST["ver"];
    $JQUERY_VERSION = $ALL_JQUERY_VERSIONS[ $JQM_VERSION ];

	$theme_name = $_POST["theme_name"];
	$uncompressed = $_POST["file"];
	
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
	//$zip->addFromString("js/jquery.mobile.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/mobile/latest/jquery.mobile.min.js")));
	//$zip->addFromString("js/jquery.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/jquery.min.js")));
	$zip->addFromString("index.html", "\n<!DOCTYPE html>\n<html>\n	<head>\n		<meta charset=\"utf-8\">\n		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n		<title>jQuery Mobile: Theme Download</title>\n		<link rel=\"stylesheet\" href=\"themes/" . $theme_name . ".min.css\" />\n		<link rel=\"stylesheet\" href=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css\" />\n		<script src=\"http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js\"></script>\n		<script src=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js\"></script>\n	</head>\n	<body>\n		<div data-role=\"page\" data-theme=\"a\">\n			<div data-role=\"header\" data-position=\"inline\">\n				<h1>It Worked!</h1>\n			</div>\n			<div data-role=\"content\" data-theme=\"a\">\n				<p>Your theme was successfully downloaded. You can use this page as a reference for how to link it up!</p>\n				<pre>\n<strong>&lt;link rel=&quot;stylesheet&quot; href=&quot;themes/" . $theme_name . ".min.css&quot; /&gt;</strong>\n&lt;link rel=&quot;stylesheet&quot; href=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css&quot; /&gt;\n&lt;script src=&quot;http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js&quot;&gt;&lt;/script&gt;\n&lt;script src=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js&quot;&gt;&lt;/script&gt;\n				</pre>\n				<p>This is content color swatch \"A\" and a preview of a <a href=\"#\" class=\"ui-link\">link</a>.</p>\n				<label for=\"slider1\">Input slider:</label>\n				<input type=\"range\" name=\"slider1\" id=\"slider1\" value=\"50\" min=\"0\" max=\"100\" data-theme=\"a\" />\n				<fieldset data-role=\"controlgroup\"  data-type=\"horizontal\" data-role=\"fieldcontain\">\n				<legend>Cache settings:</legend>\n				<input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-a1\" value=\"on\" checked=\"checked\" />\n				<label for=\"radio-choice-a1\">On</label>\n				<input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-b1\" value=\"off\"  />\n				<label for=\"radio-choice-b1\">Off</label>\n				</fieldset>\n			</div>\n		</div>\n	</body>\n</html>");
	$zip->close();
	echo ($filename);
	
	
?>