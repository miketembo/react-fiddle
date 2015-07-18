import Rx from 'rx';

export default class ActionCreator {
  constructor(topic) {
    Object.defineProperty(this, 'topic', {value: topic, enumerable: true});
    this.src = new Rx.ReplaySubject();
  }

  $on(key) {
    if (!key) throw TypeError('No valid key specified. key: ' + key);
    return this.src.filter( x => x.action === key );
  }

  $onMany(...keys) {
    if (!keys.length) {
      throw TypeError('No keys specified');
    }
    return this.src.filter( x => keys.indexOf(x.action) > -1 );
  }

  subscribe() {
    return this.src.subscribe.apply(this.src, arguments);
  }
}
