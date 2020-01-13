var DKG_UI = (function(module) {
	var EventBindable = {
		createEventListenerElem: function(eventListenerElem) {
			if (eventListenerElem === undefined) {
				this.eventListenerElem = $("<div></div>");
			}
			else {
				this.eventListenerElem = eventListenerElem;
			}
		},

		bind: function(eventName, eventHandler) {
			this.eventListenerElem.bind(eventName, eventHandler);
		},

		unbind: function(eventName, eventHandler) {
			this.eventListenerElem.unbind(eventName, eventHandler);
		},

		trigger: function(triggerOptions) {
			this.eventListenerElem.trigger(triggerOptions);
		},

		mixin: function(target, eventListenerElem) {
			for (var prop in EventBindable) {
				if (prop == "mixin") {
					continue;
				}
				target[prop] = EventBindable[prop];
			}
			target.createEventListenerElem(eventListenerElem);
		}
	};

	module.EventBindable = EventBindable;

	return module;
}(DKG_UI || {}));
