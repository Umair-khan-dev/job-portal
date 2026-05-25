import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white min-h-[70vh] flex items-center">
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Find Your Next Career
        </h1>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Browse jobs, apply with your resume, and track applications. Admins can
          post jobs and review candidates with ATS scoring.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/jobs"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Browse Jobs
          </Link>
          <Link
            to="/register"
            className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10"
          >
            Get Started
          </Link>
        </div>
        <p className="text-blue-100 text-sm mt-8 max-w-xl mx-auto">
          Candidates: track application status, browse listings, and manage your
          profile from the Dashboard after login.
        </p>
      </div>
    </div>
  );
}

export default Home;
