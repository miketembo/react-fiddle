import {iGrocery} from './grocery.interface';
import {Rx, update, _} from 'util';
import Immutable, {Seq, Map, OrderedMap} from 'immutable';
import Debug from 'debug';
Debug.enable('grocery.store:debug*');

function subscribe() {}

let toImmutableItem = x => Map(x.data.item || x.data || x);

export let groceryStore = (() => {
  let debug = Debug('grocery.store:debug');
  let info = Debug('grocery.store:info');

  let state = Map({
    items: OrderedMap(),
    activeItemId: null
  });
  let subj = new Rx.BehaviorSubject(state);
  let observer = Rx.Observer.create(
    (_state) => {
      // maybe use sortedItems and items in state to provide more control?
      state = _state.updateIn(['items'], items => items.sortBy(x => x.get('isDone')));

      subj.onNext({
        items: state.get('items').map(x => x.toJS()).toArray(),
        activeItemId: state.get('activeItemId')
      });
    }
  );
  subj.subscribe(
    (s) => {
      debug('[onNext]', s);
    }
  );

  /**
   * @param item {Map}
   */
  function addToItems(item) {
    return state.setIn(['items', item.get('_id')], item);
  }

  /**
   * @param item {Map}
   */
  function updateInItems(item) {
    return state.updateIn(['items', item.get('_id')], x => item);
  }

  function setAndAddActiveItem(item) {
    return addToItems(item).set('activeItemId', item.get('_id'));
  }

  subscribe(
    iGrocery.$on(iGrocery.keys.ADD_DONE)
      .map(toImmutableItem)
      .map(addToItems)
      .subscribe(observer)
  );

  subscribe(
    iGrocery.$on(iGrocery.keys.ADD_EMPTY_DONE)
      .map(toImmutableItem)
      .map(setAndAddActiveItem)
      .subscribe(observer)
  );

  subscribe(
    iGrocery.$on(iGrocery.keys.UPDATE_DONE)
      .map(toImmutableItem)
      .map(updateInItems)
      .subscribe(observer)
  );

  subscribe(
    iGrocery.$on(iGrocery.keys.REMOVE_DONE)
      .map( x => x.data.item._id )
      .map( id => state.removeIn(['items', id]) )
      .subscribe(observer)
  );

  return {
    subj: subj,
    subscribe: subj.subscribe.bind(subj)
  };
})();


// export let groceryStore = (function GroceryStore() {
//   let state = {
//     items: []
//   };
//   let src = new Rx.BehaviorSubject(state);
//
//   let observer = Rx.Observer.create(
//     (_state) => {
//       src.onNext(state = _state);
//     }
//   );
//
//   let extractItemIdFromPayload = x => x.data.item._id;
//
//   let removeById = _.curry(function(id, items) {
//     return _.filter(items, x => x._id !== id);
//   });
//
//   function removeItem(id) {
//     return update(state, {
//       items: {
//         $apply: removeById(id)
//       }
//     });
//   }
//
//   iGrocery.$on(iGrocery.keys.ADD_DONE)
//     .map(function(x) {
//       return update(state, {
//         items: {
//           $push: [x.data]
//         }
//       });
//     })
//     .subscribe(observer)
//   ;
//
//   iGrocery.$on(iGrocery.keys.REMOVE_DONE)
//     .map(extractItemIdFromPayload)
//     .map(removeItem)
//     .subscribe(observer)
//   ;
//
//   iGrocery.$on(iGrocery.keys.UPDATE_DONE)
//     .map((x) => {
//       let updatedItem = x.data.item;
//       return update(state, {
//         items: {
//           $apply: (items) => {
//             return _.map(items, item => item._id === updatedItem._id ? updatedItem : item);
//           }
//         }
//       });
//     })
//     .subscribe(observer)
//   ;
//
//   return {
//     src: src,
//     subscribe: src.subscribe.bind(src)
//   }
// })();


// brainfart: suspend listeners/subscribers e.g. store.pause() for testing purposes
