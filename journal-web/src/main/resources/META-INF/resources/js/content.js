AUI.add(
	'liferay-journal-content',
	function(A) {
		var AArray = A.Array;

		var Lang = A.Lang;

		var STR_CLICK = 'click';

		var STR_DDM = 'ddm';

		var STR_DESCRIPTION_INPUT_LOCALIZED = 'descriptionInputLocalized';

		var STR_FRIENDLY_URL_INPUT_LOCALIZED = 'friendlyURLInputLocalized';

		var STR_SELECT_STRUCTURE = 'selectStructure';

		var STR_SELECT_TEMPLATE = 'selectTemplate';

		var STR_STRINGS = 'strings';

		var STR_TITLE_INPUT_LOCALIZED = 'titleInputLocalized';

		var STR_URLS = 'urls';

		var WIN = A.config.win;

		var JournalContent = A.Component.create(
			{
				ATTRS: {
					ddm: {
						validator: Lang.isObject,
						value: {}
					},

					descriptionInputLocalized: {
					},

					editStructure: {
						setter: A.one
					},

					editTemplate: {
						setter: A.one
					},

					friendlyURLInputLocalized: {
						getter: function(value) {
							return Liferay.component(value);
						}
					},

					selectStructure: {
						setter: A.one
					},

					selectTemplate: {
						setter: A.one
					},

					strings: {
						validator: Lang.isObject,
						value: {
							draft: Liferay.Language.get('draft'),
							editStructure: Liferay.Language.get('editing-the-current-structure-deletes-all-unsaved-content'),
							editTemplate: Liferay.Language.get('editing-the-current-template-deletes-all-unsaved-content'),
							structures: Liferay.Language.get('structures'),
							templates: Liferay.Language.get('templates')
						}
					},

					titleInputLocalized: {
					},

					urls: {
						validator: Lang.isObject,
						value: {}
					}
				},

				AUGMENTS: [Liferay.PortletBase],

				EXTENDS: A.Base,

				NAME: 'journalcontent',

				prototype: {
					initializer: function(config) {
						var instance = this;

						instance._bindUI();

						instance._bindTranslationManager();

						instance._renderUI();
					},

					destructor: function() {
						var instance = this;

						(new A.EventHandle(instance._eventHandles)).detach();
					},

					_afterDeletingAvailableLocale: function(event) {
						var instance = this;

						var descriptionInputLocalized = instance.get(STR_DESCRIPTION_INPUT_LOCALIZED);

						var friendlyURLInputLocalized = instance.get(STR_FRIENDLY_URL_INPUT_LOCALIZED);

						var titleInputLocalized = instance.get(STR_TITLE_INPUT_LOCALIZED);

						var locale = event.locale;

						descriptionInputLocalized.removeInputLanguage(locale);

						friendlyURLInputLocalized.removeInputLanguage(locale);

						titleInputLocalized.removeInputLanguage(locale);
					},

					_afterEditingLocaleChange: function(event) {
						var instance = this;

						var descriptionInputLocalized = instance.get(STR_DESCRIPTION_INPUT_LOCALIZED);

						var friendlyURLInputLocalized = instance.get(STR_FRIENDLY_URL_INPUT_LOCALIZED);

						var titleInputLocalized = instance.get(STR_TITLE_INPUT_LOCALIZED);

						var items = descriptionInputLocalized.get('items');

						var editingLocale = event.newVal;

						var selectedIndex = items.indexOf(editingLocale);

						descriptionInputLocalized.set('selected', selectedIndex);
						descriptionInputLocalized.selectFlag(editingLocale);

						friendlyURLInputLocalized.set('selected', selectedIndex);
						friendlyURLInputLocalized.selectFlag(editingLocale);

						titleInputLocalized.set('selected', selectedIndex);
						titleInputLocalized.selectFlag(editingLocale);
					},

					_bindTranslationManager: function() {
						var instance = this;

						var eventHandles = instance._eventHandles;

						var translationManager = Liferay.component(instance.ns('translationManager'));

						if (translationManager) {
							eventHandles.push(
								translationManager.on('deleteAvailableLocale', instance._afterDeletingAvailableLocale.bind(instance))
							);

							eventHandles.push(
								translationManager.on('editingLocaleChange', instance._afterEditingLocaleChange.bind(instance))
							);
						}
						else {
							eventHandles.push(
								Liferay.once(instance.ns('translationManager:registered'), instance._bindTranslationManager.bind(instance))
							);
						}
					},

					_bindUI: function() {
						var instance = this;

						var editTemplate = instance.get('editTemplate');

						var eventHandles = [];

						if (editTemplate) {
							eventHandles.push(
								editTemplate.on(STR_CLICK, instance._editTemplate, instance)
							);
						}

						var editStructure = instance.get('editStructure');

						if (editStructure) {
							eventHandles.push(
								editStructure.on(STR_CLICK, instance._editStructure, instance)
							);
						}

						var selectTemplate = instance.get(STR_SELECT_TEMPLATE);

						if (selectTemplate) {
							eventHandles.push(
								selectTemplate.on(STR_CLICK, instance._openDDMTemplateSelector, instance)
							);
						}

						var selectStructure = instance.get(STR_SELECT_STRUCTURE);

						if (selectStructure) {
							eventHandles.push(
								selectStructure.on(STR_CLICK, instance._openDDMStructureSelector, instance)
							);
						}

						instance._eventHandles = eventHandles;
					},

					_editStructure: function(event) {
						var instance = this;

						var strings = instance.get(STR_STRINGS);

						if (confirm(strings.editStructure)) {
							var urls = instance.get(STR_URLS);

							Liferay.Util.openWindow(
								{
									id: A.guid(),
									refreshWindow: WIN,
									title: strings.structures,
									uri: urls.editStructure
								}
							);
						}
					},

					_editTemplate: function(event) {
						var instance = this;

						var strings = instance.get(STR_STRINGS);

						if (confirm(strings.editTemplate)) {
							var urls = instance.get(STR_URLS);

							Liferay.Util.openWindow(
								{
									id: A.guid(),
									refreshWindow: WIN,
									title: strings.templates,
									uri: urls.editTemplate
								}
							);
						}
					},

					_getPrincipalForm: function(formName) {
						var instance = this;

						return instance.one('form[name=' + instance.ns(formName || 'fm1') + ']');
					},

					_openDDMStructureSelector: function() {
						var instance = this;

						var ddm = instance.get(STR_DDM);

						var strings = instance.get(STR_STRINGS);

						Liferay.Util.openDDMPortlet(
							{
								basePortletURL: ddm.basePortletURL,
								classPK: ddm.classPK,
								dialog: {
									destroyOnHide: true
								},
								eventName: instance.ns(STR_SELECT_STRUCTURE),
								groupId: ddm.groupId,
								mvcPath: '/select_structure.jsp',
								navigationStartsOn: 'SELECT_STRUCTURE',
								refererPortletName: ddm.refererPortletName,
								searchRestriction: ddm.searchRestriction,
								searchRestrictionClassNameId: ddm.searchRestrictionClassNameId,
								searchRestrictionClassPK: ddm.searchRestrictionClassPK,
								showAncestorScopes: true,
								showCacheableInput: true,
								title: strings.structures
							},
							function(event) {
								var form = instance._getPrincipalForm();

								var ddmStructureId = instance.one('#ddmStructureId');

								if (ddmStructureId.val() != event.ddmstructureid) {
									ddmStructureId.val(event.ddmstructureid);

									instance.one('#changeStructure').val(true);

									instance.one('#ddmStructureKey').val(event.ddmstructurekey);

									instance.one('#ddmTemplateKey').val('');

									submitForm(form, null, false, false);
								}
							}
						);
					},

					_openDDMTemplateSelector: function() {
						var instance = this;

						var ddm = instance.get(STR_DDM);

						var strings = instance.get(STR_STRINGS);

						Liferay.Util.openDDMPortlet(
							{
								basePortletURL: ddm.basePortletURL,
								classNameId: ddm.classNameId,
								classPK: ddm.classPK,
								dialog: {
									destroyOnHide: true
								},
								eventName: instance.ns(STR_SELECT_TEMPLATE),
								groupId: ddm.groupId,
								mvcPath: '/select_template.jsp',
								navigationStartsOn: 'SELECT_TEMPLATE',
								refererPortletName: ddm.refererPortletName,
								resourceClassNameId: ddm.resourceClassNameId,
								showAncestorScopes: true,
								showCacheableInput: true,
								templateId: ddm.templateId,
								title: strings.templates
							},
							function(event) {
								var form = instance._getPrincipalForm();

								var ddmTemplateId = instance.one('#ddmTemplateId');

								ddmTemplateId.val(event.ddmtemplateid);

								submitForm(form, null, false, false);
							}
						);
					},

					_renderUI: function() {
						var instance = this;

						instance.get(STR_DESCRIPTION_INPUT_LOCALIZED).render();
						instance.get(STR_TITLE_INPUT_LOCALIZED).render();
					}
				}
			}
		);

		Liferay.Portlet.JournalContent = JournalContent;
	},
	'',
	{
		requires: ['aui-base', 'liferay-portlet-base']
	}
);