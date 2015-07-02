import _ from 'lodash';

export function createActionKeys(topic, actions) {
  return actions.reduce( (ac, x) => {
    let actionName = _.camelCase(x);
    let ucActionName = actionName.toUpperCase();
    let enumerable = true;
    Object.defineProperty(ac,   ucActionName,             {value: `${topic}__${actionName}`, enumerable});
    Object.defineProperty(ac,   `${ucActionName}_DONE`,   {value: `${topic}__${actionName}--done`, enumerable});
    Object.defineProperty(ac,   `${ucActionName}_ERROR`,  {value: `${topic}__${actionName}--error`, enumerable});

    return ac;
  }, {});
}

export function assignStateActions(ActionCreator, topic, actions) {
  actions.reduce( (ac, x) => {
    let actionName = _.camelCase(x);
    ac[actionName] = function action(data, source='view') {

      this.subj.onNext({
        state: 'pending',
        source: source,
        action: `${this.topic}__${actionName}`,
        data: data
      });
    };
    ac[`${actionName}Done`] = function done(data, source='server') {
      let state = 'done';
      this.subj.onNext({
        state: state,
        source: source,
        action: `${this.topic}__${actionName}--${state}`,
        data: data
      });
    };
    ac[`${actionName}Error`] = function error(err, source='server', errType=Error) {
      let state = 'error';
      this.subj.onError({
        err: err,
        state: state,
        source: source,
        action: `${this.topic}__${actionName}--${state}`,
        errType: errType
      });
    };
    return ac;
  }, ActionCreator.prototype);
  return ActionCreator;
}

export function assignActions(ActionCreator, actions, topic) {
  let keys = createActionKeys(topic, actions);

  class XActionCreator extends ActionCreator {
    constructor() {
      super(topic);
      Object.defineProperty(this, 'keys', { value: keys, writeable: false, enumerable: true, configurable: false });
    }

    exportKeys(target={}) {
      return _.reduce(this.keys, (ac, v, k) => {

        ac[`${this.topic.toUpperCase()}_${k}`] = v;

        return ac;
      }, target);
    }
  }

  return assignStateActions(XActionCreator, topic, actions);
}
