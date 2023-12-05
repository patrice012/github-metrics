const token = process.env.NEXT_PUBLIC_API_KEY;
import { baseUrl } from "./api-endpoint";

export async function getContributions(username) {
    try {
        const headers = {
            Authorization: `bearer ${token}`,
            "Content-Type": "application/json",
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
                commitContributionsByRepository {
                  contributions {
                    totalCount
                    
                  }
                  repository {
                    name
                  }
                }
                pullRequestContributions {
                  totalCount
                }
                issueContributions {
                  totalCount
                }
                pullRequestReviewContributions {
                  totalCount
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}