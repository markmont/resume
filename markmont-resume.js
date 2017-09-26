
var resumeUrl = "https://markmont.github.io/resume/";
var allRoles = ["manager", "hpc", "infrastructure", "web"];

$.extend({
    getQsVars: function(){
        var vars = [];
        var parts = window.location.search.substring(1).split("&");
        $.each(parts, function(i, v) {
            var part = v.split("=");
            var name = decodeURIComponent(part[0]);
            var val = decodeURIComponent(part[1]);
            vars[name] = val;
        });
        return vars;
    },
    getQsVal: function(name){
        return $.getQsVars()[name];
    }
});


/*
 * Nav bar:
 *
 */

$("body").scrollspy({ target: "#navbar-toc" });

var navbarTether = new Tether({
    classPrefix: "navbarTether", // don't conflict with scrollspy's use of Tether
    element: ".resume-sidebar",
    attachment: "top right",
    targetAttachment: "top right",
    target: document.body,
    enabled: ($(window).width() >= 768 ? true : false),
    constraints: [ {
        to: "window",
        pin: true
    } ]
});

var navbarSetup = function(event) {
    var width = $(window).width();
    if (navbarTether.enabled && width < 768) {
        navbarTether.position(); // force remove of the transform (otherwide the navbar will be partially off-canvas in Safari)
        navbarTether.disable();
        $(".resume-sidebar").css("position", "static"); // force the navbar to be repositioned
    } else if (!navbarTether.enabled && width >= 768) {
        navbarTether.enable();
    }
    if (width < 768) {
        $("#scrollspy-padding").css("padding-bottom", "0px");
    } else {
	var padding = $(window).height() - $("#contact").height();
	if (padding < 0) {
	    padding = 0;
	} else {
	    padding += 10;
	}
        $("#scrollspy-padding").css("padding-bottom", padding + "px");
    }
}

$(window).on("resize orientationChange", navbarSetup);



/*
 * Popovers:
 *
 */

var popoverToShow = null;
var popoverToHide = null;

$("body").click(function(e) {
    if (popoverToHide !== null) {
	$(popoverToHide).popover("hide");
	popoverToHide = null;
    }
    if (popoverToShow !== null) {
        $(popoverToShow).popover("show");
	popoverToHide = popoverToShow;
	popoverToShow = null;
    }
});

$(".rcard-popover").click(function(e) {
    if (popoverToHide != e.currentTarget) {
        popoverToShow = e.currentTarget;
    }
});


/*
 * Job roles:
 *
 */

$("#role").change(function() {
    var role = $("#role").val();
    if ($.inArray(role, allRoles) == -1) { return; }
    var url = resumeUrl;
    if (role != "manager") {
        url = url + "?role=" + role;
    }
    $("#resume-link").text(url);
    $("#resume-link").attr("href", url);
    var delay = 500;
    $.each(allRoles, function(i, v) {
        var positiveClass = "." + v;
        var negativeClass = ".not-" + v;
        if (v == role) {
            $(positiveClass).show(delay);
            $(negativeClass).hide(delay);
        } else {
            $(positiveClass).hide(delay);
            $(negativeClass).show(delay);
        }
    });
});

$(document).ready(function() {

    navbarTether.position(); // fix Tether positioning artifact
    navbarSetup();

    $(".rcard-popover").popover({
        container: "body",
	placement: "bottom",
	html: true
    });

    var role = $.getQsVal("role");
    if (role === undefined || $.inArray(role, allRoles) == -1) {
        role = 'manager';
    }
    $("#role").val(role).change();

});

