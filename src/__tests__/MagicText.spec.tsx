import React, { useState } from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import waitForExpect from 'wait-for-expect';

import MagicText from '../MagicText';

function BasicExample(props: {}) {
  const [content, updateContent] = useState('');
  return (
    <div>
      <h2>A basic example</h2>
      <button>A button</button>
      <MagicText content={content} updateContent={updateContent} />
      <button>Another button</button>
    </div>
  );
}

const HitEnter = { key: 'Enter', code: 13, charCode: 13 };

describe('MagicText tests', () => {
  it('Is not editable on first render', () => {
    const { container, queryByText } = render(<BasicExample />);
    expect(queryByText('Click to edit')).not.toBe(null);
    expect(container.querySelectorAll('textarea').length).toBe(0);
    expect(container.querySelectorAll('input').length).toBe(0);
  });

  it('Becomes editable when clicked', async () => {
    const { container, getByText, queryByText } = render(<BasicExample />);
    const magicButton = getByText('Click to edit');
    fireEvent.click(magicButton);
    await waitForExpect(() => {
      expect(queryByText('Click to edit')).toBe(null);
      expect(container.querySelectorAll('textarea').length).toBe(1);
      expect(container.querySelectorAll('textarea')[0]).toHaveFocus();
    });
  });

  it('Returns to read only when user clicks away', async () => {
    const { container, getByText, queryByText } = render(<BasicExample />);
    const magicButton = getByText('Click to edit');
    const decoyButton = getByText('A button');
    fireEvent.click(magicButton);
    fireEvent.click(decoyButton);
    fireEvent.blur(container.querySelectorAll('textarea')[0]); // <--- Shame we have to do this :(
    await waitForExpect(() => {
      expect(queryByText('Click to edit')).not.toBe(null);
      expect(container.querySelectorAll('textarea').length).toBe(0);
      expect(container.querySelectorAll('input').length).toBe(0);
    });
  });

  it('Returns to read only when user hits shift+enter (but not just enter)', async () => {
    const { container, getByText, queryByText } = render(<BasicExample />);
    const magicButton = getByText('Click to edit');
    fireEvent.click(magicButton);

    const textarea = container.querySelectorAll('textarea')[0];
    fireEvent.keyPress(textarea, HitEnter);
    await waitForExpect(() => {
      expect(queryByText('Click to edit')).toBe(null);
      expect(container.querySelectorAll('textarea').length).toBe(1);
      expect(container.querySelectorAll('textarea')[0]).toHaveFocus();
    });

    fireEvent.keyPress(textarea, { ...HitEnter, shiftKey: true });
    await waitForExpect(() => {
      expect(queryByText('Click to edit')).not.toBe(null);
      expect(getByText('Click to edit')).toHaveFocus();
      expect(container.querySelectorAll('textarea').length).toBe(0);
      expect(container.querySelectorAll('input').length).toBe(0);
    });
  });

  it('Obeys tab indices', () => {});

  it('Works with a text input', () => {});

  it('Works with a custom input', () => {});
});
