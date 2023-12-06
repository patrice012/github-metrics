import { FormInput } from "./FormInput";
import style from "./_home.scss";

export const InputComponent = ({ setIsSuccess }) => {
    return (
        <main className="homePage">
            <div className="container">
                <div className="block--contents">
                    <h1>Let&apos;s look at someone metrics...</h1>
                    <FormInput setIsSuccess={setIsSuccess} />
                </div>
            </div>
        </main>
    );
};