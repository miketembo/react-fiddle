import GroceryEditor from './grocery-editor';
import {iGrocery} from './grocery.interface';
import {groceryHandler} from './grocery.handler';
import {groceryStore} from './grocery.store';

import Debug from 'debug';
Debug.enable('iGrocery*');
let debug = Debug('iGrocery:debug');
let info = Debug('iGrocery:info');

export {GroceryEditor, iGrocery, groceryHandler};

/*
    [ ] update store without iterating over each element
    [x] add new
    [x] edit
    [x] remove
    [ ] undo
    [x] (un)mark as done
    [ ] persist any change
    [ ] load via localStorage/server/pouchdb
    [ ] test
    [ ] use other material design framework
 */

 iGrocery.src.subscribe(
   (x) => {
     info('[action] %s', x.action);
   }
 );

[
  'Macaroni',
  // 'Salmon',
  // 'Cheese',
  // 'Pepper',
  // 'Salt',
  'Strawberries'
].forEach(function(x) {
  iGrocery.addDone({
    _id: Date.now(),
    createdAt: new Date().toISOString(),
    title: x,
    isDone: false //Math.random() < 0.5
  });
});
