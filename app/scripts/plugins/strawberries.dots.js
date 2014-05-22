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
       Ply.core.listen("slide.changed", function(subName, context, payload){
         me.switchDot(payload);
       });
    },

    switchDot : function (position){
      this.dots.removeClass("active");
      $(this.dots[position]).addClass("active");
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
