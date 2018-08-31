/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 * <p>
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 * <p>
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.journal.content.web.configuration;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.module.configuration.ConfigurationException;
import com.liferay.portal.kernel.module.configuration.ConfigurationProvider;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Daniel Sanz
 */
@Component(immediate=true)
@Deprecated
public class JournalContentConfigurationUtil {
	public String getMenuStyle() {
		try {
			JournalContentConfiguration journalContentConfiguration =
				_configurationProvider.getSystemConfiguration(
					JournalContentConfiguration.class);

			String menuStyle = journalContentConfiguration.menuStyle();

			return menuStyle;
		}
		catch (ConfigurationException ce) {
			if (_log.isDebugEnabled()) {
				_log.debug(ce, ce);
			}

			return null;
		}
	}

	public boolean isSeparateMenus() {
		String menuStyle = getMenuStyle();

		if ("separate-menus".equals(menuStyle)) {
			return true;
		}
		else {
			return false;
		}
	}

	public boolean isSingleMenuContent() {
		String menuStyle = getMenuStyle();

		if ("single-menu-content".equals(menuStyle)) {
			return true;
		}
		else {
			return false;
		}
	}

	public boolean isSingleMenuApplication() {
		String menuStyle = getMenuStyle();

		if ("single-menu-application".equals(menuStyle)) {
			return true;
		}
		else {
			return false;
		}
	}

	private ConfigurationProvider _configurationProvider;

	private static final Log _log = LogFactoryUtil.getLog(
		JournalContentConfigurationUtil.class);

	@Reference(unbind = "-")
	protected void setConfigurationProvider(
		ConfigurationProvider configurationProvider) {

		_configurationProvider = configurationProvider;
	}
}
