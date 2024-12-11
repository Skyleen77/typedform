import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { AsChild } from '../components/as-child';

describe('AsChild component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('returns null and logs a warning if children is not a valid React element', () => {
    const { container } = render(<AsChild>{null /* invalid child */}</AsChild>);
    expect(container.firstChild).toBeNull();
    expect(console.warn).toHaveBeenCalledWith(
      'AsChild: the children prop must be a valid React element',
    );
  });

  it('renders correctly with a valid React element', () => {
    render(
      <AsChild>
        <button>Click me</button>
      </AsChild>,
    );

    const button = screen.getByText('Click me');
    // The button should still be in the document
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('applies additional props to the child element', () => {
    render(
      <AsChild id="test-button" disabled>
        <button>Click me</button>
      </AsChild>,
    );

    const button = screen.getByText('Click me') as HTMLButtonElement;
    expect(button.id).toBe('test-button');
    expect(button.disabled).toBe(true);
  });

  it('merges class names from children and props', () => {
    render(
      <AsChild className="additional-class">
        <button className="original-class">Click me</button>
      </AsChild>,
    );

    const button = screen.getByText('Click me') as HTMLButtonElement;
    // Both original-class and additional-class should be present
    expect(button.className).toMatch(/original-class/);
    expect(button.className).toMatch(/additional-class/);
  });

  it('forwards the ref correctly', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <AsChild ref={ref}>
        <button>Click me</button>
      </AsChild>,
    );

    // After rendering, ref should point to the button element
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('overwrites default props from the child if provided again', () => {
    render(
      <AsChild type="submit">
        <button type="button">Click me</button>
      </AsChild>,
    );

    const button = screen.getByText('Click me') as HTMLButtonElement;
    // The button originally had type="button", but AsChild sets type="submit"
    expect(button.type).toBe('submit');
  });
});
