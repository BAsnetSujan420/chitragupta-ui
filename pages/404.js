import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.back()
        }, 3000)
    }, [])
    return (
        <>
            <Navbar />
            <div className="not-found">
            <h2>This page cannot be found :(</h2>
            <p>Go back to the <Link href="/"><a>Homepage</a></Link></p>
            </div>
        </>
    );
}

export default NotFound;
