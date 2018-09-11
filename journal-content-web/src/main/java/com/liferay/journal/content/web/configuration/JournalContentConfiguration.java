/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.journal.content.web.configuration;

import aQute.bnd.annotation.metatype.Meta;

import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

/**
 * @author     Daniel Couso
 * @author     Brian I. Kim
 *
 * @deprecated As of Wilberforce (7.0.x), with no direct replacement
 */
@Deprecated
@ExtendedObjectClassDefinition(category = "web-experience")
@Meta.OCD(
	id = "com.liferay.journal.content.web.configuration.JournalContentConfiguration",
	localization = "content/Language",
	name = "journal-content-configuration-name"
)
public interface JournalContentConfiguration {

	@Meta.AD(
		deflt = "true", description = "journal-content-single-menu-help",
		name = "journal-content-single-menu", required = false
	)
	public boolean singleMenu();

	@Meta.AD(
		deflt = "single-menu-application",
		description = "journal-content-display-menu-configuration-help",
		name = "journal-content-display-menu-configuration",
		optionLabels = {
			"journal-content-single-menu-content-actions-first",
			"journal-content-single-menu-application-actions-first"
		},
		optionValues = {"single-menu-content", "single-menu-application"},
		required = false
	)
	public String menuStyle();

}