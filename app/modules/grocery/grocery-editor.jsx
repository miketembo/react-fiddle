import {React, UIComponent} from 'util';
import {groceryStore} from './grocery.store';
import GroceryListItem from './grocery-list-item';

import {UI, View, Container} from 'touchstonejs';
let {
  Tab, Item, ItemInner, Group, Input
} = UI;

import Debug from 'debug';
Debug.enable('groceryEditor*');
let info = Debug('groceryEditor:info');
let debug = Debug('groceryEditor:debug');

// title, input, itemList(checkbox, textfield, actions(removeBtn))

export default class GroceryEditor extends UIComponent {
  render() {
    let {items} = this.props;
    return (
      <Container className={'groceryEditor'} scrollable>
        {_.map(items, x => <GroceryListItem key={x._id} data={x} />)}
      </Container>
    );
  }
}
