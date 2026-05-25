import { Link } from "react-router-dom";
import { fileUrl } from "../services/api";

function ProfileSummaryCard({ user }) {
  const hasResume = Boolean(user?.resume);
  const hasSkills = (user?.skills?.length || 0) > 0;
  const hasPhone = Boolean(user?.phone);
  const complete = [hasResume, hasSkills, hasPhone, user?.experienceLevel].filter(
    Boolean
  ).length;
  const percent = Math.round((complete / 4) * 100);

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-blue-100">
      <h2 className="text-lg font-bold mb-2">My Profile</h2>
      <div className="flex items-center gap-4 mb-4">
        {user?.profilePicture ? (
          <img
            src={fileUrl(user.profilePicture)}
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Photo
          </div>
        )}
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Profile complete: <strong>{percent}%</strong>
      </p>
      <div className="h-2 bg-gray-100 rounded-full mb-4">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="text-sm space-y-1 mb-4 text-gray-600">
        <li>{hasResume ? "✓" : "○"} Resume uploaded</li>
        <li>{hasSkills ? "✓" : "○"} Skills listed</li>
        <li>{hasPhone ? "✓" : "○"} Phone added</li>
        <li>{user?.experienceLevel ? "✓" : "○"} Experience level set</li>
      </ul>

      <Link
        to="/profile"
        className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Create & manage profile
      </Link>
    </div>
  );
}

export default ProfileSummaryCard;
