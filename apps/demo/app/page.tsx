import { z } from 'zod';
import { Form, FormControl, FormField, FormMessage } from 'typedform';
import { zodResolver } from '@hookform/resolvers/zod';

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
      resolver={zodResolver(formSchema)}
      onSubmit={onSubmit}
      defaultValues={{ username: '' }}
      className="space-y-8"
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
    </Form>
  );
}
