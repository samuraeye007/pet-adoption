import { styled } from "styled-components";
import logo from "../images/miaudote-menu.svg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <HeaderContainer>
      <Link to="/">
        <img src={logo} alt="Miaudote logo" />
      </Link>

      <Link to="/pets">
        <AdoptButton>Adopt Now</AdoptButton>
      </Link>

      <div>
        <Link to="/signin">
          <InactiveButton>Sign In</InactiveButton>
        </Link>

        <Link to="/signup">
          <SignUpButton>Sign Up</SignUpButton>
        </Link>
      </div>
    </HeaderContainer>
  );
}

const InactiveButton = styled.button`
  font-size: 1.25em;
  min-width: max-content;
  background-color: #dadada;
  color: #6a459c;
  border: none;
`;

const AdoptButton = styled.button`
  font-size: 1.25em;
  min-width: max-content;
  background-color: #dadada;
  color: #6a459c;
  border: none;
`;

const SignUpButton = styled.button`
  font-size: 1.25em;
  min-width: max-content;
  background-color: #6a459c;
  color: #fff;
  border: none;
`;

const HeaderContainer = styled.div`
  width: 100vw;
  background-color: #dadada;
  margin-top: -1.5em;
  margin-bottom: 0.5em;
  padding: 1em 3em;
  box-shadow: 0em 0.25em 0.75em 0.25em rgba(0, 0, 0, 0.2);

  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    max-width: 20vw;
  }

  div {
    display: flex;
    gap: 1em;
  }

  @media screen and (max-width: 767px) {
    padding: 1em;

    img {
      max-width: 45vw;
      padding-left: 1em;
      margin: -0em 0.125em;
    }

    div {
      display: flex;
      gap: 0em;
    }

    ${SignUpButton} {
      display: none;
    }

    ${AdoptButton} {
      display: none;
    }

    ${InactiveButton} {
      font-size: 1em;
    }
  }
`;
