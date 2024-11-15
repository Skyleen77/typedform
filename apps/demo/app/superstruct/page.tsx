'use client';

import { superstructResolver } from '@hookform/resolvers/superstruct';
import { object, string, Infer, size, refine } from 'superstruct';
import { Form, FormControl, FormField, FormMessage } from 'typedform';

const formSchema = object({
  username: refine(size(string(), 2, Infinity), 'username', (value) => {
    if (value.length < 2) {
      return 'Username must be at least 2 characters.';
    }
    return true;
  }),
});

export default function Home() {
  function onSubmit(values: Infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form
      resolver={superstructResolver(formSchema)}
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
