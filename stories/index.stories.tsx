import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import MagicText from '../src/MagicText';

const stories = storiesOf('Components', module);

stories.add('MagicText', () => <ControlledComponent />);

function ControlledComponent(props: {}) {
  const [content, updateContent] = useState('');
  return <MagicText content={content} updateContent={updateContent} />;
}
