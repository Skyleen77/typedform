'use client';

import { z, ZodObject, ZodSchema } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  InferValues,
} from 'typedform';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Home() {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  console.log('formSchema', formSchema);
  console.log(
    'formSchema instanceof ZodSchema',
    formSchema instanceof ZodSchema,
  );
  console.log(
    'formSchema instanceof ZodObject',
    formSchema instanceof ZodObject,
  );

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
          <FormField name="username" asChild>
            <div>
              <FormControl>
                <input
                  className="px-3 py-1.5 border rounded-lg"
                  placeholder="shadcn"
                />
              </FormControl>
              <FormMessage>This is your public display name.</FormMessage>
            </div>
          </FormField>
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
