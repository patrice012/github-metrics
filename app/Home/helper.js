async function getUsers() {
    const url = `${baseUrl}/users/patrice012`;
    const res = await fetch(url);
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }
    return res.json();
}