import { styled } from "styled-components";
import validator from "validator";
import ReactInputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import Swal from "sweetalert2";

export default function RegisterPet() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const watchCEP = watch('pin');

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const { user } = useContext(UserContext);
  const token = user;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const lsUser = JSON.parse(localStorage.getItem('user'));
    if (!lsUser) {
      Swal.fire({
        title: 'You have been logged out',
        text: 'Please log in again.',
        icon: 'info',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/signin');
      });
    }
  }, []);

  function onSubmit(data) {
    const { name, photo, category, description, characteristics,pin, city, state } = data;

    const onlyNumbersCEP = pin.replace(/\D/g, "");

    axios.post(
      `http://localhost:3001/pets`,
      { name, photo, category, description, characteristics, pin, city, state },
      config
    )
      .then((resp) => {
        const { id } = resp.data;
        Swal.fire({
          title: 'Animal registered successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate(`/pets/${id}`);
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 422) {
          return Swal.fire({
            title: 'Invalid data provided.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.status === 401) {
          return Swal.fire({
            title: 'Invalid token.',
            text: 'Please log in again.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/signin');
          });
        }
        if (error.response.status === 500) {
          Swal.fire({
            title: 'Error, please try again later.',
            icon: 'error',
            confirmButtonText: 'Back to home',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/");
            }
          });
        }
      });
  }

  return (
    <>
{user ?
    (<>
      <Header />
      <PageContainer>
        <div>
          <h2>Register a Pet for Adoption</h2>
          <p>Share the details of the pet below and let it find love in a new home.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Pet Name</label>
            <input
              className={errors?.name && "input-error"}
              type="text"
              placeholder="Tommy"
              {...register("name", { required: true })}
            />
            {errors?.name?.type === 'required' && <p className="error-message">Pet name is required.</p>}

            <label>Image</label>
            <input
              className={errors?.photo && "input-error"}
              type="text"
              placeholder="Paste the image link here"
              {...register("photo", { required: true, validate: (value) => validator.isURL(value) })}
            />
            {errors?.photo?.type === 'required' && <p className="error-message">Photo is required.</p>}
            {errors?.photo?.type === 'validate' && <p className="error-message">Invalid link.</p>}

            <label>Species</label>
            <select
              className={errors?.category && "input-error"}
              {...register("category", { required: true, validate: (value) => { return value !== "0"; } })}
            >
              <option value="0">Select the pet species</option>
              <option value="1">Dog</option>
              <option value="2">Cat</option>
            </select>
            {errors?.category?.type === 'required' && <p className="error-message">Species is required.</p>}
            {errors?.category?.type === 'validate' && <p className="error-message">Select a species.</p>}

            <label>Description</label>
            <textarea
              className={errors?.description && "input-error"}
              rows="3"
              placeholder="Tell a bit about the pet's story."
              {...register("description", { required: true })}
            />
            {errors?.description?.type === 'required' && <p className="error-message">Description is required.</p>}

            <label>Pet Characteristics</label>
            <textarea
              className={errors?.characteristics && "input-error"}
              rows="3"
              placeholder="Medium-sized and short-haired.
    Very friendly with children.
    Suitable for apartment living."
              {...register("characteristics", { required: true })}
            />
            {errors?.characteristics?.type === 'required' && <p className="error-message">Characteristics are required.</p>}

            <label>Pin Code (ZIP Code)</label>
            <ReactInputMask
              mask="999999"
              className={errors?.pin && "input-error"}
              type="text"
              placeholder="123456"
              {...register("pin", {
                required: true, pattern: /^\d{6}$/
              })}
            />
            {errors?.pin?.type === 'required' && <p className="error-message">PIN code is required.</p>}
            {errors?.pin?.type === 'pattern' && <p className="error-message">Invalid PIN code format.</p>}

            <label>City</label>
            <input
              className={errors?.city && "input-error"}
              type="text"
              placeholder="Mumbai"
              {...register("city", { required: true })}
            />
            {errors?.city?.type === 'required' && <p className="error-message">City is required.</p>}

            <label>State</label>
            <select
              className={errors?.state && "input-error"}
              type="text"
              placeholder="MH"
              {...register("state", { required: true, validate: (value) => { return value !== "0"; } })}
            >
              <option value="">Select State</option>
              <option value="AP">Andhra Pradesh</option>
              <option value="AR">Arunachal Pradesh</option>
              <option value="AS">Assam</option>
              <option value="BR">Bihar</option>
              <option value="CG">Chhattisgarh</option>
              <option value="GA">Goa</option>
              <option value="GJ">Gujarat</option>
              <option value="HR">Haryana</option>
              <option value="HP">Himachal Pradesh</option>
              <option value="JH">Jharkhand</option>
              <option value="KA">Karnataka</option>
              <option value="KL">Kerala</option>
              <option value="MP">Madhya Pradesh</option>
              <option value="MH">Maharashtra</option>
              <option value="MN">Manipur</option>
              <option value="ML">Meghalaya</option>
              <option value="MZ">Mizoram</option>
              <option value="NL">Nagaland</option>
              <option value="OD">Odisha</option>
              <option value="PB">Punjab</option>
              <option value="RJ">Rajasthan</option>
              <option value="SK">Sikkim</option>
              <option value="TN">Tamil Nadu</option>
              <option value="TG">Telangana</option>
              <option value="TR">Tripura</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="UK">Uttarakhand</option>
              <option value="WB">West Bengal</option>
              <option value="AN">Andaman and Nicobar Islands</option>
              <option value="CH">Chandigarh</option>
              <option value="DH">Dadra and Nagar Haveli and Daman and Diu</option>
              <option value="LD">Lakshadweep</option>
              <option value="DL">Delhi</option>
              <option value="PY">Puducherry</option>


            </select>
            {errors?.state?.type === 'required' && <p className="error-message">State is required.</p>}
            {errors?.state?.type === 'validate' && <p className="error-message">Select a state.</p>}

            <button type="submit">Register Pet</button>
          </form>

        </div>
      </PageContainer>
      <Footer />
    </>) : null}
    </>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1em;
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
`;
