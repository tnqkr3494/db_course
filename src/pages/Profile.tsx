import axios from "axios";
import { useEffect, useState } from "react";

interface IUser {
  userId: string;
  username: string;
}

const Profile = () => {
  const [user, setUser] = useState<IUser | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true, // 쿠키를 전송하기 위해 설정
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(undefined);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <span>Id: {user.userId}</span>
          {/* 다른 컴포넌트나 페이지에서 user 상태를 사용 */}
        </div>
      ) : (
        <div>
          <h1>Please log in</h1>
          {/* 로그인 폼을 여기에 추가 */}
        </div>
      )}
    </div>
  );
};

export default Profile;
