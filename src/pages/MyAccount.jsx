import { styled } from "styled-components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import iconEye from "../images/icon-eye.svg";
import iconToggleOff from "../images/icon-toggle-off.svg";
import iconToggleOn from "../images/icon-toggle-on.svg";
import iconTrash from "../images/icon-trash.svg";

export default function MyAccount() {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const token = user;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/my-account`, config)
      .then((resp) => {
        setUserInfo(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          return Swal.fire({
            title: 'Invalid Token.',
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
            confirmButtonText: 'Back to Home',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/");
            }
          });
        }
      });
  }, []);

  function changeAvailable(id, availability) {
    const newAvailability = !availability;

    axios
      .patch(`http://localhost:3001/pets/${id}`, { available: newAvailability }, config)
      .then((resp) => {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          pets: prevUserInfo.pets.map((pet) =>
            pet.petId === id ? { ...pet, available: newAvailability } : pet
          ),
        }));
      })
      .catch((error) => {
        if (error.response.status === 401) {
          return Swal.fire({
            title: 'Invalid Token.',
            text: 'Please log in again.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/signin');
          });
        }
        if (error.response.status === 403) {
          return Swal.fire({
            title: 'Unable to delete.',
            text: 'You do not have permission to perform this action.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        if (error.response.status === 500) {
          Swal.fire({
            title: 'Error deleting the pet.',
            text: 'An error occurred while trying to delete the pet. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
  }

  function deletePet(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/pets/${id}`, config)
          .then(() => {
            Swal.fire({
              title: 'Pet deleted!',
              text: 'The pet has been successfully deleted.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
              return Swal.fire({
                title: 'Invalid Token.',
                text: 'Please log in again.',
                icon: 'error',
                confirmButtonText: 'OK',
              }).then(() => {
                navigate('/signin');
              });
            }
            if (error.response.status === 403) {
              return Swal.fire({
                title: 'Unable to delete.',
                text: 'You do not have permission to perform this action.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
            if (error.response.status === 500) {
              Swal.fire({
                title: 'Error deleting the pet.',
                text: 'An error occurred while trying to delete the pet. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          });
      }
    });
  }

  return (
    <>
      <Header />
      <PageContainer>
        {loading ? (
          <TailSpin color="#6A459C" height={80} width={80} />
        ) : (
          <>
            <h2>Welcome to your account, {userInfo.userName}</h2>
            <p>
              Welcome to your space on Miaudote! Here, you can manage the pets you've registered for adoption.
            </p>
            <InfoContainer>
              <UserContact>
                <h3>Your contact information:</h3>
                <p>These details are public.</p>
                <p>
                  <b>Email:</b> {userInfo.email}
                </p>
                <p>
                  <b>Cellphone:</b> {userInfo.cellphone}
                </p>
              </UserContact>
              <Pets>
                <h3>Manage your registered pets:</h3>
                {userInfo.pets.length === 0 ? (
                  <>
                    <p>You haven't registered any pets yet.</p>
                    <Link to="/new-pet">
                      <button>Register a pet!</button>
                    </Link>
                  </>
                ) : (
                  <PetsList>
                    {userInfo.pets.map((pet) => (
                      <PetItem key={pet.id}>
                        <img src={pet.photo} alt={`Photo of ${pet.name}`} />
                        <PetInfo>
                          <h3>{pet.name}</h3>
                          <p>
                            {pet.city} - {pet.state}
                          </p>
                          <div>
                            <img src={iconEye} alt="View registered pet" onClick={() => navigate(`/pets/${pet.id}`)} />
                            <img
                              class="availability"
                              src={pet.available ? iconToggleOn : iconToggleOff}
                              alt='Show or hide pet'
                              onClick={() => {
                                changeAvailable(pet.id, pet.available);
                              }}
                            />
                            <img
                            id="deletePetICON"
                            petid={pet.id} 
                            src={                            iconTrash}
                            alt='Delete pet'
                            onClick={() => deletePet(pet.id)}
                          />
                        </div>
                      </PetInfo>
                    </PetItem>
                  ))}
                </PetsList>
                )}
              </Pets>
            </InfoContainer>
          </>
        )}
      </PageContainer>
      <Footer />
    </>
  );
}

const InfoContainer = styled.div`
  width: 80vw;
  display: flex;
  gap: 1em;
  justify-content: space-between;

  @media screen and (max-width: 900px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
  }
`;

const Pets = styled.div`
  padding-top: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const UserContact = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5em;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding-top: 1em;
  text-align: center;
  margin: auto;
  gap: 2em;
  min-height: 100vh;

  button {
    margin-bottom: 1.5em;
  }
  p {
    text-align: center;
  }
`;

const PetsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PetItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 1em;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 0.5em;
  padding: 1em;
  position: relative;

  img {
    width: 8em;
    height: 8em;
    object-fit: cover;
    border-radius: 0.5em;
  }
`;

const PetInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5em;

  h3 {
    margin: 0;
    font-size: 1.5rem;
  }

  p {
    padding-top: 0.5em;
    text-align: left;
    font-size: 1rem;
    color: #777;
  }

  div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    position: absolute;
    bottom: 1em;
    right: 1em;

    img {
      cursor: pointer;
      font-size: 0.25em;
      color: #777;
    }
  }
`;

