/* global ajaxurl, kirkiL10n */
var kirki = {

	initialized: false,

	/**
	 * Initialize the object.
	 *
	 * @since 3.0.17
	 * @returns {void}
	 */
	initialize: function() {
		var self = this;

		// We only need to initialize once.
		if ( self.initialized ) {
			return;
		}

		self.util.webfonts.google.initialize();

		// Mark as initialized.
		self.initialized = true;
	},

	/**
	 * Set and get controls.
	 * Useful to avoid lots of code duplication.
	 *
	 * @since 3.0.17
	 */
	Control: {

		/**
		 * Store controls.
		 * Caching & avoids code duplication.
		 *
		 * @since 3.0.17
		 * @var {Object}
		 */
		_controls: {},

		/**
		 * Store a control in this._controls.
		 *
		 * @since 3.0.17
		 * @param {Object} args - All the control arguments.
		 * @returns {void}
		 */
		set: function( args ) {
			var id   = ( args.id ) ? args.id : false,
			    self = this;

			if ( ! id && args['data-id'] ) {
				id = args['data-id'];
			}

			// If no ID then there's no reason to proceed.
			if ( ! id ) {
				return;
			}

			args.id = id;
			self._controls[ id ] = args;
		},

		/**
		 * Gets a control that we have already set.
		 * Returns false if the control does not exist.
		 *
		 * @since 3.0.17
		 * @param {string} id - The control ID.
		 * @returns {Object}
		 */
		get: function( id ) {
			if ( 'undefined' === typeof this._controls[ id ] || ! this._controls[ id ] ) {
				return;
			}
			return this._controls[ id ];
		}
	},

	/**
	 * An object containing definitions for controls.
	 *
	 * @since 3.0.16
	 */
	Controls: {

		/**
		 * The radio control.
		 *
		 * @since 3.0.17
		 */
		'kirki-radio': {

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The customizer control object.
			 * @returns {void}
			 */
			init: function( control ) {
				var self = this;

				// Render the template.
				self.template( control );

				// Init the control.
				kirki.Input.radio.init( control );

			},

			/**
			 * Render the template.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The customizer control object.
			 * @param {Object} control.params - The control parameters.
			 * @param {string} control.params.label - The control label.
			 * @param {string} control.params.description - The control description.
			 * @param {string} control.params.inputAttrs - extra input arguments.
			 * @param {string} control.params.default - The default value.
			 * @param {Object} control.params.choices - Any extra choices we may need.
			 * @param {string} control.id - The setting.
			 * @returns {void}
			 */
			template: function( control ) {
				control.container.html( kirki.Input.radio.getTemplate( {
					label: control.params.label,
					description: control.params.description,
					'data-id': control.id,
					inputAttrs: control.params.inputAttrs,
					'default': control.params['default'],
					value: kirki.Setting.get( control.id ),
					choices: control.params.choices
				} ) );
			}
		},

		/**
		 * The color control.
		 *
		 * @since 3.0.16
		 */
		'kirki-color': {

			/**
			 * Init the control.
			 *
			 * @since 3.0.16
			 * @param {Object} control - The customizer control object.
			 * @returns {void}
			 */
			init: function( control ) {
				var self = this;

				// Render the template.
				self.template( control );

				// Init the control.
				kirki.Input.color.init( control );

			},

			/**
			 * Render the template.
			 *
			 * @since 3.0.16
			 * @param {Object}     control - The customizer control object.
			 * @param {Object}     control.params - The control parameters.
			 * @param {string}     control.params.label - The control label.
			 * @param {string}     control.params.description - The control description.
			 * @param {string}     control.params.mode - The colorpicker mode. Can be 'full' or 'hue'.
			 * @param {bool|array} control.params.palette - false if we don't want a palette,
			 *                                              true to use the default palette,
			 *                                              array of custom hex colors if we want a custom palette.
			 * @param {string}     control.params.inputAttrs - extra input arguments.
			 * @param {string}     control.params.default - The default value.
			 * @param {Object}     control.params.choices - Any extra choices we may need.
			 * @param {boolean}    control.params.choices.alpha - should we add an alpha channel?
			 * @param {string}     control.id - The setting.
			 * @returns {void}
			 */
			template: function( control ) {
				control.container.html( kirki.Input.color.getTemplate( {
					label: control.params.label,
					description: control.params.description,
					'data-id': control.id,
					mode: control.params.mode,
					inputAttrs: control.params.inputAttrs,
					'data-palette': control.params.palette,
					'data-default-color': control.params['default'],
					'data-alpha': control.params.choices.alpha,
					value: kirki.Setting.get( control.id )
				} ) );
			}
		},

		/**
		 * The generic control.
		 *
		 * @since 3.0.16
		 */
		'kirki-generic': {

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The customizer control object.
			 * @param {Object} control.params - Control parameters.
			 * @param {Object} control.params.choices - Define the specifics for this input.
			 * @param {string} control.params.choices.element - The HTML element we want to use ('input', 'div', 'span' etc).
			 * @returns {void}
			 */
			init: function( control ) {
				var self = this;

				// Render the template.
				self.template( control );

				// Init the control.
				if ( ! _.isUndefined( control.params ) && ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.element ) && 'textarea' === control.params.choices.element ) {
					kirki.Input.textarea.init( control );
					return;
				}
				kirki.Input.genericInput.init( control );
			},

			/**
			 * Render the template.
			 *
			 * @since 3.0.17
			 * @param {Object}  control - The customizer control object.
			 * @param {Object}  control.params - The control parameters.
			 * @param {string}  control.params.label - The control label.
			 * @param {string}  control.params.description - The control description.
			 * @param {string}  control.params.inputAttrs - extra input arguments.
			 * @param {string}  control.params.default - The default value.
			 * @param {Object}  control.params.choices - Any extra choices we may need.
			 * @param {boolean} control.params.choices.alpha - should we add an alpha channel?
			 * @param {string}  control.id - The setting.
			 * @returns {void}
			 */
			template: function( control ) {
				var args = {
						label: control.params.label,
						description: control.params.description,
						'data-id': control.id,
						inputAttrs: control.params.inputAttrs,
						choices: control.params.choices,
						value: kirki.Setting.get( control.id )
				    };

				if ( ! _.isUndefined( control.params ) && ! _.isUndefined( control.params.choices ) && ! _.isUndefined( control.params.choices.element ) && 'textarea' === control.params.choices.element ) {
					control.container.html( kirki.Input.textarea.getTemplate( args ) );
					return;
				}
				control.container.html( kirki.Input.genericInput.getTemplate( args ) );
			}
		},

		'kirki-select': {

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The customizer control object.
			 * @returns {void}
			 */
			init: function( control ) {
				var self = this;

				// Render the template.
				self.template( control );

				// Init the control.
				kirki.Input.select.init( control );
			},

			/**
			 * Render the template.
			 *
			 * @since 3.0.17
			 * @param {Object}  control - The customizer control object.
			 * @param {Object}  control.params - The control parameters.
			 * @param {string}  control.params.label - The control label.
			 * @param {string}  control.params.description - The control description.
			 * @param {string}  control.params.inputAttrs - extra input arguments.
			 * @param {Object}  control.params.default - The default value.
			 * @param {Object}  control.params.choices - The choices for the select dropdown.
			 * @param {string}  control.id - The setting.
			 * @returns {void}
			 */
			template: function( control ) {
				var args = {
						label: control.params.label,
						description: control.params.description,
						'data-id': control.id,
						inputAttrs: control.params.inputAttrs,
						choices: control.params.choices,
						value: kirki.Setting.get( control.id )
				    };

				control.container.html( kirki.Input.select.getTemplate( args ) );
			}
		},

		'kirki-typography': {

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The customizer control object.
			 * @returns {void}
			 */
			init: function( control ) {
				var self = this;

				// Render the template.
				self.template( control );
			},

			/**
			 * Render the template.
			 *
			 * @since 3.0.17
			 * @param {Object}  control - The customizer control object.
			 * @param {Object}  control.params - The control parameters.
			 * @param {string}  control.params.label - The control label.
			 * @param {string}  control.params.description - The control description.
			 * @param {string}  control.params.inputAttrs - extra input arguments.
			 * @param {Object}  control.params.default - The default value.
			 * @param {Object}  control.params.choices - The choices for the select dropdown.
			 * @param {string}  control.id - The setting.
			 * @returns {void}
			 */
			template: function( control ) {
				var html = '';

				if ( control.params.label ) {
					html += '<span class="customize-control-title">' + control.params.label + '</span>';
				}
				if ( control.params.description ) {
					html += '<span class="description customize-control-description">' + control.params.description + '</span>';
				}

				html += '<div class="wrapper">';

				if ( control.params['default']['font-family'] ) {

					// Font-family.
					kirki.Control.set( {
						label: 'Font Family', // TODO: i18n
						inputAttrs: 'placeholder="Select Font Family"', // TODO: i18n
						'data-id': control.id + '[font-family]',
						'default': control.params['default']['font-family']
					} );
					html += '<div class="font-family">' + kirki.Input.select.getTemplate( kirki.Control.get( control.id + '[font-family]' ) ) + '</div>';
					kirki.Input.select.init( kirki.Control.get( control.id + '[font-family]' ) );

					// Font-backup.
					kirki.Control.set( {
						label: 'Backup Font', // TODO: i18n
						inputAttrs: 'placeholder="Select Font Family"', // TODO: i18n
						'data-id': control.id + '[font-backup]',
						'default': control.params['default']['font-backup']
					} );
					html += '<div class="font-backup">' + kirki.Input.select.getTemplate( kirki.Control.get( control.id + '[font-backup]' ) ) + '</div>';
					kirki.Input.select.init( kirki.Control.get( control.id + '[font-backup]' ) );

					// Variants.
					// TODO: <# if ( true === data.show_variants || false !== data.default.variant ) { #>
					kirki.Control.set( {
						label: 'Variant', // TODO: i18n
						inputAttrs: 'placeholder="Select Variant"', // TODO: i18n
						'data-id': control.id + '[variant]',
						'default': control.params['default'].variant
					} );
					html += '<div class="variant">' + kirki.Input.select.getTemplate( kirki.Control.get( control.id + '[variant]' ) ) + '</div>';
					kirki.Input.select.init( kirki.Control.get( control.id + '[variant]' ) );

					// Subsets.
					// TODO: <# if ( true === data.show_subsets ) { #>
					kirki.Control.set( {
						label: 'Subset(s)', // TODO: i18n
						inputAttrs: 'placeholder="Select Subsets"', // TODO: i18n
						'data-id': control.id + '[subsets]',
						'default': control.params['default'].subsets,
						multiple: 99
					} );
					html += '<div class="subsets">' + kirki.Input.select.getTemplate( kirki.Control.get( control.id + '[subsets]' ) ) + '</div>';
					kirki.Input.select.init( kirki.Control.get( control.id + '[subsets]' ) );
				}

				// Font Size.
				if ( control.params['default']['font-size'] ) {
					kirki.Control.set( {
						label: 'Font Size', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[font-size]',
						'default': control.params['default']['font-size']
					} );
					html += '<div class="font-size">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[font-size]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[font-size]' ) );
				}

				// Line Height.
				if ( control.params['default']['line-height'] ) {
					kirki.Control.set( {
						label: 'Line Height', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[line-height]',
						'default': control.params['default']['line-height']
					} );
					html += '<div class="line-height">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[line-height]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[line-height]' ) );
				}

				// Letter Spacing.
				if ( control.params['default']['letter-spacing'] ) {
					kirki.Control.set( {
						label: 'Letter Spacing', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[letter-spacing]',
						'default': control.params['default']['letter-spacing']
					} );
					html += '<div class="letter-spacing">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[letter-spacing]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[letter-spacing]' ) );
				}

				// Word Spacing.
				if ( control.params['default']['word-spacing'] ) {
					kirki.Control.set( {
						label: 'Word Spacing', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[word-spacing]',
						'default': control.params['default']['word-spacing']
					} );
					html += '<div class="word-spacing">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[word-spacing]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[word-spacing]' ) );
				}

				// Text Align.
				if ( control.params['default']['text-align'] ) {
					kirki.Control.set( {
						label: 'Text Align', // TODO: i18n
						'data-id': control.id + '[text-align]',
						'default': control.params['default']['text-align'],
						choices: {
							inherit: '<span class="dashicons dashicons-editor-removeformatting"></span><span class="screen-reader-text">Inherit</span>', // TODO: i18n
							left: '<span class="dashicons dashicons-editor-alignleft"></span><span class="screen-reader-text">Left</span>', // TODO: i18n
							center: '<span class="dashicons dashicons-editor-aligncenter"></span><span class="screen-reader-text">Center</span>', // TODO: i18n
							right: '<span class="dashicons dashicons-editor-alignright"></span><span class="screen-reader-text">Right</span>', // TODO: i18n
							justify: '<span class="dashicons dashicons-editor-justify"></span><span class="screen-reader-text">Justify</span>' // TODO: i18n
						}
					} );
					html += '<div class="text-align">' + kirki.Input.radio.getTemplate( kirki.Control.get( control.id + '[text-align]' ) ) + '</div>';
					kirki.Input.radio.init( kirki.Control.get( control.id + '[text-align]' ) );
				}

				// Text Transform.
				if ( control.params['default']['text-transform'] ) {
					kirki.Control.set( {
						label: 'Text Transform',
						'data-id': control.id + '[text-transform]',
						'default': control.params['default']['text-transform'],
						choices: {
							none: 'None', // TODO: i18n
							capitalize: 'Capitalize',  // TODO: i18n
							uppercase: 'Uppercase', // TODO: i18n
							lowercase: 'Lowercase', // TODO: i18n
							initial: 'Initial', // TODO: i18n
							inherit: 'Inherit' // TODO: i18n
						}
					} );
					html += '<div class="text-transform">' + kirki.Input.select.getTemplate( kirki.Control.get( control.id + '[text-transform]' ) ) + '</div>';
					kirki.Input.select.init( kirki.Control.get( control.id + '[text-transform]' ) );
				}

				// Color.
				if ( control.params['default'].color ) {
					kirki.Control.set( {
						label: 'Color', // TODO: i18n
						'data-id': control.id + '[color]',
						'default': control.params['default'].color
					} );
					html += '<div class="color">' + kirki.Input.color.getTemplate( kirki.Control.get( control.id + '[color]' ) ) + '</div>';
					kirki.Input.color.init( kirki.Control.get( control.id + '[color]' ) );
				}

				// Margin-top
				if ( control.params['default']['margin-top'] ) {
					kirki.Control.set( {
						label: 'Margin Top', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[margin-top]',
						'default': control.params['default']['margin-top']
					} );
					html += '<div class="margin-top">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[margin-top]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[margin-top]' ) );
				}

				// Margin-bottom
				if ( control.params['default']['margin-bottom'] ) {
					kirki.Control.set( {
						label: 'Margin Bottom', // TODO: i18n
						inputAttrs: 'type="text"',
						'data-id': control.id + '[margin-bottom]',
						'default': control.params['default']['margin-bottom']
					} );
					html += '<div class="margin-bottom">' + kirki.Input.genericInput.getTemplate( kirki.Control.get( control.id + '[margin-bottom]' ) ) + '</div>';
					kirki.Input.genericInput.init( kirki.Control.get( control.id + '[margin-bottom]' ) );
				}

				html += '</div>';

				control.container.html( '<div class="kirki-input-container" data-id="' + control.id + '">' + html + '</div>' );
			}
		}
	},

	/**
	 * An object containing definitions for input fields.
	 *
	 * @since 3.0.16
	 */
	Input: {

		/**
		 * Radio input fields.
		 *
		 * @since 3.0.17
		 */
		radio: {
			/**
			 * Get the HTML for color inputs.
			 *
			 * @since 3.0.17
			 * @param {Object} data - The arguments.
			 * @param {string} data.label - The control label.
			 * @param {string} data.description - The control description.
			 * @param {string} data.inputAttrs - extra input arguments.
			 * @param {string} data.default - The default value.
			 * @param {Object} data.choices - The choices for the select dropdown.
			 * @param {string} data.id - The setting.
			 * @returns {string}
			 */
			getTemplate: function( data ) {
				var html = '';

				data = _.defaults( data, {
					choices: {},
					label: '',
					description: '',
					inputAttrs: '',
					'data-id': '',
					'default': ''
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value ) ? kirki.Setting.get( data.id ) : data.value;

				if ( ! data.choices ) {
					return;
				}

				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				_.each( data.choices, function( val, key ) {
					html += '<label>';
					html += '<input ' + data.inputAttrs + ' type="radio" data-id="' + data['data-id'] + '" value="' + key + '" name="_customize-radio-' + data.id + '" ' + data.link + ( data.value === key ? ' checked' : '' ) + '/>';
					html += ( _.isArray( val ) ) ? val[0] + '<span class="option-description">' + val[1] + '</span>' : val;
					html += '</label>';
				} );

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The control object.
			 * @param {Object} control.id - The setting.
			 * @returns {void}
			 */
			init: function( control ) {
				var input = jQuery( 'input[data-id="' + control.id + '"]' );

				// Save the value
				input.on( 'change keyup paste click', function() {
					kirki.Setting.set( control.id, jQuery( this ).val() );
				});
			}
		},

		/**
		 * Color input fields.
		 *
		 * @since 3.0.16
		 */
		color: {

			/**
			 * Get the HTML for color inputs.
			 *
			 * @since 3.0.16
			 * @param {Object} data - The arguments.
			 * @returns {string}
			 */
			getTemplate: function( data ) {

				var html = '';

				data = _.defaults( data, {
					label: '',
					description: '',
					mode: 'full',
					inputAttrs: '',
					'data-palette': data['data-palette'] ? data['data-palette'] : true,
					'data-default-color': data['data-default-color'] ? data['data-default-color'] : '',
					'data-alpha': data['data-alpha'] ? data['data-alpha'] : false,
					'data-id': ''
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value ) ? kirki.Setting.get( data.id ) : data.value;

				html += '<label>';
				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				html += '</label>';
				html += '<input type="text" data-type="' + data.mode + '" ' + data.inputAttrs + ' data-palette="' +  data['data-palette'] + '" data-default-color="' +  data['data-default-color'] + '" data-alpha="' + data['data-alpha'] + '" value="' + data.value + '" class="kirki-color-control" data-id="' + data['data-id'] + '"/>';

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.16
			 * @param {Object} control - The control object.
			 * @param {Object} control.id - The setting.
			 * @param {Object} control.choices - Additional options for the colorpickers.
			 * @param {Object} control.params - Control parameters.
			 * @param {Object} control.params.choices - alias for control.choices.

			 * @returns {void}
			 */
			init: function( control ) {
				var picker = jQuery( '.kirki-color-control[data-id="' + control.id + '"]' ),
				    clear;

				control.choices = control.choices || {};
				if ( _.isEmpty( control.choices ) && control.params && control.params.choices ) {
					control.choices = control.params.choices;
				}

				// If we have defined any extra choices, make sure they are passed-on to Iris.
				if ( ! _.isEmpty( control.choices ) ) {
					picker.wpColorPicker( control.choices );
				}

				// Tweaks to make the "clear" buttons work.
				setTimeout( function() {
					clear = jQuery( '.kirki-input-container[data-id="' + control.id + '"] .wp-picker-clear' );
					if ( clear.length ) {
						clear.click( function() {
							control.setting.set( '' );
						});
					}
				}, 200 );

				// Saves our settings to the WP API
				picker.wpColorPicker({
					change: function() {

						// Small hack: the picker needs a small delay
						setTimeout( function() {
							kirki.Setting.set( control.id, picker.val() );
						}, 20 );
					}
				});
			}
		},

		/**
		 * Generic input fields.
		 *
		 * @since 3.0.17
		 */
		genericInput: {

			/**
			 * Get the HTML.
			 *
			 * @since 3.0.17
			 * @param {Object} data - The arguments.
			 * @returns {string}
			 */
			getTemplate: function( data ) {
				var html    = '',
				    element;

				data.choices = data.choices || {};
				element = ( data.choices.element ) ? data.choices.element : 'input';

				data = _.defaults( data, {
					label: '',
					description: '',
					inputAttrs: '',
					'data-id': '',
					choices: {}
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value ) ? kirki.Setting.get( data.id ) : data.value;

				html += '<label>';
				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				html += '<div class="customize-control-content">';
				html += '<' + element + ' data-id="' + data['data-id'] + '" ' + data.inputAttrs + ' value="' + data.value + '" ' + data.link;
				_.each( data.choices, function( val, key ) {
					html += ' ' + key + '="' + val + '"';
				});
				if ( data.choices.content ) {
					html += '>' + data.choices.content + '</' + element + '>';
				} else {
					html += '/>';
				}
				html += '</div>';
				html += '</label>';

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The control object.
			 * @param {Object} control.id - The setting.
			 * @returns {void}
			 */
			init: function( control ) {
				var input = jQuery( 'input[data-id="' + control.id + '"]' );

				// Save the value
				input.on( 'change keyup paste click', function() {
					kirki.Setting.set( control.id, jQuery( this ).val() );
				});
			}
		},

		/**
		 * Generic input fields.
		 *
		 * @since 3.0.17
		 */
		textarea: {

			/**
			 * Get the HTML for textarea inputs.
			 *
			 * @since 3.0.17
			 * @param {Object} data - The arguments.
			 * @returns {string}
			 */
			getTemplate: function( data ) {
				var html    = '';

				data = _.defaults( data, {
					label: '',
					description: '',
					inputAttrs: '',
					'data-id': '',
					choices: {}
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value ) ? kirki.Setting.get( data.id ) : data.value;

				html += '<label>';
				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				html += '<div class="customize-control-content">';
				html += '<textarea data-id="' + data['data-id'] + '"' + data.inputAttrs + ' ' + data.link + 'value="' + data.value + '"';
				_.each( data.choices, function( val, key ) {
					html += ' ' + key + '="' + val + '"';
				});
				html += '>' + data.value + '</textarea>';
				html += '</div>';
				html += '</label>';

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The control object.
			 * @param {Object} control.id - The setting.
			 * @returns {void}
			 */
			init: function( control ) {
				var textarea = jQuery( 'textarea[data-id="' + control.id + '"]' );

				// Save the value
				textarea.on( 'change keyup paste click', function() {
					kirki.Setting.set( control.id, jQuery( this ).val() );
				});
			}
		},

		select: {

			/**
			 * Get the HTML for select inputs.
			 *
			 * @since 3.0.17
			 * @param {Object} data - The arguments.
			 * @returns {string}
			 */
			getTemplate: function( data ) {
				var html = '',
				    selected;

				data = _.defaults( data, {
					label: '',
					description: '',
					inputAttrs: '',
					'data-id': '',
					choices: {},
					multiple: 1
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value || _.isEmpty( data.value ) ) ? kirki.Setting.get( data.id ) : data.value;

				if ( 1 < data.multiple && data.value && _.isString( data.value ) ) {
					data.value = [ data.value ];
				}

				html += '<label>';
				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				html += '<select data-id="' + data['data-id'] + '" ' + data.inputAttrs + ' ' + data.link;
				if ( 1 < data.multiple ) {
					html += ' data-multiple="' + data.multiple + '" multiple="multiple"';
				}
				html += '>';
				_.each( data.choices, function( optionLabel, optionKey ) {
					selected = ( data.value === optionKey );
					if ( 1 < data.multiple && data.value ) {
						selected = _.contains( data.value, optionKey );
					}
					if ( _.isObject( optionLabel ) ) {
						html += '<optgroup label="' + optionLabel[0] + '">';
						_.each( optionLabel[1], function( optgroupOptionLabel, optgroupOptionKey ) {
							selected = ( data.value === optgroupOptionKey );
							if ( 1 < data.multiple && data.value ) {
								selected = _.contains( data.value, optgroupOptionKey );
							}
							html += '<option value="' + optgroupOptionKey + '"';
							if ( selected ) {
								html += ' selected';
							}
							html += '>' + optgroupOptionLabel + '</option>';
						} );
						html += '</optgroup>';
					} else {
						html += '<option value="' + optionKey + '"';
						if ( selected ) {
							html += ' selected';
						}
						html += '>' + optionLabel + '</option>';
					}
				} );
				html += '</select></label>';

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The control object.
			 * @param {Object} control.id - The setting.
			 * @returns {void}
			 */
			init: function( control ) {
				var element  = jQuery( 'select[data-id="' + control.id + '"' ),
				    multiple = parseInt( element.data( 'multiple' ), 10 ),
				    selectValue,
				    selectWooOptions = {
						escapeMarkup: function( markup ) {
							return markup;
						}
				    };

				if ( 1 < multiple ) {
					selectWooOptions.maximumSelectionLength = multiple;
				}
				jQuery( element ).selectWoo( selectWooOptions ).on( 'change', function() {
					selectValue = jQuery( this ).val();
					kirki.Setting.set( control.id, selectValue );
				});
			}
		},

		image: {

			/**
			 * Get the HTML for image inputs.
			 *
			 * @since 3.0.17
			 * @param {Object} data - The arguments.
			 * @returns {string}
			 */
			getTemplate: function( data ) {
				var html   = '',
				    saveAs = 'url',
				    url;

				data = _.defaults( data, {
					label: '',
					description: '',
					inputAttrs: '',
					'data-id': '',
					choices: {}
				} );

				data.id = ( _.isUndefined( data.id ) && ! _.isUndefined( data['data-id'] ) ) ? data['data-id'] : data.id;
				data.value = ( ! data.value ) ? kirki.Setting.get( data.id ) : data.value;

				if ( ! _.isUndefined( data.choices ) && ! _.isUndefined( data.choices.save_as ) ) {
					saveAs = data.choices.save_as;
				}
				url = data.value;
				if ( _.isObject( data.value ) && ! _.isUndefined( data.value.url ) ) {
					url = data.value.url;
				}

				html += '<label>';
				if ( data.label ) {
					html += '<span class="customize-control-title">' + data.label + '</span>';
				}
				if ( data.description ) {
					html += '<span class="description customize-control-description">' + data.description + '</span>';
				}
				html += '</label>';
				html += '<div class="image-wrapper attachment-media-view image-upload">';
				if ( data.value.url || '' !== url ) {
					html += '<div class="thumbnail thumbnail-image"><img src="' + url + '" alt="" /></div>';
				} else {
					html += '<div class="placeholder">' + kirkiL10n.noFileSelected + '</div>';
				}
				html += '<div class="actions">';
				html += '<button class="button image-upload-remove-button' + ( '' === url ? ' hidden' : '' ) + '">' + kirkiL10n.remove + '</button>';
				if ( data['default'] && '' !== data['default'] ) {
					html += '<button type="button" class="button image-default-button"';
					if ( data['default'] === data.value || ( ! _.isUndefined( data.value.url ) && data['default'] === data.value.url ) ) {
						html += ' style="display:none;"';
					}
					html += '>' + kirkiL10n['default'] + '</button>';
				}
				html += '<button type="button" class="button image-upload-button">' + kirkiL10n.selectFile + '</button>';
				html += '</div></div>';

				return '<div class="kirki-input-container" data-id="' + data.id + '">' + html + '</div>';
			},

			/**
			 * Init the control.
			 *
			 * @since 3.0.17
			 * @param {Object} control - The control object.
			 * @returns {void}
			 */
			init: function( control ) {
			}
		}
	},

	/**
	 * An object containing definitions for settings.
	 *
	 * @since 3.0.16
	 */
	Setting: {

		/**
		 * Gets the value of a setting.
		 *
		 * This is a helper function that allows us to get the value of
		 * control[key1][key2] for example, when the setting used in the
		 * customizer API is "control".
		 *
		 * @since 3.0.16
		 * @param {string} setting - The setting for which we're getting the value.
		 * @returns {mixed} Depends on the value.
		 */
		get: function( setting ) {
			var parts        = setting.split( '[' ),
			    foundSetting = '',
			    foundInStep  = 0,
			    currentVal   = '';

			_.each( parts, function( part, i ) {
				part = part.replace( ']', '' );

				if ( 0 === i ) {
					foundSetting = part;
				} else {
					foundSetting += '[' + part + ']';
				}

				if ( ! _.isUndefined( wp.customize.instance( foundSetting ) ) ) {
					currentVal  = wp.customize.instance( foundSetting ).get();
					foundInStep = i;
				}

				if ( foundInStep < i ) {
					if ( _.isObject( currentVal ) && ! _.isUndefined( currentVal[ part ] ) ) {
						currentVal = currentVal[ part ];
					}
				}
			});

			return currentVal;
		},

		/**
		 * Sets the value of a setting.
		 *
		 * This function is a bit complicated because there any many scenarios to consider.
		 * Example: We want to save the value for my_setting[something][3][something-else].
		 * The control's setting is my_setting[something].
		 * So we need to find that first, then figure out the remaining parts,
		 * merge the values recursively to avoid destroying my_setting[something][2]
		 * and also take into account any defined "key" arguments which take this even deeper.
		 *
		 * @since 3.0.16
		 * @param {object|string} element - The DOM element whose value has changed,
		 *                                  or an ID.
		 * @param {mixed}         value - Depends on the control-type.
		 * @param {string}        key - If we only want to save an item in an object
		 *                                  we can define the key here.
		 * @returns {void}
		 */
		set: function( element, value, key ) {
			var setting,
			    parts,
			    currentNode   = '',
			    foundNode     = '',
			    subSettingObj = {},
			    currentVal,
			    subSetting,
			    subSettingParts;

			// Get the setting from the element.
			setting = element;
			if ( _.isObject( element ) ) {
				if ( jQuery( element ).attr( 'data-id' ) ) {
					setting = element.attr( 'data-id' );
				} else {
					setting = element.parents( '[data-id]' ).attr( 'data-id' );
				}
			}

			parts = setting.split( '[' ),

			// Find the setting we're using in the control using the customizer API.
			_.each( parts, function( part, i ) {
				part = part.replace( ']', '' );

				// The current part of the setting.
				currentNode = ( 0 === i ) ? part : '[' + part + ']';

				// When we find the node, get the value from it.
				// In case of an object we'll need to merge with current values.
				if ( ! _.isUndefined( wp.customize.instance( currentNode ) ) ) {
					foundNode  = currentNode;
					currentVal = wp.customize.instance( foundNode ).get();
				}
			} );

			// Get the remaining part of the setting that was unused.
			subSetting = setting.replace( foundNode, '' );

			// If subSetting is not empty, then we're dealing with an object
			// and we need to dig deeper and recursively merge the values.
			if ( '' !== subSetting ) {
				if ( ! _.isObject( currentVal ) ) {
					currentVal = {};
				}
				if ( '[' === subSetting.charAt( 0 ) ) {
					subSetting = subSetting.replace( '[', '' );
				}
				subSettingParts = subSetting.split( '[' );
				_.each( subSettingParts, function( subSettingPart, i ) {
					subSettingParts[ i ] = subSettingPart.replace( ']', '' );
				} );

				// If using a key, we need to go 1 level deeper.
				if ( key ) {
					subSettingParts.push( key );
				}

				// Converting to a JSON string and then parsing that to an object
				// may seem a bit hacky and crude but it's efficient and works.
				subSettingObj = '{"' + subSettingParts.join( '":{"' ) + '":"' + value + '"' + '}'.repeat( subSettingParts.length );
				subSettingObj = JSON.parse( subSettingObj );

				// Recursively merge with current value.
				jQuery.extend( true, currentVal, subSettingObj );
				value = currentVal;

			} else {
				if ( key ) {
					currentVal = ( ! _.isObject( currentVal ) ) ? {} : currentVal;
					currentVal[ key ] = value;
					value = currentVal;
				}
			}
			wp.customize.control( foundNode ).setting.set( value );
		}
	},

	/**
	 * A collection of utility methods.
	 *
	 * @since 3.0.17
	 */
	util: {

		/**
		 * A collection of utility methods for webfonts.
		 *
		 * @since 3.0.17
		 */
		webfonts: {

			/**
			 * Google-fonts related methods.
			 *
			 * @since 3.0.17
			 */
			google: {

				/**
				 * An object containing all Google fonts.
				 *
				 * to set this call this.setFonts();
				 *
				 * @since 3.0.17
				 */
				fonts: {},

				/**
				 * Init for google-fonts.
				 *
				 * @since 3.0.17
				 * @returns {void}
				 */
				initialize: function() {
					var self = this;

					self.setFonts();
				},

				/**
				 * Set fonts in this.fonts
				 *
				 * @since 3.0.17
				 * @returns {void}
				 */
				setFonts: function() {
					var self = this,
					    fonts;

					// No need to run if we already have the fonts.
					if ( ! _.isEmpty( self.fonts ) ) {
						return;
					}

					// Make an AJAX call to set the fonts object.
					jQuery.post( ajaxurl, { 'action': 'kirki_fonts_google_all_get' }, function( response ) {

						// Get fonts from the JSON array.
						fonts = JSON.parse( response );

						_.each( fonts.items, function( font ) {
							self.fonts[ font.family ] = font;
						} );
					} );
				},

				/**
				 * Gets all properties of a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} family - The font-family we're interested in.
				 * @returns {Object}
				 */
				getFont: function( family ) {
					var self = this;

					return _.isUndefined( self.fonts[ family ] ) ? false : self.fonts[ family ];
				},

				/**
				 * Gets the variants for a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} family - The font-family we're interested in.
				 * @returns {Object}
				 */
				getVariants: function( family ) {
					var self = this,
					    font = self.getFont( family );

					// Early exit if font was not found.
					if ( ! font ) {
						return false;
					}

					// Early exit if font doesn't have variants.
					if ( _.isUndefined( font.variants ) ) {
						return false;
					}

					// Return the variants.
					return font.variants;
				},

				/**
				 * Get the subsets for a font-family.
				 *
				 * @since 3.0.17
				 * @param {string} family - The font-family we're interested in.
				 * @returns {Object}
				 */
				getSubsets: function( family ) {
					var self = this,
					    font = self.getFont( family );

					// Early exit if font was not found.
					if ( ! font ) {
						return false;
					}

					// Early exit if font doesn't have subsets.
					if ( _.isUndefined( font.subsets ) ) {
						return false;
					}

					// Return the variants.
					return font.subsets;
				}
			}
		}
	}
};

// Initialize the kirki object.
kirki.initialize();
