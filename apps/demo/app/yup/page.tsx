'use client';

import { object, string, InferType } from 'yup';
import { Form, FormControl, FormField, FormMessage } from 'typedform';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = object({
  username: string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .required('Username is required'),
});

export default function Home() {
  function onSubmit(values: InferType<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form
      resolver={yupResolver(formSchema)}
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
