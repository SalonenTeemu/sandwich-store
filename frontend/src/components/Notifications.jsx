import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "../redux/actionCreators/notificationActions";

export const Notifications = () => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutIds = Object.keys(notifications).map((type) => {
      return setTimeout(() => {
        dispatch(removeNotification(type));
      }, 3000);
    });

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [notifications, dispatch]);

  return (
    <div className="flex justify-center">
      {Object.keys(notifications).length === 0 ? null : (
        <div>
          {Object.keys(notifications).map((type) => {
            const { message, status } = notifications[type];
            return (
              <div
                key={`${type}-${status}-notification`}
                className={`notification ${
                  status === "error"
                    ? "bg-red-500"
                    : status === "loading"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                } text-white p-3 mb-2 rounded-md`}
              >
                {message}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};