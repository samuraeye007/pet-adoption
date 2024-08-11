import { styled } from "styled-components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";

export default function PetInfo() {
  const [pet, setPet] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPetAvailable, setIsPetAvailable] = useState(true);

  const popup = () => {
    Swal.fire({
      title: 'Want to adopt?',
      html: `
        To adopt this pet or learn more about it, contact the owner through the channels below:<br>
        <b>Email:</b> ${pet.ownerEmail}<br>
        <b>Phone:</b> ${pet.ownerCellphone}`,
      icon: 'question',
      showCloseButton: false,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Copy Email',
      cancelButtonText: 'Copy Phone',
    }).then((result) => {
      if (result.isConfirmed) {
        navigator.clipboard.writeText(pet.ownerEmail);
        Swal.fire('Email copied!', '', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigator.clipboard.writeText(pet.ownerCellphone);
        Swal.fire('Phone copied!', '', 'success');
      }
    });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:3001/pets/${id}`)
      .then((resp) => {
        console.log('Pet Info:', resp.data);
        setPet(resp.data);
        setIsPetAvailable(resp.data.available);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching pet info:', error);
  
        if (error.response && error.response.status === 404) {
          return Swal.fire({
            title: 'Pet not found!',
            text: 'The pet you are looking for was not found.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate("/pets");
          });
        }
  
        Swal.fire({
          title: 'Failed to load, please try again.',
          icon: 'error',
          confirmButtonText: 'Back to home',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      });
  }, [id, navigate]);
  
  return (
    <>
      <Header />
      <PageContainer>
        {loading ? (
          <TailSpin color="#6A459C" height={80} width={80} />
        ) : (
          <>
            <InfoPrincipal>
              <DivInfo>
                <div>
                  <h3>{pet.name}</h3>
                  <p>Posted on {pet.registeredAt} by {pet.ownerName}</p>
                  <p>{pet.city} - {pet.state}</p>
                  {isPetAvailable ? (
                    <p>This pet is looking for a home full of love.</p>
                  ) : (
                    <p>This pet has already found a home.</p>
                  )}
                </div>
                {/* <button disabled={!isPetAvailable} onClick={popup}>I WANT TO ADOPT</button> */}
              </DivInfo>
              <img src={pet.photo} />
            </InfoPrincipal>
            <InfosSecundarias>
              <h3>{pet.name}'s Story</h3>
              <p>{pet.description}</p>
              <h3>Pet's Characteristics</h3>
              <p>{pet.characteristics}</p>
              <button disabled={!isPetAvailable} onClick={popup}>I WANT TO ADOPT</button>
            </InfosSecundarias>
          </>
        )}
      </PageContainer>
      <Footer />
    </>
  );
}
const DivInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: start;
    gap: 1em;
    padding-left: 2em;

    div{
        display: flex;
        flex-direction: column;
        gap: 0.25em;
    }
`
const InfoPrincipal = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 0.5em;

    button{
        padding: 0.5em;
        height: max-content;
        max-width: 30%;
        font-size: 1.125em;
        &:disabled {
            background-color: #b1b1b1;
            border-color: #d4d4d4;
            cursor: not-allowed;
        }
    }
    img{
        aspect-ratio: 1;
        width: 40%;
        object-fit: cover;
        border-radius: 2em;
    }
`
const InfosSecundarias = styled.div`
    padding-top: 1.5em;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
    h3, p{
        width: 100%;
    }

    button{
        padding: 0.5em;
        height: max-content;
        max-width: 30%;
        font-size: 1.5em;
        &:disabled {
            background-color: #b1b1b1;
            border-color: #d4d4d4;
            cursor: not-allowed;
        }
    }
`

const PageContainer = styled.div`
    min-height: 100vh;
    width: 60vw;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    padding-top: 1em;
    text-align: center;

    @media screen and (max-width: 540px) {
        width: 90vw;
        ${DivInfo}{
            flex-direction: row;
            padding-left: 0em;
        }
        ${InfoPrincipal}{
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5em;

            button{
                padding: 0.75em;
                height: max-content;
                min-width: 40%;
                font-size: 1.125em;
            }
            img{
                aspect-ratio: 1;
                width: 100%;
                object-fit: cover;
                border-radius: 2em;
            }
        }
    }
`
