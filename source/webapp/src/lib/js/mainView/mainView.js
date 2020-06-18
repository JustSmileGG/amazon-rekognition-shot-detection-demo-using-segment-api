// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import SolutionManifest from '/solution-manifest.js';
import Localization from '../shared/localization.js';
import AppUtils from '../shared/appUtils.js';
import CognitoConnector from '../signIn/cognitoConnector.js';
import DemoTab from './tabControllers/demoTab.js';
import ConvertTab from './tabControllers/convertTab.js';

export default class MainView {
  constructor() {
    this.$ids = {
      container: `main-${AppUtils.randomHexstring()}`,
      toastlist: `main-${AppUtils.randomHexstring()}`,
      tablist: `main-${AppUtils.randomHexstring()}`,
      tabcontent: `main-${AppUtils.randomHexstring()}`,
    };
    this.$view = $('<div/>').attr('id', this.ids.container);
    this.$cognito = CognitoConnector.getSingleton();
    this.$demoTab = new DemoTab(true);
    this.$convertTab = new ConvertTab();
  }

  static get Constants() {
    return {
      Solution: {
        Url: 'https://aws.amazon.com/rekognition/',
      },
    };
  }

  get ids() {
    return this.$ids;
  }

  get view() {
    return this.$view;
  }

  get cognito() {
    return this.$cognito;
  }

  get demoTab() {
    return this.$demoTab;
  }

  get convertTab() {
    return this.$convertTab;
  }

  appendTo(parent) {
    return parent.append(this.view);
  }

  async show() {
    await this.hide();
    // await this.projectVersion.startTimer();
    const navbar = $('<nav/>').addClass('navbar navbar-expand-lg navbar-dark bg-dark')
      .append(this.createLogo())
      .append(this.createNavToggle())
      .append(this.createTabItems())
      .append(this.createLogoutIcon());
    this.view.append(navbar);
    this.view.append(this.createTabContents());
    this.view.append(this.createPadding());
    this.view.append(this.createToastLayer());
    /* initialize the first shown tab */
    const id = this.view.find('.tab-pane.active.show').first().attr('aria-labelledby');
    return this.demoTab.show();
  }

  async hide() {
    return Promise.all([
      this.demoTab,
      this.convertTab,
    ].map(tab => tab.hide()));
  }

  createLogo() {
    const solutionLink = $('<a/>').addClass('navbar-brand')
      .attr('href', MainView.Constants.Solution.Url)
      .attr('target', '_blank')
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', Localization.Tooltips.VisitSolutionPage)
      .css('font-size', '1rem')
      .tooltip();
    return solutionLink.append($('<i/>').addClass('fas fa-film d-inline-block')
      .css('font-size', '2rem'));
  }

  createNavToggle() {
    const id = this.ids.tablist;
    return $('<button/>').addClass('navbar-toggler')
      .attr('type', 'button')
      .attr('data-toggle', 'collapse')
      .attr('data-target', `#${id}`)
      .attr('aria-controls', id)
      .attr('aria-expanded', 'false')
      .attr('aria-label', 'Toggle navigation')
      .append($('<span/>').addClass('navbar-toggler-icon'));
  }

  createTabItems() {
    const id = this.ids.tablist;
    const navbar = $('<div/>').addClass('navbar-nav')
      .attr('role', 'tablist');

    [
      this.demoTab,
      this.convertTab,
    ].forEach(tab =>
      navbar.append(tab.tabLink));

    return $('<div/>').addClass('collapse navbar-collapse')
      .attr('id', id)
      .append(navbar);
  }

  createLogoutIcon() {
    const logout = $('<button/>').addClass('btn btn-sm btn-link')
      .attr('type', 'button')
      .attr('data-toggle', 'tooltip')
      .attr('data-placement', 'bottom')
      .attr('title', `${this.cognito.user.username}, ${Localization.Tooltips.Logout}`)
      .css('font-size', '1rem')
      .html($('<i/>').addClass('fas fa-user-circle')
        .css('font-size', '2rem'));
    logout.tooltip();

    logout.off('click').click((event) =>
      window.location.reload());

    return logout;
  }

  createTabContents() {
    const tabContents = $('<div/>').addClass('tab-content')
      .attr('id', this.ids.tabcontent);

    [
      this.demoTab,
      this.convertTab,
    ].forEach(tab =>
      tabContents.append(tab.tabContent));
    return tabContents;
  }

  createPadding() {
    return $('<div/>').addClass('row no-gutters')
      .css('height', 100)
      .append($('<div/>').addClass('col-12 lead-sm d-flex justify-content-center align-self-center')
        .append($('<span/>').addClass('lead-sm mr-2')
          .append(`Version ${SolutionManifest.Version} (${SolutionManifest.LastUpdated})`)));
  }

  createToastLayer(id = this.ids.toastlist) {
    return $('<div/>').addClass('position-absolute w-100 d-flex flex-column')
      .css('z-index', 1000)
      .css('margin-left', '60%')
      .attr('id', id);
  }
}
