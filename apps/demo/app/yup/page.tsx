'use client';

import { object, string, InferType } from 'yup';
import { Form, FormField, InferValues } from 'typedform';

const formSchema = object({
  username: string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Home() {
  function onSubmit(values: InferType<typeof formSchema>) {
    console.log(values);
  }

  console.log('formSchema', formSchema);

  return (
    <Form
      schema={formSchema}
      onSubmit={onSubmit}
      defaultValues={{ username: '' }}
      className="space-y-8"
    >
      {({ form }) => (
        <>
          <FormField name="username">
            {({ field }) => (
              <input
                className="px-3 py-1.5 border rounded-lg"
                placeholder="shadcn"
                {...field}
              />
            )}
          </FormField>
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
