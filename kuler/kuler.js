$(function(){
	/*
	//This is a plugin for ThemeRoller for jQuery Mobile
	//It adds integration for Adobe Kuler so the user can browse color themes and drag colors onto elements
	//It adds an activation link and all markup and CSS necessary for the interface
	*/
	var kuler_on = 0;
	var search_query = 0;
	var total_pages = 0;
	var current_page = 0;
	
	//Backup plan for hiding details panel
	$( "#kuler" ).mouseout(function() {
		$( ".kuler-details" ).hide();
	});
	
	//Adding kuler activation link
	var h2 = $( "#quickswatch h2" );
	h2.html( h2.html() + " or pick from the <img src=\"kuler/images/kuler-logo-small.png\" alt=\" \"/><span id=\"kuler-activation\">Adobe Kuler swatches&nbsp;<img src=\"kuler/images/arrow-blue.png\" alt=\" \" /></span>" );
	
	$( "#kuler-activation" ).click(initialize_kuler);
	
	//This function adds necessary markup and CSS as well as 
	//setting up draggable events and paging
 	function initialize_kuler() {
		if(!kuler_on) {
			kuler_on = 1;
		
			$( "#quickswatch" ).hide();
			$( "#kuler" ).show();
		
			$('#kuler-close').click(function(){
				$('#kuler').hide();
			})
		
			$( "#kuler-next-page" ).click(function() {
				var id = $( ".kuler-page.active" ).attr( "data-id" );
				var id = id.split( "-" )[1];
				var next = $( "[data-id=page-" + (parseInt(id) + 1) + "]" );
				if( next.html() ) {
					$( ".kuler-page.active" ).removeClass( "active" );
					next.addClass( "active" );
					$( "#kuler-back-page img" ).attr( "src", "kuler/images/arrow-l-light.png" );
					if( $("[data-id=page-" + (parseInt(id) + 2) + "]").html() === null ) {
						$( "#kuler-next-page img" ).attr( "src", "kuler/images/arrow-r.png" );
					}
					current_page += 1;
					$( "#kuler-pages>div:first" ).html( "PAGE<br />" + current_page + "/" + total_pages );
				}
			});

			$( "#kuler-back-page" ).click(function() {
				var id = $( ".kuler-page.active" ).attr( "data-id" );
				var id = id.split( "-" )[1];
				var back = $( "[data-id=page-" + (parseInt(id) - 1) + "]" );
				if( back.html() ) {
					$( ".kuler-page.active" ).removeClass( "active" );
					back.addClass( "active" );
				
					$( "#kuler-next-page img" ).attr( "src", "kuler/images/arrow-r-light.png" );
					if( $("[data-id=page-" + (parseInt(id) - 2) + "]").html() === null ) {
						$( "#kuler-back-page img" ).attr( "src", "kuler/images/arrow-l.png" );
					}
					current_page -= 1;
					$( "#kuler-pages>div:first" ).html( "PAGE<br />" + current_page + "/" + total_pages );
				}
			});

			$( "#kuler-search" ).submit(function(e) {
				e.preventDefault();
				e.stopPropagation();

				var search_by = $( "#kuler-search-by" ).val();
				get_theme( "search=true&timeSpan=30&searchQuery=" + search_by + ":" + $(this).find("input[type=text]").val() );
			});
		
			$( "#kuler-close" ).click(function() {
				$( "#kuler" ).hide();
				$( "#quickswatch" ).show();
			});
		
			$( "#kuler-select" ).bind("change keyup", function(e) {
				//on change we search with the new value
				if( e["type"] == "change" || (e["type"] == "keyup" && e.which == 13) ) {
					var val = $(this).val();
					if( $("#kuler-select [value=" + val + "]").text().indexOf("Search") == -1 ) {
						val = "list=true&listType=" + val + "&timeSpan=30";
						get_theme(val);
						if(search_query) {
							$( "#kuler-search-query" ).hide();
								setTimeout(function(){
								$( "#kuler-select" ).animate({
									marginTop: "20px"
								}, 320);
								search_query = 0;
							}, 200);
						}
					} else {
						//if we choose one that involves a search query we merely show the search field
						if( !search_query ) {
							$( "#kuler-select" ).animate({
								marginTop: "3px"
							}, 320, function(){
								$( "#kuler-search-query" ).fadeIn();
								$( "#kuler-search-query input" ).focus();
							})
							search_query = 1;
						}
					}
				}
			});
		
			$( "#kuler-search-query" ).keydown(function(e) {
				if( e.which == 13 ) {
					get_theme( "search=true&&timeSpan=30&searchQuery=" + $( "#kuler-select" ).val() + ":" + $("input", this).val() );
				}
			});
		
			$( "#kuler-search" ).click(function() {
				get_theme( "search=true&&timeSpan=30&searchQuery=" + $( "#kuler-select" ).val() + ":" + $(this).siblings("input").val() );
			});
		
			get_theme( "list=true&listType=popular&timeSpan=30" );
		} else {
			$( "#quickswatch" ).hide();
			$( "#kuler" ).show();
		}
	}
	
	function get_theme(data){		
		var kuler = $( "#kuler #center-panel" );
		
		$.ajax({
			url: "./kuler.php",
			//proper dataType would be xml but Chrome and Safari would not successfully call $(data) unless we used plain text
			dataType: "text",
			type: "post",
			data: data,
			mimeType: "text/xml",
			beforeSend: function() {
				kuler.find( "*" ).remove();
				$( "#kuler-pages>div:first" ).html( "<br /><br />" );
				kuler.html( "<div id=\"kuler-loader\"><img src=\"images/ajax-load.gif\" alt=\" \" />&nbsp;&nbsp;Loading...</div>" );
			},
			success: function(data){
				kuler.html( "" )
				var xml = $(data);
				var count = 0;
				var page = "";
				var tmp = "";
				var page_count = 1;
				
				xml.find( "kuler\\:themeItem" ).each(function(){
					tmp = "";
					if( count == 0 ) {
						if( page_count == 1 ) {
							page = $( "<div class=\"kuler-page active\" data-id=\"page-1\"></div>" );
						} else {
							page = $( "<div class=\"kuler-page\" data-id=\"page-" + page_count + "\"></div>" );
						}
					}
					
					var $this = $( this );
					var colors = [];
					tmp += "<div class=\"kuler-theme\"><p class=\"kuler-title\" data-id=\"" + count + "\">" + $this.find( "kuler\\:themeTitle" ).text() + "</p>";
					tmp += "<div class=\"kuler-colors\">";
					$this.find( "kuler\\:swatch" ).each(function() {
						colors.push( $(this).find("kuler\\:swatchHexColor").text() );
						tmp += "<div class=\"color-drag\" style=\"background-color:#" + $(this).find( "kuler\\:swatchHexColor" ).text() + "\"></div>";
					});
					tmp += "</div><div class=\"kuler-details\" data-id=\"" + count + "\"><h5>" + $this.find( "kuler\\:themeTitle" ).text() + "</h5><p>by " + $this.find( "kuler\\:authorLabel" ).text() + "</p><div class=\"rating\">";
					var rating = parseInt( $this.find("kuler\\:themeRating").text() );
					for( var i = 0; i < rating; i++ ) {
						tmp += "<img src=\"kuler/images/star.png\" class=\"detail-star\" alt=\" \"/>";
					}
					for( ; i < 5; i++ ) {
						tmp += "<img src=\"kuler/images/star-dark.png\" class=\"detail-star\" alt=\" \"/>";
					}
					tmp += "<span>" + $this.find( "kuler\\:themeDownloadCount" ).text() + " downloads</span></div><div class=\"detail-footer\"><a target=\"_blank\" href=\"http://kuler.adobe.com/index.cfm#themeID/" + $this.find( "kuler\\:themeID" ).text() + "\">View on kuler.com</a><img src=\"kuler/images/arrow-reroute.png\" alt=\" \"/></div></div></div>";
				
					if( count < 6 ) {
						page.append( tmp );
					}
					if( count == 5 ) {
						page_count++;
						kuler.append( page );
						count = -1;
					}
					count++;
				});
				if( count > 0 && count < 5 ) {
					kuler.append(page);
					page_count++;
				}
				
				current_page = 1;
				total_pages = page_count - 1;
				if(total_pages == 0) {
					$( "#kuler-pages>div:first" ).html( "<br /><br />" );
				} else {
					$( "#kuler-pages>div:first" ).html( "PAGE<br />" + current_page + "/" + total_pages );
					$( "#kuler-pages #kuler-back-page" ).html( "<img src=\"kuler/images/arrow-l.png\" alt=\" \" />" );
					if( total_pages == 1 ) {
						$( "#kuler-pages #kuler-next-page" ).html( "<img src=\"kuler/images/arrow-r.png\" alt=\" \" />" );
					} else {
						$( "#kuler-pages #kuler-next-page" ).html( "<img src=\"kuler/images/arrow-r-light.png\" alt=\" \" />" );
					}
				}
				
				$( "#kuler .color-drag" ).draggable({
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
				
				$( "#kuler .color-drag" ).mousedown(function() {
					var color = $( this ).css( "background-color" );
					TR.addMostRecent( color );
				});
				
				$( ".kuler-title" ).mouseover(function() {
					$( ".kuler-details" ).hide();
					var title = $( this );
					var top = title.offset().top;
					var bottom = top + title.height();
					var left = title.offset().left;
					var right = left + title.width();
					$( "[data-id=" + $( this ).attr( "data-id" ) + "].kuler-details" ).css({
						"top": top - 80 + "px",
						"left": right - 319 + "px"
					}).show();
				});

				$( ".kuler-title" ).mouseout(function(e) {
					var title = $( this );
					var top = title.offset().top;
					var bottom = top + title.height();
					var left = title.offset().left;
					var right = left + title.width();
					if( e.pageX < left || e.pageY > bottom || e.pageY < top) {
						$( "[data-id=" + $( this ).attr( "data-id" ) + "].kuler-details" ).hide();
					}
				});

				$( ".kuler-details" ).mouseleave(function() {
					$( this ).hide();
				});
					
			},
			error: function(e) {
				kuler.html( "<div id=\"kuler-loader\" style=\"width: 28px\">Error</div>" );
			}
		});
	}

});

