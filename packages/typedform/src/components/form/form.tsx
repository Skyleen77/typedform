import React from 'react';
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type DefaultValues,
  UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, type TypeOf, type ZodSchema } from 'zod';

type FormOnSubmitValues<TSchema extends ZodSchema> = z.infer<TSchema>;

type FormProps<TSchema extends ZodSchema> = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> & {
  schema: TSchema;
  onSubmit: (values: FormOnSubmitValues<TSchema>) => void;
  defaultValues?: DefaultValues<Partial<TypeOf<TSchema>>>;
  values?: DefaultValues<Partial<TypeOf<TSchema>>>;
  children:
    | React.ReactNode
    | ((form: {
        form: UseFormReturn<Partial<TypeOf<TSchema>>, any, undefined>;
      }) => React.ReactNode);
  useFormProps?: UseFormProps<Partial<TypeOf<TSchema>>>;
};

const Form = React.forwardRef(
  <TSchema extends ZodSchema>(
    {
      schema,
      onSubmit,
      defaultValues,
      values,
      children,
      useFormProps,
      ...props
    }: FormProps<TSchema>,
    ref: React.Ref<HTMLFormElement>,
  ) => {
    const form = useForm({
      resolver: zodResolver(schema),
      defaultValues,
      values,
      ...useFormProps,
    });

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} {...props} ref={ref}>
          {typeof children === 'function'
            ? children({ form })
            : React.isValidElement(children)
              ? React.cloneElement(children as React.ReactElement)
              : children}
        </form>
      </FormProvider>
    );
  },
);
Form.displayName = 'Form';

export { Form, type FormProps, type FormOnSubmitValues };
