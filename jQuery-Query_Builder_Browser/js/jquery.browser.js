(function ( $ ) {
    $.browser = {
		
		checkMSIE : function() {
			var rv = false; // Return value assumes failure.

			if (navigator.appName == 'Microsoft Internet Explorer')
			{
				rv = true;
			}

			return rv;
		},	
 
		getVersion : function(){
			var ver = -1;

			if (navigator.appName == 'Microsoft Internet Explorer')
			{
				var ua = navigator.userAgent;
				var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					ver = parseFloat( RegExp.$1 );
			}

			return ver;
		}
	}

	$.browser.msie = $.browser.checkMSIE();
	$.browser.version = $.browser.getVersion();
	
}( jQuery ));