import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.location.replace("/dashboard");
  }, []);
  return null;
};

export default Home;
