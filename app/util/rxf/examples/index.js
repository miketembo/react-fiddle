import {iAccount, keys as iAccountKeys} from './account';
import _ from 'lodash';

export default function init() {
  // app keys
  let appKeys = _.assign({},
    iAccountKeys
  );

  setTimeout(()=> {
    iAccount.create({
      name: 'John Doe',
      email: 'johndoe@example.com'
    });
    iAccount.create({
      name: 'John Doe (without email)',
    });
  },1);

  iAccount.subj
    .filter( x => x.action == appKeys.ACCOUNT_CREATE)
    .map( x => x.data )
    .subscribe(
      x => {
        console.debug('Interact data: %o with the data layer (e.g. REST or PouchDB)', x);
      },
      err => {
        console.log(err);
      }
    )
  ;

}

// todo create shortcut to filter on action
// Rx(F).Observable.fromAction(appKeys.ACCOUNT_CREATE_DONE)
/*
RxF
  .ObsFromAction(iAccount, appKeys.ACCOUNT_CREATE)
  .validatArgs(validator, [validator, ...])
  ...meh...action should validate arguments
;

*/
