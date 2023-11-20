# User Information:
`Endpoint: GET /users/{username}/`
### Description: Retrieve public information about a GitHub user, including their username, name, bio, avatar, and other profile details.
Repositories for a User:
`Endpoint: GET /users/{username}/repos`
### Description: Retrieve a list of repositories owned by a specific GitHub user, including details like repository name, ### Description, and statistics.
Repository Information:
`Endpoint: GET/repos/{owner}/{repo}`
### Description: Retrieve detailed information about a specific GitHub repository, including repository name, owner, ### Description, and statistics.
Repository Commits:
`Endpoint: GET /repos/{owner}/{repo}/commits`
### Description: Retrieve a list of commits for a specific GitHub repository, including details like commit message, author, and timestamp.
User's Starred Repositories:
`Endpoint: GET /users/{username}/starred`
### Description: Retrieve a list of repositories that a GitHub user has starred, indicating their interest in those repositories.
User's Contributions in the Last Year:
`Endpoint: GET /users/{username}/events`
### Description: Retrieve events for a GitHub user, including their contributions, commits, and other activities in the last year.
User's Organizations:
`Endpoint: GET /users/{username}/orgs`
### Description: Retrieve a list of organizations that a GitHub user is a member of.
User's Followers:
`Endpoint: GET /users/{username}/followers`
### Description: Retrieve a list of followers for a GitHub user.
User's Following:
`Endpoint: GET /users/{username}/following`
### Description: Retrieve a list of users that a GitHub user is following.
User's Public Events:
`Endpoint: GET /users/{username}/events/public`
### Description: Retrieve a feed of public events for a GitHub user