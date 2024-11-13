'use client';

import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '../../../packages/typedform/dist';
import React, { useRef } from 'react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`px-3 py-1.5 border rounded-lg ${className}`}
      {...props}
      ref={ref}
    />
  );
});

export default function Home() {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const testRef = useRef<HTMLLabelElement>(null);

  return (
    <Form
      schema={formSchema}
      onSubmit={onSubmit}
      defaultValues={{ username: '' }}
      className="space-y-8"
    >
      {/* <FormField name="username" as="div">
        {({ field }) => (
          <>
            <FormLabel as="label">Username</FormLabel>
            <FormControl as={Input} placeholder="shadcn" {...field} />
            <FormDescription as="p">
              This is your public display name.
            </FormDescription>
            <FormMessage as="p" />

            <FormLabel acChild>
              <p>Username</p>
            </FormLabel>
            <FormControl asChild>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription asChild>
              <p>This is your public display name.</p>
            </FormDescription>
            <FormMessage asChild>
              <p>Hello</p>
            </FormMessage>
          </>
        )}
      </FormField> */}
      <FormField name="username">
        <FormLabel ref={testRef} as="label">
          Test
        </FormLabel>
        <FormControl>
          {({ field }) => (
            <input
              className="px-3 py-1.5 border rounded-lg"
              placeholder="shadcn"
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
