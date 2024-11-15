import React from 'react';
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type DefaultValues,
  type UseFormReturn,
  type FieldValues,
  type Resolver,
} from 'react-hook-form';

/**
 * Base props for the `Form` component.
 *
 * @template TFieldValues The form values, typically matching a validation schema (e.g., using `zod` or `yup`).
 * @template TContext Optional additional context used by the validation resolver.
 */
type FormPropsBase<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> = Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> & {
  /**
   * Children of the component. Can be a React node or a render function
   * receiving the `form` instance.
   */
  children:
    | React.ReactNode
    | ((form: {
        form: UseFormReturn<TFieldValues, TContext>;
      }) => React.ReactNode);
};

/**
 * Props for `Form` when creating the form instance internally.
 *
 * @template TFieldValues The form values.
 * @template TContext Optional context for validation.
 */
type FormPropsCreateInternal<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> = FormPropsBase<TFieldValues, TContext> & {
  /**
   * Resolver for form data validation.
   * Used to integrate with libraries like `zod` or `yup`.
   */
  resolver: Resolver<TFieldValues, TContext>;

  /**
   * Callback triggered when the form is submitted with valid data.
   *
   * @param values The validated form values.
   */
  onSubmit: (values: TFieldValues) => void;

  /**
   * Default values for the form. Used to initialize the form state.
   */
  defaultValues?: DefaultValues<TFieldValues>;

  /**
   * Controlled values for the form. Allows complete control over the data.
   */
  values?: TFieldValues;

  /**
   * Additional options for the `useForm` hook from `react-hook-form`.
   */
  useFormProps?: UseFormProps<TFieldValues, TContext>;

  /**
   * When provided, the `form` instance should not be used.
   */
  form?: undefined;
};

/**
 * Props for `Form` when a form instance is provided externally.
 *
 * @template TFieldValues The form values.
 * @template TContext Optional context for validation.
 */
type FormPropsWithForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> = FormPropsBase<TFieldValues, TContext> & {
  /**
   * An existing form instance from `useForm`.
   */
  form: UseFormReturn<TFieldValues, TContext>;

  /**
   * The `onSubmit` handler should not be provided when a form instance is supplied.
   */
  onSubmit?: undefined;

  /**
   * The `resolver` should not be provided when a form instance is supplied.
   */
  resolver?: undefined;

  /**
   * The `defaultValues` should not be provided when a form instance is supplied.
   */
  defaultValues?: undefined;

  /**
   * The `values` should not be provided when a form instance is supplied.
   */
  values?: undefined;

  /**
   * The `useFormProps` should not be provided when a form instance is supplied.
   */
  useFormProps?: undefined;
};

/**
 * Union type for `Form` props, allowing either internal creation or external form instance.
 *
 * @template TFieldValues The form values.
 * @template TContext Optional context for validation.
 */
type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
> =
  | FormPropsCreateInternal<TFieldValues, TContext>
  | FormPropsWithForm<TFieldValues, TContext>;

/**
 * `Form` component using `react-hook-form` to manage form validation and state.
 *
 * Can be used in two ways:
 * - By providing configuration props (`resolver`, `onSubmit`, etc.).
 * - By passing an existing `form` instance.
 *
 * @template TFieldValues The form values.
 * @template TContext Optional context for validation.
 *
 * @param props Props to configure the `Form` component.
 * @param ref A reference to the underlying HTML `<form>` element.
 * @returns A React element representing the form.
 */
function FormComponent<TFieldValues extends FieldValues, TContext = any>(
  props: FormProps<TFieldValues, TContext>,
  ref: React.Ref<HTMLFormElement>,
) {
  const {
    resolver,
    onSubmit,
    defaultValues,
    values,
    useFormProps,
    form,
    ...restProps
  } = props as FormPropsCreateInternal<TFieldValues, TContext>;

  const hasFormInstance = 'form' in props && form !== undefined;

  let internalForm: UseFormReturn<TFieldValues, TContext>;

  if (hasFormInstance) {
    internalForm = form;
  } else {
    internalForm = useForm<TFieldValues>({
      resolver,
      defaultValues,
      values,
      ...useFormProps,
    });
  }

  return (
    <FormProvider {...internalForm}>
      {hasFormInstance ? (
        // If a form instance is provided, just render the children
        typeof props.children === 'function' ? (
          props.children({ form: internalForm })
        ) : (
          props.children
        )
      ) : (
        // Otherwise, render a <form> element with the onSubmit handler
        <form
          onSubmit={internalForm.handleSubmit(onSubmit)}
          {...restProps}
          ref={ref}
        >
          {typeof props.children === 'function'
            ? props.children({ form: internalForm })
            : props.children}
        </form>
      )}
    </FormProvider>
  );
}

/**
 * `Form` component with forwardRef support for the underlying HTML `<form>` element.
 */
const Form = React.forwardRef(FormComponent) as {
  <TFieldValues extends FieldValues = FieldValues, TContext = any>(
    props: FormProps<TFieldValues, TContext> &
      React.RefAttributes<HTMLFormElement>,
  ): React.ReactElement;
  displayName?: string;
};

Form.displayName = 'Form';

export { Form, type FormProps };
