/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, jquery:true */

;(function ($, window, document, undefined) {
  "use strict";
  var pluginName = "slideshow",
    defaults = {
      propertyName: "value"
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    this.options = $.extend({}, defaults, options, $(element).data());

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {

    init: function () {
      this.$slidesContainer = $(".slide-container", this.element);
      this.slideWidth = this.getSlideWidth();
      this.setSlidesWidth();
      this.numberOfSlides = $("figure", this.element).length;
      this.currentSlide = 0;

      var me = this;
      $( ".next" ).on("click", function () {
        me.next();
      });
      $( ".prev" ).on("click", function () {
        me.previous();
      });
      
      /*
        listen to event when user clicked the dot below the image
        and then show the right image
      */
      jQuery(window).on("dot.changed", function(event, position) {
          me.goto(position);
      });

    },

    getSlideWidth: function () {
      var max = 0;
      $( "figure", this.element ).each(function () {
        var w = $(this).outerWidth();
        if (w > max) {
          max = w;
        }
      });
      return max;
    },

    setSlidesWidth: function () {
      var $slides = $("figure", this.element);
      var w = 0, i = 0;

      for (i; i < $slides.length; i++) {
        w = w + $($slides[i]).outerWidth();
      }
      this.$slidesContainer.css("width", w);
    },


    next: function () {
      if ((this.currentSlide + 1) >= this.numberOfSlides) {
        this.goto(0, true);
      } else {
        this.goto(this.currentSlide + 1, true);
      }
    },

    previous: function () {
      if ((this.currentSlide - 1) < 0) {
        this.goto(this.numberOfSlides - 1, true);
      } else {
        this.goto(this.currentSlide - 1, true);
      }
    },

    goto: function (position, triggeredFromSlideshow) {
      /*
        in this particulary example the slideshow mechanism based on position of slideshow container
        does not work well. the toggle visibility mechanism works better in all cases
      */ 
      this.$slidesContainer.find("figure")
      // first hide all the figures of the slideshow
      .hide()
      // fadeIn the figure in question
      .filter(function(index, figure) {
        return (parseInt(jQuery(figure).index()) == position)
      })
      .show();

      this.currentSlide = position;

      if (triggeredFromSlideshow) {
        /*
          there's no need to send this instance to the trigger callback as a context
          all we want to know is the position of the currentSlide
        */
        jQuery(window).trigger("slide.changed", [position]);
      }
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
