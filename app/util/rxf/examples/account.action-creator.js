import RxF from '../';
import Ajv from 'ajv';

let actions = [
  'create',
  'remove',
  'findById',
  'query'
];


let ajv = Ajv({allErrors: true});

let validate = ajv.compile({
  title: 'createAccountArgs',
  type: 'array',
  minItems: 1,
  maxItems: 2,
  items: [
    {
      title: 'data',
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        }
      }
    },
    {
      title: 'source',
      type: 'string',
      enum: ['server', 'view']
    }
  ]
});

export const IAccount = RxF.ActionCreator('account', actions);

let createFn = IAccount.prototype.create;
IAccount.prototype.create = function() {
  if(validate(Array.prototype.slice.call(arguments))) {
    createFn.apply(this, arguments);
  } else {
    this.createError(validate.errors, 'view', TypeError('Invalid arguments'));
  }
}

export const iAccount = new IAccount();


// argumentValidator(IAccount, 'create', [validators])

/*

[
  // example validation with ajv
  ['data', (data, done) => {
    isValid = validate(data)

    if (isValid) {
      done(null);
    } else {
      done(validate.errors)
    }
  }],
  ['source', ['string', 'allowEmpty']]
]

*/

/*

{
  title: 'createAccountArgs',
  required: [0]
  type: 'array'
  properties:
    0:
      title: 'data'
      type: 'object'
      required: ['name', 'email']
      properties:


    1:
      description: 'source'
}

*/

// console.log(v([
//   // data
//   {
//     name: 'John Doe',
//     email: 'johndoe@example.com'
//   },
//   // source
//   'view'
// ]), v.errors);
