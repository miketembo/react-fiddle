import RxF from '../../';
import decorateClass from '../../../class-decorator';
import {IAccountDecorator} from './account.decorators';

let actions = [
  'create',
  'remove',
  'findById',
  'query'
];
export const IAccount = decorateClass(
  RxF.ActionCreator('account', actions),
  IAccountDecorator
);
export const iAccount = new IAccount();
export const iAccountKeys = iAccount.exportKeys();
