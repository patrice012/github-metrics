import style from "./_home.scss";
import { baseUrl } from "../../utils/api-endpoint";
import { InputComponent } from "./InputComponent";

export const HomeInterface = ({ children }) => {
    return (
        <>
            <InputComponent />
            {children}
        </>
    );
};
