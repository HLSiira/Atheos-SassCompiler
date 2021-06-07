//////////////////////////////////////////////////////////////////////////////80
// SassCompiler
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the MIT License. See [root]/docs/LICENSE.md for more.
// This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Description: 
// An Scss Compiler using ScssPHP, built for Atheos IDE.
//												- Liam Siira
//////////////////////////////////////////////////////////////////////////////80

(function() {

	const self = {

		init: function() {
			// Add a small HR to context menu
			atheos.contextmenu.fileMenu.push({
				title: 'sass_compile',
				type: 'file',
				exts: ['sass', 'scss']
			});

			// Add a Compile action to context menu
			atheos.contextmenu.fileMenu.push({
				title: 'Compile Sass',
				icon: 'fab fa-sass',
				type: 'file',
				fTypes: ['sass', 'scss'],
				action: 'atheos.sass.compile'
			});
		},

		compile: function(anchor) {
			let path = anchor.path;

			data = {
				target: 'SassCompiler',
				action: 'phpCompile',
				format: 'compressed',
				path: path
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

	carbon.subscribe('contextmenu.requestItems', self.init);
	atheos.sass = self;

})();