# TypedForm

**TypedForm** is a lightweight, unstyled React component library for building forms with ease. It leverages [React Hook Form](https://react-hook-form.com/) for robust form state management and validation, ensuring your forms are well-structured, semantically correct, and fully accessible. Inspired by the `Form` component from [Shadcn](https://shadcn.com/), TypedForm provides a set of flexible components to streamline form creation in your React applications.

## Features

- **Type-Safe Forms**: Leverages TypeScript for type-safe form handling.
- **Easy Validation**: Integrates seamlessly with validation libraries like `zod`, `yup`, `joi` and more.
- **Accessible**: Implements ARIA attributes and proper labeling for enhanced accessibility.
- **Keyboard Navigation**: Ensures forms are easy to navigate using the keyboard.
- **Unstyled Components**: Provides the structure without imposing any styling, allowing full customization.

## Installation

```bash
npm install typedform react-hook-form @hookform/resolvers
# or
yarn add typedform react-hook-form @hookform/resolvers
# or
pnpm add typedform react-hook-form @hookform/resolvers
```

## Getting Started

### Basic Usage

Here's a simple example to get you started with TypedForm. This example demonstrates creating a basic form with validation.

```tsx
import React from 'react';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
} from 'typedform';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

const ExampleForm: React.FC = () => {
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form
      resolver={zodResolver(schema)}
      onSubmit={onSubmit}
      defaultValues={{
        firstName: '',
        email: '',
      }}
    >
      <FormField name="firstName">
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <input type="text" />
        </FormControl>
        <FormDescription>Your given name.</FormDescription>
        <FormMessage />
      </FormField>

      <FormField name="email">
        <FormLabel>Email Address</FormLabel>
        <FormControl>
          <input type="email" />
        </FormControl>
        <FormDescription>We'll never share your email.</FormDescription>
        <FormMessage />
      </FormField>

      <button type="submit">Submit</button>
    </Form>
  );
};

export default ExampleForm;
```

## Components

### `Form`

The `Form` component serves as the root for your form structure. It can manage its own form instance internally or accept an external form instance provided via the `form` prop. Depending on whether `form` is supplied, the allowed props vary.

#### Case 1: Without `form` (Internal Form Management)

When the `form` prop is **not provided**, the `Form` component creates and manages its own form instance using `react-hook-form`.

**Allowed Props:**

- `resolver`: Resolver function for validation (e.g., `zod`, `yup`).
- `onSubmit`: Callback function triggered on form submission with valid data.
- `defaultValues`: Initial values for the form fields.
- `values`: Controlled form values.
- `useFormProps`: Additional options for the `useForm` hook.
- `children`: Form elements or a render function receiving form.

**Example:**

```tsx
<Form
  resolver={zodResolver(schema)}
  onSubmit={(data) => console.log(data)}
  defaultValues={{ firstName: '', email: '' }}
>
  {/** Form content here */}
</Form>
```

#### Case 2: With `form` (External Form Instance)

When the `form` prop is **provided**, the `Form` component uses the supplied instance, and the internal form management props are ignored.

**Allowed Props:**

- `form`: An external form instance created with `useForm`.
- `children`: Form elements or a render function.

**Example:**

```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { firstName: '', email: '' },
});

<Form form={form}>
  <form onSubmit={form.handleSubmit((values) => console.log(values))}>
    {/** Form content here */}
  </form>
</Form>;
```

### `FormField`

`FormField` wraps individual form fields, managing their state and validation. It uses React Hook Form’s `Controller` to connect the field to the form context.

**Props:**

- `as`: The component or element type to render (default: `'div'`).
- `asChild`: Render the field as a child component (default: `false`).
- `name`: The name of the field within the form.
- `children`: The form input component or a render function receiving field props.

### `FormControl`

`FormControl` links a form input to the form state, handling accessibility attributes and error states.

**Props:**

- `as`: The component or element type to render (default: `'div'`).
- `asChild`: Render the field as a child component (default: `false`).
- `children`: The input component or a render function receiving field props.

### `FormLabel`

`FormLabel` associates a label with a form field, ensuring accessibility by linking via `htmlFor`.

**Props:**

- `as`: The component or element type to render (default: `'label'`).
- `asChild`: Render the field as a child component (default: `false`).
- `children`: The child content of the label.

### `FormDescription`

`FormDescription` provides descriptive text for a form field, enhancing accessibility by associating the description with the field.

**Props:**

- `as`: The component or element type to render (default: `'p'`).
- `asChild`: Render the field as a child component (default: `false`).
- `children`: The child content of the description.

### `FormMessage`

`FormMessage` displays validation error messages for a form field.

**Props:**

- `as`: The component or element type to render (default: `'p'`).
- `asChild`: Render the field as a child component (default: `false`).
- `children`: Custom error message content or a render function receiving the error object.

## Accessibility

TypedForm is built with accessibility in mind. It utilizes ARIA attributes, proper labeling, and ensures keyboard navigability to provide an inclusive user experience.

## Customization

Since TypedForm provides unstyled components, you have full control over the styling of your forms. You can apply your own CSS classes or use CSS-in-JS solutions to style the components as needed.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/Skyleen77/typedform).

## License

MIT © [Skyleen77](https://github.com/Skyleen77)

## Acknowledgements

- [React Hook Form](https://react-hook-form.com/) for form state management and validation.
- [Shadcn](https://shadcn.com/) for inspiration and foundational concepts.
