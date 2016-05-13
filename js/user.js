window.app = window.app || {};

(function(app, $) {

    app.User = function User()
    {
        if (!(this instanceof User)) {
            return new User();
        }

        this.info = {
            clientID:     '3bcdd0c94dc949c4970bcd2aecd35c60',
            clientSicret: '4121bb6cab314c909bb683e3388394b5',
            accessToken:  '425749291.1fb234f.569ec48fcce04e9db17a73b1abf38876',
            redirectURL:  'http://alexander-lyakhov.github.io/coverflow/'
        };
    }

})(window.app, jQuery);