(function (window, $) {
    
    var _getCurrentSelectedText = function () {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (window.document.selection) {
            return window.document.selection.createRange().text;
        }
        return "";
    };

    $(function () {

        $(".js-a-call-phone").on("ot.trackCallPhone", function () {
            var mouseEnterTimeout = $(this).data("mouseEnterTimeout");
            if (mouseEnterTimeout) {
                clearTimeout(mouseEnterTimeout);
            }
            $(this).data("mouseEnterTime", null);
            $(this).data("mouseEnterTimeout", null);
            var $a = $(this);

            var phoneNumber = $a.attr("href").substr(5);
            window.yaCounterProxy.reachGoal("CALL_PHONE", phoneNumber);
        })
        .click(function() {
            $(this).trigger("ot.trackCallPhone");
        })
        .mouseenter(function () {
            var $a = $(this);
            $a.data("mouseEnterTime", new Date());

            var mouseEnterTimeout = setTimeout(function () {
                $a.trigger("ot.trackCallPhone");
                $a.data("mouseEnterTimeout", null);
                $a.data("mouseEnterTime", null);
                clearTimeout(mouseEnterTimeout);
            }, 3000);


            $a.data("mouseEnterTimeout", mouseEnterTimeout);
        }).mouseleave(function () {
            var mouseEnterTimeout = $(this).data("mouseEnterTimeout");
            if (mouseEnterTimeout) {
                clearTimeout(mouseEnterTimeout);
            }
            $(this).data("mouseEnterTime", null);
            $(this).data("mouseEnterTimeout", null);
        })
        .parent().mouseup(function () {
            var selectedText = _getCurrentSelectedText();
            if (selectedText) {
                $(this).find(".js-a-call-phone").each(function (i, a) {
                    if ($(a).text().indexOf(selectedText) !== -1) {
                        $(a).trigger("ot.trackCallPhone");
                    }
                });
            }
        })

    });

})(window, jQuery);

(function(window, $) {
	$(".js-social-network-link").click(function() {
		yaCounterProxy.reachGoal("SOCIAL_NETWORK_NAV", $(this).data("social-network-id"));	
		
	});
})(window, jQuery)