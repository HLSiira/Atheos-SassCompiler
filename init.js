//////////////////////////////////////////////////////////////////////////////80
// SassCompiler
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the modified License: MIT - Hippocratic 1.2: firstdonoharm.dev
// See [root]/license.md for more. This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Description: 
// An Scss Compiler using ScssPHP, built for Atheos IDE.
//												- Liam Siira
//////////////////////////////////////////////////////////////////////////////80

(function(global) {

	var atheos = global.atheos,
		amplify = global.amplify,
		oX = global.onyx;

	var self = null;

	amplify.subscribe('system.loadExtra', () => atheos.sass.init());

	atheos.sass = {

		controller: atheos.path + 'plugins/SassCompiler/controller.php',
		dialog: atheos.path + 'plugins/SassCompiler/dialog.php',

		init: function() {
			self = this;

			amplify.subscribe('contextmenu.show', function(obj) {
				if (/(\.sass|\.scss)$/.test(obj.path)) {
					obj.menu.append('<hr class="file-only sass">');
					obj.menu.append('<a class="file-only sass" onclick="atheos.sass.compile();"><i class="fab fa-sass"></i></span>Compile Sass</a>');
				}
			});
		},

		compile: function() {
			var path = oX('#contextmenu').attr('data-path');

			data = {
				'action': 'phpCompile',
				'format': 'compressed',
				'path': path
			};
			
			log(self.controller);

			echo({
				url: self.controller,
				data: data,
				success: function(data) {
					data.raw = true;
					atheos.toast.show(data);
				}
			});

		}
	};
})(this);