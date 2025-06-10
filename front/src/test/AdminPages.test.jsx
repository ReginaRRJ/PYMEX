import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminMain from '../pages/Admin/AdminMain';
import '@testing-library/jest-dom';

// Mocks de subcomponentes
jest.mock('../components/Header', () => () => <div>Mock Header</div>);
jest.mock('../components/NavbarIcon', () => ({ icon, text, onClick, selected }) => (
  <button onClick={onClick}>{text}</button>
));
jest.mock('../components/Profile', () => () => <div>Mock Profile</div>);
jest.mock('../pages/Admin/PermisosUsuarios', () => () => <div>Pantalla PermisosUsuarios</div>);
jest.mock('../pages/Admin/ReportesUsuarios', () => () => <div>Pantalla ReportesUsuarios</div>);
jest.mock('../pages/Admin/AddUser', () => ({ onClose }) => (
  <div>
    Modal AddUser
    <button onClick={onClose}>Cerrar AddUser</button>
  </div>
));
jest.mock('../pages/Admin/EditUser', () => ({ user, onClose }) => (
  <div>
    Modal EditUser
    <button onClick={onClose}>Cerrar EditUser</button>
  </div>
));

describe('AdminMain', () => {
  test('muestra PermisosUsuarios al inicio', () => {
    render(<AdminMain />);
    expect(screen.getByText('Pantalla PermisosUsuarios')).toBeInTheDocument();
  });

  test('cambia a ReportesUsuarios al hacer clic en Reportes', () => {
    render(<AdminMain />);
    fireEvent.click(screen.getByText('Reportes'));
    expect(screen.getByText('Pantalla ReportesUsuarios')).toBeInTheDocument();
  });

  test('muestra pantalla no encontrada si la pantalla es inválida', () => {
    render(<AdminMain initialScreen="pantallaInvalida" />);
    expect(screen.getByText('Pantalla no encontrada')).toBeInTheDocument();
  });

  test('renderiza y cierra el modal AddUser', () => {
    render(<AdminMain showAddUserModal={true} />);
    expect(screen.getByText('Modal AddUser')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar AddUser'));
    expect(screen.queryByText('Modal AddUser')).not.toBeInTheDocument();
  });

  test('renderiza y cierra el modal EditUser', () => {
    render(<AdminMain showEditUserModal={true} initialUser={{ nombres: 'Juan' }} />);
    expect(screen.getByText('Modal EditUser')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar EditUser'));
    expect(screen.queryByText('Modal EditUser')).not.toBeInTheDocument();
  });
});
