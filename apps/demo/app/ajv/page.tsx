'use client';

import { ajvResolver } from '@hookform/resolvers/ajv';
import { JSONSchemaType } from 'ajv';
import { Form, FormControl, FormField, FormMessage } from 'typedform';

type FormType = { username: string };

const formSchema: JSONSchemaType<FormType> = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 2,
      errorMessage: { minLength: 'username field is required' },
    },
  },
  required: ['username'],
  additionalProperties: false,
};

export default function Home() {
  function onSubmit(values: FormType) {
    console.log(values);
  }

  return (
    <Form
      resolver={ajvResolver(formSchema)}
      onSubmit={onSubmit}
      defaultValues={{ username: '' }}
      className="space-y-8"
    >
      {({ form }) => (
        <>
          <FormField name="username">
            <FormControl>
              <input
                className="px-3 py-1.5 border rounded-lg"
                placeholder="shadcn"
              />
            </FormControl>

            <FormMessage />
          </FormField>
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
