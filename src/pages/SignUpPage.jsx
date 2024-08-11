import { styled } from "styled-components";
import miaudote from "../images/miaudote-logo.svg";
import { useForm } from "react-hook-form";
import validator from "validator";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactInputMask from "react-input-mask";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Header from "../components/Header";
import fotoSignUp from "../images/signup-photo.jpg";

export default function SignUpPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const watchPassword = watch('password');

  function onSubmit(data) {
    const { name, email, aadhar, cellphone, password, confirmPassword } = data;

    // Update: Removing dashes from Aadhar number
    const onlyNumbersAadhar = aadhar.replace(/\D/g, "");
    const onlyNumbersCellphone = cellphone.replace(/\D/g, "");

    axios.post('http://localhost:3001/signup', {
      name,
      email,
      aadhar: onlyNumbersAadhar,
      cellphone: onlyNumbersCellphone,
      password,
      confirmPassword
    })
      .then(resp => {
        Swal.fire({
          title: 'Your registration was successful.',
          text: 'Please log in now.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate(`/signin`);
        });
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 422) {
          return Swal.fire({
            title: 'The provided data is invalid.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.data.message === 'This email is already registered.') {
          return Swal.fire({
            title: 'The provided email is already registered.',
            text: 'Log in.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.data.message === 'This Aadhar is already registered.') {
          return Swal.fire({
            title: 'The provided Aadhar is already registered.',
            text: 'Log in.',
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
            <h2>Join the Miaudote Family!</h2>
            <p>Together, we make happy paws find homes full of love.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Name</label>
              <input
                className={errors?.name && "input-error"}
                type="text"
                placeholder="Ana Maria Santos"
                {...register("name", { required: true })}
              />
              {errors?.name?.type === 'required' && <p className="error-message">Name is required.</p>}

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

              <label>Aadhar Number</label>
              <ReactInputMask
                mask="9999 9999 9999"
                className={errors?.aadhar && "input-error"}
                type="text"
                placeholder="1234 5678 9012"
                {...register("aadhar", { required: true, pattern: /^\d{4}\s\d{4}\s\d{4}$/ })}
              />
              {errors?.aadhar?.type === 'required' && <p className="error-message">Aadhar number is required.</p>}
              {errors?.aadhar?.type === 'pattern' && <p className="error-message">Invalid Aadhar number format.</p>}


              <label>Cellphone</label>
              <ReactInputMask
                mask="99999-99999"
                className={errors?.cellphone && "input-error"}
                type="text"
                placeholder="99999-99999"
                {...register("cellphone", { required: true, pattern: /\d{5}-\d{5}/ })}
              />
              {errors?.cellphone?.type === 'required' && <p className="error-message">Cellphone is required.</p>}
              {errors?.cellphone?.type === 'pattern' && <p className="error-message">Invalid cellphone format.</p>}

              <label>Password</label>
<input
  className={errors?.password && "input-error"}
  type="password"
  placeholder="Enter your password"
  {...register("password", { 
    required: "Password is required", 
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
      message: (value) => {
        if (!/(?=.*[a-z])/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(value)) {
          return "Password must contain at least one number";
        }
        if (!/(?=.*[@$!%*?&])/.test(value)) {
          return "Password must contain at least one special character";
        }
        return "Password must be between 8 and 15 characters";
      }
    },
    minLength: {
      value: 8,
      message: "Your password must have at least 8 characters"
    },
    maxLength: {
      value: 15,
      message: "Your password should not be more than 15 characters"
    }
  })}
/>
{errors?.password && <p className="error-message">{errors.password.message}</p>}


              <label>Password Confirmation</label>
              <input
                className={errors?.confirmPassword && "input-error"}
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword", { required: true, validate: (value) => value === watchPassword })}
              />
              {errors?.confirmPassword?.type === 'required' && <p className="error-message">Password confirmation is required.</p>}
              {errors?.confirmPassword?.type === 'validate' && <p className="error-message">Passwords do not match.</p>}

              <button type="submit" class="signupsubmit">Sign Up</button>
            </form>
          </div>
          <p>Already part of the Miaudote family?</p>
          <Link to='/signin'>
            <p><u>Log in to your account here.</u></p>
          </Link>
        </TextDiv>
        <PetPhoto src={fotoSignUp} alt="Create an account and find various pets in search of love." />

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
    width    : 90%;
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
    gap: 2.5em;
  }

  @media screen and (max-width: 770px) {
    width: 100%;
  }
`;

