import { render, screen } from '@testing-library/react';
import About from '../About';  

test('renderiza el componente About y muestra el texto Sobre nosotros', () => {
  render(<About />);
  const texto = screen.getByText(/Sobre nosotros/i);
  expect(texto).toBeInTheDocument();
});
