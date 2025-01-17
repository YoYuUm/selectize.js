/**
 * Plugin: "remove_button" (selectize.js)
 * Copyright (c) 2013 Brian Reavis & contributors
 * Copyright (c) 2020-2022 Selectize Team & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/**
 * @author [Brian Reavis](https://github.com/brianreavis)
 * @typedef {Object} options Object of options available for "remove_button" plugin
 * @param {string} [label=&#xd7;] The label value for remove button
 * @param {string} [title=Remove] The Title value for remove button
 * @param {string} [className=remove] Class name for remove button
 * @param {boolean} [append=true] Append remove button to item
 */
Selectize.define('remove_button', function (options) {
  if (this.settings.mode === 'single') return;

	options = $.extend({
			label     : '&#xd7;',
			title     : 'Remove',
			className : 'remove',
			append    : true
		}, options);

		var multiClose = function(thisRef, options) {

			var self = thisRef;
			var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';

			/**
			 * Appends an element as a child (with raw HTML).
			 *
			 * @param {string} html_container
			 * @param {string} html_element
			 * @return {string}
			 */
			var append = function(html_container, html_element) {
				var pos = html_container.search(/(<\/[^>]+>\s*)$/);
				return html_container.substring(0, pos) + html_element + html_container.substring(pos);
			};

			thisRef.setup = (function() {
				var original = self.setup;
				return function() {
					// override the item rendering method to add the button to each
					if (options.append) {
						var render_item = self.settings.render.item;
						self.settings.render.item = function(data) {
							return append(render_item.apply(thisRef, arguments), html);
						};
					}

					original.apply(thisRef, arguments);

					// add event listener
					thisRef.$control.on('click', '.' + options.className, function(e) {
						e.preventDefault();
						if (self.isLocked) return;

						var $item = $(e.currentTarget).parent();
						self.setActiveItem($item);
						if (self.deleteSelection()) {
							self.setCaret(self.items.length);
						}
						return false;
					});

				};
			})();
		};

    multiClose(this, options);
});
