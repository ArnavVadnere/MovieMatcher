import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="mb-8 text-center">
      <h1
        className="text-4xl font-bold mb-4 cursor-pointer hover:text-blue-300 transition duration-200"
        onClick={() => navigate("/")}
      >
        MovieMatcher
      </h1>
    </header>
  );
};

export default Header;
