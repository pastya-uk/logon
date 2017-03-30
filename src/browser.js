/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */

import UaaLogon from './index';
// import UaaLogonPasswordless from './passwordless';

if (typeof global.window.define == 'function' && global.window.define.amd) {
  global.window.define('uaaLogon', function () { return UaaLogon; });
  // global.window.define('uaaLogonPasswordless', function () { return UaaLogonPasswordless; });
} else if (global.window) {
  global.window.UaaLogon = UaaLogon;
  // global.window.UaaLogonPasswordless = UaaLogonPasswordless;
}
