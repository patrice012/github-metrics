import Link from 'next/link';
import styel from './_partials/_repository.scss';

export const Respository = () => {
    return (
        <div className="repository--container">
            <div className="fields--container">
                <div className="repository--username">test</div>
                <div className="repository--email">patrice@gmail.com</div>
                <div className="repository--create-at">helloekeekke</div>
            </div>
            <div className="repository--readme">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea
                iusto recusandae vel nihil nesciunt aliquam? Similique maiores
                sed quidem, numquam ipsam repellendus modi accusantium quisquam
                eaque accusamus adipisci voluptatem architecto.
            </div>
            <Link href='#' className='more-information'>get more detail</Link>
        </div>
    );
};
