if (typeof jQuery === "undefined") {
	throw new Error("jQuery plugins need to be before this file");
}

$.AdminBSB = {};
$.AdminBSB.options = {
	colors: {
		red: '#F44336',
		pink: '#E91E63',
		purple: '#9C27B0',
		deepPurple: '#673AB7',
		indigo: '#3F51B5',
		blue: '#2196F3',
		lightBlue: '#03A9F4',
		cyan: '#00BCD4',
		teal: '#009688',
		green: '#4CAF50',
		lightGreen: '#8BC34A',
		lime: '#CDDC39',
		yellow: '#ffe821',
		amber: '#FFC107',
		orange: '#FF9800',
		deepOrange: '#FF5722',
		brown: '#795548',
		grey: '#9E9E9E',
		blueGrey: '#607D8B',
		black: '#000000',
		white: '#ffffff'
	},
	leftSideBar: {
		scrollColor: 'rgba(0,0,0,0.5)',
		scrollWidth: '4px',
		scrollAlwaysVisible: false,
		scrollBorderRadius: '0',
		scrollRailBorderRadius: '0',
		scrollActiveItemWhenPageLoad: true,
		breakpointWidth: 1170
	},
	dropdownMenu: {
		effectIn: 'fadeIn',
		effectOut: 'fadeOut'
	}
}

/* Left Sidebar - Function =================================================================================================
*  You can manage the left sidebar menu options
*  
*/
$.AdminBSB.leftSideBar = {
	activate: function () {
		var _this = this;
		var $body = $('body');
		var $overlay = $('.overlay');

		//Close sidebar
		$(window).click(function (e) {
			var $target = $(e.target);
			if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

			if (!$target.hasClass('bars') && _this.isOpen() && $target.parents('#leftsidebar').length === 0) {
				if (!$target.hasClass('js-right-sidebar')) $overlay.fadeOut();
				$body.removeClass('overlay-open');
			}
		});

		$.each($('.menu-toggle.toggled'), function (i, val) {
			$(val).next().slideToggle(0);
		});

		//When page load
		$.each($('.menu .list li.active'), function (i, val) {
			var $activeAnchors = $(val).find('a:eq(0)');

			$activeAnchors.addClass('toggled');
			$activeAnchors.next().show();
		});

		//Collapse or Expand Menu
		$('.menu-toggle').on('click', function (e) {
			var $this = $(this);
			var $content = $this.next();

			if ($($this.parents('ul')[0]).hasClass('list')) {
				var $not = $(e.target).hasClass('menu-toggle') ? e.target : $(e.target).parents('.menu-toggle');

				$.each($('.menu-toggle.toggled').not($not).next(), function (i, val) {
					if ($(val).is(':visible')) {
						$(val).prev().toggleClass('toggled');
						$(val).slideUp();
					}
				});
			}

			$this.toggleClass('toggled');
			$content.slideToggle(320);
		});

		//Set menu height
		_this.setMenuHeight(true);
		_this.checkStatusForResize(true);
		$(window).resize(function () {
			_this.setMenuHeight(false);
			_this.checkStatusForResize(false);
		});

		//Set Waves
		Waves.attach('.menu .list a', ['waves-block']);
		Waves.init();
	},
	setMenuHeight: function (isFirstTime) {
		if (typeof $.fn.slimScroll != 'undefined') {
			var configs = $.AdminBSB.options.leftSideBar;
			var height = ($(window).height() - ($('.legal').outerHeight() + $('.user-info').outerHeight() + $('.navbar').innerHeight()));
			var $el = $('.list');

			if (!isFirstTime) {
				$el.slimscroll({
					destroy: true
				});
			}

			$el.slimscroll({
				height: height + "px",
				color: configs.scrollColor,
				size: configs.scrollWidth,
				alwaysVisible: configs.scrollAlwaysVisible,
				borderRadius: configs.scrollBorderRadius,
				railBorderRadius: configs.scrollRailBorderRadius
			});

			//Scroll active menu item when page load, if option set = true
			if ($.AdminBSB.options.leftSideBar.scrollActiveItemWhenPageLoad) {
				var item = $('.menu .list li.active')[0];
				if (item) {
					var activeItemOffsetTop = item.offsetTop;
					if (activeItemOffsetTop > 150) $el.slimscroll({ scrollTo: activeItemOffsetTop + 'px' });
				}
			}
		}
	},
	checkStatusForResize: function (firstTime) {
		var $body = $('body');
		var $openCloseBar = $('.navbar .navbar-header .bars');
		var width = $body.width();

		if (firstTime) {
			$body.find('.content, .sidebar').addClass('no-animate').delay(1000).queue(function () {
				$(this).removeClass('no-animate').dequeue();
			});
		}

		if (width < $.AdminBSB.options.leftSideBar.breakpointWidth) {
			$body.addClass('ls-closed');
			$openCloseBar.fadeIn();
		}
		else {
			$body.removeClass('ls-closed');
			$openCloseBar.fadeOut();
		}
	},
	isOpen: function () {
		return $('body').hasClass('overlay-open');
	}
};
//==========================================================================================================================

/* Right Sidebar - Function ================================================================================================
*  You can manage the right sidebar menu options
*  
*/
$.AdminBSB.rightSideBar = {
	activate: function () {
		var _this = this;
		var $sidebar = $('#rightsidebar');
		var $overlay = $('.overlay');

		//Close sidebar
		$(window).click(function (e) {
			var $target = $(e.target);
			if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

			if (!$target.hasClass('js-right-sidebar') && _this.isOpen() && $target.parents('#rightsidebar').length === 0) {
				if (!$target.hasClass('bars')) $overlay.fadeOut();
				$sidebar.removeClass('open');
			}
		});

		$('.js-right-sidebar').on('click', function () {
			$sidebar.toggleClass('open');
			if (_this.isOpen()) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
		});
	},
	isOpen: function () {
		return $('.right-sidebar').hasClass('open');
	}
}
//==========================================================================================================================

/* Searchbar - Function ================================================================================================
*  You can manage the search bar
*  
*/
var $searchBar = $('.search-bar');
$.AdminBSB.search = {
	activate: function () {
		var _this = this;

		//Search button click event
		$('.js-search').on('click', function () {
			_this.showSearchBar();
		});

		//Close search click event
		$searchBar.find('.close-search').on('click', function () {
			_this.hideSearchBar();
		});

		//ESC key on pressed
		$searchBar.find('input[type="text"]').on('keyup', function (e) {
			if (e.keyCode == 27) {
				_this.hideSearchBar();
			}
		});
	},
	showSearchBar: function () {
		$searchBar.addClass('open');
		$searchBar.find('input[type="text"]').focus();
	},
	hideSearchBar: function () {
		$searchBar.removeClass('open');
		$searchBar.find('input[type="text"]').val('');
	}
}
//==========================================================================================================================

/* Navbar - Function =======================================================================================================
*  You can manage the navbar
*  
*/
$.AdminBSB.navbar = {
	activate: function () {
		var $body = $('body');
		var $overlay = $('.overlay');

		//Open left sidebar panel
		$('.bars').on('click', function () {
			$body.toggleClass('overlay-open');
			if ($body.hasClass('overlay-open')) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
		});

		//Close collapse bar on click event
		$('.nav [data-close="true"]').on('click', function () {
			var isVisible = $('.navbar-toggle').is(':visible');
			var $navbarCollapse = $('.navbar-collapse');

			if (isVisible) {
				$navbarCollapse.slideUp(function () {
					$navbarCollapse.removeClass('in').removeAttr('style');
				});
			}
		});
	}
}
//==========================================================================================================================

/* Input - Function ========================================================================================================
*  You can manage the inputs(also textareas) with name of class 'form-control'
*  
*/
$.AdminBSB.input = {
	activate: function ($parentSelector) {
		$parentSelector = $parentSelector || $('body');

		//On focus event
		$parentSelector.find('.form-control').focus(function () {
			$(this).closest('.form-line').addClass('focused');
		});

		//On focusout event
		$parentSelector.find('.form-control').focusout(function () {
			var $this = $(this);
			if ($this.parents('.form-group').hasClass('form-float')) {
				if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
			}
			else {
				$this.parents('.form-line').removeClass('focused');
			}
		});

		//On label click
		$parentSelector.on('click', '.form-float .form-line .form-label', function () {
			$(this).parent().find('input,textarea').focus();
		});

		//Not blank form
		$parentSelector.find('.form-control').each(function () {
			if ($(this).val() !== '' && $(this).parents('.form-group').hasClass('form-float')) {
				$(this).parents('.form-line').addClass('focused');
			}
		});
	}
}
//==========================================================================================================================

/* Form - Select - Function ================================================================================================
*  You can manage the 'select' of form elements
*  
*/
$.AdminBSB.select = {
	activate: function () {
		if ($.fn.selectpicker) { $('select:not(.ms)').selectpicker(); }
	}
}
//==========================================================================================================================

/* DropdownMenu - Function =================================================================================================
*  You can manage the dropdown menu
*  
*/

$.AdminBSB.dropdownMenu = {
	activate: function () {
		var _this = this;

		$('.dropdown, .dropup, .btn-group').on({
			"show.bs.dropdown": function () {
				var dropdown = _this.dropdownEffect(this);
				_this.dropdownEffectStart(dropdown, dropdown.effectIn);
			},
			"shown.bs.dropdown": function () {
				var dropdown = _this.dropdownEffect(this);
				if (dropdown.effectIn && dropdown.effectOut) {
					_this.dropdownEffectEnd(dropdown, function () { });
				}
			},
			"hide.bs.dropdown": function (e) {
				var dropdown = _this.dropdownEffect(this);
				if (dropdown.effectOut) {
					e.preventDefault();
					_this.dropdownEffectStart(dropdown, dropdown.effectOut);
					_this.dropdownEffectEnd(dropdown, function () {
						dropdown.dropdown.removeClass('open');
					});
				}
			}
		});

		//Set Waves
		Waves.attach('.dropdown-menu li a', ['waves-block']);
		Waves.init();
	},
	dropdownEffect: function (target) {
		var effectIn = $.AdminBSB.options.dropdownMenu.effectIn, effectOut = $.AdminBSB.options.dropdownMenu.effectOut;
		var dropdown = $(target), dropdownMenu = $('.dropdown-menu', target);

		if (dropdown.length > 0) {
			var udEffectIn = dropdown.data('effect-in');
			var udEffectOut = dropdown.data('effect-out');
			if (udEffectIn !== undefined) { effectIn = udEffectIn; }
			if (udEffectOut !== undefined) { effectOut = udEffectOut; }
		}

		return {
			target: target,
			dropdown: dropdown,
			dropdownMenu: dropdownMenu,
			effectIn: effectIn,
			effectOut: effectOut
		};
	},
	dropdownEffectStart: function (data, effectToStart) {
		if (effectToStart) {
			data.dropdown.addClass('dropdown-animating');
			data.dropdownMenu.addClass('animated dropdown-animated');
			data.dropdownMenu.addClass(effectToStart);
		}
	},
	dropdownEffectEnd: function (data, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		data.dropdown.one(animationEnd, function () {
			data.dropdown.removeClass('dropdown-animating');
			data.dropdownMenu.removeClass('animated dropdown-animated');
			data.dropdownMenu.removeClass(data.effectIn);
			data.dropdownMenu.removeClass(data.effectOut);

			if (typeof callback == 'function') {
				callback();
			}
		});
	}
}
//==========================================================================================================================

/* Browser - Function ======================================================================================================
*  You can manage browser
*  
*/
var edge = 'Microsoft Edge';
var ie10 = 'Internet Explorer 10';
var ie11 = 'Internet Explorer 11';
var opera = 'Opera';
var firefox = 'Mozilla Firefox';
var chrome = 'Google Chrome';
var safari = 'Safari';

$.AdminBSB.browser = {
	activate: function () {
		var _this = this;
		var className = _this.getClassName();

		if (className !== '') $('html').addClass(_this.getClassName());
	},
	getBrowser: function () {
		var userAgent = navigator.userAgent.toLowerCase();

		if (/edge/i.test(userAgent)) {
			return edge;
		} else if (/rv:11/i.test(userAgent)) {
			return ie11;
		} else if (/msie 10/i.test(userAgent)) {
			return ie10;
		} else if (/opr/i.test(userAgent)) {
			return opera;
		} else if (/chrome/i.test(userAgent)) {
			return chrome;
		} else if (/firefox/i.test(userAgent)) {
			return firefox;
		} else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
			return safari;
		}

		return undefined;
	},
	getClassName: function () {
		var browser = this.getBrowser();

		if (browser === edge) {
			return 'edge';
		} else if (browser === ie11) {
			return 'ie11';
		} else if (browser === ie10) {
			return 'ie10';
		} else if (browser === opera) {
			return 'opera';
		} else if (browser === chrome) {
			return 'chrome';
		} else if (browser === firefox) {
			return 'firefox';
		} else if (browser === safari) {
			return 'safari';
		} else {
			return '';
		}
	}
}
//==========================================================================================================================

$(function () {
	$.AdminBSB.browser.activate();
	$.AdminBSB.leftSideBar.activate();
	$.AdminBSB.rightSideBar.activate();
	$.AdminBSB.navbar.activate();
	$.AdminBSB.dropdownMenu.activate();
	$.AdminBSB.input.activate();
	$.AdminBSB.select.activate();
	$.AdminBSB.search.activate();

	setTimeout(function () { $('.page-loader-wrapper').fadeOut(); }, 50);
});

//==========================================================================================================================
// BEGIN Added for CR

window.csrfToken = $('meta[name="csrf-token"]').attr('content');

moment.locale('eo');
moment.tz.setDefault('utc');

if (window.Dropzone) {
	Dropzone.autoDiscover = false;

	var prot = Dropzone.prototype.submitRequest;
	Dropzone.prototype.submitRequest = function (xhr, formData, files) {
		if (this.options.customHandler) {
			return this.options.customHandler.call(this, xhr, formData, files, function (newXhr, newFormData, newFiles) {
				prot.call(this, newXhr, newFormData, newFiles);
			});
		} else {
			return prot.call(this, xhr, formData, files);
		}
	};
}

/**
 * jQuery.fn.sortElements
 * --------------
 * @param Function comparator:
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *   
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *   
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode; 
 *   })
 *   
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function(){
 
	var sort = [].sort;
 
	return function(comparator, getSortable) {
 
		getSortable = getSortable || function(){return this;};
 
		var placements = this.map(function(){
 
			var sortElement = getSortable.call(this),
				parentNode = sortElement.parentNode,
 
				// Since the element itself will change position, we have
				// to have some way of storing its original position in
				// the DOM. The easiest way is to have a 'flag' node:
				nextSibling = parentNode.insertBefore(
					document.createTextNode(''),
					sortElement.nextSibling
				);
 
			return function() {
 
				if (parentNode === this) {
					throw new Error(
						"You can't sort elements if any one is a descendant of another."
					);
				}
 
				// Insert before flag:
				parentNode.insertBefore(this, nextSibling);
				// Remove flag:
				parentNode.removeChild(nextSibling);
 
			};
 
		});
 
		return sort.call(this, comparator).each(function(i){
			placements[i].call(getSortable.call(this));
		});
 
	};
 
})();

function showError (error) {
	if (error.error === 'NOT_LOGGED_IN') {
		swal({
			icon: 'warning',
			title: 'Vi estis elsalutita',
			text: 'Vi ne plu estas ensalutinta en Centra Reto. Bonvolu konservi eventualajn gravajn ŝanĝojn aliloke kaj reensaluti.',
			button: 'Bone'
		});

		return;
	}

	if (typeof error === 'object' && !(error instanceof Error)) {
		error.frontend_location = window.location.href;
		error.frontend_useragent = navigator.userAgent;
		error.frontend_time = moment().format();
		error = JSON.stringify(error, null, 2);
	}
	var div = document.createElement('div');
	div.innerHTML = '<p>Vi povas provi denove aŭ sendi la suban erarmesaĝon al <a href="mailto:reto@tejo.org">reto@tejo.org</a>.<p><textarea class="cr-code" readonly>' + error + '</textarea>';
	swal({
		title: 'Okazis eraro',
		icon: 'error',
		content: div,
		button: 'Bone'
	});
	console.error(error);
}

// This wrapper function is necessary as promise-polyfill appends an argument to the function
// Either use the below function signature or pass one options object with the following options:
// {string}   method
// {string}   url
// {Object}   data           The JSON data to send
// {boolean}  [handleErrors] Defaults to true.
// {Object}   [xhrEvents]    Events to add to the listener
// {Object[]} [files]        A map of name (string) to file (File) to send along with the JSON data
function performAPIRequest (method, url, data, handleErrors) {
	if (typeof method === 'object') {
		var settings = method;
	} else {
		var settings = {
			method: method,
			url: url,
			data: data,
			handleErrors: handleErrors
		};
	}

	if (settings.method === undefined) { settings.method = 'post'; }
	if (settings.data === undefined) { settings.data = {}; }
	if (settings.handleErrors === undefined) { settings.handleErrors = true; }
	
	return _performAPIRequest(settings);
}

function _performAPIRequest (settings) {
	return new Promise(function (resolve, reject) {
		var handler = function (err, data) {
			if (err) {
				if (settings.handleErrors) {
					showError(err);
					resolve(data);
				} else {
					reject(err);
				}
				return;
			}

			if (!data.success) {
				if (settings.handleErrors) {
					showError(data);
					resolve(data);
				} else {
					reject(data);
				}
				return;
			}

			resolve(data);
		};

		var xhr = new XMLHttpRequest();
		xhr.open(settings.method, settings.url);
		xhr.setRequestHeader('x-csrf-token', csrfToken);

		xhr.addEventListener('load', function (e) {
			if (!this.response) {
				handler(new Error('Empty response'), null);
				return;
			}

			var response = null
			try {
				response = JSON.parse(this.response);
			} catch (err) {
				handler(err, null);
			}

			if (!response) { return; }

			handler(null, response);
		});
		xhr.addEventListener('error', function (e) {
			handler(e, null);
		});

		if (settings.xhrEvents) {
			for (var ev in settings.xhrEvents) {
				(function (ev) {
					var fn = settings.xhrEvents[ev];
					xhr.addEventListener(ev, function (e) {
						fn(e, xhr);
					});
				})(ev);
			}
		}

		if (settings.files && Object.values(settings.files).length > 0) {
			var formData = new FormData();
			formData.append('json', JSON.stringify(settings.data));

			for (var name in settings.files) {
				var file = settings.files[name];
				formData.append(name, file);
			}

			xhr.send(formData);
		} else {
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			xhr.send(JSON.stringify(settings.data));
		}
	});
}

function setUpDataTable (options) {
	var selector        = options.el;
	var method          = options.method;
	var url             = options.url;
	var select          = options.select;
	var defaultOrder    = options.defaultOrder || [];
	var replaceOrder    = options.replaceOrder || {};
	var globalWhere     = options.globalWhere || [];
	var overrideOptions = options.options || {};
	var dataFormatter   = options.dataFormatter || null;

	var el = $(selector);
	var headerOrg = el.find('thead>*')
	var header = headerOrg.clone();
	var foot = document.createElement('tfoot');
	$(foot).append(header);
	el.append(foot);

	var latestData = {};

	var columns = [];
	headerOrg.children().each(function () {
		columns.push(this.dataset.name);
	});

	var dataTableOptions = {
		language: dataTablesEsp,
		order: defaultOrder,
		responsive: true,
		processing: true,
		serverSide: true,
		searchDelay: 800, // ms
		ajax: function (jData, cb, settings) {
			var order = [];
			for (var i in jData.order) {
				var reqOrder = jData.order[i];
				var col = jData.columns[reqOrder.column].name;
				if (replaceOrder[col]) { col = replaceOrder[col]; }

				order.push({
					col: col,
					type: reqOrder.dir
				});
			}

			var globalSearch = [];
			var localSearch = [];
			for (var i in jData.columns) {
				var reqSearch = jData.columns[i];
				if (!reqSearch.searchable) { continue; }

				if (jData.search.value.length > 0) {
					globalSearch.push({
						col: reqSearch.name,
						val: '%' + jData.search.value + '%'
					});
				}

				if (reqSearch.search.value.length > 0) {
					localSearch.push({
						col: reqSearch.name,
						val: '%' + reqSearch.search.value + '%',
						type: 'like'
					});
				}
			}

			var data = {
				select: select,
				offset: jData.start,
				limit: jData.length,
				order: order,
				search: globalSearch,
				where: globalWhere.concat(localSearch)
			};
			performAPIRequest(method, url, data).then(function (apiRes) {
				latestData = apiRes;
				var resData = [];
				for (var x in apiRes.data) {
					var row = apiRes.data[x];
					var entry = [];

					for (var y in jData.columns) {
						var col = jData.columns[y];
						var val = row[col.name];

						if (dataFormatter) { val = dataFormatter(val, col); }

						if (typeof val === 'boolean') {
							val = val ? 'Jes' : 'Ne';
						}
					
						entry.push(val);
					}

					resData.push(entry);
				}

				var res = {
					draw: jData.draw,
					data: resData,
					recordsTotal: apiRes.rows_total,
					recordsFiltered: apiRes.rows_filtered
				};

				cb(res);
			});
		}
	};
	for (var key in overrideOptions) {
		dataTableOptions[key] = overrideOptions[key];
	}
	var table = el.DataTable(dataTableOptions);

	return {
		table: table,
		columns: columns,
		getData: function () { return latestData; },
		getRowData: function (row, comparators) {
			if (!(comparators instanceof Array)) { comparators = [comparators]; }

			var _rowDataRaw = row.data();
			var _rowData = {};
			for (var i in _rowDataRaw) {
				var val = _rowDataRaw[i];
				var key = columns[i];
				_rowData[key] = val;
			}
			var rowData;
			for (var i in latestData.data) {
				var found = true;
				for (var n in comparators) {
					var comparator = comparators[n];
					if (latestData.data[i][comparator] !== _rowData[comparator]) {
						found = false;
						break;
					}
				}
				if (!found) { continue; }

				rowData = latestData.data[i];
				break;
			}

			return rowData;
		}
	};
}

function cloneTemplate (selector) {
	var el = $(selector).clone();
	el.removeClass('template');
	el.removeAttr('id');
	return el;
}

function serializeToObj (selector) {
	var arr = $(selector).serializeArray();
	var data = {};
	for (var i in arr) {
		var row = arr[i];
		data[row.name] = row.value;
	}
	return data;
}

function rot13 (str) {
	return str.replace(/[A-Za-z]/g, function (c) {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
			.charAt(
				"NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm".indexOf(c)
			);
	});
}

function handleMailEls (selector) {
	$(selector).find('[data-mail]').each(function () {
		var obf = this.dataset.mail;
		var mail = rot13(obf);
		this.href = 'mailto:' + mail;
		this.textContent = mail;
		delete this.dataset.mail;
	});
}
handleMailEls(document.body);

// END Added for CR
