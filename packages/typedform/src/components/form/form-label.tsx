import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_LABEL_TAG = 'label' as const;

type FormLabelProps = {};

/**
 * `FormLabel` is a polymorphic component that renders a label element
 * linked to a form field. It retrieves the form field ID from the React Hook Form context
 * and assigns it to the `htmlFor` attribute to ensure proper accessibility.
 * The label can also be rendered as a different HTML tag or component if desired.
 *
 * @param {FormLabelProps} props - Properties for configuring the label component.
 * @param {React.Ref<HTMLElement>} ref - Ref forwarded to the rendered label element.
 * @template D - The tag type for the label component, defaults to `label`.
 * @returns {React.ReactElement} - The rendered label element.
 */
const FormLabel = forwardRefPolymorphic<
  typeof DEFAULT_LABEL_TAG,
  FormLabelProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_LABEL_TAG,
    asChild = false,
    ...restProps
  } = props;

  const { formItemId } = useFormField();

  const Element = asChild ? AsChild : Component;

  return <Element ref={ref} htmlFor={formItemId} {...restProps} />;
});

FormLabel.displayName = 'FormLabel';

export { FormLabel, type FormLabelProps };
