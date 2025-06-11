// NavbarIcon.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavbarIcon from "../components/NavbarIcon"; // Ajusta la ruta si es necesario

describe("NavbarIcon", () => {
  const icon = "test-icon.svg";
  const text = "Inicio";

  test("renderiza correctamente cuando no está seleccionado", () => {
    render(<NavbarIcon icon={icon} text={text} onClick={() => {}} selected={false} />);

    const button = screen.getByRole("button");
    const heading = screen.getByText(text);
    const image = screen.getByRole("img");

    // Verifica clases cuando no está seleccionado
    expect(button).toHaveClass("btn-nonselected");
    expect(heading).toHaveClass("text-black");
    expect(image).not.toHaveClass("invert brightness-0");
  });

  test("renderiza correctamente cuando está seleccionado", () => {
    render(<NavbarIcon icon={icon} text={text} onClick={() => {}} selected={true} />);

    const button = screen.getByRole("button");
    const heading = screen.getByText(text);
    const image = screen.getByRole("img");

    // Verifica clases cuando está seleccionado
    expect(button).toHaveClass("btn-selected");
    expect(heading).toHaveClass("text-white");
    expect(image).toHaveClass("invert brightness-0");
  });

  test("llama a onClick al hacer click", () => {
    const handleClick = jest.fn();
    render(<NavbarIcon icon={icon} text={text} onClick={handleClick} selected={false} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
