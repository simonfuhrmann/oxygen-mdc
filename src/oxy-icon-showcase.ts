import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators';

import {OxyIconset} from './oxy-iconset';
import './oxy-icon';
import './oxy-icons-av';
import './oxy-icons-base';
import './oxy-icons-communication';
import './oxy-icons-device';
import './oxy-icons-editor';
import './oxy-icons-hardware';
import './oxy-icons-image';
import './oxy-icons-maps';
import './oxy-icons-notification';
import './oxy-icons-places';
import './oxy-icons-social';

/**
 * An element that displays all available icons.
 */
@customElement('oxy-icon-showcase')
export class OxyIcon extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }
      .icon {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.7em;
        padding: 8px;
        width: 8em;
        text-align: center;
      }
      oxy-icon {
        color: var(--oxy-icon-color, black);
        padding: 8px;
      }
      span {
        color: var(--oxy-icon-name-color, gray);
      }
    `;
  }

  render() {
    const iconsetNames = OxyIconset.getIconsetNames();
    return html`${iconsetNames.map(name => this.renderIconset(name))}`;
  }

  private renderIconset(iconsetName: string) {
    const iconNames = OxyIconset.getIconNames(iconsetName);
    return html`
      <h1>${iconsetName}</h1>
      ${iconNames.map(name => this.renderIcon(iconsetName, name))}
    `;
  }

  private renderIcon(iconsetName: string, name: string) {
    const iconName = iconsetName + ":" + name;
    return html`
      <div class="icon">
        <oxy-icon icon="${iconName}"></oxy-icon>
        <span>${name}</span>
      </div>
    `;
  }
}
