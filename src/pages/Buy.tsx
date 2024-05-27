import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IUser } from "./Profile";

function Buy() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | undefined>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true, // 쿠키를 전송하기 위해 설정
        });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkTicketAvailability = async () => {
      if (!user) return; // user가 없으면 실행하지 않음
      const userId = user.userId;
      try {
        const response = await axios.post(
          `http://localhost:8080/api/buy/tickets/${id}`,
          { userId },
          {
            withCredentials: true,
          }
        );
        setMessage(response.data.message);
      } catch (error: any) {
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage("An error occurred");
        }
      }
    };

    checkTicketAvailability();
  }, [id, user]);

  return (
    <div>
      <h1>Buy Ticket</h1>
      <p>{message}</p>
    </div>
  );
}

export default Buy;
