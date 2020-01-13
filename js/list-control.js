var DKG_UI = (function(module) {
	var EventBindable = module.EventBindable;
	var ObservableList = module.ObservableList;

	var ListControl = function(_model, _rendererClass, _width) {
		var self = this;

		this.init = function() {
			var tmpRendererControl;

			this.model = _model;
			this.width = _width;
			this.selectedEntry = undefined;
			this.options = {
				showRollOver: true,
				showSelectedEntry: true,
				emptyListMessage: "There are no items to display."
			};
			this.rendererClass = _rendererClass;
			this.rendererControls = new ObservableList();
			this.listElements = new ObservableList();
			this.createControlElement();

			for (var i = 0; i < this.model.length(); i++) {
				tmpRendererControl = this.createRendererControl(this.model.get(i));
				this.addEntry(tmpRendererControl);
			}

			this.model.bind("listChanged", this.modelChanged);
			EventBindable.mixin(this, this.controlElement);
		};

		this.createControlElement = function() {
			this.controlElement = $(this.toHTML());
			if (this.width != undefined) {
				this.controlElement.css({width: this.width});
			}
		};

		this.getControlElement = function() {
			return this.controlElement;
		};

		this.toHTML = function() {
			var html;

			html = "";
			html += "<div class='list-control'>";
			html += "	<div class='entries'></div>";
			html += "	<div class='empty-list-message'>" + this.options.emptyListMessage + "</div>";
			html += "</div>";

			return html;
		};

		this.entryWrapperHTML = function() {
			return "<div class='list-control-entry'></div>";
		};

		this.setModel = function(newModel) {
			var tmpRendererControl;

			this.model.unbind("listChanged");
			this.emptyEntries();

			this.model = newModel;
			for (var i = 0; i < this.model.length(); i++) {
				tmpRendererControl = this.createRendererControl(this.model.get(i));
				this.addEntry(tmpRendererControl);
			}
			this.model.bind("listChanged", this.modelChanged);
		};

		this.setOptions = function(newOptions) {
			if (newOptions.showRollOver !== undefined) {
				this.options.showRollOver = newOptions.showRollOver;
			}

			if (newOptions.showSelectedEntry !== undefined) {
				this.options.showSelectedEntry = newOptions.showSelectedEntry;
				if (this.options.showSelectedEntry === false && this.selectedEntry !== undefined) {
					this.selectedEntry.removeClass("selected-entry");
				}
				else if (this.options.showSelectedEntry === true && this.selectedEntry !== undefined) {
					this.selectedEntry.addClass("selected-entry");
				}
			}

			if (newOptions.emptyListMessage !== undefined) {
				this.options.emptyListMessage = newOptions.emptyListMessage;
				this.controlElement.find(".empty-list-message").html(this.options.emptyListMessage);
			}
		};

		this.hideEmptyListMessage = function() {
			this.controlElement.find(".empty-list-message").hide();
		};

		this.showEmptyListMessage = function() {
			this.controlElement.find(".empty-list-message").show();
		};

		this.highlightEntry = function(entry) {
			if (this.options.showRollOver === true) {
				entry.addClass("highlighted-entry");
			}
		};

		this.unhighlightEntry = function(entry) {
			entry.removeClass("highlighted-entry");
		};

		this.selectEntryAtPos = function(entryPos) {
			var entry;

			entry = this.listElements.get(entryPos);
			if (entry !== undefined) {
				this.selectEntry(entry);
			}
		};

		this.selectEntry = function(entry) {
			this.unselectEntry();
			this.selectedEntry = entry;
			this.selectedEntry.attr("selected", "yes");
			if (this.options.showSelectedEntry === true) {
				this.selectedEntry.addClass("selected-entry");
			}
			this.trigger({type: "ListControlEvent", subType: "EntrySelected", list: this});
		};

		this.unselectEntry = function() {
			if (this.selectedEntry !== undefined) {
				this.selectedEntry.attr("selected", "");
				this.selectedEntry.removeClass("selected-entry");
			}
		};

		this.entryMouseEnter = function(e) {
			self.highlightEntry($(this));
		};

		this.entryMouseLeave = function(e) {
			self.unhighlightEntry($(this));
		};

		this.entryClicked = function(e) {
			self.selectEntry($(this));
		};

		this.modelChanged = function(e) {
			if (e.action === "itemAdded") {
				self.addEntry(self.createRendererControl(e.item));
			}
			else if (e.action === "itemReplaced") {
				self.replaceEntry(e.replacePosition, self.createRendererControl(e.newItem));
			}
			else if (e.action === "itemInserted") {
				self.insertEntry(e.insertPosition, self.createRendererControl(e.item));
			}
			else if (e.action === "itemRemoved") {
				self.removeEntry(e.deletePosition);
			}
			else if (e.action === "emptied") {
				self.emptyEntries();
			}
		};

		this.createRendererControl = function(modelItem) {
			return new this.rendererClass(modelItem, this.width);
		};

		this.createWrappedElement = function(rendererControl) {
			var wrapperElement;

			wrapperElement = $(this.entryWrapperHTML());
			wrapperElement.append(rendererControl.getControlElement());
			wrapperElement.bind("mouseenter", this.entryMouseEnter);
			wrapperElement.bind("mouseleave", this.entryMouseLeave);
			wrapperElement.bind("click", this.entryClicked);

			return wrapperElement;
		};

		this.addEntry = function(rendererControl) {
			var newWrappedElement;

			newWrappedElement = this.createWrappedElement(rendererControl);
			this.controlElement.find(".entries").append(newWrappedElement);
			this.rendererControls.add(rendererControl);
			this.listElements.add(newWrappedElement);
			this.hideEmptyListMessage();
		};

		this.replaceEntry = function(index, rendererControl) {
			var tmpWrappedElement;
			var newWrappedElement;
			var isSelected;

			if (index >= 0 && index < this.listElements.length()) {
				tmpWrappedElement = this.listElements.get(index);
				newWrappedElement = this.createWrappedElement(rendererControl);
				isSelected = tmpWrappedElement.attr("selected");
				if (isSelected !== undefined && isSelected === "yes") {
					this.selectEntry(newWrappedElement);
				}
				tmpWrappedElement.replaceWith(newWrappedElement);
				this.rendererControls.replace(index, rendererControl);
				this.listElements.replace(index, newWrappedElement);
			}
		};

		this.insertEntry = function(index, rendererControl) {
			var tmpWrappedElement;
			var newWrappedElement;

			if (index >= 0 && index < this.listElements.length()) {
				tmpWrappedElement = this.listElements.get(index);
				newWrappedElement = this.createWrappedElement(rendererControl);
				tmpWrappedElement.before(newWrappedElement);
				this.rendererControls.insert(index, rendererControl);
				this.listElements.insert(index, newWrappedElement);
			}
		};

		this.removeEntry = function(index) {
			var tmpWrappedElement;
			var isSelected;

			if (index >= 0 && index < this.listElements.length()) {
				tmpWrappedElement = this.listElements.get(index);
				isSelected = tmpWrappedElement.attr("selected");
				if (isSelected !== undefined && isSelected === "yes") {
					this.unselectEntry();
				}
				tmpWrappedElement.remove();
				this.rendererControls.remove(index);
				this.listElements.remove(index);

				if (this.listElements.length() === 0) {
					this.showEmptyListMessage();
				}
			}
		};

		this.emptyEntries = function() {
			this.unselectEntry();
			this.controlElement.find(".entries").empty();
			this.rendererControls.empty();
			this.listElements.empty();
			this.showEmptyListMessage();
		};

		this.init();
	};

	module.ListControl = ListControl;

	return module;
}(DKG_UI || {}));
