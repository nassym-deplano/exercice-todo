import React from "react";

import Address from "./ui/components/Address/Address";
import AddressBook from "./ui/components/AddressBook/AddressBook";
import Radio from "./ui/components/Radio/Radio";
import Section from "./ui/components/Section/Section";
import Form from "./ui/components/Form/Form";
import ErrorMessage from "./ui/components/ErrorMessage/ErrorMessage";
import transformAddress from "./core/models/address";
import useAddressBook from "./ui/hooks/useAddressBook";
import useFormFields from "./ui/hooks/useFormFields";

import "./App.css";
import Button from "./ui/components/Button/Button";
import LoadingIndicator from "./ui/components/LoadingIndicator/LoadingIndicator";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { streetName: '', zipCode: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handleStreetNameChange for example
   */
  const initialValues = {
    streetName: "",
    zipCode: "",
    prenom: "",
    nom: "",
    selectedAddress: "",
  };
  const { values, handleChange, clearFormFields } =
    useFormFields(initialValues);
  /**
   * Results states
   */
  const [error, setError] = React.useState(undefined);
  const [addresses, setAddresses] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    /** TODO: Fetch addresses based on zipCode and streetName
     * - Example URL of API: http://api.postcodedata.nl/v1/postcode/?postcode=1211EP&streetnumber=60&ref=domeinnaam.nl&type=json
     * - Handle errors if they occur
     * - Handle successful response by updating the `addresses` in the state using `setAddresses`
     * - Make sure to add the zipCode to each found address in the response using `transformAddress()` function
     * - Bonus: Add a loading state in the UI while fetching addresses
     */
    /*const streetName = e.target.elements.streetName.value;
    const zipCode = e.target.elements.zipCode.value;*/

    const streetName = e.target.elements.rue.value;
    const zipCode = e.target.elements.codePostal.value;

    handleClearForm();

    setIsLoading(true);
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${streetName}&postcode=${zipCode}&limit=1&autocomplete=1`
    );
    const data = await res.json();

    if (data.features[0] === undefined ) {
      setError(
        "Adresse introuvable. Veuillez réessayer."
      );
      setIsLoading(false);
      return;
    }

    console.log('data')
    console.log(data.features[0])

    console.log('data.features[0].properties.city')
    console.log(data.features[0].properties.city)

    console.log('data.features[0].properties.housenumber')
    console.log(data.features[0].properties.housenumber)


    console.log('data.features[0].properties.x')
    console.log(data.features[0].properties.x)

    console.log('data.features[0].properties.y')
    console.log(data.features[0].properties.y)

    console.log('data.features[0].properties.postcode')
    console.log(data.features[0].properties.postcode)

    console.log('data.features[0].properties.street')
    console.log(data.features[0].properties.street)


    setIsLoading(false);
    if (data.status === "error") return setError(data.errormessage);
    // remove any potential previous errors if current request has no errors
    setError(undefined);

    const address = transformAddress({ ...data.features[0].properties});

    if (
      addresses.some(
        (entry) =>
          entry.postcode === address.postcode &&
          entry.zipCode === address.zipCode
      )
    )
      return setError("Adresse déjà ajoutée.");

    setAddresses((prevAddresses) => [...prevAddresses, address]);
  };

  const handlePersonSubmit = (e) => {
    e.preventDefault();

    if (!values.selectedAddress || !addresses.length) {
      setError(
        "Aucune adresse selectionnée. Essayez de sélectionner une adresse ou cherchez-en une si vous n'en avez pas."
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === values.selectedAddress
    );

    addAddress({
      ...foundAddress,
      firstName: values.prenom,
      lastName: values.nom,
    });
  };

  const handleClearForm = () => {
    clearFormFields();
    setAddresses([]);
  };

  return (
    <main>
      <Section>
        <h1>
        Créez votre propre carnet d'adresses !
          <br/>
          <small>
          Entrez une adresse (rue et numéro de rue) et son code postal et c'est fini ! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          initialValues={values}
          formFieldNames={["rue", "codePostal"]}
          caption="🏠 Trouver une adresse"
          buttonTitle={"Rechercher"}
          onSubmit={handleAddressSubmit}
          onChange={handleChange}
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
              >
                <Address address={address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {values.selectedAddress && (
          <Form
            initialValues={values}
            formFieldNames={["prenom", "nom"]}
            caption="✏️ Associer des informations personnelles à cette adresse"
            buttonTitle={"Ajouter au carnet d'adresse"}
            onSubmit={handlePersonSubmit}
            onChange={handleChange}
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage error={error} />}
        
        <LoadingIndicator isLoading={isLoading} />

        {/* TODO: Add a button to clear all form fields. Button must look different from the default primary button, see design. */}
        <Button variant="secondary" onClick={handleClearForm}>
          Réinitialiser tous les champs
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;