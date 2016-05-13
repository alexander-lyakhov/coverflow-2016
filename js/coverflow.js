window.app = window.app || {};

(function(app, $) {

    var SERVICES = {
        FEED: 'https://api.instagram.com/v1/users/self/feed'
        //FEED: 'https://api.instagram.com/v1/users/self/feed?access_token=425749291.1fb234f.569ec48fcce04e9db17a73b1abf38876&max_id=1245834544335779392_374940732&_=1462980560419'
    };

    app.Coverflow = function Coverflow($element)
    {
        if (!(this instanceof Coverflow)) {
            return new Coverflow($element);
        }

        var KEY = {
            ENTER:  13,
            ESCAPE: 27,
            END:    35,
            HOME:   36,
            LEFT:   37,
            RIGHT:  39,
            UP:     38,
            DOWN:   40
        };

        var images = {

            data: [],
            currentIndex: 0,
            remainToLoad: 0,

            createImage: function(src)
            {
                var image = new Image(640, 640);
                    image.src = src || '';
                    image.onload = $.proxy(this.onImageLoadHandler, this);

                return image;
            },

            onImageLoadHandler: function()
            {
                if(--this.remainToLoad === 0) {
                    $(this).trigger('allImagesLoaded');
                }
            }
        };

        var pagination = null;
        var dataset = [];

        var flags = {
            freeze: 0
        };

        var $body = $('body');
        var $coverflow = $('.cover-container');
        var $description = $('.description span');

        var user = app.User();
        var spinner = app.Spinner();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            /*
            images.data.push(
                this.createImage('img/01.jpg'),
                this.createImage('img/02.jpg'),
                this.createImage('img/03.jpg'),
                this.createImage('img/04.jpg'),
                this.createImage('img/05.jpg'),
                this.createImage('img/06.jpg'),
                this.createImage('img/07.jpg')
            );
            */

            return this.bindEvents().getData();
        };

        //==================================================================================
        //
        //==================================================================================
        this.getData = function getData()
        {
            var _this = this;

            var url = SERVICES.FEED + '?access_token=' + user.info.accessToken;

            if (pagination && pagination.next_url) {
                url += '&max_id=' + pagination.next_max_id;
            }

            console.debug(url);

            $.ajax({
                method: "GET",
                url: url,
                dataType: 'jsonp',

                beforeSend: function()
                {
                    flags.freeze = 1;
                    spinner.show();
                },

                success: function(result, status, jqXHR)
                {
                    dataset.length ?
                        dataset.push(result.data):
                        dataset = result.data;

                    _this.setImages(result);
                    console.log('success', pagination, result);
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error');
                }
            });
        };

        //==================================================================================
        //
        //==================================================================================
        this.setImages = function setImages(dataset)
        {
            dataset = dataset || {data:[]};

            images.remainToLoad = dataset.data.length;

            dataset.data.forEach(function(item)
            {
                images.data.push(
                    images.createImage(item.images.standard_resolution.url)
                );
            });

            var size = images.data.length < 3 ? images.data.length:3;

            /*
             *  Will execute for 1st set of images only
             */
            if (!pagination)
            {
                for (var i = 0; i < size; i++)
                {
                    this.shiftLeft()
                    this.addToBack(images.data[i]);
                }

                /*
                 *  If less then 3 images in set then move existing images close to center
                 */
                for (; i++ < 3; this.shiftLeft());
            }

            pagination = dataset.pagination;

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $(images).on('allImagesLoaded', function()
            {
                flags.freeze = 0;
                spinner.hide();
            });

            $body
                .on('click', function(e) {
                    console.log(e);
                })
                .on('keydown', function(e)
                {
                    if (e.keyCode === KEY.ENTER) {
                        _this.zoomIn();
                    }

                    if (e.keyCode === KEY.ESCAPE) {
                        _this.zoomOut();
                    }

                    if (e.keyCode === KEY.LEFT) {
                        _this.moveBackward();
                    }

                    if (e.keyCode === KEY.RIGHT) {
                        _this.moveForward();
                    }

                    //console.log(images.currentIndex, $coverflow.children().length);
                });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveBackward = function moveBackward()
        {
            if (images.currentIndex > 0 && !flags.freeze)
            {
                this.scrollRight();

                $description.text('');

                setTimeout(function() {
                    $description.html(dataset[images.currentIndex].caption.text);
                }, 600);

                if (images.currentIndex > 2) {
                    this.addToFront(images.data[images.currentIndex - 3]);
                }

                images.currentIndex--;
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveForward = function moveForward()
        {
            if (images.currentIndex + 1 < images.data.length && !flags.freeze)
            {
                this.scrollLeft();
                this.addToBack(images.data[images.currentIndex + 3]);

                images.currentIndex++;

                $description.text('');

                setTimeout(function() {
                    $description.html(dataset[images.currentIndex].caption.text);
                }, 600);

                if (pagination && images.currentIndex === images.data.length - 3) {
                    this.getData();
                }
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.shiftLeft = this.scrollLeft = function scrollLeft()
        {
            $coverflow.find('.cover-left-edge').remove();

            $coverflow.find('.cover-left').removeClass('cover-left').addClass('cover-left-edge');
            $coverflow.find('.cover-center').removeClass('cover-center').addClass('cover-left');
            $coverflow.find('.cover-right').removeClass('cover-right').addClass('cover-center');
            $coverflow.find('.cover-right-edge').removeClass('cover-right-edge').addClass('cover-right');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.shiftRight = this.scrollRight = function scrollRight()
        {
            $coverflow.find('.cover-right-edge').remove();

            $coverflow.find('.cover-right').removeClass('cover-right').addClass('cover-right-edge');
            $coverflow.find('.cover-center').removeClass('cover-center').addClass('cover-right');
            $coverflow.find('.cover-left').removeClass('cover-left').addClass('cover-center');
            $coverflow.find('.cover-left-edge').removeClass('cover-left-edge').addClass('cover-left');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.createCover = function createCover(img, className)
        {
            var image = new Image();
                image.src = img.src;
                image.width = 640;

            var $cover = $('<div class="cover ' + className + '"></div>');
                $cover.append(image);

            $coverflow.append($cover);

            return $cover;
        }

        //==================================================================================
        //
        //==================================================================================
        this.addToFront = function addToFront(img)
        {
            img && $coverflow.prepend(this.createCover(img, 'cover-left-edge'));
            return this;
        }

        this.addToBack = function addToBack(img)
        {
            img && $coverflow.append(this.createCover(img, 'cover-right-edge'));
            return this;
        }

        //==================================================================================
        //
        //==================================================================================
        this.zoomIn = function zoomIn()
        {
            flags.freeze = 1;
            $coverflow.find('.cover-center').addClass('cover-zoom-in');

            return this;
        };

        this.zoomOut = function zoomOut()
        {
            flags.freeze = 0;
            $coverflow.find('.cover-center').removeClass('cover-zoom-in');

            return this;
        };
    };

    var coverFlow = new app.Coverflow('.cover-container');
        coverFlow.init();


})(window.app, jQuery);