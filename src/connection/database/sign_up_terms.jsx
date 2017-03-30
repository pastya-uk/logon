import React from 'react';

const SignUpTerms = ({checkHandler, checked, children}) => {
  return checkHandler
    ? <span className="uaa-logon-sign-up-terms-agreement">
        <label>
          <input type="checkbox" onChange={checkHandler} checked={checked} />
          {children}
        </label>
      </span>
    : children;
};

export default SignUpTerms;
