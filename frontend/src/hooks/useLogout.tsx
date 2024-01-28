import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearTokenAndUser } from "../slices/auth";
import { useLogOutMutation } from "../services/auth.service";

const useLogout = () => {
  const navigate = useNavigate();
  const [logOut, { isSuccess }] = useLogOutMutation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    logOut();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearTokenAndUser());
      navigate("/");
    }
  }, [isSuccess]);

  return handleLogout;
};

export default useLogout;