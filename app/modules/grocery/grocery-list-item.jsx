import {React, UIComponent, update, cn, _, Rx} from 'util';
import {UI} from 'touchstonejs';
import {iGrocery} from './grocery.interface';
let {Item, Input, ItemContent, ItemNote, ItemInner, ItemMedia} = UI;

export default class GroceryListItem extends UIComponent {
  constructor(...args) {
    super(...args);
    this.state = this.getComponentState();

    this.contentSubj = new Rx.Subject();
    this.contentObserver = this.contentSubj
      .debounce(700)
      .subscribe(iGrocery.update.bind(iGrocery))
    ;
  }
  componentWillUnmount() {
    this.contentObserver.dispose();
  }

  getComponentState() {
    return {
      isEditable: false
    };
  }

  onItemActivate() {
    this.setState(update(this.state, {
      isEditable: {$set: !this.state.isEditable}
    }));
  }
  onItemDeactivate() {
    this.setState(update(this.state, {
      isEditable: {$set: false}
    }));
  }

  onCheckboxTap() {
    iGrocery.update(
      update(this.props.data, {
        isDone: {$set: !this.props.data.isDone }
      })
    );
  }

  onTrashTap() {

  }

  onTitleFieldChange(e) {
    this.contentSubj.onNext(update(this.props.data, {
      title: { $set: e.target.value }
    }));
  }

  render() {
    let {state} = this;
    let {data} = this.props;

    let itemClassName = cn({
      groceryItem: true,
      'groceryEditor__item': true,
      '_isDone': data.isDone
    });

    let itemTextfieldClassName = cn({
      'groceryListItem__textfield': true,
      '_isEditable': state.isEditable,
      '_isDone': data.isDone
    });

    return (
      <Item className={itemClassName}>
        <ItemMedia icon={data.categoryIcon} />
        <ItemInner>
          <ItemContent>
            <Input
              className={itemTextfieldClassName}
              defaultValue={data.title}
              onBlur={this.onItemDeactivate.bind(this)}
              onChange={this.onTitleFieldChange.bind(this)}
              onTouchTap={this.onItemActivate.bind(this)}
              placeholder="enter grocery"
              stopPropagation />
          </ItemContent>
          {/*<div onTouchTap={this.onTrashTap.bind(this)}>
            <ItemNote
              icon={'ion-trash-b'}
              className={'ion-lg'}
            />
          </div>*/}
          <div
            onTouchTap={this.onCheckboxTap.bind(this)}>
            <ItemNote
              className={'ion-lg'}
              icon={data.isDone ? 'ion-android-checkbox' : 'ion-android-checkbox-outline-blank'}
              type={data.isDone ? 'default' : 'primary'} /> {/* @TODO type will set a color for the icon e.g warning is orange-yellow */}
          </div>
        </ItemInner>
      </Item>
    );
  }
}
