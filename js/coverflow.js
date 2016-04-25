window.app = window.app || {};

(function($) {

    app.Coverflow = function Coverflow($element)
    {
        if (!(this instanceof Coverflow)) {
            return new Coverflow($element);
        }

        var KEY = {
            END:   35,
            HOME:  36,
            LEFT:  37,
            RIGHT: 39,
            UP:    38,
            DOWN:  40
        };

        var images = {

            data: [],
            currentIndex: 0
        };

        var $body = $('body');
        var $coverflow = $('.cover-container');

        var classList = [
            'cover-left-edge',
            'cover-left',
            'cover-center',
            'cover-right',
            'cover-right-edge'
        ];

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            images.data.push(
                this.createImage('img/01.jpg'),
                this.createImage('img/02.jpg'),
                this.createImage('img/03.jpg'),
                this.createImage('img/04.jpg'),
                this.createImage('img/05.jpg'),
                this.createImage('img/06.jpg'),
                this.createImage('img/07.jpg')
            );

            images.currentIndex = 0;

            var size = images.data.length < 3 ? images.data.length:3;

            for (var i = 0; i < size; i++)
            {
                this.shiftLeft()
                this.addToBack(images.data[i]);
            }

            /*
             *  If less then 3 images in set then move existing images close to center
             */
            for (; i++ < 3; this.shiftLeft());

            return this.bindEvents();
        };

        //==================================================================================
        //
        //==================================================================================
        this.createImage = function createImage(src)
        {
            var image = new Image();
                image.src = src || '';

            return image;
        }

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $body
                .on('click', function(e)
                {
                    console.log(e);
                })
                .on('keydown', function(e)
                {
                    if (e.keyCode === KEY.LEFT) {
                        _this.moveLeft();
                    }

                    if (e.keyCode === KEY.RIGHT) {
                        _this.moveRight();
                    }

                    console.log(images.currentIndex, $coverflow.children().length);
                });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.moveLeft = function moveLeft()
        {
            if (images.currentIndex > 0)
            {
                this.scrollRight();

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
        this.moveRight = function moveRight()
        {
            if (images.currentIndex + 1 < images.data.length)
            {
                this.scrollLeft();
                this.addToBack(images.data[images.currentIndex + 3]);

                images.currentIndex++;
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
        this.addToFront = function addToFront(img)
        {
            if (!img) return this;

            var image = new Image();
                image.src = img.src;
                image.width = 400;

            var $cover = $('<div class="cover cover-left-edge"></div>');
                $cover.prepend(image);

            $coverflow.append($cover);

            return this;
        }

        //==================================================================================
        //
        //==================================================================================
        this.addToBack = function addToBack(img)
        {
            if (!img) return this;

            var image = new Image();
                image.src = img.src;
                image.width = 400;

            var $cover = $('<div class="cover cover-right-edge"></div>');
                $cover.append(image);

            $coverflow.append($cover);

            return this;
        }
    };

    var coverFlow = new app.Coverflow('.cover-container');
        coverFlow.init();

})(jQuery);