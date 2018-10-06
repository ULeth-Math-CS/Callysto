define(function(require) {
  var $ = require('jquery');
  var Jupyter = require('base/js/namespace');
  var fs = require("fs")
  function load_ipython_extension() {
      let handler = function() {
        fs.appendFile("newTextFile.txt", "Hello Content", function(err) {
          if(err) throw err;
          console.log("Saved!")
        })
      }

      let action = {
        icon: 'fa-comment-o',
        help: 'Show an alert',
        help_index: 'zz',
        handler: handler
      };

      let prefix = "question_extension";
      let action_name = 'show-alert';

      let full_action_name = Jupyter.actions.register(action, action_name, prefix);
      Jupyter.toolbar.add_buttons_group([full_action_name]);
  }

  return {
    load_ipython_extension: load_ipython_extension
  };
});
