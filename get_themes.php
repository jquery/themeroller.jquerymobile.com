<?php
	//php script use to query the kuler-api
	//using timeSpan constraint on every query to improve performance
	//kuler api consists of a few url params:
	//search.cfm used to search by tag, title, hex value
	//get.cfm gets certain listTypes
	
	$post = $_POST;
	
	$query_string = '';
	foreach($post as $key => $p) {
		$query_string .= '&' . $key . '=' . $p;
	}
	
	
	header("Content-type: text/xml");
	if(isset($post['list'])) {
		//echo "http://kuler-api.adobe.com/rss/get.cfm?" . $query_string. "&key=6F58FBAB4B2FD2E7B9BC42242664608F";
		echo( file_get_contents("http://76.74.170.230/rss/get.cfm?" . $query_string. "&key=6F58FBAB4B2FD2E7B9BC42242664608F"));
		exit;
	} else if(isset($post['search'])) {
		//echo "http://kuler-api.adobe.com/rss/search.cfm?" . $query_string . "&key=6F58FBAB4B2FD2E7B9BC42242664608F";
		echo( file_get_contents("http://76.74.170.230/rss/search.cfm?" . $query_string . "&key=6F58FBAB4B2FD2E7B9BC42242664608F"));
		exit;
	}
	exit;
?>