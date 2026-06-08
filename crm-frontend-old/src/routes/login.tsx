import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <main className="bg-slate-50 min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{" "}
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            continue exploring hardware
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-3xl sm:px-10">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-3 rounded-xl bg-gray-50 border-none placeholder-slate-400 focus:outline-none focus:ring-0 focus-within:bg-gray-200 transition-colors duration-300 sm:text-sm text-slate-900"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-900">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-3 rounded-xl bg-gray-50 border-none placeholder-slate-400 focus:outline-none focus:ring-0 focus-within:bg-gray-200 transition-colors duration-300 sm:text-sm text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl shadow-xl text-sm font-bold text-white bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
