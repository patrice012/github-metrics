class UserMetrics {
    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (value.length < 1) {
            throw new Error("value must be set.");
        } else if (typeof value != String) {
            throw new Error("Name must be a string.");
        }
        this._name = value;
    }

    // set initial data field to get
    _initialFields = [
        "login",
        "name",
        "company",
        "location",
        "email",
        "created_at",
        "bio",
        "twitter_username",
        "public_repos",
        "public_gists",
        "followers",
        "following",
        "id",
        "avatar_url",
        "html_url",
        "followers_url",
        "following_url",
        "gists_url",
        "starred_url",
        "repos_url",
    ];

    /**
     * @param {any} field
     */
    set initialFields(field) {
        if (!field) {
            this.globalError({ message: "Field can't be undefined" });
        } else if (field in this._initialFields) {
            this.globalError({ message: "Field is already set" });
        } else {
            this._initialFields.push(field);
        }
    }

    get initialFields() {
        return this._initialFields;
    }

    // set user needed information
    _globalData = {};
    #setImportantFields = (key, value) => {
        this._globalData[key] = value;
    };

    /**
     * @param {(arg0: { login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string; url: string; html_url: string; followers_url: string; following_url: string; gists_url: string; starred_url: string; subscriptions_url: string; organizations_url: string; repos_url: string; events_url: string; received_events_url: string; type: string; site_admin: boolean; name: string; company: any; blog: string; location: any; email: string; hireable: any; bio: any; twitter_username: any; public_repos: number; public_gists: number; followers: number; following: number; created_at: string; updated_at: string; private_gists: number; total_private_repos: number; owned_private_repos: number; disk_usage: number; collaborators: number; two_factor_authentication: boolean; plan: { name: string; space: number; collaborators: number; private_repos: number; }; }) => void} data
     */
    set globalData(data) {
        try {
            for (const [key, value] of Object.entries(data)) {
                if (!this.initialFields.includes(key)) {
                    continue;
                }
                this.#setImportantFields(key, value);
            }
        } catch {
            (error) => console.log(error);
        }
    }

    get globalData() {
        return this._globalData;
    }

    // set global error
    _globalError = { message: undefined };

    /**
     * @param {string} error
     */
    set globalError(error) {
        if (!error) return;
        this._globalError = error;
    }

    get globalError() {
        if (this._globalError.message) {
            return this._globalError;
        } else {
            return "Not error found.";
        }
    }

    // author commits
    #commitPerRepository = [];
    #totalNumberOfCommits = 0;
    #allContributions = [];
    #commitsRepos = [];
    #allRepositories = [];

    #saveUserCommits(repos, contributions) {
        if (!this.#commitsRepos.includes(repos)) {
            this.#commitPerRepository = [
                ...this.#commitPerRepository,
                {
                    [repos]: contributions,
                },
            ];
            this.#commitsRepos.push(repos);
        }
    }

    #getTotalNumberOfCommits() {
        const initialValue = 0;
        this.#totalNumberOfCommits = this.#commitPerRepository.reduce(
            (accumulator, obj) => accumulator + Object.values(obj)[0],
            initialValue
        );

        return this.#totalNumberOfCommits;
    }

    get totalNumberOfCommits() {
        this.#getAllCommits();
        return this.#getTotalNumberOfCommits();
    }

    #filterCommitsBaseOnUserName(data) {
        for (const [key, value] of Object.entries(data)) {
            const userCommits = value?.filter((_, index) => {
                if (value[index]?.login === this.name) {
                    return value[index].contributions;
                }
            });
            if (userCommits != undefined && userCommits?.[0] != undefined) {
                this.#saveUserCommits(key, userCommits[0]?.contributions);
            }
        }
    }

    #filterCommitsInformation(data) {
        let reposContributions = [];
        for (const [key, value] of Object.entries(data)) {
            const userCommits = value?.map((_, index) => {
                return {
                    login: value[index].login,
                    contributions: value[index].contributions,
                };
            });
            const reposInfo = { [key]: userCommits };
            reposContributions = [...reposContributions, reposInfo];
        }
        return reposContributions;
    }

    get repositoryMetrics() {
        return this.#filterCommitsInformation(this.#allContributions);
    }

    saveAllContributions(data) {
        this.#allContributions = data;
    }

    #getAllCommits() {
        this.#filterCommitsBaseOnUserName(this.#allContributions);
        return this.#commitPerRepository;
    }

    get allCommits() {
        return this.#getAllCommits();
    }

    #resetValues() {
        this.#commitPerRepository = [];
        this.#totalNumberOfCommits = 0;
        this.#allContributions = [];
        this.#commitsRepos = [];
        this.#allRepositories = [];
    }

    // repos information (user, name, language, numberOfCommits, numberOfCollaborator, createAt)
    #listOfLanguages = {};

    setAllRespositories(data) {
        this.#allRepositories = [...data];
    }

    get allRepositories() {
        return this.#allRepositories;
    }

    #filterRespositoryInformation(data) {
        const filterData = data?.map((repos, _) => {
            // get all programing language
            if (repos.language) {
                if (
                    Object.keys(this.#listOfLanguages).includes(repos?.language)
                ) {
                    this.#listOfLanguages[repos?.language] += 1;
                } else {
                    this.#listOfLanguages[repos?.language] = 1;
                }
            }
            return {
                user: repos?.owner?.login,
                name: repos?.name,
                language: repos?.language,
                createAt: repos?.created_at,
            };
        });
        return filterData;
    }

    get programmingLanguages() {
        this.#filterRespositoryInformation(this.#allRepositories);
        return this.#listOfLanguages;
    }
}

export { UserMetrics };

// const data = [
//     {
//         id: 675710063,
//         node_id: "R_kgDOKEaEbw",
//         name: "AirBnB_clone",
//         full_name: "patrice012/AirBnB_clone",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/AirBnB_clone",
//         description: "ALX AirBnB clone project",
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/AirBnB_clone",
//         forks_url: "https://api.github.com/repos/patrice012/AirBnB_clone/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/AirBnB_clone/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/AirBnB_clone/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/AirBnB_clone/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone/deployments",
//         created_at: "2023-08-07T14:43:38Z",
//         updated_at: "2023-08-09T15:36:15Z",
//         pushed_at: "2023-08-21T21:41:39Z",
//         git_url: "git://github.com/patrice012/AirBnB_clone.git",
//         ssh_url: "git@github.com:patrice012/AirBnB_clone.git",
//         clone_url: "https://github.com/patrice012/AirBnB_clone.git",
//         svn_url: "https://github.com/patrice012/AirBnB_clone",
//         homepage: "",
//         size: 120,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 692823154,
//         node_id: "R_kgDOKUukcg",
//         name: "AirBnB_clone_v2",
//         full_name: "patrice012/AirBnB_clone_v2",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/AirBnB_clone_v2",
//         description: null,
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/AirBnB_clone_v2",
//         forks_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v2/deployments",
//         created_at: "2023-09-17T17:31:13Z",
//         updated_at: "2023-09-18T22:48:07Z",
//         pushed_at: "2023-10-23T00:15:55Z",
//         git_url: "git://github.com/patrice012/AirBnB_clone_v2.git",
//         ssh_url: "git@github.com:patrice012/AirBnB_clone_v2.git",
//         clone_url: "https://github.com/patrice012/AirBnB_clone_v2.git",
//         svn_url: "https://github.com/patrice012/AirBnB_clone_v2",
//         homepage: null,
//         size: 328,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 1,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 1,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 710533351,
//         node_id: "R_kgDOKlng5w",
//         name: "AirBnB_clone_v3",
//         full_name: "patrice012/AirBnB_clone_v3",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/AirBnB_clone_v3",
//         description: null,
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/AirBnB_clone_v3",
//         forks_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/AirBnB_clone_v3/deployments",
//         created_at: "2023-10-26T22:33:00Z",
//         updated_at: "2023-10-29T17:00:31Z",
//         pushed_at: "2023-11-21T17:51:48Z",
//         git_url: "git://github.com/patrice012/AirBnB_clone_v3.git",
//         ssh_url: "git@github.com:patrice012/AirBnB_clone_v3.git",
//         clone_url: "https://github.com/patrice012/AirBnB_clone_v3.git",
//         svn_url: "https://github.com/patrice012/AirBnB_clone_v3",
//         homepage: null,
//         size: 233,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 672492350,
//         node_id: "R_kgDOKBVrPg",
//         name: "ALX-21-days-coding-challenge",
//         full_name: "patrice012/ALX-21-days-coding-challenge",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/ALX-21-days-coding-challenge",
//         description:
//             "ALX students 21 days of C challenges based on Sams teach yourself C in 21 days",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge",
//         forks_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/ALX-21-days-coding-challenge/deployments",
//         created_at: "2023-07-30T09:16:03Z",
//         updated_at: "2023-08-01T21:49:19Z",
//         pushed_at: "2023-08-01T21:49:15Z",
//         git_url: "git://github.com/patrice012/ALX-21-days-coding-challenge.git",
//         ssh_url: "git@github.com:patrice012/ALX-21-days-coding-challenge.git",
//         clone_url:
//             "https://github.com/patrice012/ALX-21-days-coding-challenge.git",
//         svn_url: "https://github.com/patrice012/ALX-21-days-coding-challenge",
//         homepage: null,
//         size: 5338,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "C",
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 649786923,
//         node_id: "R_kgDOJrr2Kw",
//         name: "alx-higher_level_programming",
//         full_name: "patrice012/alx-higher_level_programming",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/alx-higher_level_programming",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/alx-higher_level_programming",
//         forks_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/alx-higher_level_programming/deployments",
//         created_at: "2023-06-05T16:24:00Z",
//         updated_at: "2023-06-08T16:13:20Z",
//         pushed_at: "2023-11-21T17:49:44Z",
//         git_url: "git://github.com/patrice012/alx-higher_level_programming.git",
//         ssh_url: "git@github.com:patrice012/alx-higher_level_programming.git",
//         clone_url:
//             "https://github.com/patrice012/alx-higher_level_programming.git",
//         svn_url: "https://github.com/patrice012/alx-higher_level_programming",
//         homepage: null,
//         size: 522,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 614979867,
//         node_id: "R_kgDOJKfZGw",
//         name: "alx-low_level_programming",
//         full_name: "patrice012/alx-low_level_programming",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/alx-low_level_programming",
//         description: "C program",
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/alx-low_level_programming",
//         forks_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/alx-low_level_programming/deployments",
//         created_at: "2023-03-16T17:48:18Z",
//         updated_at: "2023-03-16T19:35:20Z",
//         pushed_at: "2023-11-21T17:50:59Z",
//         git_url: "git://github.com/patrice012/alx-low_level_programming.git",
//         ssh_url: "git@github.com:patrice012/alx-low_level_programming.git",
//         clone_url:
//             "https://github.com/patrice012/alx-low_level_programming.git",
//         svn_url: "https://github.com/patrice012/alx-low_level_programming",
//         homepage: null,
//         size: 482,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "C",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 1,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 1,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 607817876,
//         node_id: "R_kgDOJDqQlA",
//         name: "alx-pre_course",
//         full_name: "patrice012/alx-pre_course",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/alx-pre_course",
//         description:
//             "I'm now a ALX Student, this is my first repository as a full-stack engineer",
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/alx-pre_course",
//         forks_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/alx-pre_course/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/alx-pre_course/deployments",
//         created_at: "2023-02-28T18:32:16Z",
//         updated_at: "2023-02-28T18:45:47Z",
//         pushed_at: "2023-03-03T16:39:02Z",
//         git_url: "git://github.com/patrice012/alx-pre_course.git",
//         ssh_url: "git@github.com:patrice012/alx-pre_course.git",
//         clone_url: "https://github.com/patrice012/alx-pre_course.git",
//         svn_url: "https://github.com/patrice012/alx-pre_course",
//         homepage: null,
//         size: 10,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Shell",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 611353159,
//         node_id: "R_kgDOJHCCRw",
//         name: "alx-system_engineering-devops",
//         full_name: "patrice012/alx-system_engineering-devops",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/alx-system_engineering-devops",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/alx-system_engineering-devops",
//         forks_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/alx-system_engineering-devops/deployments",
//         created_at: "2023-03-08T16:45:08Z",
//         updated_at: "2023-03-08T17:05:15Z",
//         pushed_at: "2023-11-21T17:44:12Z",
//         git_url:
//             "git://github.com/patrice012/alx-system_engineering-devops.git",
//         ssh_url: "git@github.com:patrice012/alx-system_engineering-devops.git",
//         clone_url:
//             "https://github.com/patrice012/alx-system_engineering-devops.git",
//         svn_url: "https://github.com/patrice012/alx-system_engineering-devops",
//         homepage: null,
//         size: 4566,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Shell",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 610883923,
//         node_id: "R_kgDOJGlZUw",
//         name: "alx-zero_day",
//         full_name: "patrice012/alx-zero_day",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/alx-zero_day",
//         description:
//             "I'm now a ALX Student, this is my first repository as a full-stack engineer",
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/alx-zero_day",
//         forks_url: "https://api.github.com/repos/patrice012/alx-zero_day/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/alx-zero_day/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/alx-zero_day/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/alx-zero_day/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/alx-zero_day/deployments",
//         created_at: "2023-03-07T17:13:19Z",
//         updated_at: "2023-03-07T17:32:01Z",
//         pushed_at: "2023-03-07T18:46:43Z",
//         git_url: "git://github.com/patrice012/alx-zero_day.git",
//         ssh_url: "git@github.com:patrice012/alx-zero_day.git",
//         clone_url: "https://github.com/patrice012/alx-zero_day.git",
//         svn_url: "https://github.com/patrice012/alx-zero_day",
//         homepage: null,
//         size: 4,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Shell",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 577416199,
//         node_id: "R_kgDOImqsBw",
//         name: "awesome-react",
//         full_name: "patrice012/awesome-react",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/awesome-react",
//         description: "A collection of awesome things regarding React ecosystem",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/awesome-react",
//         forks_url:
//             "https://api.github.com/repos/patrice012/awesome-react/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/awesome-react/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/awesome-react/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/awesome-react/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/awesome-react/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/awesome-react/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/awesome-react/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/awesome-react/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/awesome-react/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/awesome-react/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/awesome-react/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/awesome-react/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/awesome-react/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/awesome-react/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/awesome-react/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/awesome-react/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/awesome-react/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/awesome-react/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/awesome-react/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/awesome-react/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/awesome-react/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/awesome-react/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/awesome-react/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/awesome-react/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/awesome-react/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/awesome-react/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/awesome-react/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/awesome-react/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/awesome-react/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/awesome-react/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/awesome-react/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/awesome-react/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/awesome-react/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/awesome-react/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/awesome-react/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/awesome-react/deployments",
//         created_at: "2022-12-12T17:29:43Z",
//         updated_at: "2022-12-12T17:20:14Z",
//         pushed_at: "2022-12-07T09:18:25Z",
//         git_url: "git://github.com/patrice012/awesome-react.git",
//         ssh_url: "git@github.com:patrice012/awesome-react.git",
//         clone_url: "https://github.com/patrice012/awesome-react.git",
//         svn_url: "https://github.com/patrice012/awesome-react",
//         homepage: "",
//         size: 2455,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: false,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 684103160,
//         node_id: "R_kgDOKMaV-A",
//         name: "binary_trees",
//         full_name: "patrice012/binary_trees",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/binary_trees",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/binary_trees",
//         forks_url: "https://api.github.com/repos/patrice012/binary_trees/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/binary_trees/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/binary_trees/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/binary_trees/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/binary_trees/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/binary_trees/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/binary_trees/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/binary_trees/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/binary_trees/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/binary_trees/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/binary_trees/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/binary_trees/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/binary_trees/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/binary_trees/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/binary_trees/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/binary_trees/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/binary_trees/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/binary_trees/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/binary_trees/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/binary_trees/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/binary_trees/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/binary_trees/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/binary_trees/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/binary_trees/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/binary_trees/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/binary_trees/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/binary_trees/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/binary_trees/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/binary_trees/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/binary_trees/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/binary_trees/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/binary_trees/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/binary_trees/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/binary_trees/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/binary_trees/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/binary_trees/deployments",
//         created_at: "2023-08-28T13:12:46Z",
//         updated_at: "2023-08-28T14:07:15Z",
//         pushed_at: "2023-08-31T22:22:11Z",
//         git_url: "git://github.com/patrice012/binary_trees.git",
//         ssh_url: "git@github.com:patrice012/binary_trees.git",
//         clone_url: "https://github.com/patrice012/binary_trees.git",
//         svn_url: "https://github.com/patrice012/binary_trees",
//         homepage: null,
//         size: 228,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "C",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 612343562,
//         node_id: "R_kgDOJH-fCg",
//         name: "blog",
//         full_name: "patrice012/blog",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/blog",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/blog",
//         forks_url: "https://api.github.com/repos/patrice012/blog/forks",
//         keys_url: "https://api.github.com/repos/patrice012/blog/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/blog/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/blog/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/blog/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/blog/issues/events{/number}",
//         events_url: "https://api.github.com/repos/patrice012/blog/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/blog/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/blog/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/blog/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/blog/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/blog/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/blog/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/blog/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/blog/statuses/{sha}",
//         languages_url: "https://api.github.com/repos/patrice012/blog/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/blog/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/blog/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/blog/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/blog/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/blog/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/blog/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/blog/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/blog/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/blog/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/blog/compare/{base}...{head}",
//         merges_url: "https://api.github.com/repos/patrice012/blog/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/blog/{archive_format}{/ref}",
//         downloads_url: "https://api.github.com/repos/patrice012/blog/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/blog/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/blog/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/blog/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/blog/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/blog/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/blog/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/blog/deployments",
//         created_at: "2023-03-10T18:24:40Z",
//         updated_at: "2023-03-10T18:27:08Z",
//         pushed_at: "2023-03-15T17:09:34Z",
//         git_url: "git://github.com/patrice012/blog.git",
//         ssh_url: "git@github.com:patrice012/blog.git",
//         clone_url: "https://github.com/patrice012/blog.git",
//         svn_url: "https://github.com/patrice012/blog",
//         homepage: null,
//         size: 22057,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "CSS",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 616688701,
//         node_id: "R_kgDOJMHsPQ",
//         name: "chatbot-ui",
//         full_name: "patrice012/chatbot-ui",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/chatbot-ui",
//         description: "A ChatGPT clone for running locally in your browser.",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/chatbot-ui",
//         forks_url: "https://api.github.com/repos/patrice012/chatbot-ui/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/chatbot-ui/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/chatbot-ui/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/issues/events{/number}",
//         events_url: "https://api.github.com/repos/patrice012/chatbot-ui/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/chatbot-ui/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/compare/{base}...{head}",
//         merges_url: "https://api.github.com/repos/patrice012/chatbot-ui/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/chatbot-ui/deployments",
//         created_at: "2023-03-20T22:04:32Z",
//         updated_at: "2023-03-20T21:41:38Z",
//         pushed_at: "2023-03-20T16:16:34Z",
//         git_url: "git://github.com/patrice012/chatbot-ui.git",
//         ssh_url: "git@github.com:patrice012/chatbot-ui.git",
//         clone_url: "https://github.com/patrice012/chatbot-ui.git",
//         svn_url: "https://github.com/patrice012/chatbot-ui",
//         homepage: "https://www.chatbotui.com",
//         size: 844,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: false,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "mit",
//             name: "MIT License",
//             spdx_id: "MIT",
//             url: "https://api.github.com/licenses/mit",
//             node_id: "MDc6TGljZW5zZTEz",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 616410304,
//         node_id: "R_kgDOJL2swA",
//         name: "coding-interview-university",
//         full_name: "patrice012/coding-interview-university",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/coding-interview-university",
//         description:
//             "A complete computer science study plan to become a software engineer.",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/coding-interview-university",
//         forks_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/coding-interview-university/deployments",
//         created_at: "2023-03-20T10:37:42Z",
//         updated_at: "2023-03-20T10:45:13Z",
//         pushed_at: "2023-03-19T18:45:09Z",
//         git_url: "git://github.com/patrice012/coding-interview-university.git",
//         ssh_url: "git@github.com:patrice012/coding-interview-university.git",
//         clone_url:
//             "https://github.com/patrice012/coding-interview-university.git",
//         svn_url: "https://github.com/patrice012/coding-interview-university",
//         homepage: "",
//         size: 20180,
//         stargazers_count: 1,
//         watchers_count: 1,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: false,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "cc-by-sa-4.0",
//             name: "Creative Commons Attribution Share Alike 4.0 International",
//             spdx_id: "CC-BY-SA-4.0",
//             url: "https://api.github.com/licenses/cc-by-sa-4.0",
//             node_id: "MDc6TGljZW5zZTI2",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 1,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 615466161,
//         node_id: "R_kgDOJK9EsQ",
//         name: "css-demystified-course-material",
//         full_name: "patrice012/css-demystified-course-material",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url:
//             "https://github.com/patrice012/css-demystified-course-material",
//         description: "Course material for CSS Demystified",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/css-demystified-course-material",
//         forks_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/css-demystified-course-material/deployments",
//         created_at: "2023-03-17T19:02:42Z",
//         updated_at: "2023-02-25T04:26:41Z",
//         pushed_at: "2022-08-26T19:55:28Z",
//         git_url:
//             "git://github.com/patrice012/css-demystified-course-material.git",
//         ssh_url:
//             "git@github.com:patrice012/css-demystified-course-material.git",
//         clone_url:
//             "https://github.com/patrice012/css-demystified-course-material.git",
//         svn_url:
//             "https://github.com/patrice012/css-demystified-course-material",
//         homepage: null,
//         size: 61495,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 686018724,
//         node_id: "R_kgDOKOPQpA",
//         name: "dan-proto",
//         full_name: "patrice012/dan-proto",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/dan-proto",
//         description: null,
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/dan-proto",
//         forks_url: "https://api.github.com/repos/patrice012/dan-proto/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/dan-proto/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/dan-proto/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/dan-proto/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/dan-proto/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/dan-proto/issues/events{/number}",
//         events_url: "https://api.github.com/repos/patrice012/dan-proto/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/dan-proto/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/dan-proto/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/dan-proto/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/dan-proto/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/dan-proto/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/dan-proto/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/dan-proto/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/dan-proto/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/dan-proto/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/dan-proto/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/dan-proto/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/dan-proto/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/dan-proto/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/dan-proto/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/dan-proto/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/dan-proto/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/dan-proto/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/dan-proto/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/dan-proto/compare/{base}...{head}",
//         merges_url: "https://api.github.com/repos/patrice012/dan-proto/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/dan-proto/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/dan-proto/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/dan-proto/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/dan-proto/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/dan-proto/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/dan-proto/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/dan-proto/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/dan-proto/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/dan-proto/deployments",
//         created_at: "2023-09-01T14:41:17Z",
//         updated_at: "2023-09-01T14:41:17Z",
//         pushed_at: "2023-08-11T18:09:22Z",
//         git_url: "git://github.com/patrice012/dan-proto.git",
//         ssh_url: "git@github.com:patrice012/dan-proto.git",
//         clone_url: "https://github.com/patrice012/dan-proto.git",
//         svn_url: "https://github.com/patrice012/dan-proto",
//         homepage: null,
//         size: 161,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 722750690,
//         node_id: "R_kgDOKxRM4g",
//         name: "dark-light-theme",
//         full_name: "patrice012/dark-light-theme",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/dark-light-theme",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/dark-light-theme",
//         forks_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/dark-light-theme/deployments",
//         created_at: "2023-11-23T21:30:47Z",
//         updated_at: "2023-11-23T23:41:49Z",
//         pushed_at: "2023-11-24T18:53:08Z",
//         git_url: "git://github.com/patrice012/dark-light-theme.git",
//         ssh_url: "git@github.com:patrice012/dark-light-theme.git",
//         clone_url: "https://github.com/patrice012/dark-light-theme.git",
//         svn_url: "https://github.com/patrice012/dark-light-theme",
//         homepage: null,
//         size: 6,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "JavaScript",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 587834222,
//         node_id: "R_kgDOIwmjbg",
//         name: "Dash-by-Plotly",
//         full_name: "patrice012/Dash-by-Plotly",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/Dash-by-Plotly",
//         description: "Interactive data analytics",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/Dash-by-Plotly",
//         forks_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/Dash-by-Plotly/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/Dash-by-Plotly/deployments",
//         created_at: "2023-01-11T17:39:49Z",
//         updated_at: "2023-01-11T11:16:55Z",
//         pushed_at: "2023-01-09T00:27:03Z",
//         git_url: "git://github.com/patrice012/Dash-by-Plotly.git",
//         ssh_url: "git@github.com:patrice012/Dash-by-Plotly.git",
//         clone_url: "https://github.com/patrice012/Dash-by-Plotly.git",
//         svn_url: "https://github.com/patrice012/Dash-by-Plotly",
//         homepage: "dash-by-plotly.coding-with-adam.vercel.app",
//         size: 74149,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 725798472,
//         node_id: "R_kgDOK0LOSA",
//         name: "dashboard-backend",
//         full_name: "patrice012/dashboard-backend",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/dashboard-backend",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/dashboard-backend",
//         forks_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/dashboard-backend/deployments",
//         created_at: "2023-11-30T22:32:27Z",
//         updated_at: "2023-11-30T22:34:44Z",
//         pushed_at: "2023-12-02T13:53:07Z",
//         git_url: "git://github.com/patrice012/dashboard-backend.git",
//         ssh_url: "git@github.com:patrice012/dashboard-backend.git",
//         clone_url: "https://github.com/patrice012/dashboard-backend.git",
//         svn_url: "https://github.com/patrice012/dashboard-backend",
//         homepage: null,
//         size: 435,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "JavaScript",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 694630538,
//         node_id: "R_kgDOKWc4ig",
//         name: "dashboard-UI",
//         full_name: "patrice012/dashboard-UI",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/dashboard-UI",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/dashboard-UI",
//         forks_url: "https://api.github.com/repos/patrice012/dashboard-UI/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/dashboard-UI/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/dashboard-UI/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/dashboard-UI/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/dashboard-UI/deployments",
//         created_at: "2023-09-21T11:35:42Z",
//         updated_at: "2023-09-21T11:49:38Z",
//         pushed_at: "2023-12-02T13:52:37Z",
//         git_url: "git://github.com/patrice012/dashboard-UI.git",
//         ssh_url: "git@github.com:patrice012/dashboard-UI.git",
//         clone_url: "https://github.com/patrice012/dashboard-UI.git",
//         svn_url: "https://github.com/patrice012/dashboard-UI",
//         homepage: null,
//         size: 330,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "JavaScript",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 614494755,
//         node_id: "R_kgDOJKByIw",
//         name: "deploy-django",
//         full_name: "patrice012/deploy-django",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/deploy-django",
//         description:
//             "A bash script to deploy a django project for production sites.",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/deploy-django",
//         forks_url:
//             "https://api.github.com/repos/patrice012/deploy-django/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/deploy-django/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/deploy-django/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/deploy-django/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/deploy-django/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/deploy-django/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/deploy-django/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/deploy-django/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/deploy-django/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/deploy-django/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/deploy-django/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/deploy-django/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/deploy-django/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/deploy-django/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/deploy-django/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/deploy-django/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/deploy-django/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/deploy-django/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/deploy-django/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/deploy-django/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/deploy-django/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/deploy-django/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/deploy-django/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/deploy-django/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/deploy-django/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/deploy-django/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/deploy-django/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/deploy-django/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/deploy-django/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/deploy-django/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/deploy-django/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/deploy-django/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/deploy-django/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/deploy-django/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/deploy-django/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/deploy-django/deployments",
//         created_at: "2023-03-15T17:43:17Z",
//         updated_at: "2023-03-02T01:07:21Z",
//         pushed_at: "2022-04-29T07:43:58Z",
//         git_url: "git://github.com/patrice012/deploy-django.git",
//         ssh_url: "git@github.com:patrice012/deploy-django.git",
//         clone_url: "https://github.com/patrice012/deploy-django.git",
//         svn_url: "https://github.com/patrice012/deploy-django",
//         homepage: "",
//         size: 50,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "bsd-3-clause",
//             name: 'BSD 3-Clause "New" or "Revised" License',
//             spdx_id: "BSD-3-Clause",
//             url: "https://api.github.com/licenses/bsd-3-clause",
//             node_id: "MDc6TGljZW5zZTU=",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 616411862,
//         node_id: "R_kgDOJL2y1g",
//         name: "developer-roadmap",
//         full_name: "patrice012/developer-roadmap",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/developer-roadmap",
//         description:
//             "Interactive roadmaps, guides and other educational content to help developers grow in their careers.",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/developer-roadmap",
//         forks_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/developer-roadmap/deployments",
//         created_at: "2023-03-20T10:41:35Z",
//         updated_at: "2023-03-20T10:46:20Z",
//         pushed_at: "2023-03-20T03:20:41Z",
//         git_url: "git://github.com/patrice012/developer-roadmap.git",
//         ssh_url: "git@github.com:patrice012/developer-roadmap.git",
//         clone_url: "https://github.com/patrice012/developer-roadmap.git",
//         svn_url: "https://github.com/patrice012/developer-roadmap",
//         homepage: "https://roadmap.sh",
//         size: 1196019,
//         stargazers_count: 1,
//         watchers_count: 1,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "other",
//             name: "Other",
//             spdx_id: "NOASSERTION",
//             url: null,
//             node_id: "MDc6TGljZW5zZTA=",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 1,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 673520756,
//         node_id: "R_kgDOKCUcdA",
//         name: "devops-exercises",
//         full_name: "patrice012/devops-exercises",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/devops-exercises",
//         description:
//             "Linux, Jenkins, AWS, SRE, Prometheus, Docker, Python, Ansible, Git, Kubernetes, Terraform, OpenStack, SQL, NoSQL, Azure, GCP, DNS, Elastic, Network, Virtualization. DevOps Interview Questions",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/devops-exercises",
//         forks_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/devops-exercises/deployments",
//         created_at: "2023-08-01T20:21:45Z",
//         updated_at: "2023-08-01T20:21:45Z",
//         pushed_at: "2023-08-01T10:42:25Z",
//         git_url: "git://github.com/patrice012/devops-exercises.git",
//         ssh_url: "git@github.com:patrice012/devops-exercises.git",
//         clone_url: "https://github.com/patrice012/devops-exercises.git",
//         svn_url: "https://github.com/patrice012/devops-exercises",
//         homepage: "",
//         size: 4797,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "other",
//             name: "Other",
//             spdx_id: "NOASSERTION",
//             url: null,
//             node_id: "MDc6TGljZW5zZTA=",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "master",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 567342721,
//         node_id: "R_kgDOIdD2gQ",
//         name: "django-beginner-Post-app",
//         full_name: "patrice012/django-beginner-Post-app",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/django-beginner-Post-app",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/django-beginner-Post-app",
//         forks_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/django-beginner-Post-app/deployments",
//         created_at: "2022-11-17T15:33:12Z",
//         updated_at: "2022-11-17T16:14:50Z",
//         pushed_at: "2022-11-17T16:14:47Z",
//         git_url: "git://github.com/patrice012/django-beginner-Post-app.git",
//         ssh_url: "git@github.com:patrice012/django-beginner-Post-app.git",
//         clone_url: "https://github.com/patrice012/django-beginner-Post-app.git",
//         svn_url: "https://github.com/patrice012/django-beginner-Post-app",
//         homepage: null,
//         size: 270,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 567406995,
//         node_id: "R_kgDOIdHxkw",
//         name: "django-blog",
//         full_name: "patrice012/django-blog",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/django-blog",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/django-blog",
//         forks_url: "https://api.github.com/repos/patrice012/django-blog/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/django-blog/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/django-blog/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/django-blog/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/django-blog/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/django-blog/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/django-blog/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/django-blog/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/django-blog/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/django-blog/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/django-blog/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/django-blog/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/django-blog/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/django-blog/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/django-blog/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/django-blog/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/django-blog/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/django-blog/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/django-blog/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/django-blog/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/django-blog/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/django-blog/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/django-blog/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/django-blog/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/django-blog/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/django-blog/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/django-blog/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/django-blog/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/django-blog/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/django-blog/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/django-blog/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/django-blog/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/django-blog/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/django-blog/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/django-blog/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/django-blog/deployments",
//         created_at: "2022-11-17T18:14:04Z",
//         updated_at: "2022-11-17T18:15:23Z",
//         pushed_at: "2022-11-17T18:15:17Z",
//         git_url: "git://github.com/patrice012/django-blog.git",
//         ssh_url: "git@github.com:patrice012/django-blog.git",
//         clone_url: "https://github.com/patrice012/django-blog.git",
//         svn_url: "https://github.com/patrice012/django-blog",
//         homepage: null,
//         size: 1833,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "JavaScript",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 558945255,
//         node_id: "R_kgDOIVDT5w",
//         name: "ecommerce",
//         full_name: "patrice012/ecommerce",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/ecommerce",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/ecommerce",
//         forks_url: "https://api.github.com/repos/patrice012/ecommerce/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/ecommerce/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/ecommerce/collaborators{/collaborator}",
//         teams_url: "https://api.github.com/repos/patrice012/ecommerce/teams",
//         hooks_url: "https://api.github.com/repos/patrice012/ecommerce/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/ecommerce/issues/events{/number}",
//         events_url: "https://api.github.com/repos/patrice012/ecommerce/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/ecommerce/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/ecommerce/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/ecommerce/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/ecommerce/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/ecommerce/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/ecommerce/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/ecommerce/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/ecommerce/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/ecommerce/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/ecommerce/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/ecommerce/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/ecommerce/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/ecommerce/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/ecommerce/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/ecommerce/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/ecommerce/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/ecommerce/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/ecommerce/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/ecommerce/compare/{base}...{head}",
//         merges_url: "https://api.github.com/repos/patrice012/ecommerce/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/ecommerce/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/ecommerce/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/ecommerce/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/ecommerce/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/ecommerce/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/ecommerce/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/ecommerce/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/ecommerce/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/ecommerce/deployments",
//         created_at: "2022-10-28T16:49:05Z",
//         updated_at: "2023-01-11T16:39:15Z",
//         pushed_at: "2023-01-11T16:39:10Z",
//         git_url: "git://github.com/patrice012/ecommerce.git",
//         ssh_url: "git@github.com:patrice012/ecommerce.git",
//         clone_url: "https://github.com/patrice012/ecommerce.git",
//         svn_url: "https://github.com/patrice012/ecommerce",
//         homepage: null,
//         size: 31810,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 678355921,
//         node_id: "R_kgDOKG7j0Q",
//         name: "Fix_My_Code_Challenge",
//         full_name: "patrice012/Fix_My_Code_Challenge",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/Fix_My_Code_Challenge",
//         description:
//             "Fix my code is a new type of project, where we’ll jump into an existing code base and fix it!  Sometimes you will know the language, sometimes not.",
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge",
//         forks_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/Fix_My_Code_Challenge/deployments",
//         created_at: "2023-08-14T11:11:33Z",
//         updated_at: "2023-08-14T13:09:44Z",
//         pushed_at: "2023-08-27T23:30:25Z",
//         git_url: "git://github.com/patrice012/Fix_My_Code_Challenge.git",
//         ssh_url: "git@github.com:patrice012/Fix_My_Code_Challenge.git",
//         clone_url: "https://github.com/patrice012/Fix_My_Code_Challenge.git",
//         svn_url: "https://github.com/patrice012/Fix_My_Code_Challenge",
//         homepage: null,
//         size: 23,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "Python",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 616410362,
//         node_id: "R_kgDOJL2s-g",
//         name: "free-programming-books",
//         full_name: "patrice012/free-programming-books",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/free-programming-books",
//         description: ":books: Freely available programming books",
//         fork: true,
//         url: "https://api.github.com/repos/patrice012/free-programming-books",
//         forks_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/free-programming-books/deployments",
//         created_at: "2023-03-20T10:37:51Z",
//         updated_at: "2023-03-20T10:45:10Z",
//         pushed_at: "2023-03-20T08:47:35Z",
//         git_url: "git://github.com/patrice012/free-programming-books.git",
//         ssh_url: "git@github.com:patrice012/free-programming-books.git",
//         clone_url: "https://github.com/patrice012/free-programming-books.git",
//         svn_url: "https://github.com/patrice012/free-programming-books",
//         homepage: "https://ebookfoundation.github.io/free-programming-books/",
//         size: 16831,
//         stargazers_count: 1,
//         watchers_count: 1,
//         language: null,
//         has_issues: false,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: false,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: {
//             key: "other",
//             name: "Other",
//             spdx_id: "NOASSERTION",
//             url: null,
//             node_id: "MDc6TGljZW5zZTA=",
//         },
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 1,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 688177297,
//         node_id: "R_kgDOKQTAkQ",
//         name: "frontend_practice",
//         full_name: "patrice012/frontend_practice",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/frontend_practice",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/frontend_practice",
//         forks_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/branches{/branch}",
//         tags_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/frontend_practice/deployments",
//         created_at: "2023-09-06T20:08:36Z",
//         updated_at: "2023-09-09T09:34:46Z",
//         pushed_at: "2023-09-09T09:49:14Z",
//         git_url: "git://github.com/patrice012/frontend_practice.git",
//         ssh_url: "git@github.com:patrice012/frontend_practice.git",
//         clone_url: "https://github.com/patrice012/frontend_practice.git",
//         svn_url: "https://github.com/patrice012/frontend_practice",
//         homepage: null,
//         size: 5,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "HTML",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
//     {
//         id: 721314223,
//         node_id: "R_kgDOKv5hrw",
//         name: "github-metrics",
//         full_name: "patrice012/github-metrics",
//         private: false,
//         owner: {
//             login: "patrice012",
//             id: 73082094,
//             node_id: "MDQ6VXNlcjczMDgyMDk0",
//             avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//             gravatar_id: "",
//             url: "https://api.github.com/users/patrice012",
//             html_url: "https://github.com/patrice012",
//             followers_url: "https://api.github.com/users/patrice012/followers",
//             following_url:
//                 "https://api.github.com/users/patrice012/following{/other_user}",
//             gists_url:
//                 "https://api.github.com/users/patrice012/gists{/gist_id}",
//             starred_url:
//                 "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//             subscriptions_url:
//                 "https://api.github.com/users/patrice012/subscriptions",
//             organizations_url: "https://api.github.com/users/patrice012/orgs",
//             repos_url: "https://api.github.com/users/patrice012/repos",
//             events_url:
//                 "https://api.github.com/users/patrice012/events{/privacy}",
//             received_events_url:
//                 "https://api.github.com/users/patrice012/received_events",
//             type: "User",
//             site_admin: false,
//         },
//         html_url: "https://github.com/patrice012/github-metrics",
//         description: null,
//         fork: false,
//         url: "https://api.github.com/repos/patrice012/github-metrics",
//         forks_url:
//             "https://api.github.com/repos/patrice012/github-metrics/forks",
//         keys_url:
//             "https://api.github.com/repos/patrice012/github-metrics/keys{/key_id}",
//         collaborators_url:
//             "https://api.github.com/repos/patrice012/github-metrics/collaborators{/collaborator}",
//         teams_url:
//             "https://api.github.com/repos/patrice012/github-metrics/teams",
//         hooks_url:
//             "https://api.github.com/repos/patrice012/github-metrics/hooks",
//         issue_events_url:
//             "https://api.github.com/repos/patrice012/github-metrics/issues/events{/number}",
//         events_url:
//             "https://api.github.com/repos/patrice012/github-metrics/events",
//         assignees_url:
//             "https://api.github.com/repos/patrice012/github-metrics/assignees{/user}",
//         branches_url:
//             "https://api.github.com/repos/patrice012/github-metrics/branches{/branch}",
//         tags_url: "https://api.github.com/repos/patrice012/github-metrics/tags",
//         blobs_url:
//             "https://api.github.com/repos/patrice012/github-metrics/git/blobs{/sha}",
//         git_tags_url:
//             "https://api.github.com/repos/patrice012/github-metrics/git/tags{/sha}",
//         git_refs_url:
//             "https://api.github.com/repos/patrice012/github-metrics/git/refs{/sha}",
//         trees_url:
//             "https://api.github.com/repos/patrice012/github-metrics/git/trees{/sha}",
//         statuses_url:
//             "https://api.github.com/repos/patrice012/github-metrics/statuses/{sha}",
//         languages_url:
//             "https://api.github.com/repos/patrice012/github-metrics/languages",
//         stargazers_url:
//             "https://api.github.com/repos/patrice012/github-metrics/stargazers",
//         contributors_url:
//             "https://api.github.com/repos/patrice012/github-metrics/contributors",
//         subscribers_url:
//             "https://api.github.com/repos/patrice012/github-metrics/subscribers",
//         subscription_url:
//             "https://api.github.com/repos/patrice012/github-metrics/subscription",
//         commits_url:
//             "https://api.github.com/repos/patrice012/github-metrics/commits{/sha}",
//         git_commits_url:
//             "https://api.github.com/repos/patrice012/github-metrics/git/commits{/sha}",
//         comments_url:
//             "https://api.github.com/repos/patrice012/github-metrics/comments{/number}",
//         issue_comment_url:
//             "https://api.github.com/repos/patrice012/github-metrics/issues/comments{/number}",
//         contents_url:
//             "https://api.github.com/repos/patrice012/github-metrics/contents/{+path}",
//         compare_url:
//             "https://api.github.com/repos/patrice012/github-metrics/compare/{base}...{head}",
//         merges_url:
//             "https://api.github.com/repos/patrice012/github-metrics/merges",
//         archive_url:
//             "https://api.github.com/repos/patrice012/github-metrics/{archive_format}{/ref}",
//         downloads_url:
//             "https://api.github.com/repos/patrice012/github-metrics/downloads",
//         issues_url:
//             "https://api.github.com/repos/patrice012/github-metrics/issues{/number}",
//         pulls_url:
//             "https://api.github.com/repos/patrice012/github-metrics/pulls{/number}",
//         milestones_url:
//             "https://api.github.com/repos/patrice012/github-metrics/milestones{/number}",
//         notifications_url:
//             "https://api.github.com/repos/patrice012/github-metrics/notifications{?since,all,participating}",
//         labels_url:
//             "https://api.github.com/repos/patrice012/github-metrics/labels{/name}",
//         releases_url:
//             "https://api.github.com/repos/patrice012/github-metrics/releases{/id}",
//         deployments_url:
//             "https://api.github.com/repos/patrice012/github-metrics/deployments",
//         created_at: "2023-11-20T19:57:52Z",
//         updated_at: "2023-11-20T20:00:35Z",
//         pushed_at: "2023-12-04T12:58:25Z",
//         git_url: "git://github.com/patrice012/github-metrics.git",
//         ssh_url: "git@github.com:patrice012/github-metrics.git",
//         clone_url: "https://github.com/patrice012/github-metrics.git",
//         svn_url: "https://github.com/patrice012/github-metrics",
//         homepage: null,
//         size: 140,
//         stargazers_count: 0,
//         watchers_count: 0,
//         language: "JavaScript",
//         has_issues: true,
//         has_projects: true,
//         has_downloads: true,
//         has_wiki: true,
//         has_pages: false,
//         has_discussions: false,
//         forks_count: 0,
//         mirror_url: null,
//         archived: false,
//         disabled: false,
//         open_issues_count: 0,
//         license: null,
//         allow_forking: true,
//         is_template: false,
//         web_commit_signoff_required: false,
//         topics: [],
//         visibility: "public",
//         forks: 0,
//         open_issues: 0,
//         watchers: 0,
//         default_branch: "main",
//         permissions: {
//             admin: true,
//             maintain: true,
//             push: true,
//             triage: true,
//             pull: true,
//         },
//     },
// ];

// const user = new UserMetrics("patrice012");
// user.filterRespositoryInformation(data);
// // console.log(user.filterRespositoryInformation(data));
// console.log(user.programmingLanguages, "programmingLanguages");
