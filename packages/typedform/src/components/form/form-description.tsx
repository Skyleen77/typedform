import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_DESCRIPTION_TAG = 'p' as const;

type FormDescriptionProps = {};

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
