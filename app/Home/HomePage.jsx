import style from "./_home.scss";
import { baseUrl } from "../api-endpoint";
import { InputComponent } from "./InputComponent";

export const HomeInterface =  ({children}) => {

    return (
        <>
            <InputComponent />
            {children}
        </>
    );
};
