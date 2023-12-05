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
    const data = await getContributions(
        "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",
        "patrice012"
    );
    // console.log(data);
    console.log(data.data.user.contributionsCollection);
    for (let i = 0; i < data.data.user.contributionsCollection.contributionCalendar.weeks.length; i++){
        let week =
            data.data.user.contributionsCollection.contributionCalendar.weeks[
                i
            ];
        console.log(week, 'week')
    }
    // console.log(data);
    // console.log(data);
})();
