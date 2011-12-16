(function($) {
    if (Modernizr.csstransforms3d) {
        var cssPropertyPrefix = function(property) {
            return Modernizr.prefixed ? Modernizr.prefixed(property).replace(/([A-Z])/g, function(value, match) { return '-' + match.toLowerCase(); }).replace(/^ms-/, '-ms-') : property;
        };

        var cssEasings = {
            easeInQuad:     '0.550, 0.085, 0.680, 0.530',
            easeInCubic:    '0.550, 0.055, 0.675, 0.190',
            easeInQuart:    '0.895, 0.030, 0.685, 0.220',
            easeInQuint:    '0.755, 0.050, 0.855, 0.060',
            easeInSine:     '0.470, 0.000, 0.745, 0.715',
            easeInExpo:     '0.950, 0.050, 0.795, 0.035',
            easeInCirc:     '0.600, 0.040, 0.980, 0.335',
            easeOutQuad:    '0.250, 0.460, 0.450, 0.940',
            easeOutCubic:   '0.215, 0.610, 0.355, 1.000',
            easeOutQuart:   '0.165, 0.840, 0.440, 1.000',
            easeOutQuint:   '0.230, 1.000, 0.320, 1.000',
            easeOutSine:    '0.390, 0.575, 0.565, 1.000',
            easeOutExpo:    '0.190, 1.000, 0.220, 1.000',
            easeOutCirc:    '0.075, 0.820, 0.165, 1.000',
            easeInOutQuad:  '0.455, 0.030, 0.515, 0.955',
            easeInOutCubic: '0.645, 0.045, 0.355, 1.000',
            easeInOutQuart: '0.770, 0.000, 0.175, 1.000',
            easeInOutQuint: '0.860, 0.000, 0.070, 1.000',
            easeInOutSine:  '0.445, 0.050, 0.550, 0.950',
            easeInOutExpo:  '1.000, 0.000, 0.000, 1.000',
            easeInOutCirc:  '0.785, 0.135, 0.150, 0.860'
        };

        var completeEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition'   : 'transitionend',
            'OTransition'     : 'oTransitionEnd',
            'msTransition'    : 'msTransitionEnd',
            'transition'      : 'transitionEnd'
        };

        var transitionPrefixed = cssPropertyPrefix('transition');
        var transformPrefixed = cssPropertyPrefix('transform');
        var transformCompleteEvent = completeEventNames[Modernizr.prefixed('transition')];

        $.fn.transition = function(originalProperties, duration, easing, complete) {
            this.each(function(index) {
                var $el = $(this);
                var properties = $.extend({
                    left: $el.css('left'),
                    top: $el.css('top')
                }, originalProperties);

                var transitions = '';

                // FIXME: We don't take into account margins here
                var left = properties.left != 'auto' ? properties.left : 0;
                var top = properties.top != 'auto' ? properties.top : 0;

                // First convert any top and left properties on the object
                if (left || top) {
                    // Retrieve any existing tranforms
                    var transform = $el.css(transformPrefixed);

                    if (transform != 'none') {
                        if (!left) {
                            left = +transform.substring(19, transform.indexOf(',', 19)) || 0;
                        } else if (!top) {
                            top = +transform.substring(transform.lastIndexOf(',') + 2, transform.indexOf(')', 19)) || 0;
                        }
                    }

                    // Make sure we cast values to pixels if they're numbers
                    if (typeof left === 'number') left += 'px';
                    if (typeof top === 'number') top += 'px';

                    // Update our transform with the new values
                    properties[transformPrefixed] = 'translate3d(' + left + ',' + top + ',0)';

                    // Unset left and top
                    properties.left = properties.top = '';
                }

                // Now if we have a duration the fun starts (NOTE: We don't handle fast, slow etc here)
                if (duration > 0) {
                    easing = cssEasings[easing] ? 'cubic-bezier(' + cssEasings[easing] + ')' : easing || 'ease';

                    // Compute parameter string for all properties (TODO: We can use all here?)
                    var parameters = duration + 'ms ' + easing;
                    var transitionProperties = [];

                    for (var property in properties) {
                        if (properties[property]) {
                            transitionProperties.push(property + ' ' + parameters);
                        }
                    }

                    transitions = transitionProperties.join(', ');

                    if (complete) {
                        $el.one(transformCompleteEvent, complete);
                    }
                } else if (complete) {
                    complete();
                }

                // Finally update our properties object with our transitions and set the CSS
                properties[transitionPrefixed] = transitions;

                $el.css(properties);
            });

            return this;
        };
    } else {
        $.fn.transition = function(properties, duration, easing, complete) {
            if (duration > 0) {
                return this.animate(properties, duration, easing, complete);
            } else if (properties) {
                return this.css(properties);
            }
        };
    }
})(jQuery);