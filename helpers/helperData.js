async function getContributions(token, username) {
    const headers = {
        Authorization: `bearer ${token}`,
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
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
    });
    const data = await response.json();
    return data;
}



(async () => {
    const res = await getContributions(
        "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",
        "patrice012"
    );
    console.log(res.data.user.contributionsCollection.contributionCalendar);
    console.log(
        res.data.user.contributionsCollection.contributionCalendar.weeks[0]
            .contributionDays
    );
  
})();
