import Core from './core';
import passwordless from './engine/passwordless';

export default class UaaLogonPasswordless extends Core {

  constructor(clientID, domain, options) {
    super(clientID, domain, options, passwordless);
  }

}
