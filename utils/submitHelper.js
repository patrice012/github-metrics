import { UserMetrics } from "@/helpers/userGlobalMetrics";
import { getContributions } from "@/utils/graphqlFetch";
import { getProfileInformation } from "@/utils/getProfile";

export function submitHelper(addUser) {
    return async (e, callback = (f) => f) => {
        const formData = new FormData(e.target);

        // create default user
        const errorUser = new UserMetrics();

        try {
            // profile information
            const info = await getProfileInformation(formData.get("username"));
            // create user ==> use the login instead of name
            const user = new UserMetrics(info?.login);

            // save request state in user object
            if (user) {
                user.requestState = "success";
                user.globalData = info;
                addUser(user);
                // get user contributions
                const contributions = await getContributions(info.login);
                user.saveGitHubContributions(contributions);
            }
            //reset input state
            if (info) {
                e.target.reset();
            }
        } catch (error) {
            errorUser.requestState = "error";
            errorUser.globalError = { [error.status]: error.message };
            addUser(errorUser);
        } finally {
            callback((prev) => !prev);
        }
    };
}
