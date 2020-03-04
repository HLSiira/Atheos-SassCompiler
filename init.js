/*
	* Copyright (c) atheos & Andr3as, distributed
	* as-is and without warranty under the MIT License.
	* See http://opensource.org/licenses/MIT for more information. 
	* This information must remain intact.
	*/

(function(global, $) {

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
		// path: 'plugins/Atheos-SassCompiler/',
		base: "",
		compiler: null, //sass instance
		tree: [],

		init: function() {
			var sass = this;

			amplify.subscribe('contextmenu.onShow', function(obj) {
				if (/(\.sass|\.scss)$/.test(obj.path)) {
					o('#context-menu').append('<hr class="file-only sass">');
					o('#context-menu').append('<a class="file-only sass" onclick="atheos.sass.compile($(\'#context-menu\').attr(\'data-path\'));"><i class="fab fa-sass"></i></span>Compile Sass</a>');
				}
			});
			amplify.subscribe('contextMenu.onHide', function() {
				var nodes = o('#context-menu').find('.sass');
				if(nodes) {
					nodes.forEach(function(node) {
						node.remove();	
					});
				}
			});
		},

		compile: function(path) {

			data = {
				'action': 'phpCompile',
				'format': 'compressed',
				'path': path
			};

			ajax({
				url: this.path + 'controller.new.php',
				type: 'post',
				data: data,
				success: function(response) {
					response = JSON.parse(response);
					if (response.status !== 'error') {
						atheos.toast.success(response.message);
					} else {
						atheos.toast.error(response.message);
					}
				}
			});

		},

		_basename: function(path, suffix) {
			//  discuss at: http://phpjs.org/functions/basename/
			var b = path;
			var lastChar = b.charAt(b.length - 1);

			if (lastChar === '/' || lastChar === '\\') {
				b = b.slice(0, -1);
			}

			b = b.replace(/^.*[\/\\]/g, '');

			if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
				b = b.substr(0, b.length - suffix.length);
			}

			return b;
		},

		_dirname: function(path) {
			// discuss at: http://phpjs.org/functions/dirname/
			return path.replace(/\\/g, '/')
				.replace(/\/[^\/]*\/?$/, '');
		}

	};
})(this, jQuery);