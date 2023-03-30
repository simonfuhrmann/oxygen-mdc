import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * A simple tab component that can be used in conjuction with <oxy-tabs> to
 * ensure only one tab is active at a time.
 */
@customElement('oxy-tab')
export class OxyTab extends LitElement {
  static get styles() {
    return css`
      :host {
        position: relative;
        display: block;
        box-sizing: border-box;
        cursor: pointer;
        outline: none;
        overflow: hidden;
        min-width: 64px;
        padding: 8px 16px;
        user-select: none;
        opacity: 0.7;
      }
      :host(:hover),
      :host(:focus),
      :host([selected]) {
        opacity: 1.0;
      }

      /* Indicator common styles and animation. */

      :host::before {
        display: block;
        content: "";
        position: absolute;
        transition: var(--oxy-tab-animation-duration, 100ms) all;
        transition-timing-function: cubic-bezier(.15, .35, .5, 1.5);
      }

      /* Indicator color for inactive, hover/focused and selected. */

      :host::before {
        background-color: var(--oxy-tab-indicator-color-inactive, transparent);
      }
      :host(:hover)::before,
      :host(:focus)::before {
        background-color: var(--oxy-tab-indicator-color-focus, #999);
      }
      :host([selected])::before {
        background-color: var(--oxy-tab-indicator-color, black);
      }

      /* Indicator size and shape for different orientations. */

      :host([orientation="horizontal"])::before {
        bottom: 0;
        height: var(--oxy-tab-indicator-size, 3px);
        width: var(--oxy-tab-indicator-width-inactive, 0%);
        left: calc(50% - var(--oxy-tab-indicator-width-inactive, 0%) / 2);
        border-radius: var(--oxy-tab-horizontal-indicator-border-radius,
                       3px 3px 0 0);
      }
      :host([orientation="horizontal"][selected])::before {
        width: var(--oxy-tab-indicator-width, 90%);
        left: calc(50% - var(--oxy-tab-indicator-width, 90%) / 2);
      }
      :host([orientation="vertical"])::before {
        left: 0;
        width: var(--oxy-tab-indicator-size, 3px);
        height: var(--oxy-tab-indicator-height-inactive, 0%);
        bottom: calc(50% - var(--oxy-tab-indicator-height-inactive, 0%) / 2);
        border-radius: var(--oxy-tab-vertical-indicator-border-radius,
                       0 3px 3px 0);
      }
      :host([orientation="vertical"][selected])::before {
        height: var(--oxy-tab-indicator-height, 70%);
        bottom: calc(50% - var(--oxy-tab-indicator-height, 70%) / 2);
      }
    `;
  }

  @property({type: String, reflect: true}) orientation = 'horizontal';
  @property({type: Boolean, reflect: true}) selected = false;

  constructor() {
    super();
    this.setAttribute('role', 'tab');
    this.setAttribute('tabindex', '0');
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oxy-tab": OxyTab;
  }
}
