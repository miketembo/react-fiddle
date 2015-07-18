import {_} from 'util';
// import {Container} from 'touchstonejs';
require('./editable-list.scss');
import GroceryEditor from './grocery-editor';
import {iGrocery} from './grocery.interface';
import {groceryHandler} from './grocery.handler';
import {groceryStore} from './grocery.store';
import {GroceryListView} from './grocery-list.view';

import Debug from 'debug';
Debug.enable('iGrocery*');
let debug = Debug('iGrocery:debug');
let info = Debug('iGrocery:info');

export {
  iGrocery,
  groceryHandler,
  groceryStore,
  GroceryListView,
  GroceryEditor
};
/*
    [ ] add new
    [ ] persist any change to a storageService
    [ ] load via localStorage/server/pouchdb
    [ ] handle system errors
    [ ] test
    [ ] set state manually (on a store?)
    [x] display user notifications
    [x] remove
    [x] update store without iterating over each element
    [x] edit
    [x] (un)mark as done
 */

iGrocery.src.subscribe(
  (x) => {
    info('[action] %s', x.action);
  }
);

[
  'Macaroni',
  'Salmon',
  'Cheese',
  'Pepper',
  'Salt',
  'Strawberries'
].forEach(function(x) {
  iGrocery.addDone({
    _id: Date.now(),
    createdAt: new Date().toISOString(),
    title: x,
    isDone: Math.random() < 0.5,
    categoryIcon: ['ion-ios-nutrition-outline', 'ion-pizza', 'ion-beer', 'ion-wineglass', 'ion-coffee'][_.random(0,4)]
  });
});
