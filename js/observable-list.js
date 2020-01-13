var DKG_UI = (function(module) {
	var EventBindable = module.EventBindable;

	var ObservableList = function() {
		var self = this;

		this.init = function() {
			this.itemsArr = [];
			EventBindable.mixin(this);
		};

		this.length = function() {
			return this.itemsArr.length;
		};

		this.replace = function(index, _newItem) {
			var oldItem;

			if (index >= 0 && index <= (this.length() - 1)) {
				oldItem = this.itemsArr[index];
				this.itemsArr[index] = _newItem;
				this.trigger({type: "listChanged", action: "itemReplaced", replacePosition: index, oldItem: oldItem, newItem: _newItem});
			}
		};

		this.add = function(_newItem) {
			this.itemsArr[this.length()] = _newItem;
			this.trigger({type: "listChanged", action: "itemAdded", item: _newItem});
		};

		this.addAll = function(_newItems) {
			for (var i = 0; i < _newItems.length; i++) {
				this.add(_newItems[i]);
			}
		};

		this.insert = function(index, _newItem) {
			if (index >= 0 && index <= (this.length() - 1)) {
				this.itemsArr.splice(index, 0, _newItem);
				this.trigger({type: "listChanged", action: "itemInserted", insertPosition: index, item: _newItem});
			}
		};

		this.insertAll = function(index, _newItems) {
			for (var i = _newItems.length - 1; i >= 0; i--) {
				this.insert(index, _newItems[i]);
			}
		};

		this.remove = function(index) {
			var itemRemoved;

			if (index >= 0 && index <= (this.length() - 1)) {
				itemRemoved = this.itemsArr[index];
				this.itemsArr.splice(index, 1);
				this.trigger({type: "listChanged", action: "itemRemoved", deletePosition: index, item: itemRemoved});
			}
		};

		this.empty = function() {
			this.itemsArr = [];
			this.trigger({type: "listChanged", action: "emptied"});
		};

		this.get = function(index) {
			var item;

			if (index >= 0 && index <= (this.length() - 1)) {
				item = this.itemsArr[index];
			}
			else {
				item = undefined;
			}

			return item;
		};

		this.init();
	};

	module.ObservableList = ObservableList;

	return module;
}(DKG_UI || {}));
