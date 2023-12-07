import { baseUrl } from "./api-endpoint";// fetc user information
import { fetchData } from "./fetch";

export async function getProfileInformation(user) {
    const url = `${baseUrl}/users/${user}`;
    try {
        const res = await fetchData(url);
        return res;
    } catch (error) {
        throw error;
    }
}
