'use client';

import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from 'typedform';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
});

export default function Home() {
  function handleSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <Form
      resolver={zodResolver(schema)}
      onSubmit={handleSubmit}
      defaultValues={{ firstName: '' }}
    >
      <FormField name="firstName">
        <FormLabel>First name</FormLabel>
        <FormControl>
          {({ field }) => (
            <input
              className="px-3 py-1.5 border rounded-lg"
              placeholder="Enter your first name"
              {...field}
            />
          )}
        </FormControl>
        <FormMessage />
      </FormField>
      <button type="submit">Submit</button>
    </Form>
  );
}
