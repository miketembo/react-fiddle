import GroceryEditor from './grocery-editor';
import {iGrocery} from './grocery.interface';
import {groceryHandler} from './grocery.handler';
import {groceryStore} from './grocery.store';

export {GroceryEditor, iGrocery, groceryHandler};

/*
    [x] add new
    [ ] edit
    [x] remove
    [ ] undo
    [ ] (un)mark as done
    [ ] persist any change
 */

 iGrocery.src.subscribe(
   (x) => {
     console.log("iGrocery. action: %s", x.action);
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
