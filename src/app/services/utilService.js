(function () {
    'use strict';

    angular.module('GoTibetWebsite')
        .factory('utilService', utilService);

    /** @ngInject */
    function utilService(rfc4122, $sanitize) {

        var service = {};

        service.UUID = function (appendix) {
            return rfc4122.v4() + appendix;
        };

        service.stripFormat = function (text) {
            var result = service.stripTags(text, '<h1><h2><h3><h4><h5><h6><p>').replace(/style\s*=(['\"\s]?)[^'\"]*?\1/gi,'');
            result=result.replace(/<h1>|<h2>|<h3>|<h4>|<h5>|<h6>/gi,'<p>');
            result=result.replace(/<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>/gi,'</p>');
            // result=result.replace(/<p[^>]*>/gm, '');
            // result=result.replace(/<\/p[^>]*>/gm, '</p><p>');
            return text ? result : '';
            // return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };

        service.stripTags = function (input, allowed) {
            // eslint-disable-line camelcase
            //  discuss at: http://locutus.io/php/strip_tags/
            // original by: Kevin van Zonneveld (http://kvz.io)
            // improved by: Luke Godfrey
            // improved by: Kevin van Zonneveld (http://kvz.io)
            //    input by: Pul
            //    input by: Alex
            //    input by: Marc Palau
            //    input by: Brett Zamir (http://brett-zamir.me)
            //    input by: Bobby Drake
            //    input by: Evertjan Garretsen
            // bugfixed by: Kevin van Zonneveld (http://kvz.io)
            // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
            // bugfixed by: Kevin van Zonneveld (http://kvz.io)
            // bugfixed by: Kevin van Zonneveld (http://kvz.io)
            // bugfixed by: Eric Nagel
            // bugfixed by: Kevin van Zonneveld (http://kvz.io)
            // bugfixed by: Tomasz Wesolowski
            //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
            //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
            //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
            //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
            //   returns 2: '<p>Kevin van Zonneveld</p>'
            //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
            //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
            //   example 4: strip_tags('1 < 5 5 > 1')
            //   returns 4: '1 < 5 5 > 1'
            //   example 5: strip_tags('1 <br/> 1')
            //   returns 5: '1  1'
            //   example 6: strip_tags('1 <br/> 1', '<br>')
            //   returns 6: '1 <br/> 1'
            //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
            //   returns 7: '1 <br/> 1'

            // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
            var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

            return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
            });
        };

        return service;
    }

})();