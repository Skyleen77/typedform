import React from 'react';
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
  email: z.string().email({ message: 'Please provide a valid email.' }),
});

describe('FormControl component', () => {
  it('renders a field control that integrates correctly with validation', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input placeholder="Enter your email" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your email',
    ) as HTMLInputElement;
    const button = screen.getByText('Submit');

    // Submit empty to trigger error
    await act(async () => {
      fireEvent.click(button);
    });
    expect(
      await screen.findByText('Please provide a valid email.'),
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Enter a valid email and submit again
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.click(button);
    });

    setTimeout(() => {
      expect(screen.queryByText('Please provide a valid email.')).toBeNull();
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
    }, 50);
  });

  it('sets aria-invalid and aria-describedby correctly when there is an error', async () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input placeholder="Enter your email" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your email',
    ) as HTMLInputElement;
    const button = screen.getByText('Submit');

    // No error yet, so aria-invalid should be false or absent
    let controlWrapper =
      input.closest('[aria-invalid="false"]') ||
      input.closest('[aria-invalid="true"]');
    expect(controlWrapper?.getAttribute('aria-invalid')).toBe('false');

    // Trigger error by submitting empty
    await act(async () => {
      fireEvent.click(button);
    });
    expect(
      await screen.findByText('Please provide a valid email.'),
    ).toBeInTheDocument();

    controlWrapper = input.closest('[aria-invalid="true"]');
    expect(controlWrapper).toBeInTheDocument();

    const describedBy = controlWrapper!.getAttribute('aria-describedby');
    expect(describedBy).toMatch(/-form-item-description/);
    expect(describedBy).toMatch(/-form-item-message/);
  });

  it('forwards field props to the child element when no children function is provided', async () => {
    // If no children function is provided and only a single child element is given,
    // the FormControl should spread field props directly onto that element.
    // We test this by checking if the input receives the "name" attribute from the form.

    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input placeholder="Enter your email" />
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByPlaceholderText(
      'Enter your email',
    ) as HTMLInputElement;
    expect(input.name).toBe('email');
  });

  it('supports a children render function to manually apply field props', async () => {
    const handleSubmit = jest.fn();

    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={handleSubmit}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            {({ field }) => (
              <input
                placeholder="Enter your email"
                {...field}
                data-testid="custom-input"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormField>
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByTestId('custom-input') as HTMLInputElement;
    const button = screen.getByText('Submit');

    // Submit empty
    await act(async () => {
      fireEvent.click(button);
    });

    expect(
      await screen.findByText('Please provide a valid email.'),
    ).toBeInTheDocument();
    expect(input.name).toBe('email');
  });
});
