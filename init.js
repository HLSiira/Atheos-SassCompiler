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
		o = global.onyx,
		scripts = document.getElementsByTagName('script'),
		path = scripts[scripts.length - 1].src.split('?')[0],
		curpath = path.split('/').slice(0, -1).join('/') + '/';

	amplify.subscribe('atheos.loaded', function() {
		atheos.sass.init();
	});

	atheos.sass = {

		path: curpath,


		init: function() {
			var sass = this;

			amplify.subscribe('contextmenu.show', function(obj) {
				if (/(\.sass|\.scss)$/.test(obj.path)) {
					obj.menu.append('<hr class="file-only sass">');
					obj.menu.append('<a class="file-only sass" onclick="atheos.sass.compile();"><i class="fab fa-sass"></i></span>Compile Sass</a>');
				}
			});
			amplify.subscribe('contextmenu.hide', function() {
				var nodes = o('#contextmenu').find('.sass');
				if (nodes) {
					nodes.forEach(function(node) {
						node.remove();
					});
				}
			});
		},

		compile: function() {
			var path = o('#contextmenu').attr('data-path');

			data = {
				'action': 'phpCompile',
				'format': 'compressed',
				'path': path
			};

			ajax({
				url: this.path + 'controller.php',
				data: data,
				success: function(data) {
					data.raw = true;
					atheos.toast.show(data);
				}
			});

		}
	};
})(this);