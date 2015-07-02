import Rx from 'rx';
import {assignActions} from './helpers';
import ActionCreator from '../action-creator';

let RxF = {
  ActionCreator(topic, actions) {
    return assignActions(ActionCreator, actions, topic);
  }
};

export default RxF;
