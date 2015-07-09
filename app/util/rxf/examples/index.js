import {iAccount, iAccountKeys} from './account';
import _ from 'lodash';

export default function init() {
  // app keys
  let appKeys = _.assign({},
    iAccountKeys
  );

  let mockedResponses = {
    account: {
      default: function(data={}) {
        return _.assign({}, data, {
          _id: Date.now(),
          createdAt: new Date().toISOString()
        });
      }
    }
  };
  let accountMock = mockedResponses.account;

  // log all the (account) things
  iAccount.src.subscribe(
    (x) => {
      let args = [
        'state: "%s", action: "%s", data: %O',
        x.state, x.action, x.data || x.err
      ];

      let log = console.log.bind(console);
      if (x.state === 'error') {
        log = console.error.bind(console);
      }

      log.apply(console, args);
    },
    (e) => {
      console.debug(e);
    },
    () => console.info('streamEnd')
  );

  iAccount.$on(appKeys.ACCOUNT_FINDBYID)
    .map( x => x.data )
    .subscribe((x) => {
      setTimeout(function() {
        iAccount.findByIdDone({
          _id: x,
          createdAt: Date.now(),
          name: 'Bob',
          email: 'bob@work.com'
        });
      }, 300);
    });

  //*

  iAccount.$on(appKeys.ACCOUNT_CREATE)
    .flatMap( x => {
      // simlated (delayed/async) db/server response
      return Rx.Observable
        .return(null)
        .delay(300)
        .timeout(300, Rx.Observable.return(accountMock.default(x.data)))
      ;
    })
    .subscribe(
      iAccount.createDone.bind(iAccount)
      // catch any errors and send them through iAccount.createError(err..)
    )
  ;

  iAccount.create({
    email: 'johndoe@example.com',
    name: 'John Doe'
  });
}
