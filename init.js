/*
	* Copyright (c) atheos & Andr3as, distributed
	* as-is and without warranty under the MIT License.
	* See http://opensource.org/licenses/MIT for more information. 
	* This information must remain intact.
	*/

(function(global, $) {

	var atheos = global.atheos,
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

			atheos.helpers.loadScript(this.path + "sass/sass.js");

			amplify.subscribe('contextmenu.onShow', function(obj) {
				if (!sass.sass) {
					Sass.setWorkerUrl(sass.path + 'sass/sass.worker.js');
					sass.compiler = new Sass();
					sass.compiler.importer(sass.importer.bind(sass));
				}
				if (/(\.sass|\.scss)$/.test(obj.path)) {
					$('#context-menu').append('<hr class="file-only sass">');
					$('#context-menu').append('<a class="file-only sass" onclick="atheos.sass.processFile($(\'#context-menu\').attr(\'data-path\'));"><span class="icon-code"></span>Compile Sass</a>');
				}
			});
			amplify.subscribe('context-menu.onHide', function() {
				$('.sass').remove();
			});
		},

		compile: function(scss, path, callback) {
			var _this = this;
			setTimeout(function() {
				_this.setSettings(path);
				_this.compiler.compile(scss, callback);
			}, 0);
		},

		getIndentation: function() {
			if (atheos.editor.settings.softTabs) {
				var length = parseInt(atheos.editor.settings.tabSize, 10);
				var indent = "";
				for (var i = 0; i < length; i++) {
					indent += " ";
				}
				return indent;
			} else {
				return "\t";
			}
		},

		validPath: function(path) {
			if (/(\.sass|\.scss)$/.test(obj.path)) {
				return true;
			} else {
				return false;
			}
		},

		getMatchingFileOutOfTree: function(path) {
			var dir = this.__dirname(path);
			var basename = this.__basename(path);

			if (dir == path) {
				dir = "";
			} else {
				dir += "/";
			}

			var cases = [
				"_" + basename + ".scss",
				"_" + basename + ".sass",
				"_" + basename + ".css",
				basename + ".scss",
				basename + ".sass",
				basename + ".css"
			];

			for (var j = 0; j < this.tree.length; j++) {
				for (var i = 0; i < cases.length; i++) {
					if (this.tree[j] === (dir + cases[i])) {
						return this.tree[j];
					}
				}
			}
			return false;
		},

		importer: function(request, done) {
			var path = this.getMatchingFileOutOfTree(request.current);

			if (path === false) {
				var result = {};
				result.error = "File not found";
				done(result);
				return;
			} else {
				path = this.base + "/" + path;
			}

			//var path = this.base + "/" + request.current;
			$.getJSON(this.path + 'controller.php?action=getContent&path=' + path, function(response) {
				var result = {};
				if (response.status == "success") {
					result.content = response.content;
				} else {
					result.error = response.message;
				}
				done(result);
			});
		},

		processFile: function(path) {
			if (false) {
				this.base = this.__dirname(path);
				console.log(path);

				ajax({
					url: this.path + 'test.php',
					success: function(data) {
						console.log(data);
					}
				});

			} else {
				var _this = this;
				this.base = this.__dirname(path);
				$.getJSON(this.path + 'controller.php?action=getContent&path=' + path, function(json) {
					if (json.status == "success") {
						$.getJSON(_this.path + 'controller.php?action=getFileTree&path=' + path, function(tree) {
							_this.tree = tree.tree;
							_this.compile(json.content, path, function(result) {
								//Catch errors
								if (result.status === 0) {
									$.post(_this.path + 'controller.php?action=saveContent&path=' + path, {
										content: result.text
									}, function(response) {
										response = JSON.parse(response);
										if (response.status == "success") {
											atheos.filemanager.rescan($('#project-root').attr('data-path'));
											atheos.toast.success(response.message);
										} else {
											atheos.toast.error(response.message);
										}
									});
								} else {
									atheos.toast.error(result.message + " on Line " + result.line + " Column " + result.column);
								}
							});
						});
					} else {
						atheos.toast.error(json.message);
					}
				});
			}
		},

		setSettings: function(path) {
			var _this = this;
			this.compiler.options({
				// style: sass.style.expanded,
				style: Sass.style.compressed,
				indent: _this.getIndentation(),
				// sourceMap: true,
				// sourceMapFile: path + '.map',
				// sourceMapContents: false,
				// sourceMapEmbed: false,
				// sourceMapOmitUrl: false,
				// inputPath: 'stdin',
				// outputPath: 'stdout'
			}, function() {});
		},

		__basename: function(path, suffix) {
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

		__dirname: function(path) {
			// discuss at: http://phpjs.org/functions/dirname/
			return path.replace(/\\/g, '/')
				.replace(/\/[^\/]*\/?$/, '');
		}

	};
})(this, jQuery);