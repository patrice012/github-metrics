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

    saveUserCommits(repos, contributions) {
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

    getTotalNumberOfCommits() {
        const initialValue = 0;
        this.#totalNumberOfCommits = this.#commitPerRepository.reduce(
            (accumulator, obj) => accumulator + Object.values(obj)[0],
            initialValue
        );

        return this.#totalNumberOfCommits;
    }

    filterCommitsBaseOnUserName(data) {
        for (const [key, value] of Object.entries(data)) {
            const userCommits = value?.filter((_, index) => {
                if (value[index]?.login === this.name) {
                    return value[index].contributions;
                }
            });
            if (userCommits != undefined && userCommits?.[0] != undefined) {
                this.saveUserCommits(key, userCommits[0]?.contributions);
            }
        }
    }

    // saveAllCommits(data) {
    //     this.#allCommits = [];
    //     this.#allCommits = { ...data };
    // }

    saveAllContributions(data) {
        this.#allContributions = data;
    }

    getAllCommits() {
        this.filterCommitsBaseOnUserName(this.#allContributions);
        return this.#commitPerRepository;
    }

    resetCommitsValues() {
        this.#commitPerRepository = [];
        this.#totalNumberOfCommits = 0;
    }

    // repos information
    #allRepositories = [];
    setAllRespositories(data) {
        this.#allRepositories = [...data];
    }
}

export { UserMetrics };

// const data = [
//     {
//         login: "alexaorrico",
//         id: 26891443,
//         node_id: "MDQ6VXNlcjI2ODkxNDQz",
//         avatar_url: "https://avatars.githubusercontent.com/u/26891443?v=4",
//         gravatar_id: "",
//         url: "https://api.github.com/users/alexaorrico",
//         html_url: "https://github.com/alexaorrico",
//         followers_url: "https://api.github.com/users/alexaorrico/followers",
//         following_url:
//             "https://api.github.com/users/alexaorrico/following{/other_user}",
//         gists_url: "https://api.github.com/users/alexaorrico/gists{/gist_id}",
//         starred_url:
//             "https://api.github.com/users/alexaorrico/starred{/owner}{/repo}",
//         subscriptions_url:
//             "https://api.github.com/users/alexaorrico/subscriptions",
//         organizations_url: "https://api.github.com/users/alexaorrico/orgs",
//         repos_url: "https://api.github.com/users/alexaorrico/repos",
//         events_url: "https://api.github.com/users/alexaorrico/events{/privacy}",
//         received_events_url:
//             "https://api.github.com/users/alexaorrico/received_events",
//         type: "User",
//         site_admin: false,
//         contributions: 92,
//     },
//     {
//         login: "jhuang10123",
//         id: 24196851,
//         node_id: "MDQ6VXNlcjI0MTk2ODUx",
//         avatar_url: "https://avatars.githubusercontent.com/u/24196851?v=4",
//         gravatar_id: "",
//         url: "https://api.github.com/users/jhuang10123",
//         html_url: "https://github.com/jhuang10123",
//         followers_url: "https://api.github.com/users/jhuang10123/followers",
//         following_url:
//             "https://api.github.com/users/jhuang10123/following{/other_user}",
//         gists_url: "https://api.github.com/users/jhuang10123/gists{/gist_id}",
//         starred_url:
//             "https://api.github.com/users/jhuang10123/starred{/owner}{/repo}",
//         subscriptions_url:
//             "https://api.github.com/users/jhuang10123/subscriptions",
//         organizations_url: "https://api.github.com/users/jhuang10123/orgs",
//         repos_url: "https://api.github.com/users/jhuang10123/repos",
//         events_url: "https://api.github.com/users/jhuang10123/events{/privacy}",
//         received_events_url:
//             "https://api.github.com/users/jhuang10123/received_events",
//         type: "User",
//         site_admin: false,
//         contributions: 31,
//     },
//     {
//         login: "patrice012",
//         id: 73082094,
//         node_id: "MDQ6VXNlcjczMDgyMDk0",
//         avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//         gravatar_id: "",
//         url: "https://api.github.com/users/patrice012",
//         html_url: "https://github.com/patrice012",
//         followers_url: "https://api.github.com/users/patrice012/followers",
//         following_url:
//             "https://api.github.com/users/patrice012/following{/other_user}",
//         gists_url: "https://api.github.com/users/patrice012/gists{/gist_id}",
//         starred_url:
//             "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//         subscriptions_url:
//             "https://api.github.com/users/patrice012/subscriptions",
//         organizations_url: "https://api.github.com/users/patrice012/orgs",
//         repos_url: "https://api.github.com/users/patrice012/repos",
//         events_url: "https://api.github.com/users/patrice012/events{/privacy}",
//         received_events_url:
//             "https://api.github.com/users/patrice012/received_events",
//         type: "User",
//         site_admin: false,
//         contributions: 21,
//     },
//     {
//         login: "Salome007",
//         id: 118170555,
//         node_id: "U_kgDOBwsjuw",
//         avatar_url: "https://avatars.githubusercontent.com/u/118170555?v=4",
//         gravatar_id: "",
//         url: "https://api.github.com/users/Salome007",
//         html_url: "https://github.com/Salome007",
//         followers_url: "https://api.github.com/users/Salome007/followers",
//         following_url:
//             "https://api.github.com/users/Salome007/following{/other_user}",
//         gists_url: "https://api.github.com/users/Salome007/gists{/gist_id}",
//         starred_url:
//             "https://api.github.com/users/Salome007/starred{/owner}{/repo}",
//         subscriptions_url:
//             "https://api.github.com/users/Salome007/subscriptions",
//         organizations_url: "https://api.github.com/users/Salome007/orgs",
//         repos_url: "https://api.github.com/users/Salome007/repos",
//         events_url: "https://api.github.com/users/Salome007/events{/privacy}",
//         received_events_url:
//             "https://api.github.com/users/Salome007/received_events",
//         type: "User",
//         site_admin: false,
//         contributions: 5,
//     },
//     {
//         login: "jvpupcat",
//         id: 23646064,
//         node_id: "MDQ6VXNlcjIzNjQ2MDY0",
//         avatar_url: "https://avatars.githubusercontent.com/u/23646064?v=4",
//         gravatar_id: "",
//         url: "https://api.github.com/users/jvpupcat",
//         html_url: "https://github.com/jvpupcat",
//         followers_url: "https://api.github.com/users/jvpupcat/followers",
//         following_url:
//             "https://api.github.com/users/jvpupcat/following{/other_user}",
//         gists_url: "https://api.github.com/users/jvpupcat/gists{/gist_id}",
//         starred_url:
//             "https://api.github.com/users/jvpupcat/starred{/owner}{/repo}",
//         subscriptions_url:
//             "https://api.github.com/users/jvpupcat/subscriptions",
//         organizations_url: "https://api.github.com/users/jvpupcat/orgs",
//         repos_url: "https://api.github.com/users/jvpupcat/repos",
//         events_url: "https://api.github.com/users/jvpupcat/events{/privacy}",
//         received_events_url:
//             "https://api.github.com/users/jvpupcat/received_events",
//         type: "User",
//         site_admin: false,
//         contributions: 2,
//     },
// ];

// const user = new UserMetrics("patrice012");

// user.saveAllContributions(data);

// console.log(user.getAllCommits());
