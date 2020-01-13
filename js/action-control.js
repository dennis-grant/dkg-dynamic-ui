var DKG_UI = (function(module) {
	var EventBindable = module.EventBindable;
	var ObservableList = module.ObservableList;

	var Action = function(_label, _action, _icon) {
		this.init = function() {
			this.label = _label;
			this.action = _action;
			this.icon = _icon;
		};

		this.init();
	};

	var ActionControl = function(_action) {
		var self = this;

		this.init = function() {
			this.action = _action;
			this.createControlElement();
			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
			this.controlElement.bind("click", this.clicked);
		};

		this.clicked = function() {
			self.trigger({type: "actionPerformed", action: self.action.action});
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.toHTML = function() {
			var template;
			var html;
			var icon;

			template = "<div class='action-control' action=':action:'>:icon:<div class='label'>:label:</div><div style='clear: both;'></div></div>";
			if (this.action.icon !== undefined && this.action.icon !== "") {
				icon = "<img class='icon' src='" + this.action.icon + "'>";
			}
			else {
				icon = "";
			}
			html = template
				.replace(/:action:/g, this.action.action)
				.replace(/:icon:/g, icon)
				.replace(/:label:/g, this.action.label);

			return html;
		};

		this.init();
	};

	var SimpleActionListControl = function(_model, _rendererClass) {
		var self = this;

		this.init = function() {
			var tmpRendererControl;
			var newWrappedElement;

			this.model = _model;
			this.rendererClass = _rendererClass;
			this.rendererControls = new ObservableList();
			this.createControlElement();

			for (var i = 0; i < this.model.length(); i++) {
				tmpRendererControl = new this.rendererClass(this.model.get(i));
				newWrappedElement = $("<div class='simple-list-control-entry'></div>");
				newWrappedElement.append(tmpRendererControl.getControlElement());
				this.controlElement.append(newWrappedElement);
				this.rendererControls.add(tmpRendererControl);
			}
			this.controlElement.append($("<div style='clear: both;'></div>"));

			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.toHTML = function() {
			return "<div class='simple-action-list-control'></div>";
		};

		this.init();
	};

	module.Action = Action;
	module.ActionControl = ActionControl;
	module.SimpleActionListControl = SimpleActionListControl;

	return module;
}(DKG_UI || {}));
