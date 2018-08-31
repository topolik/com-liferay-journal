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

package com.liferay.journal.content.web.internal.portlet.configuration.icon;

import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.journal.constants.JournalContentPortletKeys;
import com.liferay.journal.content.web.configuration.JournalContentConfigurationUtil;
import com.liferay.journal.content.web.internal.display.context.JournalContentDisplayContext;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.permission.JournalArticlePermission;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.configuration.icon.PortletConfigurationIcon;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.util.Portal;

import javax.portlet.PortletRequest;

import javax.servlet.ServletContext;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author     Daniel Couso
 * @deprecated As of Wilberforce (7.0.x), with no direct replacement
 */
@Component(
	immediate = true,
	property = {
		"javax.portlet.name=" + JournalContentPortletKeys.JOURNAL_CONTENT,
		"path=-"
	},
	service = PortletConfigurationIcon.class
)
@Deprecated
public class JournalPermissionsPortletConfigurationIcon
	extends BaseJournalArticlePortletConfigurationIcon {

	@Override
	public String getJspPath() {
		return "/configuration/icon/edit_permissions.jsp";
	}

	@Override
	public double getSeparateMenusWeight() {
		return 0.1;
	}

	@Override
	public double getSingleMenuContentWeight() {
		return 18;
	}

	@Override
	public double getSingleMenuWidgetWeight() {
		return 0.1;
	}

	@Override
	public boolean isShow(PortletRequest portletRequest) {
		if (_journalContentConfigurationUtil.isSeparateMenus()) {
			return false;
		}

		JournalContentDisplayContext journalContentDisplayContext =
			getJournalContentDisplayContext(
				portletRequest, null, ddmStructureClassNameId);

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		JournalArticle article = journalContentDisplayContext.getArticle();

		if (article == null) {
			return false;
		}

		try {
			if (JournalArticlePermission.contains(
					permissionChecker, article, ActionKeys.PERMISSIONS)) {

				return true;
			}
		}
		catch (PortalException pe) {
			if (_log.isDebugEnabled()) {
				_log.debug(pe, pe);
			}

			return false;
		}

		return false;
	}

	@Override
	@Reference(
		target = "(osgi.web.symbolicname=com.liferay.journal.content.web)",
		unbind = "-"
	)
	public void setServletContext(ServletContext servletContext) {
		super.setServletContext(servletContext);
	}

	@Reference(unbind = "-")
	protected void setJournalContentConfigurationUtil(
		JournalContentConfigurationUtil journalContentConfigurationUtil) {

		_journalContentConfigurationUtil = journalContentConfigurationUtil;
	}

	@Reference(unbind = "-")
	protected void setPortal(Portal portal) {
		ddmStructureClassNameId = portal.getClassNameId(DDMStructure.class);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		JournalPermissionsPortletConfigurationIcon.class);

}