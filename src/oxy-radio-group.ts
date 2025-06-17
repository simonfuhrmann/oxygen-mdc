import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { OxyRadio } from './oxy-radio';

/**
 * A radio button group that listens to a @radio-change bubbling event and sets
 * the `checked` property of all slotted <oxy-button> elements to false. Slotted
 * elements are recursively traversed, so keep slotted content light.
 *
 * This component does not provide any styling.
 */
@customElement('oxy-radio-group')
export class OxyRadioGroup extends LitElement {
  private onChangeCb = this.onChange.bind(this);

  @query('slot') slotElem?: HTMLSlotElement;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('radio-change', this.onChangeCb);
  }

  override disconnectedCallback() {
    this.removeEventListener('radio-change', this.onChangeCb);
    super.disconnectedCallback();
  }

  override render() {
    return html`<slot></slot>`;
  }

  private onChange(event: Event) {
    const ev = event as CustomEvent<OxyRadio>;
    if (ev.detail?.checked !== true) return;

    // Get all slotted elements, including nested slots. `flatten` does not
    // actually flatten normal element hierarchies.
    const children = this.slotElem?.assignedElements({ flatten: true }) ?? [];
    for (const child of children) {
      // Recursively traverse all slotted elements.
      const walker = document.createTreeWalker(child, NodeFilter.SHOW_ELEMENT);
      let node: Node | null = walker.currentNode;
      while (node) {
        if (node instanceof OxyRadio) {
          node.checked = ev.detail === node;
        }
        node = walker.nextNode();
      }
    }
    this.dispatchEvent(new CustomEvent('change'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oxy-radio-group": OxyRadioGroup;
  }
}
