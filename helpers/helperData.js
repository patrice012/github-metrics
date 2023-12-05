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
    console.log(res);
})();
