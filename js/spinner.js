window.app = window.app || {};

(function(app, $) {

    var spinner = null;

    app.Spinner = function Spinner()
    {
        if (!(this instanceof Spinner)) {
            return new Spinner();
        }

        if (spinner) { return spinner };

        spinner = {

            $spinner: null,

            init: function init() {
                this.$spinner = $('.spinner').eq(0);
                return this;
            },

            show: function show() {
                this.$spinner.show();
                return this;
            },

            hide: function hide() {
                this.$spinner.hide();
                return this;
            }
        };

        return spinner.init();

    };


})(window.app, jQuery);