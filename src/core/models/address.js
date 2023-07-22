export default function transformAddress(data) {

  const { firstName, lastName, city, housenumber, x, y, postcode, street } =
    data;
  return {
    city: city || "",
    firstName: firstName || "",
    houseNumber: housenumber || "",
    id: `${x || Date.now()}_${y || Math.random()}`,
    lastName: lastName || "",
    postcode: postcode || "",
    street: street || "",
  };
}
