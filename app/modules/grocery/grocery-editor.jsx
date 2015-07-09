import React from 'react';
import {toUIElement, update} from 'util';
import mui, {List, ListItem, Checkbox, TextField} from 'material-ui';
import RxF from 'util/rxf';
import Rx from 'rx';
import cn from 'classnames';

import './textfield.scss';

/*
    [x] add new
    [x] edit
    [x] remove
    [ ] undo
    [ ] (un)mark as done
    [ ] persist any change
 */

let actions = [
  'add',
  'update',
  'remove'
];

let IGrocery = RxF.ActionCreator('groceryEditor', actions);
let iGrocery = new IGrocery();

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

class GroceryHandler {
  constructor() {
    iGrocery.$on(iGrocery.keys.ADD)
      .map( x => x.data )
      .flatMap(this.add)
      // @TODO .subscribe(iGrocery.addDoneObserver)
      .subscribe(iGrocery.addDone.bind(iGrocery))
    ;

    iGrocery.$on(iGrocery.keys.REMOVE)
      .map(x=>x.data)
      .flatMap(this.remove)
      .subscribe(iGrocery.removeDone.bind(iGrocery))
  }

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

  remove(id) {
    return Rx.Observable.return({code:204, item: {_id: id}}).delay(300);
  }
}

let groceryHandler = new GroceryHandler();

let groceryStore = (function GroceryStore() {
  let state = {
    items: []
  };
  let src = new Rx.BehaviorSubject(state);

  let observer = Rx.Observer.create(
    src.onNext.bind(src)
  );

  // brainfart: suspend listeners/subscribers e.g. store.pause() for testing purposes

  iGrocery.$on(iGrocery.keys.ADD_DONE)
    .map(function(x) {
      state.items.push(x.data);
      return state;
    })
    .subscribe(observer)
  ;

  iGrocery.$on(iGrocery.keys.REMOVE_DONE)
    .map(function(x) {
      let removedItemId = x.data.item._id;
      return state = update(state, {
        items: {
          $apply: items => items.filter( item => item._id !== removedItemId)
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

/*
  - grocery add(persist)/update/remove
  - groceryListChange
*/

class GroceryEditor extends React.Component {
  componentWillMount() {
    groceryStore.subscribe( x => {
      this.setState(x);
    });
  }

  addGrocery(e) {
    let {value} = e.target;

    iGrocery.add({
      title: value
    });
  }

  enableEditMode(id, e, reactId) {
    this.setState({
      [id]: {
        editable: true
      },
      items: this.state.items
    });
  }

  disableEditMode(id) {
    this.setState({
      [id]: {
        editable: false
      },
      items: this.state.items
    });
  }

  removeGrocery(item) {
    if (this.state[item._id]) {
      this.setState(update(this.state, {
        [item._id]: {
          $merge: {
            hidden: true
          }
        }
      }));
    }

    iGrocery.remove(item._id);
  }

  mapGroceryList(items) {
    let cbStyle = {
      width: 'auto',
      display: 'inline-block'
    };

    return items.map( x => {
      if (!this.state[x._id]) {
        this.state[x._id] = {
          hidden: false,
          editable: false
        }
      }

      let tfClass = {
        textfield: true
      };
      let liClass = {
        editableList: true,
        hidden: false
      };

      if (this.state[x._id]) {
        let fieldState = this.state[x._id];

        tfClass['_is_editable'] = fieldState.editable;
        liClass['_is_hidden'] = fieldState.hidden;
      }

      liClass = cn(liClass);
      tfClass = cn(tfClass);

      let removeBtn = (
        <mui.IconButton onClick={this.removeGrocery.bind(this, x)}>
          <mui.FontIcon className="material-icons">delete</mui.FontIcon>
        </mui.IconButton>
      );

      return (
        <ListItem
          className={liClass}
          rightIconButton={removeBtn}
          key={x._id}>
          <Checkbox style={cbStyle} name="grocery" checked={x.isDone} />
          <TextField
            onBlur={this.disableEditMode.bind(this, x._id)}
            onTouchTap={this.enableEditMode.bind(this, x._id)}
            className={tfClass} defaultValue={x.title} />
        </ListItem>
      );
    });
  }

  render() {

    if (!this.state) { return <div>...</div>  }

    return (
      <div>

        <List subheader="Groceries">
          <ListItem>
            <TextField floatingLabelText="Enter grocery" onEnterKeyDown={this.addGrocery.bind(this)} />
          </ListItem>
        </List>

        {this.mapGroceryList(this.state.items)}
      </div>
    );
  }
}

export default toUIElement(GroceryEditor);
