const JWT = process.env.NEXT_PUBLIC_API_KEY;
import { baseUrl } from "./api-endpoint";

export async function getContributions(username) {
    const headers = {
        Authorization: `bearer ${JWT}`,
    };
    const body = {
        query: `query {
            user(login: "${username}") {
              name
              contributionsCollection {
                contributionCalendar {
                  colors
                  totalContributions
                  weeks {
                    contributionDays {
                      color
                      contributionCount
                      date
                      weekday
                    }
                    firstDay
                  }
                }
              }
            }
          }`,
    };
    const url = `${baseUrl}/graphql`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
    });

    const data = await response.json();
    return data;
}
