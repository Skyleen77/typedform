import { render, screen } from '@testing-library/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../components/form/form';
import { FormField } from '../components/form/form-field';
import { FormLabel } from '../components/form/form-label';
import { FormControl } from '../components/form/form-control';
import { FormDescription } from '../components/form/form-description';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
});

describe('FormDescription component', () => {
  it('renders a description associated with the form field', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input placeholder="Enter your username" />
          </FormControl>
          <FormDescription>This is a description</FormDescription>
        </FormField>
      </Form>,
    );

    const input = screen.getByPlaceholderText('Enter your username');
    const controlWrapper = input.closest('[aria-describedby]');
    expect(controlWrapper).toBeInTheDocument();

    const describedBy = controlWrapper!.getAttribute('aria-describedby');
    // The description component should contribute its ID to aria-describedby
    expect(describedBy).toMatch(/-form-item-description/);

    // Check that the description text is present
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('supports polymorphic "as" prop to render a different element', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input placeholder="Enter your username" />
          </FormControl>
          <FormDescription as="div">Description in a div</FormDescription>
        </FormField>
      </Form>,
    );

    const description = screen.getByText('Description in a div');
    expect(description.tagName).toBe('DIV');
  });

  it('supports asChild prop to render as a child of another component', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input placeholder="Enter your username" />
          </FormControl>
          <FormDescription asChild>
            <p>This is a child description</p>
          </FormDescription>
        </FormField>
      </Form>,
    );

    const input = screen.getByPlaceholderText('Enter your username');
    const controlWrapper = input.closest('[aria-describedby]');
    expect(controlWrapper).toBeInTheDocument();

    const describedBy = controlWrapper!.getAttribute('aria-describedby');
    // The description component should contribute its ID to aria-describedby
    expect(describedBy).toMatch(/-form-item-description/);

    // Check that the description text is present
    expect(screen.getByText('This is a child description')).toBeInTheDocument();
  });
});
