import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 h-screen">
            <div className="flex items-center justify-center p-8 md:p-12 lg:px-16 lg:py-24">
                <SignIn />
            </div>

            <img
                alt=""
                src="https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="h-56 w-full object-cover sm:h-full"
            />
        </section>
    )
}