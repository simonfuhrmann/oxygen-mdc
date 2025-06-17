import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {KeyboardController} from './utils/keyboard-controller';

/**
 * A radio button element with some default styles. The button can be
 * customized using CSS variables, see styles below.
 *
 * Only one radio button in a radio button group can be checked at a time.
 * Define the group and the contained button like so:
 *
 *   <oxy-radio-group>
 *     <oxy-radio>Option 0</oxy-radio>
 *     <oxy-radio>Option 1</oxy-radio>
 *   </oxy-radio-group>
 *
 * Note that a group is not necessary when the radio button is housed in a
 * web component with reactive properties, as the checked attribute can be
 * synced to the local state:
 *
 *   const onClick = (state: number) => { this.state = state; };
 *   <oxy-radio ?checked=${this.state == 0} @click=${onClick.bind(0)}>...
 *   <oxy-radio ?checked=${this.state == 1} @click=${onClick.bind(1)}>...
 *
 * This approach manages the "only one checked button" explicitly.
 */
@customElement('oxy-radio')
export class OxyRadio extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      user-select: none;
      outline: none;
      position: relative;
      border-radius: 4px;
      margin: 4px;
      cursor: pointer;
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
    }

    :host::after {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      content: "";
    }
    :host(:focus-visible)::after {
      box-shadow: 0 0 0 2px var(--oxy-checkbox-focus-color, cornflowerblue);
    }

    #label {
      margin: 2px 8px;
      flex-grow: 1;
    }
    #radio {
      flex-shrink: 0;
      width: calc(1em + 4px);
      height: calc(1em + 4px);
      border-radius: 50%;
      box-sizing: border-box;
      border: var(--oxy-radio-unchecked-border, 2px solid gray);
      background: var(--oxy-radio-unchecked-background, none);
      position: relative;
      transition: transform 50ms;
    }
    :host([checked]) #radio {
      background: var(--oxy-radio-checked-background, none);
    }
    :host([checked]) #radio:after {
      position: absolute;
      inset: var(--oxy-radio-check-inset, 3px);
      border-radius: 50%;
      background: var(--oxy-radio-check-color, #28f);
      content: "";
    }
    :host(:active) #radio,
    :host([active]) #radio {
      transform: scale(0.9);
    }
    :host([checked]:active) #radio,
    :host([checked][active]) #radio {
      transform: scale(1.1);
    }
  `;

  private keyboardController = new KeyboardController(this);

  @property({type: Boolean, reflect: true}) checked: boolean = false;
  @property({type: Boolean, reflect: true}) disabled: boolean = false;

  constructor() {
    super();
    this.keyboardController.setActiveDuringSpace();
    this.keyboardController.setClickOnSpaceUp();
  }

  override updated(changedProps: Map<string, any>) {
    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.removeAttribute('aria-disabled');
      }
    }
    if (changedProps.has('checked')) {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
      this.dispatchEvent(new CustomEvent('change', {detail: this.checked}));

      const eventDict = {detail: this, bubbles: true};
      this.dispatchEvent(new CustomEvent('radio-change', eventDict));
    }
  }

  override firstUpdated() {
    this.setAttribute('role', 'radio');
    this.setAttribute('tabindex', '0');
    this.addEventListener('click', () => this.onClick());
  }

  override render() {
    return html`
      <div id="radio"></div>
      <div id="label"><slot></slot></div>
    `;
  }

  private onClick() {
    if (this.disabled) return;
    this.checked = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oxy-radio": OxyRadio;
  }
}
