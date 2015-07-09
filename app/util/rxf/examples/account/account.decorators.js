import _ from 'lodash';
import Ajv from 'ajv';
import {checkAccountCreateArgs} from './account.validators';

export const IAccountDecorator = {
  create(method) {
    return function create() {
      if(checkAccountCreateArgs(_.toArray(arguments))) {
        method.apply(this, arguments);
      } else {
        this.createError(checkAccountCreateArgs.errors, 'view', TypeError('Invalid arguments'));
      }
    }
  },

  findById(method) {
    return function findById(id) {
      method.apply(this, arguments);
      // if (isValidEntityId(arguments)) {
      //
      // }
    }
  }
};
