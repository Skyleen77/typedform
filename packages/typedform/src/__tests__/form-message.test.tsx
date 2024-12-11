import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../components/form/form';
import { FormField } from '../components/form/form-field';
import { FormLabel } from '../components/form/form-label';
import { FormControl } from '../components/form/form-control';
import { FormMessage } from '../components/form/form-message';

const schema = z.object({
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

describe('FormMessage component', () => {
  it('displays an error message when validation fails', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ password: '' }}
      >
        <FormField name="password">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <input placeholder="Enter your password" />
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
      await screen.findByText('Password must be at least 5 characters'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('does not render anything if there is no error and no children', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ password: 'abcd' }}
      >
        <FormField name="password">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <input placeholder="Enter your password" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>,
    );

    // No error should be displayed because the password is not submitted yet
    expect(
      screen.queryByText('Password must be at least 5 characters'),
    ).toBeNull();
  });

  it('supports a function as children to customize message rendering', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ password: '' }}
      >
        <FormField name="password">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <input placeholder="Enter your password" />
          </FormControl>
          <FormMessage>
            {({ error }) => (
              <span data-testid="custom-message">{error?.message}</span>
            )}
          </FormMessage>
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const button = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    const customMessage = await screen.findByTestId('custom-message');
    expect(customMessage).toHaveTextContent(
      'Password must be at least 5 characters',
    );
  });

  it('supports polymorphic "as" prop to render a different element', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ password: '' }}
      >
        <FormField name="password">
          <FormLabel>Password</FormLabel>
          <FormControl>
            <input placeholder="Enter your password" />
          </FormControl>
          <FormMessage as="div" />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const button = screen.getByText('Submit');
    await act(async () => {
      fireEvent.click(button);
    });

    // After submission, the error message should appear in a <div>
    const errorElement = await screen.findByText(
      'Password must be at least 5 characters',
    );
    expect(errorElement.tagName).toBe('DIV');
  });
});
