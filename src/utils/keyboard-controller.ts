import {ReactiveController, LitElement} from 'lit';

enum HostAction {
  SET_ACTIVE_DURING_SPACE = 1 << 0,
  SET_ACTIVE_DURING_ENTER = 1 << 1,
  CLICK_ON_SPACE_DOWN = 1 << 2,
  CLICK_ON_SPACE_UP = 1 << 3,
  CLICK_ON_ENTER_DOWN = 1 << 4,
  CLICK_ON_ENTER_UP = 1 << 5,
}

export class KeyboardController implements ReactiveController {
  private host: LitElement;
  private hostActions = 0;
  private readonly keyDownListener = this.onKeyDown.bind(this);
  private readonly keyUpListener = this.onKeyUp.bind(this);

  constructor(host: LitElement) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    this.host.addEventListener('keydown', this.keyDownListener);
    this.host.addEventListener('keyup', this.keyUpListener);
  }

  hostDisconnected() {
    this.host.removeEventListener('keydown', this.keyDownListener);
    this.host.removeEventListener('keyup', this.keyUpListener);
  }

  setActiveDuringSpace() {
    this.hostActions = this.hostActions | HostAction.SET_ACTIVE_DURING_SPACE;
  }

  setActiveDuringEnter() {
    this.hostActions = this.hostActions | HostAction.SET_ACTIVE_DURING_ENTER;
  }

  setClickOnSpaceUp() {
    this.hostActions = this.hostActions | HostAction.CLICK_ON_SPACE_UP;
  }

  setClickOnEnterDown() {
    this.hostActions = this.hostActions | HostAction.CLICK_ON_ENTER_DOWN;
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.host.hasAttribute('disabled')) return;

    switch (event.key) {
      case ' ':
        if (this.isActiveDuringSpace()) {
          event.stopPropagation();
          this.setHostActive();
        }
        break;

      case 'Enter':
        if (this.isActiveDuringEnter()) {
          event.stopPropagation();
          this.setHostActive();
        }
        if (this.hasClickOnEnterDown()) {
          event.stopPropagation();
          this.clickHost();
        }
        break;

      default:
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (this.host.hasAttribute('disabled')) return;

    switch (event.key) {
      case ' ':
        if (this.isActiveDuringSpace()) {
          event.stopPropagation();
          this.removeHostActive();
        }
        if (this.hasClickOnSpaceUp()) {
          event.stopPropagation();
          this.clickHost();
        }
        break;

      case 'Enter':
        if (this.isActiveDuringEnter()) {
          this.removeHostActive();
          event.stopPropagation();
        }
        break;

      default:
        break;
    }
  }

  private clickHost() {
    this.host.click();
  }

  private isActiveDuringSpace() {
    return this.hostActions & HostAction.SET_ACTIVE_DURING_SPACE;
  }

  private isActiveDuringEnter() {
    return this.hostActions & HostAction.SET_ACTIVE_DURING_ENTER;
  }

  private hasClickOnEnterDown() {
    return this.hostActions & HostAction.CLICK_ON_ENTER_DOWN;
  }

  private hasClickOnSpaceUp() {
    return this.hostActions & HostAction.CLICK_ON_SPACE_UP;
  }

  private setHostActive() {
    this.host.setAttribute('active', 'active');
  }

  private removeHostActive() {
    this.host.removeAttribute('active');
  }
}
