//About.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import About from '../About';

test('renderiza el componente About y muestra el texto principal Sobre nosotros', () => {
  render(
    <BrowserRouter>
      <About />
    </BrowserRouter>
  );

  const titulo = screen.getByText((content, element) =>
    element.tagName.toLowerCase() === 'p' && /sobre nosotros/i.test(content)
  );
  expect(titulo).toBeInTheDocument();
});
