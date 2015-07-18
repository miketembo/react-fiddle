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

  onTrashTap(e) {
    iGrocery.remove(this.props.data);
  }

  onTitleFieldChange(e) {
    this.contentSubj.onNext(update(this.props.data, {
      title: { $set: e.target.value }
    }));
  }

  render() {
    let {state, props} = this;
    let {data} = props;

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
              onFocus={this.onItemActivate.bind(this)}
              autoFocus={props.autoFocus}
              placeholder="enter grocery" />
          </ItemContent>

          <div className={'ButtonGroup--inline'}>
            {state.isEditable ? <UI.Button onTouchTap={this.onTrashTap.bind(this)} stopPropagation><i className={'ion-trash-b ion-lg'} /></UI.Button> : null}
            <UI.Button type={'primary'} onTouchTap={this.onCheckboxTap.bind(this)} stopPropagation className={(data.isDone ? '_isInactive' : '')}>
              <i className={'ion-checkmark-round ion-lg '} />
            </UI.Button>
          </div>
        </ItemInner>
      </Item>
    );
  }
}
