import { FormInput } from "./FormInput";
import style from "./_home.scss";

export const InputComponent = ({user}) => {
    return (
        <>
            {user?.requestState === "success" ? null : (
                <main className="homePage">
                    <div className="container">
                        <div className="block--contents">
                            <h1>Let&apos;s look at someone metrics...</h1>
                            <FormInput />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};