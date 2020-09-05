//////////////////////////////////////////////////////////////////////////////80
// SassCompiler
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the MIT License. See [root]/LICENSE.md for more.
// This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Description: 
// An Scss Compiler using ScssPHP, built for Atheos IDE.
//												- Liam Siira
//////////////////////////////////////////////////////////////////////////////80

(function(global) {

	var atheos = global.atheos,
		amplify = global.amplify;

	var self = null;

	amplify.subscribe('system.loadExtra', () => atheos.sass.init());

	atheos.sass = {

		init: function() {
			self = this;

			amplify.subscribe('contextmenu.show', function(obj) {
				if (/(\.sass|\.scss)$/.test(obj.path)) {
					obj.menu.append('<hr class="file-only sass">');
					obj.menu.append('<a class="file-only sass" onclick="atheos.sass.compile(\'' + obj.path + '\');"><i class="fab fa-sass"></i></span>Compile Sass</a>');
				}
			});
		},

		compile: function(path) {
			data = {
				'target': 'SassCompiler',
				'action': 'phpCompile',
				'format': 'compressed',
				'path': path
			};
					
			echo({
				url: atheos.controller,
				data: data,
				success: function(data) {
					data.raw = true;
					atheos.toast.show(data);
				}
			});

		}
	};
})(this);