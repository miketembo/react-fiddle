import {React, _} from 'util';
// import {Container} from 'touchstonejs';
import {groceryStore} from './grocery.store';
import GroceryEditor from './grocery-editor';
import {iGrocery} from './grocery.interface';

export let GroceryListView = React.createClass({
  statics: {
    navigationBar: 'main',
    getNavigation ({name}) {
      return {
        title: _.capitalize(name),
        rightIcon: 'ion-plus',
        rightAction: iGrocery.addEmpty.bind(iGrocery)
      };
    }
  }
  ,
  componentWillMount() {
    this.storeSubscription = groceryStore.subscribe(
      (state) => {
        this.setState(state);
      }
    );
  }
  ,
  componentWillUnmount() {
    this.storeSubscription.dispose();
  }
  ,
  render() {
    return (<GroceryEditor {...this.state} />);
  }
});
