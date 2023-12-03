const JWT = process.env.API_KEY;

export async function fetchData(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch data.");
        }
        return await res.json();
    } catch (error) {
        // handle error
        console.log(error);
    }
}
