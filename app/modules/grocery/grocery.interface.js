import RxF from 'util/rxf';

let actions = [
  'add',
  'addEmpty',
  'update',
  'remove'
];

export let IGrocery = RxF.ActionCreator('groceryEditor', actions);
export let iGrocery = new IGrocery();
