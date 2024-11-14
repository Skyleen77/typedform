import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_DESCRIPTION_TAG = 'p' as const;

type FormDescriptionProps = {};

/**
 * `FormDescription` is a polymorphic component that renders descriptive text
 * for a form field. It uses the form field context to set a unique ID for accessibility
 * and can be rendered as a specified HTML element or a custom component.
 *
 * @param {FormDescriptionProps} props - Props for configuring the description component.
 * @param {React.Ref<HTMLElement>} ref - Ref forwarded to the rendered description element.
 * @template D - The tag type for the description component, defaults to `p`.
 * @returns {React.ReactElement} - The rendered description element.
 */
const FormDescription = forwardRefPolymorphic<
  typeof DEFAULT_DESCRIPTION_TAG,
  FormDescriptionProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_DESCRIPTION_TAG,
    asChild = false,
    ...restProps
  } = props;

  const { formDescriptionId } = useFormField();

  const Element = asChild ? AsChild : Component;

  return <Element ref={ref} id={formDescriptionId} {...restProps} />;
});

FormDescription.displayName = 'FormDescription';

export { FormDescription, type FormDescriptionProps };
