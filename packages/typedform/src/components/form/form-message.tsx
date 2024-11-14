import { AsChild } from '../as-child';
import { useFormField } from './form-field';
import { forwardRefPolymorphic } from '../../utils';

const DEFAULT_MESSAGE_TAG = 'p' as const;

interface FormMessageProps {}

const FormMessage = forwardRefPolymorphic<
  typeof DEFAULT_MESSAGE_TAG,
  FormMessageProps
>((props, ref) => {
  const {
    as: Component = DEFAULT_MESSAGE_TAG,
    asChild = false,
    children,
    ...restProps
  } = props;

  const { error, formMessageId } = useFormField();
  const message = error ? <span>{String(error.message)}</span> : children;
  if (!message) return null;

  const Element = asChild ? AsChild : Component;

  return (
    <Element ref={ref} id={formMessageId} {...restProps}>
      {message}
    </Element>
  );
});

FormMessage.displayName = 'FormMessage';

export { FormMessage, type FormMessageProps };
