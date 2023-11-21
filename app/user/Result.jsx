import { SkeletonUI } from "@/components/skeleton/SkeletonUI"
import style from './_partials/_result.scss';


export const ResultPage = () => {
    return (
        <>
            <section className="container">
                <div className="search--container">
                    <SkeletonUI />
                    <SkeletonUI />
                    <SkeletonUI />
                    <SkeletonUI />
                </div>
            </section>
        </>
    );
}


