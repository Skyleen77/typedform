'use client';

import { z } from 'zod';
import { Form, FormField } from '../../../../packages/typedform/dist';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Home() {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
