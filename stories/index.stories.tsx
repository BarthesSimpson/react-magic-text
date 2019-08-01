import React from 'react';
import { storiesOf } from '@storybook/react';
import MagicText from '../src/MagicText';

const stories = storiesOf('Components', module);

stories.add('MagicText', () => <MagicText content="How" updateContent={() => {}} />);
