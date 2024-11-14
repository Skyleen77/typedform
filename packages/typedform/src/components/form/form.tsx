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
  schema: TSchema;
  onSubmit: (values: InferValues<TSchema>) => void;
  defaultValues?: DefaultValues<Partial<InferValues<TSchema>>>;
  values?: DefaultValues<Partial<InferValues<TSchema>>>;
  children:
    | React.ReactNode
    | ((form: {
        form: UseFormReturn<Partial<InferValues<TSchema>>, any, undefined>;
      }) => React.ReactNode);
  useFormProps?: UseFormProps<Partial<InferValues<TSchema>>>;
};

const getResolver = <TSchema,>(schema: TSchema) => {
  if (getInstanceOf<zod.ZodSchema<any>>(schema, 'ZodObject')) {
    return zodResolver(schema as zod.ZodSchema);
  } else if (getInstanceOf<yup.AnySchema>(schema, 'ObjectSchema')) {
    return yupResolver(schema as unknown as yup.ObjectSchema<any>);
  }
  throw new Error('Schema not supported, use zod or yup schema.');
};

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

const Form = React.forwardRef(FormComponent) as unknown as {
  <TSchema extends zod.ZodSchema | yup.AnySchema>(
    props: FormProps<TSchema> & React.RefAttributes<HTMLFormElement>,
  ): React.ReactElement;
  displayName?: string;
};

Form.displayName = 'Form';

export { Form, type FormProps, type InferValues };
