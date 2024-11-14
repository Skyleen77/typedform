import React from 'react';
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type DefaultValues,
  UseFormReturn,
} from 'react-hook-form';
import * as zod from 'zod';
import * as yup from 'yup';
import { zodResolver } from '@hookform/resolvers/zod';
import { yupResolver } from '@hookform/resolvers/yup';
import { getInstanceOf } from '../../utils';

type InferValues<TSchema> = TSchema extends zod.ZodSchema
  ? zod.infer<TSchema>
  : TSchema extends yup.AnySchema
    ? yup.InferType<TSchema>
    : any;

type FormProps<TSchema> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> & {
  /** The schema (either Zod or Yup) to validate the form inputs */
  schema: TSchema;
  /** Function to handle form submission with validated values */
  onSubmit: (values: InferValues<TSchema>) => void;
  /** Default values for the form fields */
  defaultValues?: DefaultValues<Partial<InferValues<TSchema>>>;
  /** Explicitly set form field values */
  values?: DefaultValues<Partial<InferValues<TSchema>>>;
  /** Child components or render function that receives form methods */
  children:
    | React.ReactNode
    | ((form: {
        form: UseFormReturn<Partial<InferValues<TSchema>>, any, undefined>;
      }) => React.ReactNode);
  /** Additional configuration options for `useForm` */
  useFormProps?: UseFormProps<Partial<InferValues<TSchema>>>;
};

/**
 * Returns the appropriate resolver based on the schema type.
 *
 * @param {TSchema} schema - The validation schema, either Zod or Yup.
 * @returns {Function} - The resolver for React Hook Form based on the schema type.
 * @throws {Error} - Throws if the schema type is unsupported.
 * @template TSchema
 */
const getResolver = <TSchema,>(schema: TSchema) => {
  if (getInstanceOf<zod.ZodSchema<any>>(schema, 'ZodObject')) {
    return zodResolver(schema as zod.ZodSchema);
  } else if (getInstanceOf<yup.AnySchema>(schema, 'ObjectSchema')) {
    return yupResolver(schema as unknown as yup.ObjectSchema<any>);
  }
  throw new Error('Schema not supported, use zod or yup schema.');
};

/**
 * `FormComponent` is a generic form component that uses React Hook Form,
 * Zod, or Yup for schema-based validation. It renders a form and applies
 * the specified schema resolver for form validation.
 *
 * @param {FormProps<TSchema>} props - Props for configuring the form, including schema, submit handler, default values, and children.
 * @param {React.Ref<HTMLFormElement>} ref - Ref forwarded to the form element.
 * @template TSchema - The type of the validation schema, either Zod or Yup.
 * @returns {React.ReactElement} - A form element wrapped with the `FormProvider`.
 */
function FormComponent<TSchema extends zod.ZodSchema | yup.AnySchema>(
  props: FormProps<TSchema>,
  ref: React.Ref<HTMLFormElement>,
) {
  const {
    schema,
    onSubmit,
    defaultValues,
    values,
    children,
    useFormProps,
    ...restProps
  } = props;

  const resolver = getResolver(schema);
  const form = useForm({
    resolver,
    defaultValues,
    values,
    ...useFormProps,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...restProps} ref={ref}>
        {typeof children === 'function'
          ? children({ form })
          : React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement)
            : children}
      </form>
    </FormProvider>
  );
}

/**
 * `Form` is a forwardRef wrapper around `FormComponent`, providing a typed interface
 * for creating forms with schema validation.
 */
const Form = React.forwardRef(FormComponent) as unknown as {
  <TSchema extends zod.ZodSchema | yup.AnySchema>(
    props: FormProps<TSchema> & React.RefAttributes<HTMLFormElement>,
  ): React.ReactElement;
  displayName?: string;
};

Form.displayName = 'Form';

export { Form, type FormProps, type InferValues };
