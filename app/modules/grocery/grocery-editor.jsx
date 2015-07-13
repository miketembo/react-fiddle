import React from 'react';
import {toUIElement, update} from 'util';
import mui, {List, ListItem, Checkbox, TextField} from 'material-ui';
import RxF from 'util/rxf';
import Rx from 'rx';
import cn from 'classnames';

import './editable-list.scss';
import {iGrocery} from './grocery.interface';
import {groceryStore} from './grocery.store';

class GroceryEditor extends React.Component {
  constructor(...args) {
    super(...args);

    this.updateItemContent = new Rx.Subject();

    this.updateItemContent
      .debounce(700)
      .distinctUntilChanged()
      .subscribe(
        iGrocery.update.bind(iGrocery)
      )
    ;
  }

  componentWillMount() {
    this.subscription = groceryStore.subscribe( x => {
      this.setState(x);
    });
  }
  componentWillUnmount() {
    this.subscription.dispose();
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

    iGrocery.remove(item);
  }

  toggleItemDone(item) {
    item = update(item, {
      isDone: {$set: !item.isDone}
    });
    iGrocery.update(item);
  }

  onItemContentChange(item, e) {
    item = update(item, {
      title: {$set: e.target.value}
    });
    this.updateItemContent.onNext(item);
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
        'editableList__item': true,
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
          <Checkbox onClick={this.toggleItemDone.bind(this, x)} style={cbStyle} name="grocery" checked={x.isDone} />
          <TextField
            onChange={this.onItemContentChange.bind(this, x)}
            onBlur={this.disableEditMode.bind(this, x._id)}
            onTouchTap={this.enableEditMode.bind(this, x._id)}
            className={tfClass} defaultValue={x.title} />
        </ListItem>
      );
    });
  }

  render() {

    if (!this.state) { return <div>...</div>;  }

    let storeState = {
      items: this.state.items
    };

    return (
      <div>
        <List subheader="Groceries">
          <ListItem>
            <TextField floatingLabelText="Enter grocery" onEnterKeyDown={this.addGrocery.bind(this)} />
          </ListItem>
        </List>

        {this.mapGroceryList(this.state.items)}

        <h3>Grocery store state: </h3>
        <div><pre>{JSON.stringify( storeState || {}, null, 2)}</pre></div>
      </div>
    );
  }
}

export default toUIElement(GroceryEditor);
