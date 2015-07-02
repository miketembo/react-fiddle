import Rx from 'rx';

export default class ActionCreator {
  constructor(topic) {
    Object.defineProperty(this, 'topic', {value: topic, enumerable: true});
    this.subj = new Rx.ReplaySubject();
    this.ignoreErrSubj = Rx.Observable.onErrorResumeNext(this.subj);
  }
}
