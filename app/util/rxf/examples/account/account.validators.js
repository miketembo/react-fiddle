import Ajv from 'ajv';
let ajv = Ajv({allErrors: true});

export const checkAccountCreateArgs = ajv.compile({
  title: 'accountCreateArgs',
  type: 'array',
  minItems: 1,
  maxItems: 2,
  items: [
    {
      // @TODO use $ref for reuse of schema's
      title: 'data',
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: {
          type: 'string',
          minLength: 2,
          maxLength: 100
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
