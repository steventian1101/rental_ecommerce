import axios from "axios"
export async function getAddress(address) {
    let returnAddress;
    let validaddress = address;
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + validaddress + "&key=" + process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    await axios.get(url)
        .then(response => {
            returnAddress = response.data
        })
        .catch(error => {
            console.error(error);
        });
    return returnAddress; 
}
export async function getCity(addressComponent) {
    if (addressComponent.status === "OK") {
        const addressComponents = addressComponent.results[0].address_components;
        const city = addressComponents.find(component => component.types.includes("administrative_area_level_2")).long_name;
        return city;
    } else {
        return [];
    }
}
export async function getLine1(addressComponent) {
    if (addressComponent.status === "OK") {
        const addressComponents = addressComponent.results[0].address_components;
        const street = addressComponents.find(component => component.types.includes("route")).short_name;
        const street_number = addressComponents.find(component => component.types.includes("street_number")).short_name;
        return street_number + " " + street;
    } else {
        return [];
    }
}
export async function getPostalCode(addressComponent) {
    if (addressComponent.status === "OK") {
        const addressComponents = addressComponent.results[0].address_components;
        const postal_code = addressComponents.find(component => component.types.includes("postal_code")).short_name;
        return postal_code;
    } else {
        return [];
    }
}
export async function getState(addressComponent) {
    if (addressComponent.status === "OK") {
        const addressComponents = addressComponent.results[0].address_components;
        const state = addressComponents.find(component => component.types.includes("administrative_area_level_1")).short_name;
        return state;
    } else {
        return [];
    }
}