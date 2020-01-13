var DKG_UI = (function(module) {
	var Panel = function(_options) {
		var self = this;

		this.init = function() {
			this.options = _options;
			this.createControlElement();
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.append = function(elem) {
			this.controlElement.find(".content").append(elem);
		};

		this.showHeader = function() {
			this.controlElement.find(".header").show();
		};
		
		this.hideHeader = function() {
			this.controlElement.find(".header").hide();
		};

		this.setOptions = function(newOptions) {
			var icon;

			if (newOptions.icon !== undefined) {
				this.options.icon = newOptions.icon;
				if (this.options.icon !== "") {
					icon = "<img class='icon' src='" + this.options.icon + "'>";
				}
				else {
					icon = "<div class='icon'></div>";
				}
				this.controlElement.find(".icon").replaceWith(icon);
			}

			if (newOptions.title !== undefined) {
				this.options.title = newOptions.title;
				this.controlElement.find(".title").text(this.options.title);
			}
		};

		this.toHTML = function() {
			var template;
			var html;
			var icon;

			template = "";
			template += "<div class='panel-control'>";
			template += "	<div class='header'>";
			template += "		:icon:<div class='title'>:title:</div>";
			template += "	</div>";
			template += "	<div class='content'></div>";
			template += "</div>";

			if (this.options.icon !== undefined && this.options.icon !== "") {
				icon = "<img class='icon' src='" + this.options.icon + "'>";
			}
			else {
				icon = "<div class='icon'></div>";
			}
			html = template
				.replace(/:icon:/g, icon)
				.replace(/:title:/g, this.options.title);
			
			return html;
		};

		this.init();
	};

	module.Panel = Panel;

	return module;
}(DKG_UI || {}));
