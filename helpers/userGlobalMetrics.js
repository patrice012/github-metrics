class UserMetrics {
    constructor(name) {
        this.name = name;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (!value) {
            // throw new Error("value must be set.");
            this._name = "Error";
            return;
        } else if (typeof value != typeof "string") {
            throw new Error("Name must be a string.");
        }
        this._name = value;
    }

    // set initial data field to use
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
    _initialData = {};

    #setImportantFields = (key, value) => {
        this._globalData[key] = value;
    };

    get initialData() {
        return this._initialData;
    }

    /**
     * @param {(arg0: { login: string; id: number; node_id: string; avatar_url: string; gravatar_id: string; url: string; html_url: string; followers_url: string; following_url: string; gists_url: string; starred_url: string; subscriptions_url: string; organizations_url: string; repos_url: string; events_url: string; received_events_url: string; type: string; site_admin: boolean; name: string; company: any; blog: string; location: any; email: string; hireable: any; bio: any; twitter_username: any; public_repos: number; public_gists: number; followers: number; following: number; created_at: string; updated_at: string; private_gists: number; total_private_repos: number; owned_private_repos: number; disk_usage: number; collaborators: number; two_factor_authentication: boolean; plan: { name: string; space: number; collaborators: number; private_repos: number; }; }) => void} data
     */
    set globalData(data) {
        this._initialData = { ...data };
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
    _globalError = {};

    /**
     * @param {string} error
     */
    set globalError(error) {
        if (!error) return;
        if (typeof error != typeof {}) {
            throw new Error("Error must be an Object");
        }
        let key = Object.keys(error)[0];
        let value = Object.values(error)[0];
        this._globalError[[key]] = value;
    }

    get globalError() {
        if (this._name === "Error") {
            return { error: "Name error" };
        }
        if (this._globalError) {
            return this._globalError;
        } else {
            return "No error.";
        }
    }

    // author commits
    #commitPerRepository = [];
    _totalNumberOfCommits = 0;
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
        this._totalNumberOfCommits = this.#commitPerRepository.reduce(
            (accumulator, obj) => accumulator + Object.values(obj)[0],
            initialValue
        );

        return this._totalNumberOfCommits;
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
        this._totalNumberOfCommits = 0;
        this.#allContributions = [];
        this.#commitsRepos = [];
        this.#allRepositories = [];
    }

    // repos information (user, name, language, numberOfCommits, numberOfCollaborator, createAt)
    _programmingLanguages = {};

    setAllRespositories(data) {
        this.#allRepositories = [...data];
    }

    get allRepositories() {
        return this.#allRepositories;
    }

    #filterRespositoryInformation(data) {
        // reset this fields and save new data when username changed
        this._programmingLanguages = {};
        const filterData = data?.map((repos, _) => {
            // get all programing language
            if (repos.language) {
                if (
                    Object.keys(this._programmingLanguages).includes(
                        repos?.language
                    )
                ) {
                    this._programmingLanguages[repos?.language] += 1;
                } else {
                    this._programmingLanguages[repos?.language] = 1;
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
        return this._programmingLanguages;
    }

    // user contributions
    #githubContributions = [];
    #repositoriesContributions = [];
    #numberOfIssues = {};
    #numberOfPullRequest = {};
    #numberOfReviews = {};
    #userContributionCalendar = [];

    saveGitHubContributions(result) {
        this.#githubContributions = result.data.user.contributionsCollection;
        this.#userContributionCalendar =
            this.#githubContributions.contributionCalendar.weeks;
        this.#repositoriesContributions =
            this.#githubContributions.commitContributionsByRepository;
        this.#numberOfIssues = this.#githubContributions.issueContributions;
        this.#numberOfPullRequest =
            this.#githubContributions.pullRequestContributions;
        this.#numberOfReviews =
            this.#githubContributions.pullRequestReviewContributions;
    }

    _contributionsPerYear = {};
    get contributionsPerYear() {
        const dataPerWeek = this.contributionsPerMonths;
        const data = {};
        for (let [key, value] of Object.entries(dataPerWeek)) {
            const month = key.split("-")[0];
            if (Object.keys(data).includes(month)) {
                data[month] += value;
            } else {
                data[month] = value;
            }
        }
        this._contributionsPerYear = data;
        return this._contributionsPerYear;
    }

    _contributionsPerMonths = {};
    get contributionsPerMonths() {
        const dataPerWeek = this.contributionsPerWeek;
        const data = {};
        for (let [key, value] of Object.entries(dataPerWeek)) {
            const month = key.split("-").slice(0, 2).join("-");
            if (Object.keys(data).includes(month)) {
                data[month] += value;
            } else {
                data[month] = value;
            }
        }
        this._contributionsPerMonths = data;
        return this._contributionsPerMonths;
    }

    _contributionsPerWeek = {};
    get contributionsPerWeek() {
        const data = {};
        this.#userContributionCalendar?.map((contrib, _) => {
            const initialValue = 0;
            const count = contrib.contributionDays.reduce(
                (accumulator, obj) => accumulator + obj.contributionCount,
                initialValue
            );
            data[contrib.firstDay] = count;
        });
        this._contributionsPerWeek = data;
        return this._contributionsPerWeek;
    }

    // contributions types
    _numberOfIssues = 0;
    get numberOfIssues() {
        this._numberOfIssues = this.#numberOfIssues.totalCount;
        return this._numberOfIssues;
    }
    _numberOfPullRequest = 0;
    get numberOfPullRequest() {
        this._numberOfPullRequest = this.#numberOfPullRequest.totalCount;
        return this._numberOfPullRequest;
    }
    _numberOfReviews = 0;
    get numberOfReviews() {
        this._numberOfReviews = this.#numberOfReviews.totalCount;
        return this._numberOfReviews;
    }
    _repositoriesContributions = [];
    get repositoriesContributions() {
        this._repositoriesContributions = this.#repositoriesContributions;
        return this._repositoriesContributions;
    }
}

export { UserMetrics };
