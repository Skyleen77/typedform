'use client';

import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from 'typedform';
import { useRef } from 'react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Home() {
  const testRef = useRef<HTMLInputElement>(null);

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
          {/* <FormField name="username">
            {({ field }) => (
              <>
                <FormControl>
                  <input
                    className="px-3 py-1.5 border rounded-lg"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
                <FormMessage>This is your public display name.</FormMessage>
              </>
            )}
          </FormField> */}
          <FormField name="username">
            <FormControl
              ref={testRef}
              as="input"
              className="px-3 py-1.5 border rounded-lg"
              placeholder="shadcn"
            />
            {/* <FormMessage asChild>
              <p className="text-blue-500">This is your public display name.</p>
            </FormMessage> */}
            <FormMessage>
              {({ error }) => (
                <p className={error ? 'text-red-500' : 'text-blue-500'}>
                  {error
                    ? String(error.message)
                    : 'This is your public display name.'}
                </p>
              )}
            </FormMessage>
          </FormField>
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
