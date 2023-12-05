async function getContributions(token, username) {
    const headers = {
        Authorization: `bearer ${token}`,
    };
    const body = {
        query: `query {
            user(login: "${username}") {
              name
                contributionsCollection {
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
    console.log(
        res.data.user.contributionsCollection.commitContributionsByRepository
    );
    console.log(res.data.user.contributionsCollection.issueContributions);
    console.log(res.data.user.contributionsCollection.pullRequestContributions);
    console.log(
        res.data.user.contributionsCollection.pullRequestReviewContributions
    );
    // console.log(res.data.user.contributionsCollection.pullRequestContributions);
    // console.log(
    //     res.data.user.contributionsCollection.pullRequestReviewContributions
    // );
    // console.log(res);
})();
