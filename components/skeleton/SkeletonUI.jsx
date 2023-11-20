import style from './_skeleton.scss';

export const SkeletonUI = () => {
    return (
        <div className="skeleton--container">
            <div className="UIcontent">
                <div className="skeleton avatar"></div>
                <div className="flex flex-col gap-4 fields--container">
                    <div className="skeleton username"></div>
                    <div className="skeleton email"></div>
                    <div className="skeleton join-at"></div>
                </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
        </div>
    );
};
