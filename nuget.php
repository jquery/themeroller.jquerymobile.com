<?php
	require_once('version.php');
	date_default_timezone_set('America/Los_Angeles');

    $JQM_VERSION = $_POST["ver"];
    $JQUERY_VERSION = $ALL_JQUERY_VERSIONS[ $JQM_VERSION ];

	$theme_name = $_POST["theme_name"];
	$safe_theme_name = preg_replace('/[^A-Za-z0-9-]+/', '',$theme_name);
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

	$dir = scandir('nugets');
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
					unlink('nugets/' . $file);
				}
			}
		}
	}
	$filename = "./nugets/jquery-mobile-nuget-" .  $today . "-" . $last_file_num . ".nupkg";

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
	
	/*
		 /Content
		   /Themes
			   /$name
					 /images


	 */
	$nuget_path = "content/Content/Themes/$name";



	//add files to zip and echo it back to page
	$zip->addFromString($nuget_path."/images/icons-18-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-white.png"));
	$zip->addFromString($nuget_path."/images/icons-18-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-black.png"));
	$zip->addFromString($nuget_path."/images/icons-36-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-white.png"));
	$zip->addFromString($nuget_path."/images/icons-36-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-black.png"));
	$zip->addFromString($nuget_path . "/" . $match, file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/" . $match));
	$zip->addFromString($nuget_path . "/jqm-" . $safe_theme_name . ".css", $uncompressed);
	$zip->addFromString($nuget_path . "/jqm-" . $safe_theme_name . ".min.css", $compressed);

	$zip->addFromString("[Content_Types].xml",'<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
	<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
	<Default Extension="nuspec" ContentType="application/octet" />
	<Default Extension="gif" ContentType="application/octet" />
	<Default Extension="png" ContentType="application/octet" />
	<Default Extension="css" ContentType="application/octet" />
	<Default Extension="psmdcp" ContentType="application/vnd.openxmlformats-package.core-properties+xml" />
</Types>');

	// Generate some random, unique ids
	$id1 = "R".substr(md5($safe_theme_name),0,15);
	$id2 = "R".substr(md5($safe_theme_name),1,15);
	$zip->addFromString("_rels/.rels",'<?xml version="1.0" encoding="utf-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
	<Relationship Type="http://schemas.microsoft.com/packaging/2010/07/manifest" Target="/'.$safe_theme_name.'.nuspec" Id="'.$id1.'" />
	<Relationship Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="/package/services/metadata/core-properties/'.md5($safe_theme_name).'.psmdcp" Id="'.$id2.'" />
</Relationships>');

	$zip->addFromString("package/services/metadata/core-properties/".md5($safe_theme_name).".psmdcp", '<?xml version="1.0" encoding="utf-8"?>
<coreProperties xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.openxmlformats.org/package/2006/metadata/core-properties">
	<dc:creator>You!</dc:creator>
	<dc:description>Custom built jQuery Mobile Theme</dc:description>
	<dc:identifier>'.$safe_theme_name.'</dc:identifier>
	<version>'.$JQM_VERSION.'</version>
	<keywords>jQuery jQueryMobile Themes</keywords>
	<dc:title>Custom jQuery Mobile Theme</dc:title>
</coreProperties>');

	$zip->addFromString($theme_name.".nuspec", "<?xml version=\"1.0\"?>
<package xmlns=\"http://schemas.microsoft.com/packaging/2011/08/nuspec.xsd\">
  <metadata>
    <id>".$safe_theme_name."</id>
		<authors>You!</authors>
    <version>".$JQM_VERSION."</version>
    <title>Custom jQuery Mobile Theme</title>
    <projectUrl>http://themeroller.jquerymobile.com/</projectUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <description>Custom built jQuery Mobile Theme</description>
    <tags>jQuery jQueryMobile Themes</tags>
  </metadata>
</package>");

	$zip->close();
	echo ($filename);
?>
