import Image from "next/image";
import Link from "next/link";
import avatar  from "../../public/avatar.png";

export const AccountDetail = () => {
    return (
        <section className="account-detail">
            <div className="container">
                <div className="main-information">
                    <Image src={avatar} alt="profil picture" />
                    <h1 className="name">Jonh doe</h1>
                    <Link href="mailto:ex@gmail.com">ex@gmail.com</Link>
                </div>
                <div className="profile">
                    <h4 className="followers">
                        <span>Followings:</span> <span>45</span>
                    </h4>
                    <h4 className="following">
                        <span>Followers:</span> <span>95</span>
                    </h4>
                    <h4 className="join-at">
                        <span>Join at:</span> <span>12-02-2001</span>
                    </h4>
                    <h4 className="status">
                        <span>status:</span> <span>happy</span>
                    </h4>
                </div>
                <div className="bio">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Explicabo vitae suscipit eos ipsum minus, veniam quibusdam
                    ullam tenetur ducimus! Cupiditate aliquam unde non quisquam
                    vero sit maiores natus, atque eveniet! Magnam neque eligendi
                    deserunt reiciendis hic laboriosam enim similique
                    perspiciatis repudiandae, ad aut nihil consequatur nam, vero
                    sapiente dicta aspernatur asperiores? Sint quasi vero eaque
                    neque voluptatum rerum! Eos, saepe!
                </div>
            </div>
        </section>
    );
};
