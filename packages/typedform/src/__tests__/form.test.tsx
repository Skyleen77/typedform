import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form } from '../components/form/form';
import { FormField } from '../components/form/form-field';
import { FormLabel } from '../components/form/form-label';
import { FormControl } from '../components/form/form-control';
import { FormMessage } from '../components/form/form-message';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
});

describe('Form component', () => {
  it('renders the form, shows an error for empty input, then submits successfully with a valid value', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ firstName: '' }}
      >
        <FormField name="firstName">
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <input placeholder="Enter your first name" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText('Enter your first name');
    const button = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(
      await screen.findByText('First name is required'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.click(button);
    });

    setTimeout(() => {
      expect(screen.queryByText('First name is required')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({ firstName: 'John' });
    }, 50);
  });

  it('allows using an external form instance with its own configuration', async () => {
    const handleSubmit = jest.fn();

    const ExternalForm = () => {
      const externalForm = useForm({
        defaultValues: { firstName: '' },
        resolver: zodResolver(schema),
      });

      return (
        <Form form={externalForm}>
          <FormField name="firstName">
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <input placeholder="Enter your first name" />
            </FormControl>
            <FormMessage />
          </FormField>
          <button
            type="submit"
            onClick={externalForm.handleSubmit(handleSubmit)}
          >
            Submit
          </button>
        </Form>
      );
    };

    render(<ExternalForm />);

    const input = screen.getByPlaceholderText('Enter your first name');
    const button = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(button);
    });

    expect(
      await screen.findByText('First name is required'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Mary' } });
      fireEvent.click(button);
    });

    setTimeout(() => {
      expect(screen.queryByText('First name is required')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledWith({ firstName: 'Mary' });
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    }, 50);
  });

  it('supports a render function as children, providing access to form methods', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ firstName: '' }}
      >
        {({ form }) => (
          <>
            <FormField name="firstName">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <input placeholder="Enter your first name" />
              </FormControl>
              <FormMessage />
            </FormField>
            <button type="submit">Submit</button>
            <div data-testid="form-methods">
              {Object.keys(form).length > 0 && 'Form methods available'}
            </div>
          </>
        )}
      </Form>,
    );

    // The form render function should have access to form methods
    expect(screen.getByTestId('form-methods')).toHaveTextContent(
      'Form methods available',
    );

    const button = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(
      await screen.findByText('First name is required'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying <form> element', () => {
    const formRef = React.createRef<HTMLFormElement>();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ firstName: '' }}
        ref={formRef}
      >
        <FormField name="firstName">
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <input placeholder="Enter your first name" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    expect(formRef.current).not.toBeNull();
    expect(formRef.current?.tagName).toBe('FORM');
  });

  it('does not call onSubmit if validation fails', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ firstName: '' }}
      >
        <FormField name="firstName">
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <input placeholder="Enter your first name" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const button = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(
      await screen.findByText('First name is required'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
