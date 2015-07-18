import Rx from 'rx';
import {iGrocery} from './grocery.interface';
import {update} from 'util';

class GroceryHandler {
  constructor() {
    iGrocery.$on(iGrocery.keys.ADD)
      .map( this._mapData )
      .flatMap(this.add)
      // @TODO .subscribe(iGrocery.addDoneObserver)
      .subscribe(iGrocery.addDone.bind(iGrocery))
    ;

    iGrocery.$on(iGrocery.keys.ADD_EMPTY)
      .flatMap(this.addEmpty)
      .subscribe(iGrocery.addEmptyDone.bind(iGrocery))
    ;

    iGrocery.$on(iGrocery.keys.REMOVE)
      .map( this._mapData )
      .flatMap(this.remove)
      .subscribe(iGrocery.removeDone.bind(iGrocery))
    ;

    iGrocery.$on(iGrocery.keys.UPDATE)
      .map(this._mapData)
      .flatMap(this.update)
      .subscribe(iGrocery.updateDone.bind(iGrocery))
    ;
  }

  _mapData(payload) { return payload.data; }

  add(grocery) {
    return Rx.Observable.create( obs => {
      setTimeout(function() {

        grocery._id = Date.now();
        grocery.createdAt = new Date();

        obs.onNext(grocery);
        obs.onCompleted();

      }, 300);
    });
  }

  addEmpty() {
    return Rx.Observable.return({
      _id: Date.now(),
      title: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      isDone: false
    }).delay(300);
  }

  remove(item) {
    return Rx.Observable.return({code: 204, item: item}).delay(1000);
  }

  update(item) {

    item = update(item, {
      updatedAt: { $set: new Date().toISOString() }
    });

    return Rx.Observable.return({item: item}).delay(10);
  }
}

export let groceryHandler = new GroceryHandler();
