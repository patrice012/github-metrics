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

    #filterRespositoryInformation(data) {
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
        return this.#filterRespositoryInformation(this.#allContributions);
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

    // repos information
    setAllRespositories(data) {
        this.#allRepositories = [...data];
    }

    get allRepositories() {
        return this.#allRepositories;
    }
}

export { UserMetrics };
