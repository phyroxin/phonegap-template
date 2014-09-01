Backbone.View.prototype.dispose = function() {
  this.$el.empty();
  this.unbind();
}