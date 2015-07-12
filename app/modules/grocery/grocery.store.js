import {iGrocery} from './grocery.interface';
import {update} from 'util';
import _ from 'lodash';

export let groceryStore = (function GroceryStore() {
  let state = {
    items: []
  };
  let src = new Rx.BehaviorSubject(state);

  let observer = Rx.Observer.create(
    (_state) => {
      src.onNext(state = _state);
    }
  );

  let extractItemIdFromPayload = x => x.data.item._id;

  let removeById = _.curry(function(id, items) {
    return _.filter(items, x => x._id !== id);
  });

  function removeItem(id) {
    return update(state, {
      items: {
        $apply: removeById(id)
      }
    });
  }

  iGrocery.$on(iGrocery.keys.ADD_DONE)
    .map(function(x) {
      return update(state, {
        items: {
          $push: [x.data]
        }
      })
    })
    .subscribe(observer)
  ;

  iGrocery.$on(iGrocery.keys.REMOVE_DONE)
    .map(extractItemIdFromPayload)
    .map(removeItem)
    .subscribe(observer)
  ;

  iGrocery.$on(iGrocery.keys.UPDATE_DONE)
    .map((x) => {
      let updatedItem = x.data.item;
      return update(state, {
        items: {
          $apply: (items) => {
            return _.map(items, item => item._id === updatedItem._id ? updatedItem : item);
          }
        }
      });
    })
    .subscribe(observer)
  ;

  return {
    src: src,
    subscribe: src.subscribe.bind(src)
  }
})();


// brainfart: suspend listeners/subscribers e.g. store.pause() for testing purposes
