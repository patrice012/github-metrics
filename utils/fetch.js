const JWT = process.env.NEXT_PUBLIC_API_KEY;
export async function fetchData(url) {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${JWT}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch (error) {
        // console.error("Error fetching user data:", error);
        throw error;
    }
}
