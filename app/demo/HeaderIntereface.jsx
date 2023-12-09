import { Header } from "./Header";
import { HeaderSliderProvider } from "@/context/headerSliderContext";

export default function HeaderIntereface({ user }) {
    return (
        <>
            {user?.requestState === "success" ? null : (
                <HeaderSliderProvider>
                    <Header />
                </HeaderSliderProvider>
            )}
        </>
    );
}
