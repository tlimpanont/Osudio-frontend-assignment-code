/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, jquery:true */

;(function ($, window, document, undefined) {
  "use strict";
  var pluginName = "dots",
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
      this.dots = $(".dot");
      var me = this;

      this.dots.first().addClass("active");
      
      this.dots.on("click", function(e) {
          var thisDot = jQuery(e.currentTarget);
          var position = parseInt(jQuery(thisDot).parent().data("value"));
          this.switchDot(e, position);
      }.bind(this));

      /*
        There's no need to write own pub/sub system. jQuery provided us a very robust
        solution for that with on and trigger. To keep things short in code we can 
        use jQuery.proxy to pass over this as the object context
      */
      jQuery(window).on("slide.changed", jQuery.proxy(this.switchDot, this));
    },
    /*
      changing callback parameters because this function is an event driven callback (first argument)
    */
    switchDot : function (event, position){
      this.dots.removeClass("active");
      $(this.dots[position]).addClass("active");
      jQuery(window).trigger("dot.changed", [position]);
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
