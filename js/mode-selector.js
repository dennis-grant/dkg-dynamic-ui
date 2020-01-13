var DKG_UI = (function(module) {
	var ModeSelector = {
		DEFAULT_MODE: "__default__",

		DEFAULT_MODE_ATTR_NAME: "mode",

		MODE_CLASS_PAIR_PATTERN: /[^:]*:([^;]*);*/,

		mode: undefined,

		modeOptions: {modeAttributeName: "mode", searchDepth: -1},

		getMode: function() {
			return this.mode;
		},

		setMode: function(_mode) {
			var elemArr;
			var modeSearchPattern;
			var modeClassSearchPattern;
			var elemModeClass;

			if (_mode !== undefined && this.mode !== _mode) {
				this.mode = _mode;

				modeSearchPattern = new RegExp(
					"^" + this.mode + "$|" +
					"^" + this.mode + ",|" +
					"," + this.mode + ",|" +
					"," + this.mode + "$"
				);
				modeClassSearchPattern = new RegExp(
					"^" + this.mode + ":[^;]*$|" +
					"^" + this.mode + ":[^;]*;|" +
					";" + this.mode + ":[^;]*;|" +
					";" + this.mode + ":[^;]*$"
				);

				elemArr = $(this).find("*[mode],*[mode_class]");
				for (var i = 0; i < elemArr.length; i++) {
					this.toggleElement(elemArr[i], modeSearchPattern);
					elemModeClass = $(elemArr[i]).attr("mode_class");
					if (elemModeClass !== undefined && elemModeClass !== "") {
						this.setElementClass(elemArr[i], modeClassSearchPattern);
					}
				}
			}
		},

		toggleElement: function(elem, modeSearchPattern) {
			var elemMode;

			// hide/show element based on its modes
			elemMode = $(elem).attr("mode");
			if (elemMode !== undefined && elemMode !== "") {
				if (modeSearchPattern.test(elemMode) === true) {
					$(elem).show();
				}
				else {
					$(elem).hide();
				}
			}
		},

		setElementClass: function(elem, modeClassSearchPattern) {
			var elemModeClass;
			var matchResults;
			var modeClassMatchStr;
			var tmpClass;

			// change class attribute element based on its modeClasses
			if (this.mode === this.DEFAULT_MODE) {
				tmpClass = $(elem).attr("defaultClass");
				$(elem).removeClass().addClass(tmpClass);
			}
			else {
				elemModeClass = $(elem).attr("mode_class");
				if (elemModeClass !== undefined && elemModeClass !== "") {
					matchResults = elemModeClass.match(modeClassSearchPattern);
					if (matchResults !== null) {
						modeClassMatchStr = matchResults[0];
						matchResults = modeClassMatchStr.match(this.MODE_CLASS_PAIR_PATTERN);
						tmpClass = matchResults[1];
					}
					else {
						tmpClass = $(elem).attr("defaultClass");
					}
					$(elem).removeClass().addClass(tmpClass);
				}
			}
		},

		saveDefaultClass: function() {
			$(this).find("*[mode_class]").each(function(index, elem) {
				$(elem).attr("defaultClass", $(elem).attr("class"));
			});
		},

		resetMode: function() {
			this.setMode(this.DEFAULT_MODE);
		},

		setOptions: function(_options) {
			if (_options !== undefined) {
				for (var opt in _options) {
					this.modeOptions[opt] = _options[opt];
				}
			}
		},

		mixin: function(targetElement) {
			for (var prop in ModeSelector) {
				if (prop == "mixin") {
					continue;
				}
				targetElement[prop] = ModeSelector[prop];
			}
			targetElement.saveDefaultClass();
			targetElement.resetMode();
		}
	};

	module.ModeSelector = ModeSelector;

	return module;
}(DKG_UI || {}));
