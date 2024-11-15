'use client';

import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from 'typedform';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Home() {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  return (
    <Form form={form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit((values) => console.log(values))}
      >
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
      </form>
    </Form>
  );
}
