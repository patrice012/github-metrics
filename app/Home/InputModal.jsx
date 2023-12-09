"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { submitHelper } from "@/utils/submitHelper";
import { Loading } from "@/components/LoadingIndicator/loading";
import style from "./_modal.scss";

export const InputModal = ({ showModal, setShowModal }) => {
    const { addUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

     const handler = submitHelper(addUser);

    const handleSubmit = async (e) => {
         setLoading((prev) => !prev);
         e.preventDefault();
         await handler(e,setLoading, setShowModal);
     };
    return (
        <>
            <input
                checked={showModal}
                readOnly
                type="checkbox"
                id="my_modal_6"
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <form onSubmit={handleSubmit} className="search--container">
                        <div className="form-control">
                            <input
                                type="text"
                                placeholder="Search"
                                className="input input-bordered w-24 md:w-auto"
                                name="username"
                            />
                        </div>

                        <button className="btn btn-square btn-ghost submit">
                            {loading ? (
                                <Loading />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            )}
                        </button>
                    </form>
                    <div
                        className="close--btn"
                        onClick={() => setShowModal((prev) => !prev)}
                    >
                        <label htmlFor="my_modal_6" className="btn">
                            Close!
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};
