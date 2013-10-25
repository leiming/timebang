var ConfigModel = ConfigModel || ( function () {

    var _public = {
        configArr:null,
        screensaverArr:null,
        total:0,
        screensaverTotal:0,
        isWhite:0,
        imgArr: null
    };

    // minimum - 18

    _public.configArr = [];
    _public.screensaverArr = [];
    _public.imgArr = [];

    var $loading, $preloader, _finishedLoad = false, _finishedAnimation = false,
        _isShowLoading = false, _isTouch = CMDetect.isTouch, _browserName = CMDetect.browserName,
        _loadingOpts = {
            lines: 12, // The number of lines to draw
            length: 3, // The length of each line
            width: 2, // The line thickness
            radius: 4, // The radius of the inner circle
            color: '#fff', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            zIndex: 2e9 // The z-index (defaults to 2000000000)
        };


    function init(data) {
        _public.configArr = data.data.section;
        _public.screensaverArr = data.data.screensaver;
        _public.total = _public.configArr.length;
        _public.screensaverTotal = _public.screensaverArr.length;
        var first = [], i, total = _public.total, img;
        for (i = 0; i < total; i++) {
            img = _public.configArr[i].poster.img;
            _public.imgArr[i] = img;
            first[i] = '<img src="' + img  + '_c.png">';
        }
        first.push('<img src="images/about.png">');
        first.push('<img src="images/buttons.png">');
        first.push('<img src="images/circle_load.png">');
        first.push('<img src="images/guide.png">');
        if (_isTouch) {
            first.push('<img src="images/rotate.png">');
        } else {
            first.push('<img src="images/cinema.png">');
        }
        return first;
    }

    function convertSaverIdToOrder(id) {
        if (id == "") {
            return 0;
        }
        var i, total = _public.screensaverTotal;
        for (i = 0; i < total; i++) {
            if (id == _public.screensaverArr[i].item.id) {
                return i;
            }
        }
        return 0;
    }

    function convertIdToOrder(id) {
        if (id == "") {
            return 0;
        }
        var i, total = _public.total;
        for (i = 0; i < total; i++) {
            if (id == _public.configArr[i].poster.id) {
                return i;
            }
        }
        return 0;
    }

    function load(no, curSection, txt, item) {
        if ($loading == null) {
            $loading = $('#pantone-loading');
            $preloader = $('#preloader');
        }

        _finishedLoad = false;
        _finishedAnimation = false;

        $loading.css({'background-color':ConfigModel.configArr[curSection].poster.bgcolor, 'width':0}).show();

        var bigimg = ConfigModel.configArr[curSection].poster.img + '_b.jpg';
        $preloader.html('<img src="' + bigimg  + '">');
        var imgLoader = $preloader.imagesLoaded();
        imgLoader.always( function(){
            _finishedLoad = true;
            checkEndLoading(no, curSection, txt, item);
            $preloader.empty();
            imgLoader = null;
        });

        TweenLite.to($loading, 1, {
            css:{'width':'100%'},
            ease:Cubic.easeInOut,
            onComplete:endLoading,
            onCompleteParams:[no, curSection, txt, item]
        });

        //$('#footer').css('color', '#000');
    }


    function endLoading(no, curSection, txt, item) {
        _finishedAnimation = true;
        checkEndLoading(no, curSection, txt, item);
    }

    function checkEndLoading(no, curSection, txt, item) {
        if (_finishedAnimation && !_finishedLoad) {
            _isShowLoading = true;
            if (ConfigModel.isWhite == 1) {
                _loadingOpts.color = '#fff';
            } else {
                _loadingOpts.color = '#000';
            }
            $('#poster-loading').show().spin(_loadingOpts);
        } else if (_finishedAnimation && _finishedLoad) {
            if (_isShowLoading) {
                _isShowLoading = false;
                $('#poster-loading').hide().spin(false);
            }
            CircleAniamtion.ready();
            loadContent(curSection);
            Contents.init(no, curSection, txt, item);
        }
    }


    function loadContent(curSection) {
        var prearr = ConfigModel.configArr[curSection].poster.preload,
            page = ConfigModel.configArr[curSection].poster.page,
            id = ConfigModel.configArr[curSection].poster.id,
            browsers = ConfigModel.configArr[curSection].poster.browser,
            arr = [];

        if (browsers.indexOf(_browserName) != -1 || _isTouch) {
            var i, total = prearr.length;
            for (i = 0; i < total; i++) {
                arr[i] = '<img src="' + prearr[i]  + '">';
            }

            //and add an ajaxrequest
            $.manageAjax.add('ajaxProfile', {
                cacheResponse: true,
                success: function(data) {
                    Contents.setData(data, id);

                    //CircleAniamtion.start();

                    if (total != 0) {
                        var img_tag = arr.join("");
                        $preloader.html(img_tag);
                        var imgLoader = $preloader.imagesLoaded();
                        imgLoader.always( function(){
                            $preloader.empty();
                            imgLoader = null;
                            CircleAniamtion.loaded();
                        });
                    } else {
                        CircleAniamtion.loaded();
                    }
                },
                error: function(data){
                    CircleAniamtion.loaded();
                    var datahtml, msg = 'A network error has occurred and connection has failed.<br>Please refresh the page to try again.';
                    if (ConfigModel.isWhite == 1) {
                        datahtml = '<div class="expError expError-white">' + msg + '</div>';
                    } else {
                        datahtml = '<div class="expError expError-black">' + msg + '</div>';
                    }
                    Contents.setData(datahtml, id);
                },
                url: page
            });
        } else {
            CircleAniamtion.loaded();
            var datahtml, msg = 'Your browser does not seem to support HTML5 perfectly.<br>Please use <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> browser.';
            if (ConfigModel.isWhite == 1) {
                datahtml = '<div class="expError expError-white">' + msg + '</div>';
            } else {
                datahtml = '<div class="expError expError-black">' + msg + '</div>';
            }
            Contents.setData(datahtml, id);
        }
    }

    _public.load = load;
    _public.init = init;
    _public.convertIdToOrder = convertIdToOrder;
    _public.convertSaverIdToOrder = convertSaverIdToOrder;

    return _public;
} )();

