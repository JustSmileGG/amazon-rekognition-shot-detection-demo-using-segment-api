// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import AppUtils from '../../shared/appUtils.js';

export default class BaseTab {
  constructor(title, params) {
    this.$ids = {
      tabId: `tab-${AppUtils.randomHexstring()}`,
      contentId: `tab-content-${AppUtils.randomHexstring()}`,
    };
    this.$title = title;

    const anchor = $('<a/>').addClass('nav-link')
      .attr('id', this.tabId)
      .attr('href', `#${this.contentId}`)
      .attr('role', 'tab')
      .attr('data-toggle', 'tab')
      .attr('aria-controls', this.$contentId)
      .attr('aria-selected', params.selected || false)
      .css('font-size', params.fontSize || '1.2rem')
      .html(this.$title);
    this.$tabLink = $('<li/>').addClass('nav-item')
      .append(anchor);

    this.$tabContent = $('<div/>').addClass('tab-pane fade')
      .attr('id', this.contentId)
      .attr('role', 'tabpanel')
      .attr('aria-labelledby', this.tabId);

    if (params.selected) {
      anchor.addClass('active');
      this.$tabContent.addClass('show active');
    }

    anchor.off('shown.bs.tab').on('shown.bs.tab', async (event) => {
      const target = $(event.target);
      target.parent().siblings()
        .children('.nav-link')
        .removeClass('show active');
      target.closest('[data-role="custom-tab-group"]')
        .siblings()
        .find('.nav-link')
        .removeClass('show active');
      if (target.prop('id') === this.tabId) {
        await this.show();
      }
    });

    this.$initialized = false;
  }

  get ids() {
    return this.$ids;
  }

  get tabId() {
    return this.$ids.tabId;
  }

  get contentId() {
    return this.$ids.contentId;
  }

  get title() {
    return this.$title;
  }

  set title(val) {
    this.$title = val;
  }

  get tabLink() {
    return this.$tabLink;
  }

  get tabContent() {
    return this.$tabContent;
  }

  get initialized() {
    return this.$initialized;
  }

  set initialized(val) {
    this.$initialized = val;
  }

  get eventSource() {
    return this.$tabLink;
  }

  async show() {
    this.initialized = true;
    return this.tabContent;
  }

  async hide() {
    this.tabContent.children().remove();
    this.initialized = false;
  }

  async showIfActive() {
    if (this.tabContent.hasClass('active')) {
      return this.show();
    }
    return this;
  }

  async setActive() {
    return this.tabLink.children('a').tab('show');
  }
}
