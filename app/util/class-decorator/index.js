import _ from 'lodash';

export default function decorateClass(Target, decorators) {
  class DecoratedClass extends Target {
    constructor(...args) { super(...args); }
  }
  _.reduce(decorators, (ac, d, key) => {
    ac[key] = d(ac[key]);
    return ac;
  }, DecoratedClass.prototype);

  return DecoratedClass;
}
