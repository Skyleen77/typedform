import React from 'react';
import { render, screen } from '@testing-library/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../components/form/form';
import { FormField } from '../components/form/form-field';
import { FormLabel } from '../components/form/form-label';
import { FormControl } from '../components/form/form-control';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

describe('FormLabel component', () => {
  it('renders a label linked to the associated form field', () => {
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
        </FormField>
      </Form>,
    );

    const label = screen.getByText('Email') as HTMLLabelElement;
    const input = screen.getByPlaceholderText(
      'Enter your email',
    ) as HTMLInputElement;

    // The label should have a 'for' attribute linking it to the input
    expect(label.getAttribute('for')).toMatch(/-form-item$/);
    // The input should have an ID that matches the label's 'for' attribute
    expect(input.id).toBe(label.htmlFor);
  });

  it('supports polymorphic "as" prop to render a different tag', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel as="span">Email</FormLabel>
          <FormControl>
            <input placeholder="Enter your email" />
          </FormControl>
        </FormField>
      </Form>,
    );

    const labelElement = screen.getByText('Email');
    // It should now be a <span> instead of a <label>
    expect(labelElement.tagName).toBe('SPAN');
  });

  it('supports asChild prop to render as a child of another component', () => {
    render(
      <Form
        resolver={zodResolver(schema)}
        onSubmit={jest.fn()}
        defaultValues={{ email: '' }}
      >
        <FormField name="email">
          <FormLabel asChild>
            <span>Email</span>
          </FormLabel>
          <FormControl>
            <input placeholder="Enter your email" />
          </FormControl>
        </FormField>
      </Form>,
    );

    const labelElement = screen.getByText('Email');
    // It should now be a child of the FormControl
    expect(labelElement.tagName).toBe('SPAN');
  });
});
