import React from 'react';
import { render } from 'react-dom';

import External from './External';
import './index.css';

render(<External />, window.document.querySelector('#app-container'));
