import React, {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';

import { MagicTextArea, MagicTextInput, StealthButton } from './styles';
export interface MagicTextProps {
  content: string;
  updateContent: (content: string) => void;
  useInput?: boolean;
  children?: ReactElement;
}

// The enter key
const ENTER = 'Enter';

export default function MagicText(props: MagicTextProps) {
  const { content, updateContent, useInput = false, children = null } = props;
  const hasCustomElement = !!children && React.Children.count(children);
  // Verify there is at most one child element (i.e. a custom input)
  if (hasCustomElement) React.Children.only(children);
  const [isEditable, setIsEditable] = useState(false);
  const toggleIsEditable = useCallback(() => setIsEditable(isEditable => !isEditable), []);
  const textArea = useRef<HTMLTextAreaElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const makeEditable = useCallback(() => {
    setIsEditable(isEditable => !isEditable);
    focusElement(useInput ? textInput : textArea);
  }, [useInput]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => updateContent(e.target.value),
    [updateContent],
  );

  const blurOnShiftEnter = useCallback((e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === ENTER && e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
      focusElement(button);
    }
  }, []);

  const textEditProps = {
    onBlur: toggleIsEditable,
    onChange: handleChange,
    onKeyPress: blurOnShiftEnter,
    value: content,
  };

  // If the user passed a custom element
  const inputElement = hasCustomElement ? (
    React.Children.map(children!, (child: ReactElement) =>
      React.cloneElement(child, { ref: textArea, ...textEditProps }),
    )[0]
  ) : useInput ? (
    // If the user wants a text input
    <MagicTextInput ref={textInput} {...textEditProps} />
  ) : (
    // If the user wants a textarea (default)
    <MagicTextArea ref={textArea} {...textEditProps} />
  );

  return isEditable ? (
    inputElement
  ) : (
    <StealthButton onClick={makeEditable} ref={button}>
      {content.trim() ? content : 'Click to edit'}
    </StealthButton>
  );
}

function focusElement(ref: MutableRefObject<HTMLElement | undefined | null>) {
  setTimeout(() => {
    if (ref.current) ((ref.current as unknown) as HTMLElement).focus();
  }, 10);
}
