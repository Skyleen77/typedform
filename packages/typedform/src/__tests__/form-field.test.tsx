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
  username: z.string().min(1, { message: 'Username is required' }),
});

describe('FormField component', () => {
  it('renders a controlled field integrated with react-hook-form', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input placeholder="Enter your username" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your username',
    ) as HTMLInputElement;
    const button = screen.getByText('Submit');

    // Submit empty form
    await act(async () => {
      fireEvent.click(button);
    });
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Fill the field and submit again
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Alice' } });
      fireEvent.click(button);
    });

    // Wait for async updates
    setTimeout(() => {
      expect(screen.queryByText('Username is required')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({ username: 'Alice' });
    }, 50);
  });

  it('includes -form-item-message in aria-describedby when there is an error', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input placeholder="Enter your username" />
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

    // Now there's an error, so aria-describedby should include both.
    const input = screen.getByPlaceholderText('Enter your username');
    const controlWrapper = input.closest('[aria-describedby]');
    const describedBy = controlWrapper!.getAttribute('aria-describedby');

    expect(describedBy).toMatch(/-form-item-description/);
    expect(describedBy).toMatch(/-form-item-message/);
  });

  it('allows children to be a function receiving field props', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ username: '' }}
      >
        <FormField name="username">
          {({ field }) => (
            <>
              <label htmlFor={field.name}>Username</label>
              <input
                id={field.name}
                placeholder="Enter your username"
                {...field}
              />
              <FormMessage />
            </>
          )}
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your username',
    ) as HTMLInputElement;
    const button = screen.getByText('Submit');

    // Submit empty form
    await act(async () => {
      fireEvent.click(button);
    });
    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Fill and submit
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Bob' } });
      fireEvent.click(button);
    });

    setTimeout(() => {
      expect(screen.queryByText('Username is required')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({ username: 'Bob' });
    }, 50);
  });

  it('supports asChild property to render the field with a different wrapper', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ username: '' }}
      >
        <FormField name="username" asChild>
          <div>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="Enter your username" />
            </FormControl>
            <FormMessage />
          </div>
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your username',
    ) as HTMLInputElement;
    const button = screen.getByText('Submit');

    // The field is now wrapped by a <div> due to asChild
    const fieldContainer = input.closest('div');
    expect(fieldContainer).toBeInTheDocument();

    // Submit empty
    await act(async () => {
      fireEvent.click(button);
    });
    expect(await screen.findByText('Username is required')).toBeInTheDocument();

    // Fill and submit
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Charlie' } });
      fireEvent.click(button);
    });

    setTimeout(() => {
      expect(screen.queryByText('Username is required')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({ username: 'Charlie' });
    }, 50);
  });
});
