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
}

export { UserMetrics };

// const data = {
//     login: "patrice012",
//     id: 73082094,
//     node_id: "MDQ6VXNlcjczMDgyMDk0",
//     avatar_url: "https://avatars.githubusercontent.com/u/73082094?v=4",
//     gravatar_id: "",
//     url: "https://api.github.com/users/patrice012",
//     html_url: "https://github.com/patrice012",
//     followers_url: "https://api.github.com/users/patrice012/followers",
//     following_url:
//         "https://api.github.com/users/patrice012/following{/other_user}",
//     gists_url: "https://api.github.com/users/patrice012/gists{/gist_id}",
//     starred_url:
//         "https://api.github.com/users/patrice012/starred{/owner}{/repo}",
//     subscriptions_url: "https://api.github.com/users/patrice012/subscriptions",
//     organizations_url: "https://api.github.com/users/patrice012/orgs",
//     repos_url: "https://api.github.com/users/patrice012/repos",
//     events_url: "https://api.github.com/users/patrice012/events{/privacy}",
//     received_events_url:
//         "https://api.github.com/users/patrice012/received_events",
//     type: "User",
//     site_admin: false,
//     name: "patrice_dev",
//     company: null,
//     blog: "",
//     location: null,
//     email: "patricedev02@gmail.com",
//     hireable: null,
//     bio: null,
//     twitter_username: null,
//     public_repos: 48,
//     public_gists: 1,
//     followers: 9,
//     following: 32,
//     created_at: "2020-10-18T21:55:50Z",
//     updated_at: "2023-12-02T14:20:11Z",
//     private_gists: 0,
//     total_private_repos: 0,
//     owned_private_repos: 0,
//     disk_usage: 123607,
//     collaborators: 0,
//     two_factor_authentication: false,
//     plan: {
//         name: "pro",
//         space: 976562499,
//         collaborators: 0,
//         private_repos: 9999,
//     },
// };
