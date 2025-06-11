import { render, screen } from '@testing-library/react';
import AdminMain from '../pages/Admin/AdminMain';
import '@testing-library/jest-dom';

// Mock de componentes hijos (puedes irlos ajustando según necesites)
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/NavbarIcon', () => ({ text, onClick }) => (
  <div onClick={onClick}>{text}</div>
));
jest.mock('../components/Profile', () => () => <div>Mock Profile</div>);
jest.mock('../pages/Admin/PermisosUsuarios', () => () => <div>PermisosUsuarios</div>);
jest.mock('../pages/Admin/ReportesUsuarios', () => () => <div>ReportesUsuarios</div>);
jest.mock('../pages/Admin/AddUser', () => () => <div>AddUser Modal</div>);
jest.mock('../pages/Admin/EditUser', () => () => <div>EditUser Modal</div>);

describe('AdminMain component', () => {
  test('se renderiza y muestra el botón de Usuarios', () => {
    render(<AdminMain />);
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });

  test('se renderiza y muestra el componente PermisosUsuarios por defecto', () => {
    render(<AdminMain />);
    expect(screen.getByText('PermisosUsuarios')).toBeInTheDocument();
  });
});
