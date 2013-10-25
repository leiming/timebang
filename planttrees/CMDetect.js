var CMDetect = new function(){
    
    var uagent = navigator.userAgent.toLowerCase();

    this.IMG_HALF_W = 110;
    this.IMG_HALF_H = 155;
    this.IMG_W = 220;
    this.IMG_H = 310;

    this.APP_ID = "304280369692789";
    this.SITE_URL = "http://fff.cmiscm.com/";
    this.SITE_TITLE = "Form Follows Function";
    this.SITE_DES = "FFF is a collection of interactive experiences. Each experience has its own unique design and functionality.";

    this.isPaused = false;

        // VARIABLES
    this.isTouch = touch_device();
    this.isIpad = detect_ipad();


    this.isTranslate3d = Modernizr.csstransforms3d;
    this.isTransition = Modernizr.csstransitions;
    this.isCanvas = Modernizr.canvas;
    //this.isMobile = $.browser.mobile;

    this.cssHead;

    this.saveID;

    this.browserName = "";
    if (uagent.indexOf('chrome') > -1) {
        this.browserName = "ch";
    } else if (uagent.indexOf('firefox') > -1) {
        this.browserName = "ff";
    } else if (uagent.indexOf('safari') > -1) {
        this.browserName = "sf";
    } else if (uagent.indexOf('msie') > -1) {
        this.browserName = "ie";
        if ($.browser.version >= 10) {
            this.browserName = "ie10";
        }
    } else if (this.isTouch) {
        this.browserName = "touch";
    } else if (uagent.indexOf('applewebkit') > -1) {
        this.browserName = "sf";
    }

    /*
    if ($.browser.webkit) {
        this.cssHead = "Webkit";
        //this.isTranslate3d = true;
    } else if ($.browser.msie) {
        this.cssHead = "ms";
    } else if ($.browser.mozilla) {
        this.cssHead = "Moz";
        //this.firefoxVersion = $.browser.version;
        //this.isTranslate3d = true;
    } else if ($.browser.opera) {
        this.cssHead = "O";
    }
    */
    //this.isWin = (navigator.appVersion.indexOf("Win")!=-1);




    this.loadingOpts = {
        lines: 12, // The number of lines to draw
        length: 3, // The length of each line
        width: 3, // The line thickness
        radius: 6, // The radius of the inner circle
        color: '#fff', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        zIndex: 2e9 // The z-index (defaults to 2000000000)
    };

    function touch_device() {
        return 'ontouchstart' in window;
    }

    function detect_ipad() {
        if (uagent.search("ipad") > -1  && uagent.search("webkit") > -1) return true;
        else return false;
    }
    /*
    function checkVersion() {
        var agent = window.navigator.userAgent,
            start = agent.indexOf( 'OS ' );
        if(detect_ipad()){
            return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
        }
        return 100;
    }
     */
}



var CSSEasing = CSSEasing || ( function () {
    return {
        linear:         "linear",
	swing:          "ease-out",
	bounce:         "cubic-bezier(0,.35,.5,1.3)",
	// Penner equation approximations from Matthew Lein's Ceaser: http://matthewlein.com/ceaser/
	easeInQuad:     "cubic-bezier(.55,.085,.68,.53)",
	easeInCubic:    "cubic-bezier(.55,.055,.675,.19)",
	easeInQuart:    "cubic-bezier(.895,.03,.685,.22)",
	easeInQuint:    "cubic-bezier(.755,.05,.855,.06)",
	easeInSine:     "cubic-bezier(.47,0,.745,.715)",
	easeInExpo:     "cubic-bezier(.95,.05,.795,.035)",
	easeInCirc:     "cubic-bezier(.6,.04,.98,.335)",
	easeOutQuad:    "cubic-bezier(.25,.46,.45,.94)",
	easeOutCubic:   "cubic-bezier(.215,.61,.355,1)",
	easeOutQuart:   "cubic-bezier(.165,.84,.44,1)",
	easeOutQuint:   "cubic-bezier(.23,1,.32,1)",
	easeOutSine:    "cubic-bezier(.39,.575,.565,1)",
	easeOutExpo:    "cubic-bezier(.23,1,.32,1)",//"cubic-bezier(.19,1,.22,1)",
	easeOutCirc:    "cubic-bezier(.075,.82,.165,1)",
	easeInOutQuad:  "cubic-bezier(.455,.03,.515,.955)",
	easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
	easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
	easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
	easeInOutSine:  "cubic-bezier(.445,.05,.55,.95)",
	easeInOutExpo:  "cubic-bezier(.86,0,.07,1)", //"cubic-bezier(1,0,0,1)",
	easeInOutCirc:  "cubic-bezier(.785,.135,.15,.86)"
    };
} )();