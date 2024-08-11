import { styled } from "styled-components";
import miaudote from "../images/miaudote-logo.svg";
import { useForm } from "react-hook-form";
import validator from "validator";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import fotoSignIn from "../images/signin-photo.jpg";

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  function onSubmit(data) {
    const { email, password } = data;

    axios.post(`http://localhost:3001/signin`, { email, password })
      .then(resp => {
        const { token } = resp.data;
        setUser(token);
        localStorage.setItem('user', JSON.stringify(token));
        navigate(`/my-account`);
      })
      .catch(error => {
        if (error.response.status === 422) {
          return Swal.fire({
            title: 'The provided data is invalid.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.status === 404) {
          return Swal.fire({
            title: 'The provided email is not registered, sign up first.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.status === 401) {
          return Swal.fire({
            title: 'Incorrect password.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.status === 500) {
          return Swal.fire({
            title: 'Please try again in a few moments.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
  }

  return (
    <>
      <Header />
      <PageContainer>
        <TextDiv>
          <div>
            <h2>Welcome Back to Miaudote!</h2>
            <p>Log in to continue spreading love (and treats!)</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Email</label>
              <input
                className={errors?.email && "input-error"}
                type="text"
                autoComplete="email"
                placeholder="name@miaudote.com"
                {...register("email", { required: true, validate: (value) => validator.isEmail(value) })}
              />
              {errors?.email?.type === 'required' && <p className="error-message">Email is required.</p>}
              {errors?.email?.type === 'validate' && <p className="error-message">Invalid email.</p>}

              <label>Password</label>
              <input
                className={errors?.password && "input-error"}
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
              {errors?.password?.type === 'required' && <p className="error-message">Password is required.</p>}

              <button type="submit" class= 'submitsignin'>Sign In</button>
            </form>
          </div>
          <p>Not part of the Miaudote family yet?</p>
          <Link to='/signup'>
            <p><u>Create a new account here.</u></p>
          </Link>
        </TextDiv>
        <PetPhoto src={fotoSignIn} alt="Log into your account and continue spreading love." />
      </PageContainer>
      <Footer />
    </>
  );
}

const PetPhoto = styled.img`
  width: 50%;
  height: 100vh;
  object-fit: contain;

  @media screen and (max-width: 770px) {
    display: none;
  }
`;

const TextDiv = styled.div`
  padding-left: 6em;
  width: 60%;
  flex-direction: column;

  @media screen and (min-width: 771px) and (max-width: 1200px) {
    padding-left: 4em;
  }

  @media screen and (max-width: 770px) {
    display: none;
    padding-left: 0em;
    width: 90%;
    margin: auto;
  }
`;

const PageContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100vw;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  padding-top: 2em;
  gap: 1.5em;
  text-align: center;

  button {
    margin-bottom: 1.5em;
  }

  p {
    text-align: center;
  }

  div {
    max-width: 80vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap    : 2.5em;
  }
  
  @media screen and (max-width: 770px) {
    width: 100%;
  }
`;

