import Image from "next/image"
const Loader = () => {
    return (
        <div className="loader">
            <Image
                src="/assets/icons/logo.svg"
                alt="logo"
                height={30}
                width={30}
            />
            ...Loading
        </div>
    )
}

export default Loader