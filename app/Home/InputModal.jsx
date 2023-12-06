export const InputModal = ({ showModal, setShowModal }) => {
    return (
        <>
            <input
                checked={showModal}
                type="checkbox"
                id="my_modal_6"
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <div className="form-control">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-24 md:w-auto"
                        />
                    </div>
                    <div className="modal-action" onClick={() => setShowModal(prev => !prev)}>
                        <label htmlFor="my_modal_6" className="btn">
                            Close!
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};