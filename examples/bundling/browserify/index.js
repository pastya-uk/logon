import UaaLogon from 'uaa-logon';

const cid = "yKJO1ckwuY1X8gPEhTRfhJXyObfiLxih";
const domain = "mdocs.auth0.com";

const logon = new UaaLogon(cid, domain);

logon.show();
