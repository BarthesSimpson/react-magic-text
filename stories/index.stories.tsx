import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import MagicText from '../src/MagicText';

const stories = storiesOf('Components', module);

stories.add('Basic Example', () => <ControlledComponent />);
stories.add('Custom Input', () => <CustomInput />);

function ControlledComponent(props: {}) {
  const [content, updateContent] = useState('');
  return <MagicText content={content} updateContent={updateContent} />;
}

function CustomInput(props: {}) {
  const [content, updateContent] = useState('');
  return (
    <MagicText content={content} updateContent={updateContent}>
      <input />
    </MagicText>
  );
}
