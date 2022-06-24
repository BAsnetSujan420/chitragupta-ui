const Card = ({ children, topic, description }) => (
    <div className="w-full mx-4 shadow-lg md:w-1/2 lg:w-1/3 wrounded">
        <div className="px-6 py-4">
            <div className="mb-2 text-xl font-bold">{topic}</div>
            <p className="text-base text-gray-700">{description}</p>
        </div>

        <div className="m-5">{children}</div>
    </div>
)

export default Card;
