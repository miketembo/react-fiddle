import {React, UIComponent, _} from 'util';
import GroceryListItem from './grocery-list-item';

import {Container} from 'touchstonejs';

import Debug from 'debug';
Debug.enable('groceryEditor*');
let info = Debug('groceryEditor:info');
let debug = Debug('groceryEditor:debug');

// title, input, itemList(checkbox, textfield, actions(removeBtn))

export default class GroceryEditor extends UIComponent {
  render() {
    let {items, activeItemId} = this.props;
    return (
      <Container className={'groceryEditor'} scrollable>
        {_.map(items, x => <GroceryListItem key={x._id} data={x} autoFocus={x._id === activeItemId} />)}
      </Container>
    );
  }
}
