import Ajv from 'ajv';
import {checkAccountCreateArgs} from './account.schema';

export const IAccountDecorator = {
  create(method) {
    return function create() {
      if(checkAccountCreateArgs(Array.prototype.slice.call(arguments))) {
        method.apply(this, arguments);
      } else {
        this.createError(checkAccountCreateArgs.errors, 'view', TypeError('Invalid arguments'));
      }
    }
  }
};
