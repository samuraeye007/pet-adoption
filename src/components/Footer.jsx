import { styled } from "styled-components";
import logo from "../images/miaudote-menu.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <FooterContainer>
      <img src={logo} alt="Miaudote logo" />
      <p>
        Developed with React
        <p> <Link to="http://localhost:5173">Contact us</Link>
      </p></p>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  width: 100vw;
  background-color: #dadada;
  margin-bottom: -1.5em;
  margin-top: 2em;
  padding: 1em 3em;

  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    max-width: 20vw;
  }

  @media screen and (max-width: 767px) {
    padding: 0.75em;
    gap: 0.75em;
    img {
      max-width: 45vw;
      padding-left: 1em;
      margin: -0em 0.125em;
    }
    p {
      font-size: 0.75em;
    }
  }
`;
