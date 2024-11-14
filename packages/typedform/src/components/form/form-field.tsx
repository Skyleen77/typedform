import React from 'react';
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { AsChild } from '../as-child';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_FIELD_TAG = 'div' as const;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /** The name of the field within the form */
  name: TName;
  /** Unique ID for the form field */
  id: string;
  /** Controller render props for managing the field's state and events */
  field: ControllerRenderProps<FieldValues, string>;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

/**
 * Hook to retrieve the context of a `FormField`, providing access to the field's
 * name, ID, control methods, and related form item IDs for accessibility.
 *
 * @returns {Object} - The context data for the form field, including state, IDs, and field props.
 * @throws {Error} - Throws if used outside of a `FormField` context.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { name, id, field } = fieldContext;

  return {
    id,
    name,
    field,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  /** The name of the field within the form */
  name: TName;
  /** Children components or a render function to access the field's props */
  children:
    | React.ReactNode
    | ((field: {
        field: ControllerRenderProps<FieldValues, string>;
      }) => React.ReactNode);
};

/**
 * `FormField` is a polymorphic component that renders a form field within a controlled context.
 * It provides access to form state and validation via React Hook Form’s `Controller`.
 * The field can be rendered as a specified HTML element or custom component.
 *
 * @param {FormFieldProps<TFieldValues, TName>} props - Properties to configure the form field, including `name` and children.
 * @param {React.Ref<HTMLElement>} ref - Ref forwarded to the rendered field element.
 * @template TFieldValues - The type of field values in the form.
 * @template TName - The name path of the field in the form values.
 * @returns {React.ReactElement} - The rendered form field element.
 */
const FormField = forwardRefPolymorphic<
  typeof DEFAULT_FIELD_TAG,
  FormFieldProps<FieldValues, string>
>((props, ref) => {
  const {
    as: Component = DEFAULT_FIELD_TAG,
    asChild = false,
    children,
    name,
    ...restProps
  } = props;

  const { control } = useFormContext();
  const id = React.useId();

  const Element = asChild ? AsChild : Component;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormFieldContext.Provider value={{ name, id, field }}>
          <Element ref={ref} {...restProps}>
            {typeof children === 'function'
              ? children({ field })
              : React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement)
                : children}
          </Element>
        </FormFieldContext.Provider>
      )}
    />
  );
});

FormField.displayName = 'FormField';

export {
  FormField,
  useFormField,
  type FormFieldContext,
  type FormFieldContextValue,
  type FormFieldProps,
};
