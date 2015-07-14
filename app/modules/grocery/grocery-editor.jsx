import {React, UIComponent} from 'util';
import {groceryStore} from './grocery.store';

import {UI, View, Container} from 'touchstonejs';
let {
  Tab, Item, ItemInner, Group, Input
} = UI;

import Debug from 'debug';
Debug.enable('groceryEditor*');
let info = Debug('groceryEditor:info');
let debug = Debug('groceryEditor:debug');

// title, input, itemList(checkbox, textfield, actions(removeBtn))

class GroceryItem extends UIComponent {
  render() {
    let {data} = this.props;
    return (
      <Item className={'groceryItem groceryEditor__item'}>
        <Input placeholder="enter grocery" defaultValue={data.title} />
      </Item>
    );
  }
}

export default class GroceryEditor extends UIComponent {
  render() {
    let {items} = this.props;
    return (
      <Container className={'groceryEditor'}>
        {_.map(items, x => <GroceryItem key={x._id} data={x} />)}
      </Container>
    );
  }
}
